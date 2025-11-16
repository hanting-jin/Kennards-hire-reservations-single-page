import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';
import Logo from './Logo';
import UserInfo from './UserInfo';

const getEnvironmentLabel = (env: string | null | undefined) => {
  const normalized = String(env ?? '').toLowerCase();

  if (normalized === 'dev' || normalized === 'development') {
    return 'LOCAL - DEVELOPMENT';
  }

  if (normalized === 'uat') {
    return 'UAT - FOR TESTING ONLY';
  }

  if (!normalized) {
    // Default to UAT when not specified for local mockup
    return 'UAT - FOR TESTING ONLY';
  }

  return 'PRODUCTION';
};

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const environmentLabel = getEnvironmentLabel(
    (typeof import.meta !== 'undefined' &&
      (import.meta as any).env &&
      (import.meta as any).env.VITE_APP_ENV) ||
      null,
  );

  const handleLogoClick = () => {
    window.location.href = '/';
  };

  const handleMyAccount = () => {
    console.log('My account clicked');
  };

  const handleLogout = () => {

    console.log('Logout clicked');
  };

  return (
    <>
      <header className="border-b-2 border-red-500 bg-white">
        <div className="mx-auto flex w-full items-center justify-between py-2">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Open navigation"
              onClick={() => setIsMenuOpen(true)}
            >
              <Menu className="h-4 w-4" />
            </Button>
            <div className="flex items-start gap-3">
              <Logo
                src="/src/assets/Kennards-Hire-logo.svg"
                alt="Kennards Hire"
                width={160}
                height={32}
                clickable
                onClick={handleLogoClick}
              />
              {environmentLabel && (
                <span className="mt-1 text-xs font-semibold uppercase tracking-wide text-gray-600">
                  {environmentLabel}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <UserInfo
              name="Dong Qiu"
              id="8520 - Information Technology"
              onMyAccount={handleMyAccount}
              onLogout={handleLogout}
            />
          </div>
        </div>
      </header>

      <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <SheetHeader>
          <SheetTitle>Main menu</SheetTitle>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Close menu"
            onClick={() => setIsMenuOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </SheetHeader>
        <SheetContent className="space-y-2">
          <button
            type="button"
            className="flex w-full items-center rounded-md px-2 py-2 text-sm text-slate-800 hover:bg-slate-100"
            onClick={() => setIsMenuOpen(false)}
          >
            Menu item 1
          </button>
          <button
            type="button"
            className="flex w-full items-center rounded-md px-2 py-2 text-sm text-slate-800 hover:bg-slate-100"
            onClick={() => setIsMenuOpen(false)}
          >
            Menu item 2
          </button>
          <button
            type="button"
            className="flex w-full items-center rounded-md px-2 py-2 text-sm text-slate-800 hover:bg-slate-100"
            onClick={() => setIsMenuOpen(false)}
          >
            Menu item 3
          </button>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default Header;
