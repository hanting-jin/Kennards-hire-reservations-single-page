import { Avatar } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

export interface UserInfoProps {
  name: string;
  id: string;
  avatarUrl?: string;
  onMyAccount: () => void;
  onLogout: () => void;
}

const UserInfo = ({
  name,
  id,
  avatarUrl,
  onMyAccount,
  onLogout,
}: UserInfoProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-3">
        <div className="hidden flex-col items-end text-right md:flex">
          <span className="text-sm font-semibold text-slate-900">{name}</span>
          <span className="text-[11px] uppercase tracking-wide text-slate-500">
            {id}
          </span>
        </div>
        <Avatar src={avatarUrl} name={name} />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <div className="px-3 py-2 text-xs text-slate-500 md:hidden">
          <div className="text-sm font-semibold text-slate-900">{name}</div>
          <div className="mt-0.5 text-[11px] uppercase tracking-wide text-slate-500">
            {id}
          </div>
        </div>
        <DropdownMenuItem onClick={onMyAccount}>My account</DropdownMenuItem>
        <DropdownMenuItem onClick={onLogout}>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserInfo;
