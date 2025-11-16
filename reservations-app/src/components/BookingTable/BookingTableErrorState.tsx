import { AlertTriangle } from 'lucide-react';
import { Button } from '../ui/button';

export interface BookingTableErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

const BookingTableErrorState = ({ message, onRetry }: BookingTableErrorStateProps) => {
  return (
    <div className="mt-6 rounded-md border border-red-200 bg-red-50 p-4">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 text-red-600" />
        <div className="flex-1">
          <h2 className="text-sm font-semibold text-red-800">
            Failed to load reservations
          </h2>
          <p className="mt-1 text-xs text-red-700">
            {message ?? 'An unexpected error occurred.'}
          </p>
          {onRetry && (
            <Button
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={onRetry}
            >
              Retry
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingTableErrorState;
