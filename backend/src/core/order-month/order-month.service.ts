import {Injectable, NotFoundException} from '@nestjs/common';
import {OrderMonth} from '../../data/entitites/order-month.entity';
import {FindOneOptions, FindOptionsWhere, Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {AuthService} from '../../auth/auth.service';
import {Temporal} from '@js-temporal/polyfill';

@Injectable()
export class OrderMonthService {
    private monthsToGoBack: 5;

    constructor(@InjectRepository(OrderMonth) private orderMonthRepository: Repository<OrderMonth>, private authService: AuthService) {
    }

    async getBalance(email: string): Promise<number> {
        const options: FindOptionsWhere<OrderMonth> = {
            profile: {
                email
            },
            paid: false
        };

        const {sum} = await this.orderMonthRepository.createQueryBuilder('orderMonth')
            .where(options)
            .innerJoin('orderMonth.profile', 'profile')
            .select('SUM(orderMonth.total)')
            .getRawOne<{ sum: number }>();

        return sum;
    }

    async getHistory(email: string): Promise<OrderMonth[]> {
        const currentDate = Temporal.Now.plainDateISO();
        const fromDate = currentDate.add({months: -this.monthsToGoBack});

        const options: FindOptionsWhere<OrderMonth> = {
            profile: {email}
        };

        return this.orderMonthRepository
            .createQueryBuilder('orderMonth')
            .innerJoinAndSelect('orderMonth.orders', 'order')
            .innerJoinAndSelect('order.meal', 'meal')
            .where(options)
            .andWhere('order.guestName IS NULL')
            .andWhere('orderMonth.year > :year OR (orderMonth.year = :year AND orderMonth.month >= :month)', {
                year: fromDate.year,
                month: fromDate.month
            })
            .getMany();
    }

    async monthOverview(): Promise<OrderMonth[]> {
        const currentDate = Temporal.Now.plainDateISO();
        const fromDate = currentDate.add({months: -this.monthsToGoBack});

        return this.orderMonthRepository
            .createQueryBuilder('orderMonth')
            .innerJoinAndSelect('orderMonth.orders', 'order')
            .innerJoinAndSelect('orderMonth.profile', 'profile')
            .where('order.guestName IS NULL')
            .andWhere('orderMonth.year > :year OR (orderMonth.year = :year AND orderMonth.month >= :month)', {
                year: fromDate.year,
                month: fromDate.month
            })
            .getMany();
    }

    async guestMonthOverview(): Promise<OrderMonth[]> {
        const currentDate = Temporal.Now.plainDateISO();
        const fromDate = currentDate.add({months: -this.monthsToGoBack});

        return this.orderMonthRepository
            .createQueryBuilder('orderMonth')
            .innerJoinAndSelect('orderMonth.orders', 'order')
            .innerJoinAndSelect('orderMonth.profile', 'profile')
            .where('order.guestName IS NOT NULL')
            .andWhere('orderMonth.year > :year OR (orderMonth.year = :year AND orderMonth.month >= :month)', {
                year: fromDate.year,
                month: fromDate.month
            })
            .getMany();
    }

    async get(month: number, year: number, email: string): Promise<OrderMonth> {
        const options: FindOneOptions<OrderMonth> = {
            where: {month, year, profile: {email}}
        };

        let orderMonth = await this.orderMonthRepository.findOne(options);

        if (!orderMonth) {
            orderMonth = await this.create(month, year, email);
        }

        return orderMonth;
    }

    async getById(id: string): Promise<OrderMonth> {
        const options: FindOneOptions<OrderMonth> = {where: {id}};

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
