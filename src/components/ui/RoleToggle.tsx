import { ShieldCheck, Eye } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAppStore } from '@/store/useAppStore';
import type { Role } from '@/types';

const ROLE_CONFIG: Record<Role, {
  label: string;
  icon: typeof ShieldCheck;
  description: string;
  badgeClass: string;
  iconClass: string;
}> = {
  admin: {
    label: 'Admin',
    icon: ShieldCheck,
    description: 'Full access',
    badgeClass: 'text-emerald-400',
    iconClass: 'text-emerald-500',
  },
  viewer: {
    label: 'Viewer',
    icon: Eye,
    description: 'Read-only',
    badgeClass: 'text-slate-400',
    iconClass: 'text-slate-500',
  },
};

export default function RoleToggle() {
  const role = useAppStore((s) => s.role);
  const setRole = useAppStore((s) => s.setRole);

  const current = ROLE_CONFIG[role];
  const CurrentIcon = current.icon;

  return (
    <div className="space-y-1.5">
      <p className="px-1 text-[10px] font-semibold uppercase tracking-widest text-slate-600">
        Role
      </p>
      <Select
        value={role}
        onValueChange={(value) => setRole(value as Role)}
      >
        <SelectTrigger
          className={[
            'h-9 w-full rounded-lg border-slate-700 bg-slate-800/70',
            'text-sm font-medium ring-offset-slate-900',
            'hover:bg-slate-800 focus:ring-emerald-500 focus:ring-offset-slate-900',
            'transition-colors duration-150',
            current.badgeClass,
          ].join(' ')}
        >
          <div className="flex items-center gap-2">
            <CurrentIcon className={`h-3.5 w-3.5 flex-shrink-0 ${current.iconClass}`} />
            <SelectValue />
          </div>
        </SelectTrigger>

        <SelectContent
          className="border-slate-700 bg-slate-800 text-slate-200"
          align="start"
        >
          {(Object.entries(ROLE_CONFIG) as [Role, typeof ROLE_CONFIG[Role]][]).map(
            ([value, config]) => {
              const Icon = config.icon;
              return (
                <SelectItem
                  key={value}
                  value={value}
                  className={[
                    'cursor-pointer rounded-md focus:bg-slate-700 focus:text-slate-100',
                    'data-[state=checked]:text-emerald-400',
                  ].join(' ')}
                >
                  <div className="flex items-center gap-2.5 py-0.5">
                    <Icon className={`h-3.5 w-3.5 flex-shrink-0 ${config.iconClass}`} />
                    <div>
                      <p className="text-sm font-medium leading-none">{config.label}</p>
                      <p className="mt-0.5 text-[11px] text-slate-500">{config.description}</p>
                    </div>
                  </div>
                </SelectItem>
              );
            }
          )}
        </SelectContent>
      </Select>
    </div>
  );
}