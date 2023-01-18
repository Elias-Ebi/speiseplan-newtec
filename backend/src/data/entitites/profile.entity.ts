import { Column, Entity, PrimaryColumn } from 'typeorm';
import { IsEmail } from 'class-validator';

@Entity()
export class Profile {
  @PrimaryColumn()
  @IsEmail()
  email: string;

  @Column()
  name: string;

  @Column()
  isAdmin: boolean;
}
