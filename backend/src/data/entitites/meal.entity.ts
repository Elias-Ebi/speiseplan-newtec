import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Temporal } from '@js-temporal/polyfill';
import PlainDate = Temporal.PlainDate;

@Entity()
export class Meal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  date: PlainDate;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  total: number;

  @Column()
  categoryId: string;
}
