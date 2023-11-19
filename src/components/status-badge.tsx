import { AppointmentStatus, SpecialRequestStatus } from '@prisma/client';
import { Badge } from './ui/badge';
import { cn, toTitleCase } from '@/lib/utils';

export default function StatusBadge({
  status,
}: {
  status: AppointmentStatus | SpecialRequestStatus;
}) {
  return (
    <Badge
      className={cn(
        status === 'PENDING'
          ? 'bg-gray-600 border-none hover:bg-gray-600/80 text-white'
          : status === 'APPROVED'
          ? 'bg-primary text-primary-foreground border-none hover:bg-primary/80'
          : status === 'DENIED'
          ? 'bg-destructive text-destructive-foreground border-none hover:bg-destructive/80'
          : status === 'ONGOING'
          ? 'bg-yellow-600 border-none text-white hover:bg-yellow-600/80'
          : 'bg-green-600 border-none text-white hover:bg-green-600/80',
      )}>
      {toTitleCase(status)}
    </Badge>
  );
}
