import Link from 'next/link';
import { notFound } from 'next/navigation';
import styles from '@/components/ui/Product/product.module.css';
import ProductInformationSections from '@/components/ui/Product/ProductInformationSections';
import { getEngineBySlug } from '@/features/engines/services/enginesCatalog';
import { ENGINE_TYPE_LABELS } from '@/features/engines/data/manufacturers';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const engine = await getEngineBySlug(slug);
  return engine ? { title: `${engine.title} | Truck Import` } : {};
}

export default async function EnginePage({ params }) {
  const { slug } = await params;
  const engine = await getEngineBySlug(slug);
  if (!engine) notFound();
  const numericPrice = Number(engine.price);
  const price = Number.isFinite(numericPrice) && numericPrice > 0
    ? `${engine.price} ${engine.currency === 'RUB' ? '₽' : engine.currency}`
    : 'По запросу';

  return (
    <main className={styles.productMainContainer}>
      <div className={styles.productContentWrapper}>
        <nav className={styles.breadcrumbs} aria-label="Хлебные крошки">
          <Link href="/">Главная</Link><span className={styles.breadcrumbArrow}>→</span>
          <Link href="/engines">Двигатели и блоки</Link><span className={styles.breadcrumbArrow}>→</span>
          <span className={styles.breadcrumbCurrent}>{engine.title}</span>
        </nav>
        <section className={styles.heroGrid}>
          <div className={styles.productDataCard}>
            <div className={styles.productImagePlaceholder} style={{ backgroundImage: `url(${engine.image || '/images/product-image.jpg'})` }}>
              <span className={styles.imageSkuText}>{engine.sku}</span>
            </div>
            <div className={styles.productInfoContent}>
              <div className={styles.titleBlock}>
                <div className={styles.skuBadge}>{engine.sku}</div>
                <h1 className={styles.productTitle}>{engine.title}</h1>
              </div>
              <section className={styles.specificationsSection}>
                <h2 className={styles.specificationsTitle}>Характеристики</h2>
                <div className={styles.specificationsList}>
                  {engine.manufacturer && <div className={styles.specRow}><span className={styles.specName}>Производитель</span><span className={styles.specValue}>{engine.manufacturer}</span></div>}
                  {engine.engine_family && <div className={styles.specRow}><span className={styles.specName}>Серия двигателя</span><span className={styles.specValue}>{engine.engine_family}</span></div>}
                  {engine.model && <div className={styles.specRow}><span className={styles.specName}>Модель</span><span className={styles.specValue}>{engine.model}</span></div>}
                  {engine.type && <div className={styles.specRow}><span className={styles.specName}>Тип</span><span className={styles.specValue}>{ENGINE_TYPE_LABELS[engine.type] || engine.type}</span></div>}
                  {engine.sku && <div className={styles.specRow}><span className={styles.specName}>OEM / артикул</span><span className={styles.specValue}>{engine.sku}</span></div>}
                </div>
              </section>
            </div>
          </div>
          <aside className={styles.productBuyCard}>
            <div className={styles.availabilityRow}>
              <span className={styles.inStockBadge}>Доступно для заказа</span>
            </div>
            <div className={styles.infoRow}><span className={styles.priceLabel}>Цена:</span><span className={styles.priceValue}>{price}</span></div>
            {engine.availability && <p>{engine.availability}</p>}
            <a className={styles.helpButton} href="tel:+74957403306">Уточнить цену</a>
          </aside>
        </section>
        {engine.description && (
          <section className={styles.aboutSection}>
            <h2 className={styles.aboutTitle}>Описание товара</h2>
            <p className={styles.aboutText}>{engine.description}</p>
          </section>
        )}
        <ProductInformationSections />
      </div>
    </main>
  );
}
