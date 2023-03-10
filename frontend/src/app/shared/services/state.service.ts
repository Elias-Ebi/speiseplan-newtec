import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private selectedOrderDateSource = new BehaviorSubject<string | null>(null);
  selectedOrderDate = this.selectedOrderDateSource.asObservable();

  setSelectedOrderDate(date: string | null) {
    this.selectedOrderDateSource.next(date);
  }
}
