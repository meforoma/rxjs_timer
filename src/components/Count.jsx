/* eslint-disable react/prop-types */
import React from 'react';
import './Count.scss';

export const Count = ({ timerSec }) => {
  const isoDate = new Date(timerSec * 100).toISOString();
  const HHMMSS = isoDate.slice(11, 19);
  const ms = isoDate.slice(19, 21);

  return (
    <div className="count__container">
      <span className="count__HHMMSS">
        {HHMMSS}
      </span>
      <span className="count__ms">
        {ms}
      </span>
    </div>
  );
};
