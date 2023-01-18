import { Injectable } from '@nestjs/common';
import { OrderMonth } from '../../data/entitites/order-month.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from '../../auth/auth.service';

@Injectable()
export class OrderMonthService {

  constructor(@InjectRepository(OrderMonth) private orderMonthRepository: Repository<OrderMonth>, private authService: AuthService) {
  }

  async getOrderMonth(month: number, year: number, email: string): Promise<OrderMonth> {
    const options: FindOneOptions<OrderMonth> = {
      where: { month, year, profile: { email } }
    };

    let orderMonth = await this.orderMonthRepository.findOne(options);

    if (!orderMonth) {
      orderMonth = await this.addOrderMonth(month, year, email);
    }

    return orderMonth;
  }

  private async addOrderMonth(month: number, year: number, email: string): Promise<OrderMonth> {
    const profile = await this.authService.getProfile(email);

    const orderMonth: OrderMonth = {
      profile,
      month,
      year,
      total: 0,
      paid: false
    } as OrderMonth;

    return this.orderMonthRepository.save(orderMonth);
  }
}
