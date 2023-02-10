import { Controller, Get, Request } from '@nestjs/common';
import { AuthUser } from '../../auth/models/AuthUser';
import { OrderMonthService } from './order-month.service';
import { OrderMonth } from '../../data/entitites/order-month.entity';

@Controller('order-month')
export class OrderMonthController {
  constructor(private orderMonthService: OrderMonthService) {
  }

  @Get('history')
  async order(@Request() req): Promise<OrderMonth[]> {
    const user = req.user as AuthUser;
    return this.orderMonthService.getHistory(user.email);
  }
}
