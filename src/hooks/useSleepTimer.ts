import { useState, useEffect, useRef } from 'react';
import { dspEngine } from '../audio/dspEngine';

export function useSleepTimer(onStopCb: () => void) {
  const [minutesLeft, setMinutesLeft] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const endTimeRef = useRef<number | null>(null);

  const startTimer = (minutes: number) => {
    clearTimer();
    setMinutesLeft(minutes);
    
    timerRef.current = setTimeout(() => {
      dspEngine.stop();
      onStopCb();
      clearTimer();
    }, minutes * 60 * 1000);

    endTimeRef.current = Date.now() + minutes * 60 * 1000;

    intervalRef.current = setInterval(() => {
      if (endTimeRef.current) {
        const remainingMs = endTimeRef.current - Date.now();
        if (remainingMs <= 0) {
          clearTimer();
        } else {
          setMinutesLeft(Math.ceil(remainingMs / 60000));
        }
      }
    }, 10000);
  };

  const clearTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
    timerRef.current = null;
    intervalRef.current = null;
    endTimeRef.current = null;
    setMinutesLeft(null);
  };

  useEffect(() => {
    return () => clearTimer();
  }, []);

  return { minutesLeft, startTimer, clearTimer };
}