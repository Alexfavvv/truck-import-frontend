'use client'

import Link from 'next/link';
import SafeImage from "@/components/ui/SafeImage/SafeImage";
import ProductAddToCart from "@/components/ui/ProductAddToCart/ProductAddToCart";
import { useRef } from 'react';
import Feedback from "@/components/ui/Feedback/Feedback";
import ProductInformationSections from "@/components/ui/Product/ProductInformationSections";
import brandsData from "@/json/brands.json";
import styles from "./product.module.css";

const BRAND_SLUGS = new Set(brandsData.map((item) => item.slug));

const DEFAULT_RELATED = [
    { id: 101, sku: 'QEV111AJC39M', name: 'Carrier', brand: 'Kolbenschmidt', count: 999 },
    { id: 102, sku: 'A9414706842', name: 'Carrier', brand: 'Mercedes Trucks', count: 999 },
    { id: 103, sku: 'HENGST-7712', name: 'Масляный фильтр', brand: 'Hengst', count: 999 },
    { id: 104, sku: 'MAN-998123', name: 'Ремкомплект', brand: 'MAN', count: 999 }
];

export function ProductHelpButton() {
    const dialogRef = useRef(null);

    const handleDialogClick = (e) => {
        const dialog = dialogRef.current;
        if (!dialog) return;
        const rect = dialog.getBoundingClientRect();
        if (
            e.clientX < rect.left || e.clientX > rect.right ||
            e.clientY < rect.top || e.clientY > rect.bottom
        ) {
            dialog.close();
        }
    };

    return (
        <>
            <button type="button" className={styles.helpButton} onClick={() => dialogRef.current?.showModal()}>
                <span>Помощь в подборе</span>
                <img src="/images/btn-avatar.png" alt="Менеджер" className={styles.managerAvatar} />
            </button>
            <dialog ref={dialogRef} className={styles.modalDialog} onClick={handleDialogClick}>
                <div className={styles.modalWrapper}>
                    <Feedback />
                    <button className={styles.modalClose} onClick={() => dialogRef.current?.close()} aria-label="Закрыть">
                        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="#FFFFFF" strokeWidth="2">
                            <path d="M1 1L19 19M19 1L1 19" />
                        </svg>
                    </button>
                </div>
            </dialog>
        </>
    );
}

function displayPrice(price) {
    const numericPrice = Number(String(price ?? '').replace(/\s/g, '').replace(',', '.'));
    return Number.isFinite(numericPrice) && numericPrice > 0 ? `${price} ₽` : 'Цена по запросу';
}

