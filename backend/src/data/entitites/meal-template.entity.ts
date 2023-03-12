import { IsNotEmpty, IsUUID } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class MealTemplate {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    @IsNotEmpty({ message: 'Name must not be empty.' })
    name: string;

    @Column()
    @IsNotEmpty({ message: 'Description must not be empty.' })
    description: string;

    @Column()
    @IsUUID('all', { message: 'CategoryId must be a UUID.' })
    categoryId: string;
}