import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import PollingProgress from '../PollingProgress';
import { Button } from '../ui/button';

export interface BookingTableDateNavigatorProps {
  label: string;
  onPrev: () => void;
  onNext: () => void;
  isFetching: boolean;
  isMobile?: boolean;
}

export const BookingTableDateNavigator = ({
  label,
  onPrev,
  onNext,
  isFetching,
  isMobile = false,
}: BookingTableDateNavigatorProps) => {
  const containerClass = cn('mt-4 flex items-center justify-between gap-4', isMobile && 'px-1');
  const labelClass = cn(
    'font-semibold text-slate-800',
    isMobile ? 'text-xl leading-tight text-center whitespace-nowrap' : 'text-sm',
  );
  const buttonClass = cn(
    isMobile && 'h-11 min-w-[90px] rounded-sm px-4 text-base shadow-[0_6px_12px_rgba(0,0,0,0.18)]',
  );

  return (
    <div className={containerClass}>
      <Button size={isMobile ? 'lg' : 'md'} onClick={onPrev} className={buttonClass}>
        <ChevronLeft className="mr-1 h-4 w-4" />
        Prev
      </Button>
      <div className="flex flex-1 flex-col items-center">
        <span className={labelClass}>{label}</span>
        <PollingProgress isFetching={isFetching} />
      </div>
      <Button size={isMobile ? 'lg' : 'md'} onClick={onNext} className={buttonClass}>
        Next
        <ChevronRight className="ml-1 h-4 w-4" />
      </Button>
    </div>
  );
};
