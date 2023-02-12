import { Controller, Delete, Get, Param, Post, Put, Query, Request } from '@nestjs/common';
import { OrderService } from './order.service';
import { AuthUser } from '../../auth/models/AuthUser';
import { Order } from '../../data/entitites/order.entity';
import { Temporal } from '@js-temporal/polyfill';
import PlainDate = Temporal.PlainDate;
import { AdminOnly } from 'src/auth/decorators/admin-only.decorator';


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

  @Get('current-balance')
  async currentBalance(@Request() req): Promise<number> {
    const user = req.user as AuthUser;
    return this.orderService.getCurrentBalance(user.email);
  }

  @Get('unchangeable')
  async unchangeableOrders(@Request() req): Promise<Order[]> {
    const user = req.user as AuthUser;
    const time = Temporal.Now.plainDateTimeISO();
    return this.orderService.getUnchangeable(time, user.email);
  }

  /*
  @Get('multiple-orders')
  async allOrders(@Request() req): Promise<Order[]> {
    const user = req.user as AuthUser;
    const filter = {
      meal: 'testmeal',
      buyer: 'testuser',
      guest: 'testguest',
      date: this.dateService.getLatestUnchangeableDate()
    }
    return this.orderService.getMultipleOrders(user.email, filter);
  }
  */

  @Get('open')
  async openOrders(@Request() req): Promise<Order[]> {
    const user = req.user as AuthUser;
    const time = Temporal.Now.plainDateTimeISO();
    return this.orderService.getChangeable(time, user.email);
  }

  @Get('admin')
  @AdminOnly()
  async openOrdersAdmin(@Request() req): Promise<Order[]> {
    return this.orderService.getAllOrders();
  }

  @Get('date/:date')
  async getOrdersOn(@Param('date') date: string, @Request() req): Promise<Order[]> {
    const user = req.user as AuthUser;
    const requestedDate = PlainDate.from(date);
    return await this.orderService.getOn(requestedDate, user.email);
  }

  @Post(':mealId')
  async order(@Param('mealId') mealId: string, @Request() req, @Query('guestName') guestName?: string): Promise<Order> {
    const user = req.user as AuthUser;
    const time = Temporal.Now.plainDateTimeISO();
    return this.orderService.order(time, mealId, user.email, guestName);
  }


  @Post('admin/:orderId')
  @AdminOnly()
  async updateOrder(@Param('orderId') orderId: string, @Request() req): Promise<boolean> {
    return this.orderService.updateOrder(orderId, req.body.order);
  }
  
  @Post('/multiple-orders/admin')
  @AdminOnly()
  async updateMultipleOrders(@Request() req): Promise<boolean> {
    return this.orderService.updateMultipleOrders(req.body.orders as Order[], req.body.changes);
  }

  @Delete('admin/:id')
  @AdminOnly()
  async deleteOrderAdmin(@Param('id') id: string, @Request() req): Promise<Order> {
    return this.orderService.deleteOrderByAdmin(id);
  }
  
   // http client cannot add body, so post is used instead
  @Post('/multiple-orders/delet/admin')
  @AdminOnly()
  async deleteMultipleOrdersAdmin( @Request() req): Promise<boolean> {
    return this.orderService.deleteMultipleOrdersByAdmin(req.body.orders as Order[]);
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
