import type { ReactNode } from 'react';
import type { Reservation } from '@/api/reservationsApi';

export interface BookingCellContext {
  reservation: Reservation;
  index: number;
  expandLines: boolean;
}

export interface BookingTableColumn {
  key: string;
  title: ReactNode;
  width?: string | number;
  className?: string;
  headerClassName?: string;
  render: (ctx: BookingCellContext) => ReactNode;
  renderMobile?: (ctx: BookingCellContext) => ReactNode;
}

export interface BookingTableMobileLayout {
  topLeft?: string[];
  topRight?: string;
  body?: string[];
}

export interface BookingTableConfig {
  columns: BookingTableColumn[];
  mobileLayout?: BookingTableMobileLayout;
  getRowKey?: (reservation: Reservation, index: number) => string | number;

  // 日期导航
  showDateNavigator?: boolean;
  rangeLabel?: string;
  onPrev?: () => void;
  onNext?: () => void;

  // Expand lines
  showExpandLinesToggle?: boolean;

  // 状态
  isLoading?: boolean;
  isFetching?: boolean;
  isError?: boolean;
  errorMessage?: string;
  onRetry?: () => void;
  onRefresh?: () => void;
}
