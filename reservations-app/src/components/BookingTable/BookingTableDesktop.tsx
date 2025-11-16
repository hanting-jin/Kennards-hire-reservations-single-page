import type { Reservation } from '@/api/reservationsApi';
import { groupReservationsByDate } from '@/lib/utils/reservations';
import { formatDateForDisplay, parseReservationDate } from '@/lib/utils/date';
import BookingTableDateHeader from './BookingTableDateHeader';
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from '../ui/table';
import type { BookingTableColumn, BookingCellContext } from './types';

export interface BookingTableDesktopProps {
  reservations: Reservation[];
  columns: BookingTableColumn[];
  expandLines: boolean;
  getRowKey?: (reservation: Reservation, index: number) => string | number;
}

const BookingTableDesktop = ({
  reservations,
  columns,
  expandLines,
  getRowKey,
}: BookingTableDesktopProps) => {
  const groups = groupReservationsByDate(reservations);
  const entries = Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));

  return (
    <div className="mt-4 space-y-2">
      {entries.map(([dateKey, items]) => {
        const sorted = [...items].sort(
          (a, b) =>
            parseReservationDate(a.start).getTime() - parseReservationDate(b.start).getTime(),
        );

        const date = parseReservationDate(sorted[0].start);
        const label = formatDateForDisplay(date);

        return (
          <section key={dateKey}>
            <BookingTableDateHeader label={label} />
            <Table>
              <TableHeader>
                <TableRow data-muted="true">
                  {columns.map((column) => (
                    <TableHead
                      key={column.key}
                      className={column.headerClassName}
                      style={column.width ? { width: column.width as string | number } : undefined}
                    >
                      {column.title}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {sorted.map((reservation, rowIndex) => (
                  <TableRow
                    key={getRowKey ? getRowKey(reservation, rowIndex) : `${dateKey}-${rowIndex}`}
                  >
                    {columns.map((column) => {
                      const ctx: BookingCellContext = {
                        reservation,
                        index: rowIndex,
                        expandLines,
                      };

                      return (
                        <TableCell key={column.key} className={column.className}>
                          {column.render ? column.render(ctx) : null}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </section>
        );
      })}
    </div>
  );
};

export default BookingTableDesktop;
