import { ValueTransformer } from 'typeorm';

export class DateTimeTransformer implements ValueTransformer {
  to(data: string): string {
    return data;
  }

  from(data: Date): string {
    return data.toISOString().replace('Z', '');
  }
}
