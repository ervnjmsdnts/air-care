import { serverClient } from '@/app/_trpc/server';
import InventoryTable from './(components)/inventory-table';

export default async function Inventory() {
  const inventory = await serverClient.getProducts();
  return (
    <div className='h-full'>
      <InventoryTable inventory={inventory} />
    </div>
  );
}
