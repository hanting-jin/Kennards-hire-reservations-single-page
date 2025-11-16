import { useMemo } from 'react';
import { ChevronRight, X } from 'lucide-react';
import type { Reservation } from '@/api/reservationsApi';
import { filterPickup } from '@/lib/utils/reservations';
import { Card } from '../ui/card';
import type { BookingTableColumn, BookingTableMobileLayout, BookingCellContext } from './types';

export interface BookingTableMobileProps {
  reservations: Reservation[];
  columns: BookingTableColumn[];
  layout?: BookingTableMobileLayout;
  expandLines: boolean;
  getRowKey?: (reservation: Reservation, index: number) => string | number;
}

const BookingTableMobile = ({
  reservations,
  columns,
  layout,
  expandLines,
  getRowKey,
}: BookingTableMobileProps) => {
  const pickupReservations = filterPickup(reservations);
  const showNoPickupMessage = pickupReservations.length === 0;

  const resolvedLayout: BookingTableMobileLayout = useMemo(
    () => ({
      topLeft: layout?.topLeft ?? ['time', 'type'],
      topRight: layout?.topRight ?? 'hireNumber',
      body: layout?.body ?? ['customer', 'contact', 'phone', 'equipment'],
    }),
    [layout],
  );

  const findColumn = (key?: string) =>
    key ? columns.find((column) => column.key === key) : undefined;

  const renderCell = (
    column: BookingTableColumn | undefined,
    reservation: Reservation,
    rowIndex: number,
  ) => {
    if (!column) {
      return null;
    }

    const ctx: BookingCellContext = { reservation, index: rowIndex, expandLines };
    const renderer = column.renderMobile ?? column.render;
    return renderer ? renderer(ctx) : null;
  };

  return (
    <div className="mt-3 space-y-3">
      {showNoPickupMessage && (
        <div className="py-4 text-center text-sm text-slate-600">No pickup reservations</div>
      )}

      {pickupReservations.map((reservation, rowIndex) => {
        const bodyColumns =
          resolvedLayout.body?.map((key) => findColumn(key)).filter(Boolean) ?? [];
        const primaryColumn = bodyColumns[0];
        const secondaryColumns = bodyColumns.slice(1);

        return (
          <Card
            key={getRowKey ? getRowKey(reservation, rowIndex) : `row-${rowIndex}`}
            className="rounded-sm border-slate-200 shadow-[0_3px_10px_rgba(0,0,0,0.12)]"
          >
            <div className="flex items-center justify-between gap-3 px-4 py-4">
              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-red-600 text-sm font-semibold text-white shadow-[0_4px_10px_rgba(0,0,0,0.2)]">
                  <X className="h-4 w-4" />
                </div>
                <div className="space-y-1">
                  {primaryColumn && (
                    <div className="text-base font-semibold text-slate-900">
                      {renderCell(primaryColumn, reservation, rowIndex)}
                    </div>
                  )}
                  {secondaryColumns.map((column) =>
                    column ? (
                      <div key={column.key} className="text-sm text-slate-700">
                        {renderCell(column, reservation, rowIndex)}
                      </div>
                    ) : null,
                  )}
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-slate-400" />
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default BookingTableMobile;
