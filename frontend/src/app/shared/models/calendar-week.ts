import { Temporal } from '@js-temporal/polyfill';

export class CalendarWeek {
    weekNumber: number;
    span: string;
    monday: CalendarWeekDay;
    tuesday: CalendarWeekDay;
    wednesday: CalendarWeekDay;
    thursday: CalendarWeekDay;
    friday: CalendarWeekDay;
    [key: string]: any; // erlaubt den Zugriff auf alle Schlüssel vom Typ string



    constructor(date: Temporal.PlainDate) {
        this.weekNumber = date.calendar.weekOfYear(date);
        // let currentWeekday = this.setCurrentWeekday(date);
        this.monday = new CalendarWeekDay(date.subtract({days: (date.dayOfWeek - 1)}));
        this.tuesday = new CalendarWeekDay(date.subtract({days: (date.dayOfWeek - 2)}));
        this.wednesday = new CalendarWeekDay(date.subtract({days: (date.dayOfWeek - 3)}));
        this.thursday = new CalendarWeekDay(date.subtract({days: (date.dayOfWeek - 4)}));
        this.friday = new CalendarWeekDay(date.subtract({days: (date.dayOfWeek - 5)}));
        this.span = this.getDateString();
    }

    getDateString(): string {
        return `KW ${this.weekNumber} —
            ${this.monday.date.toLocaleString('de', {  year: "numeric", month: "2-digit", day: "2-digit"})} -
            ${this.friday.date.toLocaleString('de', {  year: "numeric", month: "2-digit", day: "2-digit"})}`;
    }

    /*
    setCurrentWeekday(date: Temporal.PlainDate) {
        date.dayOfWeek
    }*/
}

export class CalendarWeekDay {
    date: Temporal.PlainDate
    dishes: any[]

    constructor(date: Temporal.PlainDate){
        this.date = date;
        //TODO:loadsaved dish-management for this day
        this.dishes = [];
    }
}
