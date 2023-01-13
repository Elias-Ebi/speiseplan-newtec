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
      year: "2-digit",
      month: "numeric",
      day: "numeric",
    };
    return date.toLocaleString('default', options);
  }

}
