import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ReservationsPage from '../ReservationsPage';
import type { Reservation } from '@/api/reservationsApi';
import { addDays, formatDateForDisplay } from '@/lib/utils/date';
import useMediaQuery from '@/hooks/useMediaQuery';
import { useReservationsQuery } from '@/api/reservationsApi';

jest.mock('@/hooks/useMediaQuery');
jest.mock('@/api/reservationsApi', () => ({
  __esModule: true,
  useReservationsQuery: jest.fn(),
}));
jest.mock('@/components', () => {
  const React = require('react');
  const BranchSelect = ({ branchId, onChange }: { branchId: string; onChange: (id: string) => void }) =>
    React.createElement(
      'select',
      {
        'aria-label': 'Branch',
        value: branchId,
        onChange: (e: { target: { value: string } }) => onChange(e.target.value),
      },
      React.createElement('option', { value: branchId }, branchId),
    );

  return {
    __esModule: true,
    BranchSelect,
  };
});

const mockUseMediaQuery = useMediaQuery as jest.Mock;
const mockUseReservationsQuery = useReservationsQuery as jest.Mock;

const createReservation = (overrides?: Partial<Reservation>): Reservation => ({
  start: new Date().toISOString(),
  lineItems: [
    {
      description: 'Excavator',
      quantity: 1,
      isAllocated: true,
      isBulk: false,
    },
  ],
  contract: {
    hireNumber: Math.floor(Math.random() * 10000),
    deliveryRequired: false,
    contacts: {
      customer: { name: 'Customer' },
      primaryContact: {},
      siteContact: {},
    },
  },
  ...overrides,
});

describe('ReservationsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders only current week reservations on desktop', () => {
    mockUseMediaQuery.mockReturnValue(true);

    const today = new Date();
    today.setHours(12, 0, 0, 0);

    const inRangeReservation = createReservation({
      start: today.toISOString(),
      contract: {
        hireNumber: 1111,
        deliveryRequired: false,
        contacts: { customer: { name: 'Current week reservation' } },
      },
    });

    const outOfRangeReservation = createReservation({
      start: addDays(today, 10).toISOString(),
      contract: {
        hireNumber: 2222,
        deliveryRequired: false,
        contacts: { customer: { name: 'Other week reservation' } },
      },
    });

    mockUseReservationsQuery.mockReturnValue({
      data: [inRangeReservation, outOfRangeReservation],
      isLoading: false,
      isFetching: false,
      isError: false,
      error: undefined,
      refetch: jest.fn(),
    });

    render(<ReservationsPage />);

    expect(screen.getByText('Reservations')).toBeInTheDocument();
    expect(screen.getByText('Current week reservation')).toBeInTheDocument();
    expect(screen.queryByText('Other week reservation')).not.toBeInTheDocument();
  });

  it('shows today reservations on mobile and allows navigation and refresh', async () => {
    mockUseMediaQuery.mockReturnValue(false);

    const today = new Date();
    today.setHours(12, 0, 0, 0);

    const pickupReservation = createReservation({
      start: today.toISOString(),
      contract: {
        hireNumber: 3333,
        deliveryRequired: false,
        contacts: { customer: { name: 'Pickup reservation' } },
      },
    });
    const deliveryReservation = createReservation({
      start: today.toISOString(),
      contract: {
        hireNumber: 4444,
        deliveryRequired: true,
        contacts: { customer: { name: 'Delivery reservation' } },
      },
    });

    const refetch = jest.fn();

    mockUseReservationsQuery.mockReturnValue({
      data: [pickupReservation, deliveryReservation],
      isLoading: false,
      isFetching: false,
      isError: false,
      error: undefined,
      refetch,
    });

    render(<ReservationsPage />);

    const todayLabel = formatDateForDisplay(today);
    expect(screen.getByText(todayLabel)).toBeInTheDocument();
    expect(screen.getByText('Pickup reservation')).toBeInTheDocument();
    expect(screen.queryByText('Delivery reservation')).not.toBeInTheDocument();
    fireEvent.click(screen.getByText('Next'));

    const nextLabel = formatDateForDisplay(addDays(today, 1));
    await waitFor(() => expect(screen.getByText(nextLabel)).toBeInTheDocument());

    fireEvent.click(screen.getByRole('button', { name: /refresh/i }));
    expect(refetch).toHaveBeenCalledTimes(1);
  });
});
