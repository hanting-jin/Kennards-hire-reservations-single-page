import { Switch } from '../ui/switch';

export interface BookingTableExpandLinesToggleProps {
  expandLines: boolean;
  onExpandLinesChange: (value: boolean) => void;
}

const BookingTableExpandLinesToggle = ({
  expandLines,
  onExpandLinesChange,
}: BookingTableExpandLinesToggleProps) => {
  return (
    <div className="flex gap-2 w-60">
      <Switch checked={expandLines} onCheckedChange={onExpandLinesChange} />
      <span className="text-sm font-medium text-slate-700">Expand lines</span>
    </div>
  );
};

export default BookingTableExpandLinesToggle;
