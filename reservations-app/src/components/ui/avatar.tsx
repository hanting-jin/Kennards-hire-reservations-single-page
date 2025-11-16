import type { ImgHTMLAttributes, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

export interface AvatarProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src?: string;
  name?: string;
}

export function Avatar({ src, name, className, ...props }: AvatarProps) {
  const initials =
    name
      ?.split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('') ?? '';

  return (
    <div
      className={cn(
        'inline-flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-red-600 text-xs font-semibold text-white',
        className,
      )}
    >
      {src ? (
        // eslint-disable-next-line jsx-a11y/img-redundant-alt
        <img
          src={src}
          alt={name ? `${name} avatar` : 'User avatar'}
          className="h-full w-full object-cover"
          {...props}
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}

export function AvatarFallback({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'flex h-full w-full items-center justify-center text-xs font-semibold',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
