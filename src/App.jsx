import './App.css';
import React, { useState } from 'react';
import {
  interval, Subject, fromEvent
} from 'rxjs';
import {
  scan, tap, startWith,
  takeUntil,
  buffer, debounceTime, map, filter
} from 'rxjs/operators';

import { Title } from './components/Title';
import { Count } from './components/Count';
import { Controls } from './components/Controls';

const timerStopObserve = new Subject();

export const App = () => {
  const [running, setRunning] = useState(false);
  const [timerSec, setTimerSec] = useState(0);

  const timerStart = (reset) => {
    interval(100)
      .pipe(
        startWith(reset === 'with reset' ? 0 : timerSec),
        scan(second => second + 1),
        tap(setTimerSec),
        takeUntil(timerStopObserve.asObservable())
      )
      .subscribe();
  };

  const doStart = () => {
    setRunning(true);

    timerStart('without reset');
  };

  const doStop = () => {
    timerStopObserve.next(false);
    setRunning(false);
    setTimerSec(0);
  };

  const doRestart = () => {
    timerStopObserve.next(false);
    timerStart('with reset');
    setRunning(true);
  };

  const doWait = (timeToClick = 300) => {
    const buttonWait = document.querySelector('.controls__button--wait');
    const click = fromEvent(buttonWait, 'click');

    const waitClick = click
      .pipe(
        buffer(click.pipe(debounceTime(timeToClick))),
        map(e => e.length),
        filter(clicks => clicks === 2)
      );

    waitClick.subscribe(result => {
      console.log('triple click: ', result, 'debounceTime = ', timeToClick);
      timerStopObserve.next(false);
      setRunning(false);
    });
  };

  return (
    <container>
      <div className="timer-wrap">
        <Title />
        <Count
          timerSec={timerSec}
        />
        <Controls
          doStart={doStart}
          doStop={doStop}
          doRestart={doRestart}
          doWait={doWait}
          running={running}
        />
      </div>
    </container>
  );
};
