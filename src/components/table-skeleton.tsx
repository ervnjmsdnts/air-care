import { Skeleton } from './ui/skeleton';

export default function TableSkeleton() {
  return (
    <div className='grid grid-cols-1 h-full w-full gap-4'>
      <Skeleton className='w-full rounded-lg' />
      <Skeleton className='w-full rounded-lg' />
      <Skeleton className='w-full rounded-lg' />
      <Skeleton className='w-full rounded-lg' />
      <Skeleton className='w-full rounded-lg' />
    </div>
  );
}
