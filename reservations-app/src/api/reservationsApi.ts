import { keepPreviousData, useQuery, type QueryFunctionContext } from '@tanstack/react-query';
import { request } from './client';

export interface PhoneDetails {
  rawPhoneNumber?: string;
  isValid?: boolean;
  isMobileNumber?: boolean;
}

export interface Address {
  streetLine1?: string;
  streetLine2?: string;
  suburb?: string;
  state?: string;
  postcode?: string;
  country?: string;
}

export interface ReservationCustomer {
  name?: string;
  companyName?: string;
  phone?: PhoneDetails;
  mobile?: PhoneDetails;
  isCreditAccountCustomer?: boolean;
  email?: string;
  address?: Address;
  consolidatedAddress?: string;
}

export interface ReservationSiteContact {
  contact?: string;
  phone?: PhoneDetails;
  mobile?: PhoneDetails;
  address?: Address;
}

export interface ReservationPrimaryContact {
  name?: string;
  phone?: PhoneDetails;
  contractContactType?: string;
}

export interface ReservationContacts {
  customer?: ReservationCustomer;
  orderer?: unknown;
  siteContact?: ReservationSiteContact;
  primaryContact?: ReservationPrimaryContact;
}

export interface DepositInformation {
  depositRequired?: boolean;
  depositReceived?: string;
  isDepositOutstanding?: boolean;
}

export interface ReservationContract {
  hireNumber: number;
  expectedEndDate?: string;
  confirmationRequired?: boolean;
  deliveryRequired: boolean;
  isAccountCustomer?: boolean;
  depositInformation?: DepositInformation;
  contacts: ReservationContacts;
  customerIdentification?: unknown;
  fieldNamesOfMissingAndRequiredValues?: string[];
  countryCode?: string;
}

export interface ReservationValidation {
  warnings: string[];
  errors: string[];
}

export interface ReservationLineItem {
  isPackageHeader?: boolean;
  lineNumber?: number;
  description?: string;
  quantity?: number;
  plantNumber?: string;
  hasRegistration?: boolean;
  pricingGroup?: string;
  packageType?: string;
  isAllocated?: boolean;
  packageLineItems?: ReservationLineItem[];
  isBulk?: boolean;
}

export interface Reservation {
  start: string;
  lineItems: ReservationLineItem[];
  contract: ReservationContract;
  validationResult?: ReservationValidation;
}

type ReservationsApiResponse =
  | {
      reservations?: Reservation[];
    }
  | Reservation[];

export interface ReservationsApiParams {
  branchId: string;
  from: string;
  to: string;
}

export const fetchReservations = async (
  params: ReservationsApiParams,
): Promise<Reservation[]> => {
  const { branchId, from, to } = params;

  const path = `/branches/${encodeURIComponent(
    branchId,
  )}/reservations?from=${encodeURIComponent(from)}&to=${encodeURIComponent(
    to,
  )}`;

  const raw = await request<ReservationsApiResponse>(path, {
    method: 'GET',
  });

  if (Array.isArray(raw)) {
    return raw;
  }

  if (raw && Array.isArray(raw.reservations)) {
    return raw.reservations;
  }

  return [];
};

export const reservationsQueryKey = (params: ReservationsApiParams) =>
  ['reservations', params] as const;

type ReservationsQueryKey = ReturnType<typeof reservationsQueryKey>;

export const useReservationsQuery = (params: ReservationsApiParams) => {
  return useQuery<Reservation[], Error, Reservation[], ReservationsQueryKey>({
    queryKey: reservationsQueryKey(params),
    queryFn: ({ queryKey }: QueryFunctionContext<ReservationsQueryKey>) =>
      fetchReservations(queryKey[1]),
    refetchInterval: 30000,
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: true,
  });
};
