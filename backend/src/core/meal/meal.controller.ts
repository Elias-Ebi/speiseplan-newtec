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
import { UpdateMealOptions } from './options-models/update-meal.options';
import PlainDate = Temporal.PlainDate;
import { MealTemplate } from 'src/data/entitites/meal-template.entity';
import { DefaultValues } from 'src/data/entitites/default-values.entity';
import { AuthUser } from 'src/auth/models/AuthUser';
import { Request } from '@nestjs/common/decorators';

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

  @Get('date/:date')
  async getMealsOn(@Param('date') date: string): Promise<Meal[]> {
    const requestedDate = PlainDate.from(date);
    return await this.mealService.getMealsOn(requestedDate);
  }

  @Get('meal-counter/:date')
  async getWeekMealCounter(@Param('date') mondayDate: string): Promise<number[]> {
    const requestedDate = PlainDate.from(mondayDate);
    return await this.mealService.getWeekMealCounter(requestedDate);
  }

  @Post('default-values')
  @AdminOnly()
  async setDefaultValues(@Body() values: DefaultValues): Promise<DefaultValues> {
    return await this.mealService.setDefaultValues(values);
  }


  @Get('default-values')
  @AdminOnly()
  async getDefaultValues(): Promise<DefaultValues> {
    return await this.mealService.getDefaultValues();
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
    const options: UpdateMealOptions = { replaceOrderCount: true };
    return await this.mealService.update(meal, options);
  }

  @Delete(':id')
  @AdminOnly()
  async deleteMeal(@Param('id') id: string, @Request() req): Promise<void> {
    const user = req.user as AuthUser;
    return await this.mealService.delete(id, user);
  }

  @Put('mealTemplates')
  @AdminOnly()
  async addMealTemplate(@Body() mealTemplate: MealTemplate): Promise<MealTemplate>{
    return await this.mealService.createTemplate(mealTemplate);
  }

  @Get('mealTemplates')
  async getMealTemplates(): Promise<MealTemplate[]> {
    return await this.mealService.getTemplates();
  }

  @Delete('mealTemplates/remove/:id')
  @AdminOnly()
  async deleteMealTemplate(@Param('id') id: string): Promise<void> {
    return await this.mealService.deleteTemplate(id);
  }
}
