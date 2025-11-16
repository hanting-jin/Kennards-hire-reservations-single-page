import { format } from 'date-fns';
import type { Reservation } from '@/api/reservationsApi';
import { parseReservationDate } from './date';

export const groupReservationsByDate = (
  reservations: Reservation[],
): Record<string, Reservation[]> => {
  return reservations.reduce<Record<string, Reservation[]>>((acc, reservation) => {
    const date = parseReservationDate(reservation.start);
    const key = format(date, 'yyyy-MM-dd');

    if (!acc[key]) {
      acc[key] = [];
    }

    acc[key].push(reservation);
    return acc;
  }, {});
};

export const filterPickup = (reservations: Reservation[]): Reservation[] => {
  return reservations.filter((reservation) => reservation.contract.deliveryRequired === false);
};

export const filterDelivery = (reservations: Reservation[]): Reservation[] => {
  return reservations.filter((reservation) => reservation.contract.deliveryRequired === true);
};

export const buildEquipmentSummary = (reservation: Reservation): string => {
  if (!reservation.lineItems || reservation.lineItems.length === 0) {
    return 'No equipment';
  }

  const firstItem = reservation.lineItems.find((item) => !item.isPackageHeader);

  if (!firstItem) {
    return 'No equipment';
  }

  const quantity = firstItem.quantity ?? 0;
  const description = firstItem.description ?? 'Item';
  const plant = firstItem.plantNumber ? ` (${firstItem.plantNumber})` : '';

  return `${quantity}x ${description}${plant}`;
};

export const isReservationFullyAllocated = (reservation: Reservation): boolean => {
  if (!reservation.lineItems || reservation.lineItems.length === 0) {
    return false;
  }

  return reservation.lineItems.every((item) => item.isAllocated !== false);
};
