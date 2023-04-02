import { Controller, Get, Param, Put, Request } from '@nestjs/common';
import { AuthUser } from '../../auth/models/AuthUser';
import { OrderMonthService } from './order-month.service';
import { OrderMonth } from '../../data/entitites/order-month.entity';
import { AdminOnly } from '../../auth/decorators/admin-only.decorator';
import {Order} from "../../data/entitites/order.entity";
import {OrderService} from "../order/order.service";

@Controller('order-month')
export class OrderMonthController {
  constructor(private orderMonthService: OrderMonthService, private orderService: OrderService) {
  }

  @Get('current-balance')
  async currentBalance(@Request() req): Promise<number> {
    const user = req.user as AuthUser;
    return this.orderMonthService.getBalance(user.email);
  }

  @Get('month-overview')
  @AdminOnly()
  async orderMonths(): Promise<OrderMonth[]> {
    return await this.orderMonthService.monthOverview();
  }

  @Get('guest-month-overview')
//  @AdminOnly()
  async guestOrderMonths(): Promise<Order[]> {
    const orderMonthsWithGuests =  await this.orderMonthService.guestMonthOverview();

    const ordersWithGuestNameIds: string[] = orderMonthsWithGuests
        .flatMap(orderMonth => orderMonth.orders)
        .filter(order => order.guestName !== null)
        .map(order => order.id);

    return await Promise.all(ordersWithGuestNameIds.map(id => this.orderService.get(id)));
  }

  @Get('history')
  async history(@Request() req): Promise<OrderMonth[]> {
    const user = req.user as AuthUser;
    return this.orderMonthService.getHistory(user.email);
  }

  @Put('payment-status/:id')
  @AdminOnly()
  async changePaymentStatus(@Param('id') id: string): Promise<OrderMonth> {
    return this.orderMonthService.setPaymentStatus(id);
  }
}
