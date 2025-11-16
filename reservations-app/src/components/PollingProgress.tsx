import { useEffect, useState } from 'react';
import { Progress } from './ui/progress';

interface PollingProgressProps {
  label?: string;
  isFetching: boolean;
}

const MIN_PROGRESS = 12;
const MAX_PROGRESS = 96;
const STEP = 16;
const TICK_MS = 180;

const PollingProgress = ({
  label = 'Updating latest reservations…',
  isFetching,
}: PollingProgressProps) => {
  const [value, setValue] = useState(MIN_PROGRESS);

  useEffect(() => {
    if (!isFetching) {
      return undefined;
    }

    let direction: 1 | -1 = 1;
    const resetTimeoutId = window.setTimeout(() => {
      setValue(MIN_PROGRESS);
    }, 0);
    const intervalId = window.setInterval(() => {
      setValue((prev) => {
        const next = prev + direction * STEP;

        if (next >= MAX_PROGRESS) {
          direction = -1;
          return MAX_PROGRESS;
        }

        if (next <= MIN_PROGRESS) {
          direction = 1;
          return MIN_PROGRESS;
        }

        return next;
      });
    }, TICK_MS);

    return () => {
      window.clearInterval(intervalId);
      window.clearTimeout(resetTimeoutId);
    };
  }, [isFetching]);

  if (!isFetching) {
    return null;
  }

  return (
    <div className="mt-1 flex w-full flex-col items-center gap-2" aria-live="polite">
      <span className="text-xs font-medium text-slate-700">{label}</span>
      <div className="w-full max-w-[280px]">
        <Progress value={value} className="h-2 bg-red-100" />
      </div>
    </div>
  );
};

export default PollingProgress;
