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
    <div className="flex flex-col items-start gap-2 w-60">
      <span className="text-sm font-medium text-slate-700">Branch</span>
      <Select value={branchId} onValueChange={handleChange}>
        <SelectTrigger>
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
