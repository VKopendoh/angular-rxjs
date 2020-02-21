import {Component} from '@angular/core';
import {interval, Subscription, Observable, Subject} from 'rxjs';
import {map, filter, switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  sub: Subscription;

  sub2: Subscription;

  sub3: Subscription;

  stream$: Subject<number> = new Subject<number>();

  counter = 0;

  constructor() {
    this.sub3 = this.stream$.subscribe(val => {
      console.log('Subcribe" ', val);
    });

    const stream$ = new Observable(obs => {
      setTimeout(() => {
        obs.next(1);
      }, 500);

      setTimeout(() => {
        obs.complete();
      }, 1900);

      setTimeout(() => {
        obs.error('Error 2 secs');
      }, 2000);

      setTimeout(() => {
        obs.next(2);
      }, 2500);
    });

    this.sub2 = stream$.subscribe(value => {
        console.log('Next: ', value);
      }, error => console.log('Error: ', error),
      () => console.log('Stream complete!'));

    const intervalStream$ = interval(1000);

    this.sub = intervalStream$
      .pipe(
        filter(value => value % 2 === 0),
        map((val) => `Mapped value ${val}`),
        switchMap(() => interval(500))
      )
      .subscribe((value) => {
        console.log(value);
      });
  }

  stop() {
    this.sub.unsubscribe();
  }

  stop2() {
    this.sub3.unsubscribe();
  }

  next() {
    this.counter++;
    this.stream$.next(this.counter);
  }
}
