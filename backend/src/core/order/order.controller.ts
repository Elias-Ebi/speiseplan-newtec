import { Controller, Delete, Get, Param, Post, Query, Request } from '@nestjs/common';
import { OrderService } from './order.service';
import { AuthUser } from '../../auth/models/AuthUser';
import { Order } from '../../data/entitites/order.entity';
import { DateService } from '../../shared/date/date.service';

@Controller('orders')
export class OrderController {
  constructor(private orderService: OrderService, private dateService: DateService) {
  }

  @Get('banditplates')
  async banditPlates(): Promise<Order[]> {
    const date = this.dateService.getLatestUnchangeableDate();
    return this.orderService.getBanditPlates(date);
  }

  @Get('current-total')
  async currentTotal(@Request() req): Promise<number> {
    const user = req.user as AuthUser;
    return this.orderService.currentTotal(user.email);
  }

  @Get('today')
  async todaysOrders(@Request() req): Promise<Order[]> {
    const user = req.user as AuthUser;
    const date = this.dateService.getLatestUnchangeableDate();
    return this.orderService.getOrdersOn(date, user.email);
  }

  @Get('open')
  async openOrders(@Request() req): Promise<Order[]> {
    const user = req.user as AuthUser;
    const date = this.dateService.getNextOrderableDate();
    return this.orderService.getOrdersFrom(date, user.email);
  }

  @Post(':mealId')
  async order(@Param('mealId') mealId: string, @Request() req, @Query('guestName') guestName?: string): Promise<Order> {
    const user = req.user as AuthUser;
    return this.orderService.order(mealId, user.email, true, guestName);
  }

  @Delete(':id')
  async deleteOrder(@Param('id') id: string, @Request() req): Promise<void> {
    const user = req.user as AuthUser;
    return this.orderService.deleteOrder(id, user, true);
  }
}
