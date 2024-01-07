'use client';

import { trpc } from '@/app/_trpc/client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
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
import { Printer } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import ReactPrint from 'react-to-print';
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
    return (
      <div className='p-4 bg-white border text-sm max-w-xl'>
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
            <p className=''>{toPhp(item.price)}</p>
          </div>
        ))}
        <div className='grid grid-cols-3 gap-2'>
          <p>
            <strong>Total Sales: </strong>
          </p>
          <div />
          <p>{toPhp(dataPoint.payload.sales)}</p>
        </div>
      </div>
    );
  }

  return null;
};

function LabelAsPoint({
  x,
  y,
  data,
  index,
}: {
  x?: number;
  y?: number;
  data: any;
  index?: number;
}) {
  const sales = data[index!];

  const ref = useRef<HTMLDivElement>(null);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <circle
          fill='transparent'
          className='hover:fill-[#8884d8] cursor-pointer hover:stroke-white hover:stroke-[0.2em]'
          r={8}
          cx={x}
          cy={y}
        />
      </DialogTrigger>
      <DialogContent className='max-w-7xl'>
        <div className='flex flex-col gap-2'>
          <ReactPrint
            bodyClass='printStyle'
            content={() => ref.current}
            trigger={() => (
              <Button className='self-start gap-2' variant='outline'>
                <Printer className='w-4 h-4' />
                Print
              </Button>
            )}
          />
          <div ref={ref} className='p-4 bg-white text-sm'>
            <p>
              <strong>Date: </strong>
              {format(new Date(sales.date), 'PP')}
            </p>
            <p>
              <strong>Items: </strong>
              {sales.items.length}
            </p>
            <div className='grid font-bold grid-cols-6 border-b gap-2'>
              <p>Name</p>
              <p>Quantity</p>
              <p>Price</p>
              <p>Customer</p>
              <p>Email</p>
              <p>Contact Number</p>
            </div>
            {sales.items.map((item: any, index: number) => (
              <div className='grid grid-cols-6 border-b gap-2' key={index}>
                <p className='border-r'>
                  {truncateString(item.product.name, 30)}
                </p>
                <p className='border-r'>{item.quantity}</p>
                <p className='border-r'>{toPhp(item.price)}</p>
                <p className='border-r'>
                  {item.user ? item.user.name : item.name}
                </p>
                <p className='border-r break-all'>
                  {item.user ? item.user.email : item.email}
                </p>
                <p>
                  {item.user ? item.user.contactNumber : item.contactNumber}
                </p>
              </div>
            ))}
            <p>
              <strong>Total Sales: </strong> {toPhp(sales.sales)}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

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
          <Line
            label={<LabelAsPoint data={salesData} />}
            activeDot={false}
            type='monotone'
            dataKey='sales'
            stroke='#8884d8'
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
