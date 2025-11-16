export interface BookingTableDateHeaderProps {
  label: string;
}

const BookingTableDateHeader = ({ label }: BookingTableDateHeaderProps) => {
  return (
    <div className="mt-6 bg-red-300 px-4 py-1 text-sm font-semibold text-black text-center">
      {label}
    </div>
  );
};

export default BookingTableDateHeader;
