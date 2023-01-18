import {Pipe, PipeTransform} from '@angular/core';
import {Intl, Temporal} from "@js-temporal/polyfill";
import DateTimeFormatOptions = Intl.DateTimeFormatOptions;

@Pipe({
  name: 'fullDate',
  standalone: true
})
export class FullDatePipe implements PipeTransform {

  transform(date: Temporal.PlainDate): string {
    const options: DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "2-digit",
      day: "numeric",
    };
    return date.toLocaleString('default', options);
  }

}
