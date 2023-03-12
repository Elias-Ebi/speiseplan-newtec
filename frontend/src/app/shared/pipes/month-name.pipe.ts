import { Pipe, PipeTransform } from '@angular/core';
import { Temporal } from "@js-temporal/polyfill";
import PlainDate = Temporal.PlainDate;
import PlainYearMonth = Temporal.PlainYearMonth;

@Pipe({
  name: 'monthName',
  standalone: true
})
export class MonthNamePipe implements PipeTransform {

  transform(date: PlainDate | PlainYearMonth): string {
    let transformDate: PlainDate;

    if (date instanceof PlainYearMonth) {
      transformDate = date.toPlainDate({day: 1});
    } else {
      transformDate = date;
    }

    return transformDate.toLocaleString('default', {month: 'long'});
  }
}
