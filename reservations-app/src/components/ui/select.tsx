import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  MouseEvent,
  ReactNode,
} from 'react';
import { createContext, useContext, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface SelectContextValue {
  value?: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  onValueChange: (value: string) => void;
}

const SelectContext = createContext<SelectContextValue | null>(null);

function useSelectContext(): SelectContextValue {
  const context = useContext<SelectContextValue | null>(SelectContext);

  if (!context) {
    throw new Error('Select components must be used within <Select>');
  }

  return context;
}

export interface SelectProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  children: ReactNode;
  className?: string;
}

export function Select({
  value,
  defaultValue,
  onValueChange,
  children,
  className,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState<string | undefined>(
    defaultValue,
  );

  const selectedValue = value ?? internalValue;

  const handleValueChange = (nextValue: string) => {
    if (value === undefined) {
      setInternalValue(nextValue);
    }

    onValueChange?.(nextValue);
    setOpen(false);
  };

  return (
    <SelectContext.Provider
      value={{
        value: selectedValue,
        open,
        setOpen,
        onValueChange: handleValueChange,
      }}
    >
      <div className={cn('relative inline-block w-full text-left', className)}>
        {children}
      </div>
    </SelectContext.Provider>
  );
}

export interface SelectTriggerProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export function SelectTrigger({
  children,
  className,
  ...props
}: SelectTriggerProps) {
  const { open, setOpen } = useSelectContext();

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    props.onClick?.(event);
    if (!event.defaultPrevented) {
      setOpen(!open);
    }
  };

  return (
    <button
      type="button"
      className={cn(
        'flex h-9 w-full items-center justify-between rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500',
        className,
      )}
      onClick={handleClick}
      {...props}
    >
      <span className="flex-1 text-left">{children}</span>
      <ChevronDown className="ml-2 h-4 w-4 text-slate-500" />
    </button>
  );
}

export interface SelectValueProps extends HTMLAttributes<HTMLSpanElement> {
  placeholder?: string;
}

export function SelectValue({
  placeholder,
  className,
  children,
  ...props
}: SelectValueProps) {
  const content = children ?? placeholder ?? '';

  return (
    <span
      className={cn(
        'block truncate text-sm text-slate-900',
        !content && 'text-slate-500',
        className,
      )}
      {...props}
    >
      {content}
    </span>
  );
}

export interface SelectContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function SelectContent({
  children,
  className,
  ...props
}: SelectContentProps) {
  const { open } = useSelectContext();

  if (!open) return null;

  return (
    <div
      className={cn(
        'absolute z-40 mt-1 max-h-60 w-full overflow-auto rounded-md border border-slate-200 bg-white py-1 text-sm shadow-lg',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export interface SelectItemProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  children: ReactNode;
}

export function SelectItem({
  value,
  children,
  className,
  onClick,
  ...props
}: SelectItemProps) {
  const { value: selectedValue, onValueChange } = useSelectContext();

  const isSelected = selectedValue === value;

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (!event.defaultPrevented) {
      onValueChange(value);
    }
  };

  return (
    <button
      type="button"
      className={cn(
        'flex w-full cursor-pointer select-none items-center px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50',
        isSelected && 'bg-slate-100 font-medium',
        className,
      )}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
}

