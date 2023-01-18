import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSource = new BehaviorSubject<boolean>(false);


  get loading$(): Observable<boolean> {
    return this.loadingSource.asObservable();
  }


  setLoading(value: boolean): void {
    this.loadingSource.next(value);
  }
}
