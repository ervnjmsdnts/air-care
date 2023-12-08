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
import {
  eachDayOfInterval,
  endOfMonth,
  format,
  parseISO,
  startOfMonth,
} from 'date-fns';
import { useEffect, useState } from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
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

export default function SalesChart() {
  const { data: doneAppointments } = trpc.getDoneAppointments.useQuery();
  const [selectedMonth, setSelectedMonth] = useState(
    format(new Date(), 'MM'), // Set the default to the current month
  );
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

    // Map the days in the month to the format expected by Recharts
    const formattedData = daysInMonth.map((day) => {
      const dayFormatted = format(day, 'yyyy-MM-dd');
      const saleForDay = doneAppointments?.find(
        (appointment) =>
          format(parseISO(appointment.createdAt), 'yyyy-MM-dd') ===
          dayFormatted,
      );

      return {
        day: format(new Date(dayFormatted), 'dd'),
        sales: saleForDay ? saleForDay.price : 0,
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
          <Tooltip />
          <Legend />
          <Line type='monotone' dataKey='sales' stroke='#8884d8' />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
