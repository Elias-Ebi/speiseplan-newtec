import { ConflictException, Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Meal } from '../../data/entitites/meal.entity';
import { FindManyOptions, FindOneOptions, FindOptionsWhere, MoreThan, Repository } from 'typeorm';
import { categoryExists } from '../../data/other-models/category.type';
import { Temporal } from '@js-temporal/polyfill';
import { UpdateMealOptions } from './options-models/update-meal.options';
import PlainDateTime = Temporal.PlainDateTime;
import PlainDate = Temporal.PlainDate;
import { MealTemplate } from 'src/data/entitites/meal-template.entity';
import { DefaultValues } from 'src/data/entitites/default-values.entity';
import { Order } from 'src/data/entitites/order.entity';
import { OrderMonth } from 'src/data/entitites/order-month.entity';
import { AuthUser } from 'src/auth/models/AuthUser';
import { OrderOptions } from '../order/options-models/order.options';

@Injectable()
export class MealService {
  constructor(
      @InjectRepository(Meal) private mealRepository: Repository<Meal>, 
      @InjectRepository(MealTemplate) private mealTemplateRepository: Repository<MealTemplate>,
      @InjectRepository(DefaultValues) private defaultValuesRepository: Repository<DefaultValues>,
      @InjectRepository(Order) private orderRepository: Repository<Order>,
      @InjectRepository(OrderMonth) private orderMonthRepository: Repository<OrderMonth>
    ) {
  }

  async get(id: string): Promise<Meal> {
    const options: FindOneOptions<Meal> = { where: { id } };

    const meal = await this.mealRepository.findOne(options);

    if (!meal) {
      throw new NotFoundException();
    }

    return meal;
  }

  async getMealsOn(date: PlainDate): Promise<Meal[]> {
    const options: FindManyOptions<Meal> = {
      where: {
        date: date.toString()
      }
    };

    return this.mealRepository.find(options);
  }

  async getNextOrderable(time: PlainDateTime): Promise<Meal[]> {
    const nextOrderableDate = await this.getMinDateFrom(time);

    if (!nextOrderableDate) {
      return [];
    }

    const options: FindManyOptions<Meal> = {
      where: {
        date: nextOrderableDate,
        orderable: MoreThan(time.toString())
      }
    };

    return this.mealRepository.find(options);
  }

  async getOrderable(time: PlainDateTime) {
    const options: FindManyOptions<Meal> = {
      where: {
        orderable: MoreThan(time.toString())
      }
    };
    return this.mealRepository.find(options);
  }

  async create(meal: Meal): Promise<Meal> {
    if (!categoryExists(meal.categoryId)) {
      throw new UnprocessableEntityException('CategoryID is invalid.');
    }

    meal.orderCount = 0;

    return this.mealRepository.save(meal);
  }

  async update(meal: Meal, options?: UpdateMealOptions): Promise<Meal> {
    if (options?.replaceOrderCount) {
      const currMeal = await this.get(meal.id);
      meal.orderCount = currMeal.orderCount;
    }

    return this.mealRepository.save(meal);
  }

  async delete(id: string, user: AuthUser): Promise<void> {
    const meal = await this.get(id);
    // Get all orders with this mealId
    const options: FindOneOptions<Order> = {
      where: {
        meal: {
          id: id
        }
      },
      relations: {
        profile: true,
        orderMonth: true,
        meal: true,
      }
    };
    const relevantOrders = await this.orderRepository.find(options);

    const time = Temporal.Now.plainDateTimeISO();
    for (const order of relevantOrders) {
      await this.deleteOrder(time, order, user)
    }
    await this.mealRepository.remove(meal);
  }


  // TODO: find a better way to implement this
  async deleteOrder(time: PlainDateTime, order: Order, user: AuthUser, options?: OrderOptions): Promise<Order> {
    const orderMonth = order.orderMonth;
    const meal = order.meal;

    // only decrease total if order is not for guest
    if (!order.guestName) {
      orderMonth.total -= meal.total;
    }

    meal.orderCount -= 1;

    const promises = [this.orderMonthRepository.save(orderMonth), this.mealRepository.save(meal)];
    await Promise.all(promises);

    return this.orderRepository.remove(order);
  }
  

  private async getMinDateFrom(time: PlainDateTime): Promise<string> {
    const options: FindOptionsWhere<Meal> = {
      orderable: MoreThan(time.toString())
    };

    const { minDate } = await this.mealRepository.createQueryBuilder('meal')
      .where(options)
      .select('MIN(meal.date)', 'minDate')
      .getRawOne<{ minDate: string }>();

    return minDate;
  }

  async createTemplate(mealTemplate: MealTemplate): Promise<MealTemplate> {
    //check if this meal template already exists
    const options: FindOneOptions<MealTemplate> = {
      where: {
        name: mealTemplate.name,
        description: mealTemplate.description,
        categoryId: mealTemplate.categoryId
      },
    };

    const savedTemplate = await this.mealTemplateRepository.findOne(options);
    if (savedTemplate) {
      throw new ConflictException;
    }
    return this.mealTemplateRepository.save(mealTemplate);
  }

  async getTemplates(): Promise<MealTemplate[]> {
    const options: FindOneOptions<MealTemplate> = {
      where: {},
    };

    return this.mealTemplateRepository.find(options);
  }

  async deleteTemplate(id: string): Promise<void> {
    const options: FindOneOptions<MealTemplate> = { where: { id } };

    const meal = await this.mealTemplateRepository.findOne(options);

    if (!meal) {
      throw new NotFoundException();
    }

    await this.mealTemplateRepository.remove(meal);
  }

  async setDefaultValues(values: DefaultValues): Promise<DefaultValues> {
    return await this.defaultValuesRepository.save(values);
  }

  async getDefaultValues(): Promise<DefaultValues> {
    const options: FindOneOptions<DefaultValues> = {
      where: {},
    };
    const result = await this.defaultValuesRepository.find(options);
    if (result.length === 0) {
      return await this.defaultValuesRepository.save(new DefaultValues());
    } else {
      return result[0];
    }
  }

}