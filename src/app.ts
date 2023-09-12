import {
  Observable,
  Subscription,
  of,
  from,
  forkJoin,
  combineLatest,
  delay,
  mergeMap,
  concatMap,
  switchMap,
  distinctUntilChanged,
  debounceTime,
} from "rxjs";

class App {
  /** Entry point of our app */
  public static start1() {
    const observable: Observable<number> = of(1, 2, 3, 4, 5); // observable can be observed for a stram of values.
    const subscription1: Subscription = observable.subscribe({
      next: (value: number) => {
        console.log(`From observer1 ${value}`);
      },
    });
    const subscription2: Subscription = observable.subscribe((n) => {
      console.log(`From observer2 ${n}`);
    });
    subscription1.unsubscribe();
    subscription2.unsubscribe();

    // An observable that throws an error
    const errorObservable = new Observable<string>((subscriber) => {
      // Trying to emit a value
      subscriber.next("This is a value before the error.");

      // Throwing an error
      // subscriber.error(new Error("fatal error"));

      // This won't get called due to the error above
      subscriber.next("This is a value after the error.");
    });

    // Subscribing to the observable
    errorObservable.subscribe({
      next(value) {
        console.log(value);
      },
      error(err) {
        console.error(err); // This will handle and log the error
      },
    });

    let promise = Promise.resolve(1);
    let obs = from(promise);
    obs.subscribe((x) => {
      console.log(`Bingo ${x}`);
    });

    //forkJoin
    let promises = [
      Promise.resolve(1),
      Promise.resolve(2),
      Promise.resolve(3),
      Promise.resolve(4),
    ];
    let obx = forkJoin(promises);
    obx.subscribe((x) => {
      console.log(`Fork Join ${x}`);
    });

    const obs1 = of(1, 2, 3).pipe(delay(1000)); // Emits values with a delay
    const obs2 = of("a", "b", "c");

    combineLatest([obs1, obs2]).subscribe(([val1, val2]) => {
      console.log(val1, val2);
    });

    /*  of('a', 'b', 'c').pipe(
      mergeMap(char => {
        if (char === 'b') {
          return throwError('Oops!');
        }
        return of(char);
      }),
      retry(2)
    ).subscribe({
      next: value => console.log(value),
      error: error => console.error(error)
    }); */

    of("a", "b", "c")
      .pipe(switchMap((x) => of(`mm1${x}`, `mm2${x}`).pipe(delay(200))))
      .subscribe((x) => {
        console.log(x);
      });
  }
  public static start2() {
    const source$ = of(1, 2, 3, 4);
    source$
      .pipe(concatMap((value) => of(value * 2).pipe(delay(100 - value * 10))))
      .subscribe(console.log);
  }
  public static start3() {
    const source$ = of(1, 1, 1, 2, 2, 3, 3, 3, 3, 3, 4);
    source$
      .pipe(distinctUntilChanged(),debounceTime(100), switchMap((x)=>of(x*3)))
      .subscribe(console.log);
  }
}
//App.start1();
//App.start2();
App.start3();
