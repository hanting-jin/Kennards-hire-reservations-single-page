import { useMemo } from 'react';
import { RefreshCcw } from 'lucide-react';
import type { Reservation } from '@/api/reservationsApi';
import { filterPickup } from '@/lib/utils/reservations';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader } from '../ui/card';
import type {
  BookingTableColumn,
  BookingTableMobileLayout,
  BookingCellContext,
} from './types';

export interface BookingTableMobileProps {
  reservations: Reservation[];
  columns: BookingTableColumn[];
  layout?: BookingTableMobileLayout;
  expandLines: boolean;
  getRowKey?: (reservation: Reservation, index: number) => string | number;
  onRefresh?: () => void;
  isFetching: boolean;
}

const BookingTableMobile = ({
  reservations,
  columns,
  layout,
  expandLines,
  getRowKey,
  onRefresh,
  isFetching,
}: BookingTableMobileProps) => {
  const pickupReservations = filterPickup(reservations);
  const showNoPickupMessage =
    pickupReservations.length === 0 && reservations.length > 0;

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
    <div className="mt-4 space-y-4">
      {onRefresh && (
        <div className="flex justify-center">
          <Button
            variant="default"
            size="md"
            onClick={onRefresh}
            disabled={isFetching}
            className="min-w-[140px]"
          >
            <RefreshCcw className="mr-2 h-4 w-4" />
            {isFetching ? 'Refreshing…' : 'Refresh'}
          </Button>
        </div>
      )}

      {showNoPickupMessage && (
        <div className="rounded-md border border-slate-200 bg-white px-4 py-6 text-center text-sm text-slate-600">
          No pickup reservations
        </div>
      )}

      {pickupReservations.map((reservation, rowIndex) => {
        const topLeftColumns =
          resolvedLayout.topLeft?.map((key) => findColumn(key)) ?? [];
        const topRightColumn = findColumn(resolvedLayout.topRight);
        const bodyColumns =
          resolvedLayout.body?.map((key) => findColumn(key)).filter(Boolean) ??
          [];

        return (
          <Card
            key={getRowKey ? getRowKey(reservation, rowIndex) : `row-${rowIndex}`}
          >
            <CardHeader className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                {topLeftColumns.map((column) =>
                  column ? (
                    <span key={column.key}>
                      {renderCell(column, reservation, rowIndex)}
                    </span>
                  ) : null,
                )}
              </div>
              {topRightColumn && (
                <span className="text-xs text-slate-500">
                  {renderCell(topRightColumn, reservation, rowIndex)}
                </span>
              )}
            </CardHeader>
            {bodyColumns.length > 0 && (
              <CardContent className="space-y-1 text-xs text-slate-800">
                {bodyColumns.map((column) =>
                  column ? (
                    <div key={column.key} className="text-slate-800">
                      {renderCell(column, reservation, rowIndex)}
                    </div>
                  ) : null,
                )}
              </CardContent>
            )}
          </Card>
        );
      })}
    </div>
  );
};

export default BookingTableMobile;
