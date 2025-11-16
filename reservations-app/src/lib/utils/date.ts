import {
  addDays as dfAddDays,
  addWeeks as dfAddWeeks,
  endOfWeek,
  format,
  parseISO,
  startOfWeek,
} from 'date-fns';

const getOrdinal = (day: number): string => {
  if (day >= 11 && day <= 13) {
    return `${day}th`;
  }

  const lastDigit = day % 10;

  if (lastDigit === 1) return `${day}st`;
  if (lastDigit === 2) return `${day}nd`;
  if (lastDigit === 3) return `${day}rd`;

  return `${day}th`;
};

export const getWeekRange = (date: Date): { start: Date; end: Date } => {
  const start = startOfWeek(date, { weekStartsOn: 1 });
  const end = endOfWeek(date, { weekStartsOn: 1 });

  return { start, end };
};

export const addDays = (date: Date, amount: number): Date => {
  return dfAddDays(date, amount);
};

export const addWeeks = (date: Date, amount: number): Date => {
  return dfAddWeeks(date, amount);
};

export const formatDateForApi = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};

export const formatDateForDisplay = (date: Date): string => {
  return format(date, 'EEEE do MMMM yyyy');
};

export const formatDateRangeForDisplay = (start: Date, end: Date): string => {
  const startDay = getOrdinal(start.getDate());
  const endDay = getOrdinal(end.getDate());

  const startMonthYear = format(start, 'MMM yyyy');
  const endMonthYear = format(end, 'MMM yyyy');

  if (startMonthYear === endMonthYear) {
    return `${startDay} ${startMonthYear} to ${endDay} ${endMonthYear}`;
  }

  return `${startDay} ${startMonthYear} to ${endDay} ${endMonthYear}`;
};

export const parseReservationDate = (dateString: string): Date => {
  return parseISO(dateString);
};
