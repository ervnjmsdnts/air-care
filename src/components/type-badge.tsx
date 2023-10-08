import { cn, toTitleCase } from '@/lib/utils';
import { Badge } from './ui/badge';
import { AppointmentType } from '@prisma/client';

export default function TypeBadge({ type }: { type: AppointmentType }) {
  return (
    <Badge
      className={cn(
        type === 'INSTALLATION'
          ? 'bg-gray-600 border-none hover:bg-gray-600/80 text-white'
          : type === 'REPAIR'
          ? 'bg-green-600 border-none text-white hover:bg-green-600/80'
          : type === 'CLEANING'
          ? 'bg-blue-400 text-white border-none hover:bg-blue-400/80'
          : 'bg-primary text-primary-foreground border-none hover:bg-primary/80',
      )}>
      {toTitleCase(type)}
    </Badge>
  );
}