export default function Product({ product = {}, cartAuthenticated = false, relatedProducts = DEFAULT_RELATED }) {
    const specifications = product.specifications || [];
    const brandLabel = product.brand_name || product.brand || product.truck_manufacturers?.[0]?.name || 'Kolbenschmidt';
    const hasBrandLink = Boolean(product.brand) && BRAND_SLUGS.has(product.brand);
    const deliveryLabel = product.delivery || 'от 15 дней';
    const priceDisplay = displayPrice(product.price);
    const productSku = product.sku || 'QEV111AJC39M';
    const productName = product.name || 'Mercedes-Benz Evobus';
    const physicalSpecs = [
        ['Вес', product.weight],
        ['Ширина', product.width],
        ['Высота', product.height],
        ['Длина', product.length],
        ['Замена', product.replacement],
    ].filter(([, value]) => value !== null && value !== undefined && String(value).trim() !== '');

    return (
        <main className={styles.productMainContainer}>
            <div className={styles.productContentWrapper}>

                {/* --- ХЛЕБНЫЕ КРОШКИ --- */}
                <nav className={styles.breadcrumbs}>
                    <Link href="/">Главная</Link>
                    <span className={styles.breadcrumbArrow}>→</span>
                    <Link href="/catalog">Запчасти для грузовиков Mercedes</Link>
                    <span className={styles.breadcrumbArrow}>→</span>
                    <Link href="/catalog">Запчасти Mercedes Actros</Link>
                    <span className={styles.breadcrumbArrow}>→</span>
                    <span className={styles.breadcrumbCurrent}>{productSku}</span>
                </nav>

                {/* --- ВЕРХНИЙ БЛОК ТОВАРА (2 карточки) --- */}
                <section className={styles.heroGrid}>
                    
                    {/* ЛЕВАЯ КАРТОЧКА (Фото слева, Название и Тех. характеристики справа) */}
                    <div className={styles.productDataCard}>
                        {/* Отображение номера товара на фоновом изображении */}
                        <div className={styles.productImagePlaceholder}>
                            <span className={styles.imageSkuText}>{productSku}</span>
                        </div>

                        {/* Правая часть: SKU, Название, Технические характеристики */}
                        <div className={styles.productInfoContent}>
                            <div className={styles.titleBlock}>
                                <div className={styles.skuBadge}>
                                    {productSku}
                                </div>
                                <h1 className={styles.productTitle}>
                                    {productName}
                                </h1>
                            </div>

                            {/* Технические характеристики */}
                            <div className={styles.specificationsSection}>
                                <h2 className={styles.specificationsTitle}>
                                    Технические характеристики
                                </h2>
                                <div className={styles.specificationsList}>
                                    <div className={styles.specRow}>
                                        <span className={styles.specName}>Бренд</span>
                                        <span className={styles.specValue}>
                                            {hasBrandLink ? (
                                                <Link href={`/brands/${product.brand}`}>
                                                    {brandLabel}
                                                </Link>
                                            ) : (
                                                brandLabel
                                            )}
                                        </span>
                                    </div>

                                    <div className={styles.specRow}>
                                        <span className={styles.specName}>Категория</span>
                                        <span className={styles.specValue}>
                                            {product.category_id || 'Прочее'}
                                        </span>
                                    </div>

                                    {physicalSpecs.map(([label, value]) => (
                                        <div key={label} className={styles.specRow}>
                                            <span className={styles.specName}>{label}</span>
                                            <span className={styles.specValue}>{value}</span>
                                        </div>
                                    ))}

                                    {specifications.map((item, index) => (
                                        <div key={index} className={styles.specRow}>
                                            <span className={styles.specName}>{item[0]}</span>
                                            <span className={styles.specValue}>{item[1]}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ПРАВАЯ КАРТОЧКА (Наличие, цена, способы получения, кнопки) */}
                    <div className={styles.productBuyCard}>

                        <div className={styles.availabilityRow}>
                            <span className={styles.inStockBadge}>Доступно для заказа</span>
                        </div>
                        
                        {/* Сроки доставки */}
                        <div className={styles.infoRow}>
                            <span className={styles.infoLabel}>Сроки доставки:</span>
                            <span className={styles.infoValue}>{deliveryLabel}</span>
                        </div>

                        {/* Цена */}
                        <div className={styles.infoRow}>
                            <span className={styles.priceLabel}>Цена:</span>
                            <span className={styles.priceValue}>{priceDisplay}</span>
                        </div>

                        {/* Способы получения */}
                        <div className={styles.deliveryMethodsSection}>
                            <p className={styles.deliveryMethodsTitle}>Способы получения:</p>
                            <ul className={styles.deliveryMethodsList}>
                                <li>
                                    <span>• Самовывоз </span>
                                    <a href="#map" className={styles.addressLink}>
                                        г.Люберцы, ул. Каскадная 20к2, пом.1.
                                    </a>
                                </li>
                                <li>
                                    <span>• Доставка ТК по всей России</span>
                                </li>
                            </ul>
                        </div>

                        {/* Кнопки действий */}
                        <div className={styles.actionsContainer}>
                            
                            {/* Кнопка "Помощь в подборе" с аватаркой менеджера */}
                            <ProductHelpButton />

                            {/* Кнопка "Добавить в корзину" */}
                            <div className={styles.cartBtnWrapper}>
                                <ProductAddToCart
                                    props_count={999}
                                    productId={product.id || 1}
                                    productSku={productSku}
                                    cartAuthenticated={cartAuthenticated}
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- О ТОВАРЕ --- */}
                <section className={styles.aboutSection}>
                    <h2 className={styles.aboutTitle}>О товаре:</h2>
                    <p className={styles.aboutText}>
                        Оригинальная запчасть или качественный аналог — <strong>{productName}, арт. {productSku}</strong>. Производитель: <strong>{brandLabel}</strong>. Высокая износостойкость и точное соответствие заводским стандартам. Закажите надёжную запчасть в интернет-магазине Truck-Import — оперативная доставка по всей России.
                    </p>
                </section>

                {/* --- ВАМ ТАК ЖЕ МОЖЕТ БЫТЬ ИНТЕРЕСНО --- */}
                <section className={styles.relatedSection}>
                    <h2 className={styles.relatedTitle}>Вам так же может быть интересно</h2>
                    <div className={styles.relatedGrid}>
                        {relatedProducts.slice(0, 4).map((item) => (
                            <div key={item.id} className={styles.relatedCard}>
                                <div className={styles.relatedImagePlaceholder}>
                                    <span className={styles.relatedSkuText}>{item.sku}</span>
                                </div>
                                <h3 className={styles.relatedItemTitle}>{item.name}</h3>
                                <div className={styles.relatedDetails}>
                                    <div className={styles.relatedDetailRow}>
                                        <span className={styles.relatedLabel}>Бренд</span>
                                        <span className={styles.relatedValue}>{item.brand}</span>
                                    </div>
                                    <div className={styles.relatedDetailRow}>
                                        <span className={styles.relatedLabel}>Цена:</span>
                                            <span className={styles.relatedPriceValue}>{displayPrice(item.price)}</span>
                                    </div>
                                </div>
                                <div className={styles.relatedCartWrapper}>
                                    <ProductAddToCart
                                        props_count={item.count || 999}
                                        productId={item.id}
                                        productSku={item.sku}
                                        cartAuthenticated={cartAuthenticated}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <ProductInformationSections />

            </div>

        </main>
    );
}
