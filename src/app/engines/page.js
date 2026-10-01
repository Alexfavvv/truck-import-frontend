import { Suspense } from 'react';
import EnginesCatalog from '@/features/engines/EnginesCatalog.client';
import { getEnginesPage } from '@/features/engines/services/enginesCatalog';

export const metadata = {
  title: 'Двигатели и блоки | Truck Import',
  description: 'Каталог двигателей и блоков MAN, Volvo, Volvo Penta и Scania Marine.',
};

export default async function EnginesPage({ searchParams }) {
  const params = await searchParams;
  const manufacturer = typeof params.manufacturer === 'string' ? params.manufacturer : '';
  const search = typeof params.search === 'string' ? params.search : '';
  const page = typeof params.page === 'string' ? params.page : '1';
  const { data: engines, meta } = await getEnginesPage({ manufacturer, search, page });
  return (
    <main>
      <Suspense fallback={null}>
        <EnginesCatalog engines={engines} meta={meta} />
      </Suspense>
    </main>
  );
}
