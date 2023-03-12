import { Controller, Delete, Get, Param, Post, Put, Query, Request } from '@nestjs/common';
import { OrderService } from './order.service';
import { AuthUser } from '../../auth/models/AuthUser';
import { Order } from '../../data/entitites/order.entity';
import { Temporal } from '@js-temporal/polyfill';
import { AdminOnly } from '../../auth/decorators/admin-only.decorator';
import PlainDate = Temporal.PlainDate;


@Controller('orders')
export class OrderController {
  constructor(private orderService: OrderService) {
  }

  @Get('banditplates')
  async banditPlates(): Promise<Order[]> {
    const time = Temporal.Now.plainDateTimeISO();
    return this.orderService.getBanditPlates(time);
  }

  @Put('banditplates/offer/:id')
  async offerAsBanditplate(@Param('id') id: string, @Request() req): Promise<Order> {
    const user = req.user as AuthUser;
    const time = Temporal.Now.plainDateTimeISO();
    return this.orderService.offerAsBanditplate(time, id, user);
  }

  @Put('banditplates/take/:id')
  async takeBanditplate(@Param('id') id: string, @Request() req): Promise<Order>{
    const user = req.user as AuthUser;
    const time = Temporal.Now.plainDateTimeISO();
    return this.orderService.takeBanditplate(time, id, user);
  }

  @Get('unchangeable')
  async unchangeableOrders(@Request() req): Promise<Order[]> {
    const user = req.user as AuthUser;
    const time = Temporal.Now.plainDateTimeISO();
    return this.orderService.getUnchangeable(time, user.email);
  }

  @Get('open')
  async openOrders(@Request() req): Promise<Order[]> {
    const user = req.user as AuthUser;
    const time = Temporal.Now.plainDateTimeISO();
    return this.orderService.getChangeable(time, user.email);
  }

  @Get('admin/changeable')
  @AdminOnly()
  async getAllChangeableAdmin() {
    const time = Temporal.Now.plainDateTimeISO();
    return this.orderService.getAllChangeableAdmin(time);
  }

  @Get('date/:date')
  async getOrdersOn(@Param('date') date: string, @Request() req): Promise<Order[]> {
    const user = req.user as AuthUser;
    const requestedDate = PlainDate.from(date);
    return await this.orderService.getOn(requestedDate, user.email);
  }

  @Get('date/:date/all')
  @AdminOnly()
  async getAllOrdersOn(@Param('date') date: string): Promise<Order[]> {
    const requestedDate = PlainDate.from(date);
    return this.orderService.getAllOn(requestedDate);
  }

  @Post(':mealId')
  async order(@Param('mealId') mealId: string, @Request() req, @Query('guestName') guestName?: string): Promise<Order> {
    const user = req.user as AuthUser;
    const time = Temporal.Now.plainDateTimeISO();
    return this.orderService.order(time, mealId, user.email, guestName);
  }

  @Post('/multiple-orders/delete/admin')
  @AdminOnly()
  async deleteMultipleOrdersAdmin( @Request() req): Promise<boolean> {
    const user = req.user as AuthUser;
    return this.orderService.deleteMultipleOrdersByAdmin(req.body.orders as Order[], user);
  }

  @Delete(':id')
  async deleteOrder(@Param('id') id: string, @Request() req): Promise<Order> {
    const user = req.user as AuthUser;
    const time = Temporal.Now.plainDateTimeISO();
    return this.orderService.delete(time, id, user);
  }

  @Delete('delete-day/:date')
  async deleteOrders(@Param('date') date: string, @Request() req): Promise<void> {
    const user = req.user as AuthUser;
    const time = Temporal.Now.plainDateTimeISO();
    const requestedDate = PlainDate.from(date);
    return this.orderService.deleteOn(time, requestedDate, user);
  }
}
