import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Meal } from '../../data/entitites/meal.entity';
import { FindManyOptions, FindOneOptions, FindOptionsWhere, MoreThan, Repository } from 'typeorm';
import { categoryExists } from '../../data/other-models/category.type';
import { Temporal } from '@js-temporal/polyfill';
import { UpdateMealOptions } from './options-models/update-meal.options';
import PlainDateTime = Temporal.PlainDateTime;
import PlainDate = Temporal.PlainDate;

@Injectable()
export class MealService {
  constructor(@InjectRepository(Meal) private mealRepository: Repository<Meal>) {
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

  async delete(id: string): Promise<void> {
    const meal = await this.get(id);
    await this.mealRepository.remove(meal);
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
}
