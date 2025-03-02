import { useEffect, useRef, useState } from 'react';

export const convertMsToTimeString = (ms: number) => {
  let totalSeconds = Math.floor(ms / 1000);
  let totalMinutes = Math.floor(totalSeconds / 60);
  let hours = (Math.floor(totalMinutes / 60) + '').padStart(2, '0');
  let minutes = ((totalMinutes % 60) + '').padStart(2, '0');
  let seconds = ((totalSeconds % 60) + '').padStart(2, '0');

  return `${hours}h ${minutes}m ${seconds}s`;
};

export const useTimer = (initialValueMs: number, intervalMs: number) => {
  const [timer, setTimer] = useState(initialValueMs);
  const expected = useRef(Date.now() + intervalMs);

  useEffect(() => {
    // self adjusting timer
    const step = () => {
      const dt = Date.now() - expected.current; // time drift

      if (dt > intervalMs) {
        console.warn(`Significant quiz timer drift: ${dt} ms, adjusting`);

        // update timer
        setTimer(
          (prev) => prev + intervalMs * (Math.floor(dt / intervalMs) + 1)
        );
        expected.current += intervalMs * (Math.floor(dt / intervalMs) + 1);

        // compensate for drift
        setTimeout(step, Math.max(0, intervalMs - (dt % intervalMs)));
        return;
      }

      // update timer
      setTimer((prev) => prev + intervalMs);
      expected.current += intervalMs;

      // compensate for drift
      setTimeout(step, Math.max(0, intervalMs - dt));
    };

    const timer = setTimeout(step, intervalMs);
    return () => clearTimeout(timer);
  }, []);

  return { timer };
};
