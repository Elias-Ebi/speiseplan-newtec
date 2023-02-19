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

  @Get('admin')
  @AdminOnly()
  async openOrdersAdmin(@Request() req): Promise<Order[]> {
    return this.orderService.getAllOrders();
  }
  @Post('filter')
  @AdminOnly()
  async filterOrders(@Request() req): Promise<Order[]> {
    const filter = req.body.filter;
    return this.orderService.applyFilter(filter);
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
