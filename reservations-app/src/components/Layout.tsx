import type {  ReactNode } from 'react';

export interface LayoutProps {
  children: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  className?: string;
  fluid?: boolean;
}

const mergeClasses = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(' ');

const Layout = ({
  children,
  header,
  footer,
  className,
  fluid = false,
}: LayoutProps) => {
  const containerClass = mergeClasses(
    'flex min-h-screen flex-col bg-slate-50 text-slate-900 px-6 sm:px-4',
    className,
  );

  const contentWrapperClass = mergeClasses(
    'flex w-full flex-1 flex-col gap-6 px-4 py-4 sm:px-6 sm:py-6 lg:px-8',
    fluid ? 'max-w-full' : 'mx-auto max-w-screen-xl',
  );



  return (
    <div className={containerClass} >
      {header}
      <div className={contentWrapperClass}>
        <main id="main-content" role="main" className="flex-1">
          {children}
        </main>

        {footer ? <footer className="pb-4 sm:pb-6 lg:pb-8">{footer}</footer> : null}
      </div>
    </div>
  );
};

export default Layout;
