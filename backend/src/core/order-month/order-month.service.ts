import { Injectable, NotFoundException } from '@nestjs/common';
import { OrderMonth } from '../../data/entitites/order-month.entity';
import { FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';
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
    const options: FindOptionsWhere<OrderMonth> = {
      profile: { email }
    };

    return this.orderMonthRepository
      .createQueryBuilder('orderMonth')
      .innerJoinAndSelect('orderMonth.orders', 'order')
      .innerJoinAndSelect('order.meal', 'meal')
      .where(options)
      .andWhere('order.guestName IS NULL')
      .getMany();
  }

  async getOrderMonths(month: number, year: number): Promise<OrderMonth[]> {
    const options: FindOneOptions<OrderMonth> = {
      where: { month, year },
      relations: {
        profile: true,
        orders: true
      }
    };
    return this.orderMonthRepository.find(options);
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

  async getById(id: string): Promise<OrderMonth> {
    const options: FindOneOptions<OrderMonth> = { where: { id } };

    const orderMonth = await this.orderMonthRepository.findOne(options);

    if (!orderMonth) {
      throw new NotFoundException();
    }

    return orderMonth;
  }

  async setPaymentStatus(id: string) {
    const orderMonth = await this.getById(id);
    orderMonth.paid = !orderMonth.paid;
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
