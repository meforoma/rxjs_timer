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

  const doPause = (timeToDoubleClick = 300) => {
    const buttonPause = document.querySelector('.controls__button--pause');
    const click = fromEvent(buttonPause, 'click');

    const doubleClick = click
      .pipe(
        buffer(click.pipe(debounceTime(timeToDoubleClick))),
        map(e => e.length),
        filter(clicks => clicks === 3)
      );

    doubleClick.subscribe(result => {
      console.log('double clicked', result, 'debounceTime = ', timeToDoubleClick);
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
          doPause={doPause}
          running={running}
        />
      </div>
    </container>
  );
};
