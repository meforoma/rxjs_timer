/* eslint-disable react/prop-types */
import React from 'react';
import './Controls.scss';

export const Controls = ({
  doStart, doStop,
  doRestart, doWait,
  running
}) => (
  <div className="controls__container">
    <button
      type="button"
      className="controls__button controls__button--start-stop"
      onClick={running ? doStop : doStart}
    >
      {running ? '⏹️ Stop' : '▶️ Start'}
    </button>

    <button
      type="button"
      name="button--wait"
      className="controls__button controls__button--wait"
      disabled={!running}
      onClick={() => doWait()}
    >
      ⏸️ Wait
      <br />
      (double-click)
    </button>

    <button
      type="button"
      className="controls__button controls__button--restart"
      onClick={doRestart}
    >
      🔄 Restart
    </button>
  </div>
);
