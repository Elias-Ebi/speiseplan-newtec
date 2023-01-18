import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from './order.entity';
import { DecimalTransformer } from '../transformers/decimal.transformer';
import { Profile } from './profile.entity';

@Entity()
export class OrderMonth {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Profile)
  profile: Profile;

  @Column()
  month: number;

  @Column()
  year: number;

  @OneToMany(() => Order, (order) => order.orderMonth)
  orders: Order[];

  @Column({ type: 'decimal', precision: 5, scale: 2, transformer: new DecimalTransformer() })
  total: number;

  @Column({ default: false })
  paid: boolean;
}
