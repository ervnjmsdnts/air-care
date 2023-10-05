import { serverClient } from '@/app/_trpc/server';
import InventoryTable from './(components)/inventory-table';

export default async function Inventory() {
  const products = await serverClient.getProducts();
  return (
    <div className='h-full'>
      <InventoryTable products={products} />
    </div>
  );
}
