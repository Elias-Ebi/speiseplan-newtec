import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, In, Repository } from 'typeorm';
import { Order } from '../../data/entitites/order.entity';
import { AuthUser } from '../../auth/models/AuthUser';
import { Meal } from '../../data/entitites/meal.entity';
import { AuthService } from '../../auth/auth.service';
import { Temporal } from '@js-temporal/polyfill';
import { MealService } from '../meal/meal.service';
import { OrderMonthService } from '../order-month/order-month.service';
import { OrderMonth } from '../../data/entitites/order-month.entity';
import PlainDate = Temporal.PlainDate;
import PlainDateTime = Temporal.PlainDateTime;
import { OrderOptions } from './options-models/order.options';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    private authService: AuthService,
    private mealService: MealService,
    private orderMonthService: OrderMonthService
  ) {
  }

  async getBanditPlates(time: PlainDateTime): Promise<Order[]> {
    const possibleMeals = await this.mealService.getUnchangeable(time);
    const possibleMealIDs = possibleMeals.map((meal) => meal.id);

    const options: FindManyOptions<Order> = {
      where: {
        meal: {
          id: In(possibleMealIDs)
        },
        isBanditplate: true
      },
      relations: {
        profile: true,
        meal: true
      }
    };

    return this.orderRepository.find(options);
  }

  async offerAsBanditplate(time: PlainDateTime, id: string, user: AuthUser): Promise<Order> {
    const order = await this.get(id);

    if (!this.canEdit(order, user)) {
      throw new UnauthorizedException();
    }

    if (order.isBanditplate) {
      throw new BadRequestException('Order already offered.');
    }

    if (
      PlainDateTime.compare(time, order.meal.orderable) !== 1
      && PlainDateTime.compare(time, order.meal.delivery) !== -1
    ) {
      throw new BadRequestException('Order can not be offered at the moment.');
    }

    order.isBanditplate = true;

    return this.orderRepository.save(order);
  }


  async getCurrentBalance(email: string): Promise<number> {
    return this.orderMonthService.getBalance(email);
  }

  async getUnchangeable(time: PlainDateTime, email: string): Promise<Order[]> {
    const possibleMeals = await this.mealService.getUnchangeable(time);
    const possibleMealIDs = possibleMeals.map((meal) => meal.id);

    const options: FindManyOptions<Order> = {
      where: {
        profile: {
          email
        },
        meal: {
          id: In(possibleMealIDs)
        }
      },
      relations: {
        meal: true
      }
    };

    return this.orderRepository.find(options);
  }

  async getChangeable(time: PlainDateTime, email: string): Promise<Order[]> {
    const possibleMeals = await this.mealService.getOrderable(time);
    const possibleMealIDs = possibleMeals.map((meal) => meal.id);

    const options: FindManyOptions<Order> = {
      where: {
        profile: {
          email
        },
        meal: {
          id: In(possibleMealIDs)
        }
      },
      relations: {
        meal: true
      }
    };

    return this.orderRepository.find(options);
  }

  async get(orderId: string): Promise<Order> {
    const options: FindOneOptions<Order> = {
      where: { id: orderId },
      relations: {
        profile: true,
        orderMonth: true,
        meal: true
      }
    };

    const order = await this.orderRepository.findOne(options);

    if (!order) {
      throw new NotFoundException();
    }

    return order;
  }

  async getOn(date: PlainDate, email: string): Promise<Order[]> {
    const options: FindOneOptions<Order> = {
      where: {
        date: date.toString(),
        profile: { email }
      },
      relations: {
        profile: true,
        orderMonth: true,
        meal: true
      }
    };

    return this.orderRepository.find(options);
  }

  async order(time: PlainDateTime, mealId: string, email: string, guestName?: string, options?: OrderOptions): Promise<Order> {
    const meal = await this.mealService.get(mealId);

    const orderableTime = PlainDateTime.from(meal.orderable);

    if (!options?.ignoreOrderableDate && PlainDateTime.compare(orderableTime, time) !== 1) {
      throw new BadRequestException('Too late to order this meal.');
    }

    const mealAlreadyOrdered = await this.mealAlreadyOrdered(mealId, email, guestName);
    if (mealAlreadyOrdered) {
      const additionalText = guestName ? ` for ${guestName}.` : '.';
      throw new BadRequestException(`User already ordered this meal${additionalText}`);
    }

    const order = await this.create(email, meal, guestName);

    const promises: Promise<any>[] = [];

    // only increase total if order is not for guest
    if (!guestName) {
      order.orderMonth.total += meal.total;
      promises.push(this.orderMonthService.update(order.orderMonth));
    }

    meal.orderCount += 1;
    promises.push(this.mealService.update(meal));

    await Promise.all(promises);
    return order;
  }

  async create(email: string, meal: Meal, guestName: string): Promise<Order> {
    const date = PlainDate.from(meal.date);

    const profilePromise = this.authService.getProfile(email);
    const orderMonthPromise = this.orderMonthService.get(date.month, date.year, email);
    const [profile, orderMonth] = await Promise.all([profilePromise, orderMonthPromise]);

    const order: Order = {
      profile,
      date: date.toString(),
      orderMonth,
      meal,
      guestName: guestName || '',
      isBanditplate: false
    } as Order;

    return this.orderRepository.save(order);
  }

  async delete(time: PlainDateTime, id: string, user: AuthUser, options?: OrderOptions): Promise<Order> {
    const order = await this.get(id);

    if (!options?.ignoreOrderableDate && !this.canBeEdited(order, time)) {
      throw new BadRequestException('Too late to delete this order.');
    }

    if (!this.canEdit(order, user)) {
      throw new UnauthorizedException();
    }

    const orderMonth = order.orderMonth;
    const meal = order.meal;

    // only decrease total if order is not for guest
    if (!order.guestName) {
      orderMonth.total -= meal.total;
    }

    meal.orderCount -= 1;

    await Promise.all([this.orderMonthService.update(orderMonth), this.mealService.update(meal)]);
    return this.orderRepository.remove(order);
  }

  async deleteOn(time: PlainDateTime, date: PlainDate, user: AuthUser, options?: OrderOptions): Promise<Order[]> {
    const orders = await this.getOn(date, user.email);

    if (!orders.length) {
      throw new BadRequestException('No orders to delete.');
    }

    let ordersToDelete = orders.filter((order) => this.canEdit(order, user));

    if (!options?.ignoreOrderableDate) {
      ordersToDelete = ordersToDelete.filter((order) => this.canBeEdited(order, time));
    }

    const otherOrders = orders.filter((order) => !ordersToDelete.includes(order));

    if (otherOrders.length) {
      throw new BadRequestException('User tried to delete orders which can not be deleted.');
    }

    const orderMonths: Map<string, OrderMonth> = new Map<string, OrderMonth>();
    const meals: Map<string, Meal> = new Map<string, Meal>();

    orders.forEach((order) => {
      let orderMonth = orderMonths.get(order.orderMonth.id);
      if (!orderMonth) {
        orderMonths.set(order.orderMonth.id, order.orderMonth);
        orderMonth = order.orderMonth;
      }

      let meal = meals.get(order.meal.id);
      if (!meal) {
        meals.set(order.meal.id, order.meal);
        meal = order.meal;
      }

      // only decrease total if order is not for guest
      if (!order.guestName) {
        orderMonth.total -= meal.total;
      }

      meal.orderCount -= 1;
    });

    const orderMonthPromises = Array.from(orderMonths.values()).map((orderMonth) => this.orderMonthService.update(orderMonth));
    const mealPromises = Array.from(meals.values()).map((meal) => this.mealService.update(meal));

    await Promise.all([orderMonthPromises, mealPromises]);

    const deletedOrdersPromises = orders.map((order) => this.orderRepository.remove(order));
    return Promise.all(deletedOrdersPromises);
  }

  private async mealAlreadyOrdered(mealId: string, email: string, guestName: string): Promise<boolean> {
    const orderOptions: FindManyOptions<Order> = {
      where: {
        profile: {
          email
        },
        meal: {
          id: mealId
        },
        guestName: guestName || ''
      }
    };

    const order = await this.orderRepository.findOne(orderOptions);
    return !!order;
  }

  private canEdit(order: Order, user: AuthUser): boolean {
    return order.profile.email === user.email || user.isAdmin;
  }

  private canBeEdited(order: Order, time: PlainDateTime) {
    return PlainDateTime.compare(order.meal.orderable, time) !== -1;
  }
}
