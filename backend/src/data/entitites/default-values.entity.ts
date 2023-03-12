import { IsNotEmpty, IsUUID } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class DefaultValues {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('decimal', {default: 3.8})
    @IsNotEmpty({ message: 'Total must not be empty.' })
    total: number;

    @Column('varchar', {default: '12:00'})
    @IsNotEmpty({ message: 'DeliveryTime must not be empty.' })
    deliveryTime: string;

    @Column('varchar', {default: '13:00'})
    @IsNotEmpty({ message: 'OrderableTime must not be empty.' })
    orderableTime: string;
}