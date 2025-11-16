import { Skeleton } from '../ui/skeleton';

const BookingTableLoadingState = () => {
  return (
    <div className="mt-6 space-y-2">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-24 w-full" />
    </div>
  );
};

export default BookingTableLoadingState;
