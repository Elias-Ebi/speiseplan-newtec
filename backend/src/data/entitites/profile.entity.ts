import { Column, Entity, PrimaryColumn } from 'typeorm';
import {IsEmail, IsNotEmpty} from 'class-validator';

@Entity()
export class Profile {
  @PrimaryColumn()
  @IsEmail()
  email: string;

  @Column()
  @IsNotEmpty({ message: 'Name must not be empty.' })
  name: string;

  @Column()
  isAdmin: boolean;
}
