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
import { DateService } from '../../shared/date/date.service';

@Controller('meals')
export class MealController {
  constructor(private mealService: MealService, private dateService: DateService) {
  }

  @Get()
  async getOrderableMeals(): Promise<Meal[]> {
    const date = this.dateService.getNextOrderableDate();
    return await this.mealService.getMealsFrom(date);
  }

  @Post()
  @AdminOnly()
  async addMeal(@Body() meal: Meal): Promise<Meal> {
    if (meal.id) {
      throw new ConflictException('New meal must not contain an ID.');
    }

    return await this.mealService.addMeal(meal);
  }

  @Put()
  @AdminOnly()
  async updateMeal(@Body() meal: Meal): Promise<Meal> {
    if (!meal.id) {
      throw new UnprocessableEntityException('Meal must contain an ID.');
    }

    return await this.mealService.updateMeal(meal);
  }

  @Delete(':id')
  @AdminOnly()
  async deleteMeal(@Param('id') id: string): Promise<void> {
    return await this.mealService.deleteMeal(id);
  }
}
