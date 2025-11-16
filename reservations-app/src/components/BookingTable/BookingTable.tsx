import { useState } from 'react';
import type { ReactNode } from 'react';
import { RefreshCcw } from 'lucide-react';
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
import { Button } from '../ui/button';

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
  const shouldShowRefreshButton = !isDesktop && onRefresh;

  const reservations = tableData ?? [];
  const hasData = reservations.length > 0;

  const showSkeleton = isLoading && !hasData;
  const showError = !isLoading && isError;
  const showEmpty = !isLoading && !isError && !hasData;

  const handleExpandLinesChange = (value: boolean) => {
    setExpandLines(value);
  };

  return (
    <div className="space-y-5">
      <div
        className={`flex flex-wrap justify-between gap-3 ${isDesktop ? 'items-center' : 'items-start'}`}
      >
        {title &&
          (typeof title === 'string' ? (
            <h1
              className={`leading-tight text-slate-900 ${isDesktop ? 'text-2xl font-normal' : 'text-3xl font-normal'}`}
            >
              {title}
            </h1>
          ) : (
            <div>{title}</div>
          ))}
        <div className={`flex ${isDesktop ? 'items-center gap-6' : 'flex-col items-start gap-3'}`}>
          {showExpandLinesToggle && isDesktop && (
            <BookingTableExpandLinesToggle
              expandLines={expandLines}
              onExpandLinesChange={handleExpandLinesChange}
            />
          )}
          {filters}
        </div>
      </div>

      {shouldShowRefreshButton && (
        <div className="flex justify-center">
          <Button
            variant="default"
            size="lg"
            onClick={onRefresh}
            disabled={isFetching}
            className="h-12 min-w-[160px] rounded-sm text-base font-semibold shadow-[0_6px_12px_rgba(0,0,0,0.18)]"
          >
            <RefreshCcw className="mr-2 h-5 w-5" />
            {isFetching ? 'Refreshing…' : 'Refresh'}
          </Button>
        </div>
      )}

      {showDateNavigator && rangeLabel && onPrev && onNext && (
        <BookingTableDateNavigator
          label={rangeLabel}
          onPrev={onPrev}
          onNext={onNext}
          isFetching={isFetching && !isLoading}
          isMobile={!isDesktop}
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
          />
        ))}
    </div>
  );
};

export default BookingTable;
