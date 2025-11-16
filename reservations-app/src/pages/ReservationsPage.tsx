import { useMemo, useState, type ReactElement } from 'react';
import { format } from 'date-fns';
import { Truck, Warehouse, AlertTriangle, CircleDollarSign, ArrowDownToLine } from 'lucide-react';
import useMediaQuery from '@/hooks/useMediaQuery';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  useReservationsQuery,
  type ReservationLineItem,
  type Reservation,
} from '@/api/reservationsApi';
import {
  addDays,
  addWeeks,
  formatDateForApi,
  formatDateForDisplay,
  formatDateRangeForDisplay,
  getWeekRange,
  parseReservationDate,
} from '@/lib/utils/date';
import { buildEquipmentSummary } from '@/lib/utils/reservations';
import { BranchSelect } from '@/components';
import { BranchId } from '@/enums';
import BookingTable, {
  type BookingTableConfig,
  type BookingTableColumn,
} from '@/components/BookingTable';
import { Checkbox } from '@/components/ui/checkbox';

const renderEquipmentLines = (items: ReservationLineItem[]) => {
  if (!items || items.length === 0) {
    return <span className="text-xs text-slate-500">No equipment</span>;
  }

  return (
    <div className="flex flex-col gap-1">
      {items
        .filter((item) => !item.isPackageHeader)
        .map((item) => {
          const quantity = item.quantity ?? 0;
          const description = item.description ?? 'Item';
          const plant = item.plantNumber ? ` (${item.plantNumber})` : '';

          return (
            <div key={item.lineNumber ?? description} className="flex gap-2 text-xs">
              <span className="font-medium">{quantity}x</span>
              <span className="flex-1">
                {description}
                {plant}
              </span>
            </div>
          );
        })}
    </div>
  );
};

