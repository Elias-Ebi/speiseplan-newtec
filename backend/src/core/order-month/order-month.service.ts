import { Injectable } from '@nestjs/common';
import { OrderMonth } from '../../data/entitites/order-month.entity';
import { FindManyOptions, FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from '../../auth/auth.service';

@Injectable()
export class OrderMonthService {

  constructor(@InjectRepository(OrderMonth) private orderMonthRepository: Repository<OrderMonth>, private authService: AuthService) {
  }

  async getBalance(email: string): Promise<number> {
    const options: FindOptionsWhere<OrderMonth> = {
      profile: {
        email
      },
      paid: false

    };

    const { sum } = await this.orderMonthRepository.createQueryBuilder('orderMonth')
      .where(options)
      .innerJoin('orderMonth.profile', 'profile')
      .select('SUM(orderMonth.total)')
      .getRawOne<{ sum: number }>();

    return sum;
  }

  async getHistory(email: string): Promise<OrderMonth[]> {
    const options: FindManyOptions<OrderMonth> = {
      where: { profile: { email } },
      relations: {
        orders: {
          meal: true
        }
      }
    };

    const orderMonths = await this.orderMonthRepository.find(options);
    orderMonths.forEach((orderMonth) => {
      orderMonth.orders = orderMonth.orders.filter((order) => !order.guestName);
    });

    return orderMonths;
  }

  async get(month: number, year: number, email: string): Promise<OrderMonth> {
    const options: FindOneOptions<OrderMonth> = {
      where: { month, year, profile: { email } }
    };

    let orderMonth = await this.orderMonthRepository.findOne(options);

    if (!orderMonth) {
      orderMonth = await this.create(month, year, email);
    }

    return orderMonth;
  }

  async update(orderMonth: OrderMonth): Promise<OrderMonth> {
    return this.orderMonthRepository.save(orderMonth);
  }

  private async create(month: number, year: number, email: string): Promise<OrderMonth> {
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
