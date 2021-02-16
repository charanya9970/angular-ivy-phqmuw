import { Component, Input, OnDestroy,  OnInit, Output } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { of, Subscription, timer } from "rxjs";
import { catchError, filter, switchMap } from "rxjs/operators";

@Component({
  selector: "app-data-emitter",
  templateUrl: "./data-emitter.component.html",
  styleUrls: ["./data-emitter.component.css"]
})
export class DataEmitterComponent implements OnInit, OnDestroy {
  @Output() data: any;
  @Input() apiUrl: any;
  @Input() intervalPeriod: number;

  minutes: number;
  subscription: Subscription;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.minutes = this.intervalPeriod * 60 * 1000;

    this.subscription = timer(0, this.minutes)
      .pipe(
        switchMap(() => {
          return this.getData()
            .pipe(catchError(err => {
              // Handle errors
              console.error(err);
              return of(undefined);
            }));
        }),
        filter(data => data !== undefined)
      )
      .subscribe(data => {
        this.data = data;
        console.log(this.data);
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getData() {
    return this.http
      .get(this.apiUrl);
  }
}
