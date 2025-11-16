export interface BookingTableEmptyStateProps {
  message?: string;
}

const BookingTableEmptyState = ({ message }: BookingTableEmptyStateProps) => {
  return (
    <div className="mt-6 rounded-md border border-slate-200 bg-white px-4 py-8 text-center text-sm text-slate-600">
      {message ?? 'No reservations for this period'}
    </div>
  );
};

export default BookingTableEmptyState;
