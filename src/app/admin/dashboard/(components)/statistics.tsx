'use client';

import { trpc } from '@/app/_trpc/client';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { toPhp } from '@/lib/utils';
import { Dispatch, SetStateAction, useMemo, useState } from 'react';

type StatItemType = {
  label: string;
  value?: number;
  divide?: boolean;
  isMonthly?: boolean;
  selectedMonth?: string;
  setSelectedMonth?: Dispatch<SetStateAction<string>>;
};

const months = [
  { value: 'JAN', label: 'January' },
  { value: 'FEB', label: 'February' },
  { value: 'MAR', label: 'March' },
  { value: 'APR', label: 'April' },
  { value: 'MAY', label: 'May' },
  { value: 'JUN', label: 'June' },
  { value: 'JUL', label: 'July' },
  { value: 'AUG', label: 'August' },
  { value: 'SEP', label: 'September' },
  { value: 'OCT', label: 'October' },
  { value: 'NOV', label: 'November' },
  { value: 'DEC', label: 'December' },
];

function StatItem({
  label,
  value = 0,
  divide = true,
  isMonthly = false,
  selectedMonth,
  setSelectedMonth,
}: StatItemType) {
  return (
    <div className='flex gap-6'>
      {divide && <Separator orientation='vertical' />}
      <div className='flex flex-col w-full justify-center h-full'>
        <div className='flex w-full items-center justify-between'>
          <p className='text-muted-foreground text-sm mb-1'>{label}</p>
          {isMonthly ? (
            <Select
              defaultValue={selectedMonth}
              onValueChange={setSelectedMonth}>
              <SelectTrigger className='max-w-[180px] mr-4'>
                <SelectValue placeholder='Select month' />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Months</SelectLabel>
                  {months.map((month) => (
                    <SelectItem key={month.value} value={month.value}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          ) : null}
        </div>
        <h2 className='text-secondary-foreground font-extrabold text-4xl'>
          {toPhp(value)}
        </h2>
      </div>
    </div>
  );
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
  const [selectedMonth, setSelectedMonth] = useState(
    months[new Date().getMonth()].value,
  );
  const { data: doneAppointments } = trpc.getDoneAppointments.useQuery();

  const monthlySales = useMemo(() => {
    if (!doneAppointments) {
      return 0;
    }

    const selectedMonthIndex = months.findIndex(
      (month) => month.value === selectedMonth,
    );

    const selectedMonthAppointments = doneAppointments.filter((appointment) => {
      const appointmentMonth = new Date(appointment.createdAt).getMonth();
      return appointmentMonth === selectedMonthIndex;
    });

    const totalSales = selectedMonthAppointments.reduce(
      (accumulator, appointment) => accumulator + appointment.price,
      0,
    );

    return totalSales;
  }, [doneAppointments, selectedMonth]);

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
            isMonthly
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
            value={monthlySales}
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
