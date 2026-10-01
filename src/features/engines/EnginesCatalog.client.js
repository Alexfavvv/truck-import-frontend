'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import BrandFilter from '@/components/ui/BrandFilter/BrandFilter';
import { ENGINE_MANUFACTURERS, ENGINE_TYPE_LABELS } from './data/manufacturers';
import catalogStyles from '@/app/catalog/page.module.css';
import cardStyles from '@/components/ui/ProductList/productlist.module.css';
import searchStyles from '@/components/ui/Search/headerSearch.module.css';
import styles from './engines.module.css';

const manufacturerOptions = ENGINE_MANUFACTURERS.map(({ name }) => ({ value: name, label: name }));
function EngineCard({ engine }) {
  const href = `/engines/${engine.slug}`;
  const numericPrice = Number(engine.price);
  const price = Number.isFinite(numericPrice) && numericPrice > 0
    ? `${engine.price} ${engine.currency === 'RUB' ? '₽' : engine.currency}`
    : 'По запросу';

  return (
    <article className={cardStyles.product__card}>
      <Link href={href} className={styles.cardLink}>
        <div className={cardStyles.product__image_container}>
          <div className={cardStyles.product__image}>
            <img src={engine.image || '/images/product-image.jpg'} alt={engine.title} loading="lazy" />
          </div>
        </div>
        <span className={cardStyles.product__code}>{engine.sku}</span>
        <div className={cardStyles.product__data}>
          <span className={cardStyles.product__name}>
            <span className={cardStyles.product__name_value}>{engine.title}</span>
          </span>
          <span className={cardStyles.product__brand}>
            <span className={cardStyles.product__brand_name}>Производитель: </span>
            <span className={cardStyles.product__brand_value}>{engine.manufacturer}</span>
          </span>
          {engine.model && <span className={cardStyles.product__brand}>
            <span className={cardStyles.product__brand_name}>Модель: </span>
            <span className={cardStyles.product__brand_value}>{engine.model}</span>
          </span>}
          <span className={cardStyles.product__brand}>
            <span className={cardStyles.product__brand_name}>Тип: </span>
            <span className={cardStyles.product__brand_value}>{ENGINE_TYPE_LABELS[engine.type] || engine.type}</span>
          </span>
          <span className={cardStyles.product__price}>
            <span className={cardStyles.product__price_name}>Цена: </span>
            <span className={`${cardStyles.product__price_value} ${styles.priceValue}`}>{price}</span>
          </span>
        </div>
      </Link>
    </article>
  );
}

export default function EnginesCatalog({ engines, meta }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const manufacturerParam = searchParams.get('manufacturer');
  const searchParam = searchParams.get('search') || '';
  const [selectedManufacturers, setSelectedManufacturers] = useState(
    manufacturerParam ? manufacturerParam.split(',') : [],
  );
  const [query, setQuery] = useState(searchParam);

  useEffect(() => {
    setSelectedManufacturers(manufacturerParam ? manufacturerParam.split(',') : []);
  }, [manufacturerParam]);

  useEffect(() => {
    setQuery(searchParam);
  }, [searchParam]);

  useEffect(() => {
    if (query.trim() === searchParam) return;
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (query.trim()) params.set('search', query.trim());
      else params.delete('search');
      params.delete('page');
      const search = params.toString();
      router.replace(search ? `/engines?${search}` : '/engines', { scroll: false });
    }, 300);
    return () => clearTimeout(timer);
  }, [query, searchParam, searchParams, router]);

  const updateManufacturers = (next) => {
    setSelectedManufacturers(next);
    const params = new URLSearchParams(searchParams.toString());
    if (next.length) params.set('manufacturer', next.join(','));
    else params.delete('manufacturer');
    params.delete('page');
    const search = params.toString();
    router.replace(search ? `/engines?${search}` : '/engines', { scroll: false });
  };

  const updatePage = (page) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(page));
    router.replace(`/engines?${params.toString()}`, { scroll: false });
  };

  return (
    <>
      <section className={catalogStyles.catalog__hero}>
        <h1 className={catalogStyles.catalog__title}>Двигатели и блоки</h1>
      </section>
      <section className={`${catalogStyles.catalog__content} ${styles.catalogContent}`}>
        <div className={styles.layout}>
          <aside className={styles.filters}>
            <BrandFilter
              title="Производитель"
              allBrands={manufacturerOptions}
              selectedBrands={selectedManufacturers}
              onChange={updateManufacturers}
            />
          </aside>
          <div className={`${catalogStyles.container} ${styles.container}`}>
            <div className={`${searchStyles.headerSearch__inputContainer} ${styles.search}`}>
              <input
                type="search"
                className={searchStyles.headerSearch__input}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Поиск по двигателям и блокам"
                aria-label="Поиск по двигателям и блокам"
              />
              {query && <button type="button" className={searchStyles.headerSearch__clearBtn} onClick={() => setQuery('')} aria-label="Очистить поиск">✕</button>}
            </div>
            {engines.length ? (
              <div className={`${catalogStyles.products} ${styles.products}`}>
                {engines.map((engine) => <EngineCard key={engine.id} engine={engine} />)}
              </div>
            ) : (
              <p className={catalogStyles.empty}>Товары не найдены</p>
            )}
            {meta.last_page > 1 && (
              <nav className={catalogStyles.pagination} aria-label="Страницы каталога двигателей">
                {meta.current_page > 1 && <button type="button" onClick={() => updatePage(meta.current_page - 1)}>←</button>}
                <span>{meta.current_page} / {meta.last_page}</span>
                {meta.current_page < meta.last_page && <button type="button" onClick={() => updatePage(meta.current_page + 1)}>→</button>}
              </nav>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
