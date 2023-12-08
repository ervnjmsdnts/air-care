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
import { toPhp, truncateString } from '@/lib/utils';
import { eachDayOfInterval, endOfMonth, format, startOfMonth } from 'date-fns';
import { useEffect, useState } from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from 'recharts';

const months = [
  { value: '01', label: 'January' },
  { value: '02', label: 'February' },
  { value: '03', label: 'March' },
  { value: '04', label: 'April' },
  { value: '05', label: 'May' },
  { value: '06', label: 'June' },
  { value: '07', label: 'July' },
  { value: '08', label: 'August' },
  { value: '09', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
];

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: any;
}) => {
  if (active && payload && payload.length) {
    const dataPoint = payload[0];
    console.log(dataPoint.payload.items);
    return (
      <div className='p-4 bg-white border text-sm max-w-md'>
        <p>
          <strong>Date: </strong>
          {format(new Date(dataPoint.payload.date), 'PP')}
        </p>
        <p>
          <strong>Items: </strong>
          {dataPoint.payload.items.length}
        </p>
        <div className='grid font-bold grid-cols-3 border-b gap-2'>
          <p>Name</p>
          <p>Quantity</p>
          <p>Price</p>
        </div>
        {dataPoint.payload.items.map((item: any, index: number) => (
          <div className='grid grid-cols-3 border-b gap-2' key={index}>
            <p className='border-r'>{truncateString(item.product.name, 30)}</p>
            <p className='border-r'>{item.quantity}</p>
            <p>{toPhp(item.price)}</p>
          </div>
        ))}
        <p>
          <strong>Total Sales: </strong> {toPhp(dataPoint.payload.sales)}
        </p>
      </div>
    );
  }

  return null;
};

export default function SalesChart() {
  const { data: doneAppointments } = trpc.getDoneAppointments.useQuery();
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'MM'));
  const [salesData, setSalesData] = useState<any>([]);
  const currentYear = new Date().getFullYear();
  useEffect(() => {
    const selectedMonthStart = startOfMonth(
      new Date(`${currentYear}-${selectedMonth}-01`),
    );
    const selectedMonthEnd = endOfMonth(
      new Date(`${currentYear}-${selectedMonth}-01`),
    );

    const daysInMonth = eachDayOfInterval({
      start: selectedMonthStart,
      end: selectedMonthEnd,
    });

    const formattedData = daysInMonth.map((day) => {
      const dayFormatted = format(day, 'yyyy-MM-dd');
      const saleForDay = doneAppointments?.filter(
        (appointment) =>
          format(
            new Date(appointment.scheduledDate || appointment.createdAt),
            'yyyy-MM-dd',
          ) === dayFormatted,
      );

      const priceOfDay = saleForDay?.reduce((acc, app) => acc + app.price, 0);

      return {
        date: dayFormatted,
        items: saleForDay ? saleForDay : [],
        day: format(new Date(dayFormatted), 'dd'),
        sales: priceOfDay ? priceOfDay : 0,
      };
    });

    setSalesData(formattedData);
  }, [doneAppointments, selectedMonth, currentYear]);

  return (
    <div className='h-96 mt-4'>
      <div className='flex justify-end mb-2'>
        <Select defaultValue={selectedMonth} onValueChange={setSelectedMonth}>
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
      </div>
      <ResponsiveContainer width='100%' height='100%'>
        <LineChart data={salesData}>
          <CartesianGrid stroke='#ccc' />
          <XAxis dataKey='day' />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line type='monotone' dataKey='sales' stroke='#8884d8' />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
