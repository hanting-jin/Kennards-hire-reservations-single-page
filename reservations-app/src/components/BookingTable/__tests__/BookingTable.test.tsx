import { render, screen, fireEvent } from '@testing-library/react';
import BookingTable from '../BookingTable';
import type { BookingTableConfig } from '../types';
import type { Reservation } from '@/api/reservationsApi';
import useMediaQuery from '@/hooks/useMediaQuery';

jest.mock('@/hooks/useMediaQuery');

const mockUseMediaQuery = useMediaQuery as jest.Mock;

const createReservation = (overrides?: Partial<Reservation>): Reservation => ({
  start: new Date().toISOString(),
  lineItems: [],
  contract: {
    hireNumber: 1001,
    deliveryRequired: false,
    contacts: {
      customer: { name: 'ACME Corp' },
      primaryContact: {},
      siteContact: {},
    },
  },
  ...overrides,
});

const baseColumns: BookingTableConfig['columns'] = [
  {
    key: 'customer',
    title: 'Customer',
    render: ({ reservation }) => reservation.contract.contacts.customer?.name ?? '',
    renderMobile: ({ reservation }) => reservation.contract.contacts.customer?.name ?? '',
  },
];

const baseConfig: BookingTableConfig = {
  columns: baseColumns,
  mobileLayout: { body: ['customer'] },
  getRowKey: (reservation) => reservation.contract.hireNumber,
  showDateNavigator: false,
  showExpandLinesToggle: true,
};

describe('BookingTable', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders desktop table with expand toggle', () => {
    mockUseMediaQuery.mockReturnValue(true);
    const reservation = createReservation();

    render(
      <BookingTable
        config={baseConfig}
        tableData={[reservation]}
        title="Test table"
        filters={<div>filters</div>}
      />,
    );

    expect(screen.getByText('Test table')).toBeInTheDocument();
    expect(screen.getByText('Customer')).toBeInTheDocument();
    expect(screen.getByText('ACME Corp')).toBeInTheDocument();
    expect(screen.getByText('Expand lines')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /refresh/i })).not.toBeInTheDocument();
  });

  it('renders mobile cards with refresh button', () => {
    mockUseMediaQuery.mockReturnValue(false);
    const onRefresh = jest.fn();
    const reservation = createReservation();

    render(
      <BookingTable
        config={{ ...baseConfig, onRefresh, isFetching: false }}
        tableData={[reservation]}
        title="Mobile view"
      />,
    );

    const refreshButton = screen.getByRole('button', { name: /refresh/i });
    expect(refreshButton).toHaveTextContent('Refresh');
    expect(screen.getByText('ACME Corp')).toBeInTheDocument();

    fireEvent.click(refreshButton);
    expect(onRefresh).toHaveBeenCalledTimes(1);
  });

  it('shows error state and allows retry', () => {
    mockUseMediaQuery.mockReturnValue(true);
    const onRetry = jest.fn();

    render(
      <BookingTable
        config={{ ...baseConfig, isError: true, errorMessage: 'Network error', onRetry }}
        title="Error state"
      />,
    );

    expect(screen.getByText('Failed to load reservations')).toBeInTheDocument();
    expect(screen.getByText('Network error')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /retry/i }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('shows empty state when there is no data', () => {
    mockUseMediaQuery.mockReturnValue(true);

    render(<BookingTable config={baseConfig} tableData={[]} title="Empty state" />);

    expect(screen.getByText('No pickup reservations')).toBeInTheDocument();
  });
});
