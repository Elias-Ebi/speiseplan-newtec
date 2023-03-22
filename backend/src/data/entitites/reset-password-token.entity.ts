import { IsEmail, IsNotEmpty } from "class-validator";
import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class ResetPasswordToken {
    @PrimaryColumn()
    @IsEmail()
    email: string;

    @Column()
    @IsNotEmpty()
    token: string;
    
    @Column()
    @IsNotEmpty()
    updatedAt: string;
}