const IconWithTooltip = ({ children }: { children: ReactElement<{ 'aria-label'?: string }> }) => {
  const ariaLabel = children.props['aria-label'];

  if (!ariaLabel) {
    return children;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent>{ariaLabel}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const handleAllocateToggle = (reservation: Reservation, checked: boolean | 'indeterminate') => {
  // TODO: submit allocation update for this reservation
  // Placeholder implementation for now
  // eslint-disable-next-line no-console
  console.log('Allocate toggle changed', {
    hireNumber: reservation.contract.hireNumber,
    checked,
  });
};

const reservationColumns: BookingTableColumn[] = [
  {
    key: 'hireNumber',
    title: '#',
    width: '7%',
    headerClassName: 'whitespace-nowrap',
    className: 'whitespace-nowrap text-xs font-medium text-slate-800',
    render: ({ reservation }) => reservation.contract.hireNumber,
    renderMobile: ({ reservation }) => `#${reservation.contract.hireNumber}`,
  },
  {
    key: 'status',
    title: 'Status',
    width: '8%',
    render: ({ reservation }) => {
      const depositInfo = reservation.contract.depositInformation;
      const hasDepositInfo = !!depositInfo;
      const isDepositOutstanding = depositInfo?.isDepositOutstanding === true;

      const hasWarnings =
        !!reservation.validationResult?.warnings &&
        reservation.validationResult.warnings.length > 0;

      return (
        <div className="flex items-center gap-1">
          {hasDepositInfo && (
            <IconWithTooltip>
              <CircleDollarSign
                className={`h-4 w-4 ${isDepositOutstanding ? 'text-green-600' : 'text-red-600'}`}
                aria-label={isDepositOutstanding ? 'Deposit outstanding' : 'No deposit outstanding'}
              />
            </IconWithTooltip>
          )}
          {hasWarnings && (
            <IconWithTooltip>
              <AlertTriangle
                className="h-4 w-4 text-yellow-500"
                aria-label="Reservation warnings"
              />
            </IconWithTooltip>
          )}
        </div>
      );
    },
  },
  {
    key: 'type',
    title: 'Type',
    width: '7%',
    render: ({ reservation }) =>
      reservation.contract.deliveryRequired ? (
        <IconWithTooltip>
          <Truck className="h-4 w-4" aria-label="Delivery reservation" />
        </IconWithTooltip>
      ) : (
        <IconWithTooltip>
          <Warehouse className="h-4 w-4" aria-label="Pickup reservation" />
        </IconWithTooltip>
      ),
    renderMobile: ({ reservation }) =>
      reservation.contract.deliveryRequired ? (
        <IconWithTooltip>
          <Truck className="h-4 w-4" aria-label="Delivery reservation" />
        </IconWithTooltip>
      ) : (
        <IconWithTooltip>
          <Warehouse className="h-4 w-4" aria-label="Pickup reservation" />
        </IconWithTooltip>
      ),
  },
  {
    key: 'time',
    title: 'Time',
    width: '8%',
    className: 'whitespace-nowrap text-xs text-slate-800',
    render: ({ reservation }) => {
      const startDate = parseReservationDate(reservation.start);
      return format(startDate, 'hh:mm a').toLowerCase();
    },
    renderMobile: ({ reservation }) => {
      const startDate = parseReservationDate(reservation.start);
      return format(startDate, 'hh:mm a').toLowerCase();
    },
  },
  {
    key: 'customer',
    title: 'Customer',
    width: '16%',
    className: 'text-xs text-slate-800',
    render: ({ reservation }) => {
      const customer =
        reservation.contract.contacts.customer?.companyName ??
        reservation.contract.contacts.customer?.name ??
        'Customer';
      return customer;
    },
    renderMobile: ({ reservation }) => {
      const customer =
        reservation.contract.contacts.customer?.companyName ??
        reservation.contract.contacts.customer?.name ??
        'Customer';
      return <div className="font-medium">{customer}</div>;
    },
  },
  {
    key: 'contact',
    title: 'Contact',
    width: '16%',
    className: 'text-xs text-slate-800',
    render: ({ reservation }) => {
      const siteName = reservation.contract.contacts.siteContact?.contact;
      const primaryName = reservation.contract.contacts.primaryContact?.name;

      if (reservation.contract.deliveryRequired && siteName) {
        return `site: ${siteName}`;
      }

      if (reservation.contract.contacts.customer?.name) {
        return `customer: ${reservation.contract.contacts.customer.name}`;
      }

      if (primaryName) {
        return primaryName;
      }

      return '';
    },
    renderMobile: ({ reservation }) => {
      const siteName = reservation.contract.contacts.siteContact?.contact;
      const primaryName = reservation.contract.contacts.primaryContact?.name;

      if (reservation.contract.deliveryRequired && siteName) {
        return <div className="text-slate-700">{`site: ${siteName}`}</div>;
      }

      if (reservation.contract.contacts.customer?.name) {
        return (
          <div className="text-slate-700">
            {`customer: ${reservation.contract.contacts.customer.name}`}
          </div>
        );
      }

      if (primaryName) {
        return <div className="text-slate-700">{primaryName}</div>;
      }

      return null;
    },
  },
  {
    key: 'phone',
    title: 'Phone',
    width: '10%',
    className: 'whitespace-nowrap text-xs text-slate-800',
    render: ({ reservation }) => {
      const phone =
        reservation.contract.contacts.siteContact?.phone?.rawPhoneNumber ??
        reservation.contract.contacts.siteContact?.mobile?.rawPhoneNumber ??
        reservation.contract.contacts.customer?.mobile?.rawPhoneNumber ??
        reservation.contract.contacts.customer?.phone?.rawPhoneNumber ??
        '';

      return phone;
    },
    renderMobile: ({ reservation }) => {
      const phone =
        reservation.contract.contacts.siteContact?.phone?.rawPhoneNumber ??
        reservation.contract.contacts.siteContact?.mobile?.rawPhoneNumber ??
        reservation.contract.contacts.customer?.mobile?.rawPhoneNumber ??
        reservation.contract.contacts.customer?.phone?.rawPhoneNumber ??
        '';

      if (!phone) {
        return null;
      }

      return <div className="text-slate-700">{phone}</div>;
    },
  },
  {
    key: 'equipment',
    title: 'Equipment',
    width: '20%',
    className: 'text-xs text-slate-800 whitespace-nowrap overflow-hidden text-ellipsis',
    render: ({ reservation, expandLines }) =>
      expandLines ? (
        renderEquipmentLines(reservation.lineItems)
      ) : (
        <span>{buildEquipmentSummary(reservation)}</span>
      ),
    renderMobile: ({ reservation }) => (
      <div className="mt-2 text-slate-800 whitespace-nowrap overflow-hidden text-ellipsis">
        {buildEquipmentSummary(reservation)}
      </div>
    ),
  },
  {
    key: 'availability',
    title: 'Availability',
    width: '4%',
    className: 'w-24',
    render: () => (
      <button
        type="button"
        aria-label="Download availability document"
        onClick={() => {
          console.log('download file');
        }}
      >
        <IconWithTooltip>
          <ArrowDownToLine className="h-4 w-4" aria-label="Download availability document" />
        </IconWithTooltip>
      </button>
    ),
  },
  {
    key: 'allocated',
    title: 'Allocated',
    width: '4%',
    className: 'w-20',
    render: ({ reservation }) => {
      const lineItems = reservation.lineItems ?? [];

      const hasUnallocatedNonBulkItem = lineItems.some(
        (item) => item && item.isBulk === false && item.isAllocated === false,
      );

      if (!hasUnallocatedNonBulkItem) {
        return null;
      }

      return (
        <div className="flex items-center justify-center">
          <Checkbox
            aria-label="Mark reservation as allocated"
            onCheckedChange={(checked) => handleAllocateToggle(reservation, checked)}
          />
        </div>
      );
    },
  },
];

const ReservationsPage = () => {
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const today = useMemo(() => new Date(), []);
  const initialWeek = useMemo(() => getWeekRange(today), [today]);

  const [branchId, setBranchId] = useState<string>(BranchId.ARTARMON);
  const [selectedWeekStart, setSelectedWeekStart] = useState(initialWeek.start);
  const [selectedDate, setSelectedDate] = useState(today);

  const currentWeek = getWeekRange(selectedWeekStart);

  const from = isDesktop ? formatDateForApi(currentWeek.start) : formatDateForApi(selectedDate);
  const to = isDesktop ? formatDateForApi(currentWeek.end) : formatDateForApi(selectedDate);

  const { data, isLoading, isFetching, isError, error, refetch } = useReservationsQuery({
    branchId,
    from,
    to,
  });

  const filteredReservations = useMemo(() => {
    if (!data) {
      return [];
    }

    const formatKey = (date: Date) => format(date, 'yyyy-MM-dd');

    if (isDesktop) {
      const startKey = formatKey(currentWeek.start);
      const endKey = formatKey(currentWeek.end);

      return data.filter((reservation) => {
        const reservationKey = formatKey(parseReservationDate(reservation.start));
        return reservationKey >= startKey && reservationKey <= endKey;
      });
    }

    const targetKey = formatKey(selectedDate);

    return data.filter((reservation) => {
      const reservationKey = formatKey(parseReservationDate(reservation.start));
      return reservationKey === targetKey;
    });
  }, [data, isDesktop, currentWeek.start, currentWeek.end, selectedDate]);

  const handlePrev = () => {
    if (isDesktop) {
      setSelectedWeekStart((prev) => addWeeks(prev, -1));
    } else {
      setSelectedDate((prev) => addDays(prev, -1));
    }
  };

  const handleNext = () => {
    if (isDesktop) {
      setSelectedWeekStart((prev) => addWeeks(prev, 1));
    } else {
      setSelectedDate((prev) => addDays(prev, 1));
    }
  };

  const rangeLabel = isDesktop
    ? formatDateRangeForDisplay(currentWeek.start, currentWeek.end)
    : formatDateForDisplay(selectedDate);

  const bookingTableConfig: BookingTableConfig = {
    columns: reservationColumns,
    mobileLayout: {
      topLeft: ['time', 'type'],
      topRight: 'hireNumber',
      body: ['customer', 'contact', 'phone', 'equipment'],
    },
    getRowKey: (reservation) => reservation.contract.hireNumber,
    showDateNavigator: true,
    rangeLabel,
    onPrev: handlePrev,
    onNext: handleNext,
    showExpandLinesToggle: true,
    isLoading,
    isFetching,
    isError,
    errorMessage: error?.message,
    onRetry: refetch,
    onRefresh: refetch,
  };

  return (
    <div className="space-y-4">
      <BookingTable
        config={bookingTableConfig}
        tableData={filteredReservations}
        title="Reservations"
        filters={<BranchSelect branchId={branchId} onChange={setBranchId} />}
      />
    </div>
  );
};

export default ReservationsPage;
