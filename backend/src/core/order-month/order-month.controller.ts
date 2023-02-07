import {Controller, Get, Param, Request} from '@nestjs/common';
import {AuthUser} from "../../auth/models/AuthUser";
import {OrderMonthService} from "./order-month.service";
import {OrderMonth} from "../../data/entitites/order-month.entity";

@Controller('order-month')
export class OrderMonthController {
    constructor(private orderMonthService: OrderMonthService) {
    }

    @Get('month/:month/:year')
    async monthOrders(@Param('month') month: string, @Param('year') year: string, @Request() req): Promise<OrderMonth[]> {
        const user = req.user as AuthUser;
         if (!user.isAdmin){
             console.log("Not authorized!!")
             return ;
         }
        return await this.orderMonthService.getMonthOrders(Number(month), Number(year));
    }
}
