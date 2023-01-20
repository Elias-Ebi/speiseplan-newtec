import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UnprocessableEntityException
} from '@nestjs/common';
import { Meal } from '../../data/entitites/meal.entity';
import { MealService } from './meal.service';
import { AdminOnly } from '../../auth/decorators/admin-only.decorator';
import { Temporal } from '@js-temporal/polyfill';

@Controller('meals')
export class MealController {
  constructor(private mealService: MealService) {
  }

  @Get()
  async getOrderableMeals(): Promise<Meal[]> {
    const time = Temporal.Now.plainDateTimeISO();
    return await this.mealService.getOrderable(time);
  }

  @Get('next-orderable')
  async getNextOrderable(): Promise<Meal[]> {
    const time = Temporal.Now.plainDateTimeISO();
    return await this.mealService.getNextOrderable(time);
  }

  @Post()
  @AdminOnly()
  async addMeal(@Body() meal: Meal): Promise<Meal> {
    if (meal.id) {
      throw new ConflictException('New meal must not contain an ID.');
    }

    return await this.mealService.create(meal);
  }

  @Put()
  @AdminOnly()
  async updateMeal(@Body() meal: Meal): Promise<Meal> {
    if (!meal.id) {
      throw new UnprocessableEntityException('Meal must contain an ID.');
    }

    return await this.mealService.update(meal, false);
  }

  @Delete(':id')
  @AdminOnly()
  async deleteMeal(@Param('id') id: string): Promise<void> {
    return await this.mealService.delete(id);
  }
}
