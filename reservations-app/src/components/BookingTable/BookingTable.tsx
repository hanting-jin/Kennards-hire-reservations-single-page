import { useState } from 'react';
import type { ReactNode } from 'react';
import useMediaQuery from '@/hooks/useMediaQuery';
import type { Reservation } from '@/api/reservationsApi';
import { BookingTableDateNavigator } from './BookingTableDateNavigator';
import BookingTableDesktop from './BookingTableDesktop';
import BookingTableMobile from './BookingTableMobile';
import BookingTableLoadingState from './BookingTableLoadingState';
import BookingTableErrorState from './BookingTableErrorState';
import BookingTableEmptyState from './BookingTableEmptyState';
import type { BookingTableConfig } from './types';
import BookingTableExpandLinesToggle from './BookingTableExpandLinesToggle';

export interface BookingTableProps {
  config: BookingTableConfig;
  tableData?: Reservation[];
  filters?: ReactNode;
  title?: ReactNode;
}

const BookingTable = ({ config, tableData, filters, title }: BookingTableProps) => {
  const {
    columns,
    mobileLayout,
    getRowKey,
    showDateNavigator,
    rangeLabel,
    onPrev,
    onNext,
    showExpandLinesToggle,
    isLoading = false,
    isFetching = false,
    isError = false,
    errorMessage,
    onRetry,
    onRefresh,
  } = config;

  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [expandLines, setExpandLines] = useState(false);

  const reservations = tableData ?? [];
  const hasData = reservations.length > 0;

  const showSkeleton = isLoading && !hasData;
  const showError = !isLoading && isError;
  const showEmpty = !isLoading && !isError && !hasData;

  const handleExpandLinesChange = (value: boolean) => {
    setExpandLines(value);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {title &&
          (typeof title === 'string' ? (
            <h1 className="text-2xl  text-slate-900">{title}</h1>
          ) : (
            <div>{title}</div>
          ))}
        <div className="flex flex-wrap items-center gap-6">
          {showExpandLinesToggle && isDesktop && (
            <BookingTableExpandLinesToggle
              expandLines={expandLines}
              onExpandLinesChange={handleExpandLinesChange}
            />
          )}
          {filters}
        </div>
      </div>

      {showDateNavigator && rangeLabel && onPrev && onNext && (
        <BookingTableDateNavigator
          label={rangeLabel}
          onPrev={onPrev}
          onNext={onNext}
          isFetching={isFetching && !isLoading}
        />
      )}

      {showSkeleton && <BookingTableLoadingState />}

      {showError && <BookingTableErrorState message={errorMessage} onRetry={onRetry} />}

      {showEmpty && <BookingTableEmptyState />}

      {!showSkeleton &&
        !showError &&
        hasData &&
        (isDesktop ? (
          <BookingTableDesktop
            reservations={reservations}
            columns={columns}
            expandLines={expandLines}
            getRowKey={getRowKey}
          />
        ) : (
          <BookingTableMobile
            reservations={reservations}
            columns={columns}
            layout={mobileLayout}
            expandLines={false}
            getRowKey={getRowKey}
            onRefresh={onRefresh}
            isFetching={isFetching}
          />
        ))}
    </div>
  );
};

export default BookingTable;
