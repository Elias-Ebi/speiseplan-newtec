import { Injectable } from '@angular/core';
import { Temporal } from "@js-temporal/polyfill";
import PlainDate = Temporal.PlainDate;
import PlainTime = Temporal.PlainTime;

@Injectable({
  providedIn: 'root'
})
export class DateService {
  private threshold = Temporal.PlainTime.from({hour: 13});

  /**
   * Get the latest date where orders can't be changed anymore.
   *
   * @Return today if its < 13:00 and tomorrow if its >= 13:00
   * @Return Edge Case: Monday if its Friday > 13:00 or Weekend
   */
  getLatestUnchangeableDate(): PlainDate {
    const currentDate = Temporal.Now.plainDateISO();
    const currentTime = Temporal.Now.plainTimeISO();

    const isWeekend = currentDate.dayOfWeek > 5;
    const isFriday = currentDate.dayOfWeek === 5;
    const isBeforeThreshold = PlainTime.compare(currentTime, this.threshold) === -1;

    if (isFriday && !isBeforeThreshold || isWeekend) {
      const daysToNextMonday = 8 - currentDate.dayOfWeek;
      return currentDate.add({days: daysToNextMonday});
    }

    return this.getNextDate(currentDate, currentTime, this.threshold, 0);
  }

  /**
   * Get the next date where meals could potentially be ordered.
   *
   * @Return tomorrow if its < 13:00 and day after if its >= 13:00
   * @Return Edge Case: Next Monday if its thursday >= 13:00 or Friday < 13:00
   * @Return Edge Case: Tuesday if its Friday >= 13:00 or weekend
   */
  getNextOrderableDate(): PlainDate {
    const currentDate = Temporal.Now.plainDateISO();
    const currentTime = Temporal.Now.plainTimeISO();

    const isWeekend = currentDate.dayOfWeek > 5;
    const isFriday = currentDate.dayOfWeek === 5;
    const isThursday = currentDate.dayOfWeek === 4;
    const isBeforeThreshold = PlainTime.compare(currentTime, this.threshold) === -1;

    if (isFriday && isBeforeThreshold || isThursday && !isBeforeThreshold) {
      const daysToNextMonday = 8 - currentDate.dayOfWeek;
      return currentDate.add({days: daysToNextMonday});
    }

    if (isFriday && !isBeforeThreshold || isWeekend) {
      const daysToNextMonday = 8 - currentDate.dayOfWeek;
      return currentDate.add({days: daysToNextMonday + 1});
    }

    return this.getNextDate(currentDate, currentTime, this.threshold, 1);
  }

  public getNextFiveWeekDays() {
    let currentDate = Temporal.Now.plainDateISO();
    const weekdays = [];
    while (weekdays.length < 5) {
      if (currentDate.dayOfWeek >= 1 && currentDate.dayOfWeek <= 5) {
        weekdays.push(new PlainDate(currentDate.year, currentDate.month, currentDate.day));
      }
      currentDate = currentDate.add({days: 1})
    }
    return weekdays;
  }

  private getNextDate(startDate: PlainDate, time: PlainTime, threshold: PlainTime, daysToAdd: number): PlainDate {
    if (PlainTime.compare(time, threshold) >= 0) {
      return startDate.add({days: daysToAdd + 1});
    }

    return startDate.add({days: daysToAdd});
  }

  // This function takes a date object and returns a Temporal.PlainDate object with the same date.
  public dateToTemporal(date: Date): Temporal.PlainDate {
    return Temporal.PlainDate.from({year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate()});
  }

  //This function takes in a Temporal.PlainDate object and returns a Date object with the same date.
  public temporalToDate(date: Temporal.PlainDate): Date {
    return new Date(date.year, date.month - 1, date.day);
  }

  /**
   * Returns the date before a given date.
   * @param date The date to subtract days from.
   * @param days The number of days to subtract. Defaults to 1 if not provided.
   * @returns The date before a given date.
   */
  public getDayBefore(date: Temporal.PlainDate, days?: number) {
    if(days) {
      return date.subtract({days: days});
    } else {
      return date.subtract({days: 1});
    }
  }
}
