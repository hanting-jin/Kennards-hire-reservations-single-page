import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';

export interface BookingTableDateNavigatorProps {
  label: string;
  onPrev: () => void;
  onNext: () => void;
  isFetching: boolean;
}

export const BookingTableDateNavigator = ({
  label,
  onPrev,
  onNext,
  isFetching,
}: BookingTableDateNavigatorProps) => {
  return (
    <div className="mt-4 flex items-center justify-between gap-4">
      <Button size="md" onClick={onPrev}>
        <ChevronLeft className="mr-1 h-4 w-4" />
        Prev
      </Button>
      <div className="flex flex-col items-center">
        <span className="text-sm font-semibold text-slate-800">{label}</span>
        {isFetching && (
          <span className="mt-1 text-xs text-slate-500">Updating latest reservations…</span>
        )}
      </div>
      <Button size="md" onClick={onNext}>
        Next
        <ChevronRight className="ml-1 h-4 w-4" />
      </Button>
    </div>
  );
};
