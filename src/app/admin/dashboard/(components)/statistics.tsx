import { Separator } from '@/components/ui/separator';

type StatItemType = {
  label: string;
  value: string;
  divide?: boolean;
};

function StatItem({ label, value, divide = true }: StatItemType) {
  return (
    <div className='flex gap-6'>
      {divide && <Separator orientation='vertical' />}
      <div className='flex flex-col justify-center h-full'>
        <p className='text-muted-foreground text-sm mb-1'>{label}</p>
        <h2 className='text-secondary-foreground font-extrabold text-4xl'>
          {value}
        </h2>
      </div>
    </div>
  );
}

export default function Statistics() {
  return (
    <div className='border rounded-lg'>
      <div className='grid grid-cols-3 h-24 px-6'>
        <StatItem divide={false} label='Total Sales' value='&#8369;13k' />
        <StatItem label='Monthly Sales' value='&#8369;4,200' />
        <StatItem label='Daily Sales' value='&#8369;1,200' />
      </div>
    </div>
  );
}
