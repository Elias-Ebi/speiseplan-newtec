import { Controller, Get, Param, Put, Request } from '@nestjs/common';
import { AuthUser } from '../../auth/models/AuthUser';
import { OrderMonthService } from './order-month.service';
import { OrderMonth } from '../../data/entitites/order-month.entity';
import { AdminOnly } from '../../auth/decorators/admin-only.decorator';

@Controller('order-month')
export class OrderMonthController {
  constructor(private orderMonthService: OrderMonthService) {
  }

  @Get('current-balance')
  async currentBalance(@Request() req): Promise<number> {
    const user = req.user as AuthUser;
    return this.orderMonthService.getBalance(user.email);
  }

  @Get(':month/:year')
  @AdminOnly()
  async orderMonths(@Param('month') month: number, @Param('year') year: number): Promise<OrderMonth[]> {
    return await this.orderMonthService.getOrderMonths(month, year);
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
