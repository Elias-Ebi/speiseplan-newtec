import { Column, Entity, PrimaryColumn } from 'typeorm';
import { IsEmail, IsNotEmpty } from 'class-validator';

@Entity()
export class User {
  @PrimaryColumn()
  @IsEmail()
  email: string;

  @Column()
  @IsNotEmpty()
  password: string;
}
