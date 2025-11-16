import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { BranchId } from '@/enums';

const BRANCHES = [
  {
    id: BranchId.ARTARMON,
    label: 'ARTARMON',
  },
];

export interface BranchSelectProps {
  branchId: string;
  onChange: (branchId: string) => void;
}

const BranchSelect = ({ branchId, onChange }: BranchSelectProps) => {
  const handleChange = (value: string) => {
    onChange(value);
  };

  const selectedBranch = BRANCHES.find((branch) => branch.id === branchId);

  return (
    <div className="flex w-full max-w-[220px] flex-col items-end gap-1 text-right sm:items-start sm:text-left">
      <span className="text-sm font-semibold text-slate-400">Branch</span>
      <Select value={branchId} onValueChange={handleChange}>
        <SelectTrigger className="h-11 rounded-md border-slate-200 px-4 text-base shadow-[0_3px_10px_rgba(0,0,0,0.12)]">
          <SelectValue placeholder={selectedBranch?.label ?? 'Select a branch'} />
        </SelectTrigger>
        <SelectContent>
          {BRANCHES.map((branch) => (
            <SelectItem key={branch.id} value={branch.id}>
              {branch.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default BranchSelect;
