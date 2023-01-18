import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, MoreThanOrEqual, Repository } from 'typeorm';
import { Order } from '../../data/entitites/order.entity';
import { OrderMonth } from '../../data/entitites/order-month.entity';
import { AuthUser } from '../../auth/models/AuthUser';
import { Meal } from '../../data/entitites/meal.entity';
import { AuthService } from '../../auth/auth.service';
import { Temporal } from '@js-temporal/polyfill';
import { DateService } from '../../shared/date/date.service';
import { MealService } from '../meal/meal.service';
import { OrderMonthService } from '../order-month/order-month.service';
import PlainDate = Temporal.PlainDate;

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    @InjectRepository(OrderMonth) private orderMonthRepository: Repository<OrderMonth>,
    @InjectRepository(Meal) private mealRepository: Repository<Meal>,
    private authService: AuthService,
    private dateService: DateService,
    private mealService: MealService,
    private orderMonthService: OrderMonthService
  ) {
  }

  async getBanditPlates(date: PlainDate): Promise<Order[]> {
    const options: FindManyOptions<Order> = {
      where: {
        date: date.toString(),
        isBanditplate: true
      },
      relations: {
        profile: true,
        meal: true
      }
    };

    return this.orderRepository.find(options);
  }


  async currentTotal(email: string): Promise<number> {
    const options: FindManyOptions<OrderMonth> = {
      where: {
        profile: {
          email
        },
        paid: false
      }
    };

    const { sum } = await this.orderMonthRepository.createQueryBuilder('orderMonth')
      .where(options.where)
      .innerJoin('orderMonth.profile', 'profile')
      .select('SUM(orderMonth.total)')
      .getRawOne<{ sum: number }>();

    return sum;
  }

  async getOrdersOn(date: PlainDate, email: string): Promise<Order[]> {
    const options: FindManyOptions<Order> = {
      where: {
        profile: {
          email
        },
        date: date.toString()
      },
      relations: {
        meal: true
      }
    };

    return this.orderRepository.find(options);
  }

  async getOrdersFrom(date: PlainDate, email: string): Promise<Order[]> {
    const options: FindManyOptions<Order> = {
      where: {
        profile: {
          email
        },
        date: MoreThanOrEqual(date.toString())
      },
      relations: {
        meal: true
      }
    };

    return this.orderRepository.find(options);
  }

  async getOrder(orderId: string): Promise<Order> {
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

  async order(mealId: string, email: string, considerOrderableDate: boolean, guestName?: string): Promise<Order> {
    const meal = await this.mealService.getMeal(mealId);

    const mealDate = Temporal.PlainDate.from(meal.date);
    const firstOrderableDate = this.dateService.getNextOrderableDate();

    if (considerOrderableDate && PlainDate.compare(mealDate, firstOrderableDate) === -1) {
      throw new BadRequestException('Too late to order this meal.');
    }

    const mealAlreadyOrdered = await this.mealAlreadyOrdered(mealId, email);
    if (mealAlreadyOrdered) {
      throw new BadRequestException('User already ordered this meal.');
    }

    const order = await this.addOrder(email, meal, guestName);

    const promises: Promise<any>[] = [];

    // only increase total if order is not for guest
    if (!guestName) {
      order.orderMonth.total += meal.total;
      promises.push(this.orderMonthRepository.save(order.orderMonth));
    }

    meal.orderCount += 1;
    promises.push(this.mealRepository.save(meal));

    await Promise.all(promises);
    return order;
  }

  async addOrder(email: string, meal: Meal, guestName: string): Promise<Order> {
    const date = PlainDate.from(meal.date);

    const profilePromise = this.authService.getProfile(email);
    const orderMonthPromise = this.orderMonthService.getOrderMonth(date.month, date.year, email);
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

  async deleteOrder(id: string, user: AuthUser): Promise<void> {
    const order = await this.getOrder(id);

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

    await Promise.all([this.orderRepository.remove(order), this.orderMonthRepository.save(orderMonth), this.mealRepository.save(meal)]);
  }

  private async mealAlreadyOrdered(mealId: string, email: string): Promise<boolean> {
    const orderOptions: FindManyOptions<Order> = {
      where: {
        profile: {
          email
        },
        meal: {
          id: mealId
        },
        guestName: ''
      }
    };

    const order = await this.orderRepository.findOne(orderOptions);
    return !!order;
  }

  private canEdit(order: Order, user: AuthUser): boolean {
    return order.profile.email === user.email || user.isAdmin;
  }
}
