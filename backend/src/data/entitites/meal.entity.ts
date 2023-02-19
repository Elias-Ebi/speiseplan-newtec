import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { IsDate, IsDateString, IsNotEmpty, IsUUID, Min } from 'class-validator';
import { DecimalTransformer } from '../transformers/decimal.transformer';
import { DateTimeTransformer } from '../transformers/date-time.transformer';

@Entity()
export class Meal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date' })
  @IsDate({ message: 'Date has to be in a date format.' })
  @Index()
  date: string;

  @Column({ type: 'timestamptz', transformer: new DateTimeTransformer() })
  @IsDateString()
  delivery: string;

  @Column({ type: 'timestamptz', transformer: new DateTimeTransformer() })
  @IsDateString()
  @Index()
  orderable: string;

  @Column()
  @IsNotEmpty({ message: 'Name must not be empty.' })
  name: string;

  @Column()
  @IsNotEmpty({ message: 'Description must not be empty.' })
  description: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, transformer: new DecimalTransformer() })
  @Min(0, { message: 'Total must not be negative.' })
  total: number;

  @Column()
  @IsUUID('all', { message: 'CategoryId must be a UUID.' })
  categoryId: string;

  @Column({ default: 0 })
  orderCount: number;
}
