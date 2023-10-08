'use client';

import { trpc } from '@/app/_trpc/client';
import { Separator } from '@/components/ui/separator';
import { toPhp } from '@/lib/utils';

type StatItemType = {
  label: string;
  value?: number;
  divide?: boolean;
};

function StatItem({ label, value = 0, divide = true }: StatItemType) {
  return (
    <div className='flex gap-6'>
      {divide && <Separator orientation='vertical' />}
      <div className='flex flex-col justify-center h-full'>
        <p className='text-muted-foreground text-sm mb-1'>{label}</p>
        <h2 className='text-secondary-foreground font-extrabold text-4xl'>
          {toPhp(value)}
        </h2>
      </div>
    </div>
  );
}

function calculateMonthlySales(
  data: { price: number; createdAt: Date; updateAt: Date }[] | undefined,
): number | undefined {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  const totalSales = data
    ?.filter((item) => {
      const itemMonth = item.updateAt.getMonth() + 1;
      const itemYear = item.updateAt.getFullYear();
      return itemMonth === currentMonth && itemYear === currentYear;
    })
    .reduce((total, item) => total + item.price, 0);

  return totalSales;
}

function calculateDailySales(
  data: { price: number; createdAt: Date; updateAt: Date }[] | undefined,
): number | undefined {
  const currentDate = new Date();
  const currentDay = currentDate.getDate();
  const currentMonth = currentDate.getMonth() + 1; // Months are 0-based
  const currentYear = currentDate.getFullYear();

  const totalSales = data
    ?.filter((item) => {
      const itemDay = item.updateAt.getDate();
      const itemMonth = item.updateAt.getMonth() + 1;
      const itemYear = item.updateAt.getFullYear();
      return (
        itemDay === currentDay &&
        itemMonth === currentMonth &&
        itemYear === currentYear
      );
    })
    .reduce((total, item) => total + item.price, 0);

  return totalSales;
}

export default function Statistics() {
  const { data: doneAppointments, isLoading } =
    trpc.getDoneAppointments.useQuery();

  const totalSales = doneAppointments?.reduce(
    (total, item) => total + item.price,
    0,
  );

  return (
    <div className='border rounded-lg'>
      <div className='grid grid-cols-3 h-24 px-6'>
        <>
          <StatItem
            divide={false}
            label='Total Sales'
            value={totalSales || 0}
          />
          <StatItem
            label='Monthly Sales'
            value={
              calculateMonthlySales(
                doneAppointments?.map((d) => ({
                  ...d,
                  createdAt: new Date(d.createdAt),
                  updateAt: new Date(d.updatedAt),
                })),
              ) || 0
            }
          />
          <StatItem
            label='Daily Sales'
            value={
              calculateDailySales(
                doneAppointments?.map((d) => ({
                  ...d,
                  createdAt: new Date(d.createdAt),
                  updateAt: new Date(d.updatedAt),
                })),
              ) || 0
            }
          />
        </>
      </div>
    </div>
  );
}
