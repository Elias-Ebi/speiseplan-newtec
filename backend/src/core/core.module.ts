import {Module} from '@nestjs/common';
import {MealController} from './meal/meal.controller';
import {MealService} from './meal/meal.service';
import {OrderController} from './order/order.controller';
import {OrderService} from './order/order.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Meal} from '../data/entitites/meal.entity';
import {Order} from '../data/entitites/order.entity';
import {OrderMonth} from '../data/entitites/order-month.entity';
import {AuthModule} from '../auth/auth.module';
import {OrderMonthController} from './order-month/order-month.controller';
import {OrderMonthService} from './order-month/order-month.service';
import {MealTemplate} from 'src/data/entitites/meal-template.entity';
import {DefaultValues} from 'src/data/entitites/default-values.entity';
import {SharedModule} from '../shared/shared.module';
import { ResetPasswordToken } from 'src/data/entitites/reset-password-token.entity';
import {ScheduleModule} from "@nestjs/schedule/dist";

@Module({
  imports: [ScheduleModule.forRoot(), TypeOrmModule.forFeature([Meal, Order, OrderMonth, MealTemplate, DefaultValues, ResetPasswordToken]), AuthModule, SharedModule],
  controllers: [MealController, OrderController, OrderMonthController],
  providers: [MealService, OrderService, OrderMonthService]
})
export class CoreModule {
}
