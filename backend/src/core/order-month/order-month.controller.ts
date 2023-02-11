import {Body, Controller, Get, Param, Put, Request} from '@nestjs/common';
import {AuthUser} from "../../auth/models/AuthUser";
import {OrderMonthService} from "./order-month.service";
import {OrderMonth} from "../../data/entitites/order-month.entity";
import {AdminOnly} from "../../auth/decorators/admin-only.decorator";

@Controller('order-month')
export class OrderMonthController {
    constructor(private orderMonthService: OrderMonthService) {
    }

    @Get('month/:month/:year')
    @AdminOnly()
    async monthOrders(@Param('month') month: string, @Param('year') year: string, @Request() req): Promise<OrderMonth[]> {
        const user = req.user as AuthUser;
         if (!user.isAdmin){
             console.log("Not authorized!!")
             return ;
         }
        return await this.orderMonthService.getMonthOrders(Number(month), Number(year));
    }

    @Put('change-payment-status')
    @AdminOnly()
    async changePaymentStatus(@Body() order: OrderMonth): Promise<OrderMonth> {
        return await this.orderMonthService.update(order);
    }
}
