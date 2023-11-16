import { cn } from '@/lib/utils';

export default function Logo({ className }: { className?: string }) {
  return (
    <h1
      className={cn(
        'text-[#1da9c1] text-[16rem] tracking-tighter leading-[140px] font-cynthe',
        className,
      )}>
      ac
    </h1>
  );
}
