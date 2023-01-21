import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Meal } from '../../data/entitites/meal.entity';
import { FindManyOptions, FindOneOptions, MoreThanOrEqual, Repository } from 'typeorm';
import { categoryExists } from '../../data/other-models/category.type';
import { Temporal } from '@js-temporal/polyfill';
import PlainDate = Temporal.PlainDate;

@Injectable()
export class MealService {
  constructor(@InjectRepository(Meal) private mealRepository: Repository<Meal>) {
  }

  async getMeal(id: string): Promise<Meal> {
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

  async getMealsFrom(date: PlainDate): Promise<Meal[]> {
    const options: FindManyOptions<Meal> = {
      where: {
        date: MoreThanOrEqual(date.toString())
      }
    };

    return this.mealRepository.find(options);
  }

  async addMeal(meal: Meal): Promise<Meal> {
    if (!categoryExists(meal.categoryId)) {
      throw new UnprocessableEntityException('CategoryID is invalid.');
    }

    meal.orderCount = 0;

    return this.mealRepository.save(meal);
  }

  async updateMeal(meal: Meal): Promise<Meal> {
    const currMeal = await this.getMeal(meal.id);

    meal.orderCount = currMeal.orderCount;

    return this.mealRepository.save(meal);
  }

  async deleteMeal(id: string): Promise<void> {
    const meal = await this.getMeal(id);
    await this.mealRepository.remove(meal);
  }
}
