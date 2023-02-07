//Mainly for the monthoverview screen, not to be confused with the actual entity representation in src/app/shared/models/

export interface OrdersMonthByUser {
  name: string,
  numberOfMeals: number,
  totalBill: number,
  isPaid: boolean
}
