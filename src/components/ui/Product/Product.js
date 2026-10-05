'use client'

import Link from 'next/link';
import SafeImage from "@/components/ui/SafeImage/SafeImage";
import ProductAddToCart from "@/components/ui/ProductAddToCart/ProductAddToCart";
import { useCallback, useEffect, useRef, useState } from 'react';
import Feedback from "@/components/ui/Feedback/Feedback";
import ProductInformationSections from "@/components/ui/Product/ProductInformationSections";
import ProductContactStrip from "@/components/ui/ProductContactStrip/ProductContactStrip";
import brandsData from "@/json/brands.json";
import styles from "./product.module.css";

const BRAND_SLUGS = new Set(brandsData.map((item) => item.slug));

export function ProductHelpButton({
    title = 'Помощь в подборе',
    subtitle = 'Оставьте заявку, и мы поможем подобрать нужную запчасть',
    formType = 'selection',
    triggerLabel = 'Помощь в подборе',
    className,
    showAvatar = true,
}) {
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
            <button type="button" className={className || styles.helpButton} onClick={() => dialogRef.current?.showModal()}>
                <span>{triggerLabel}</span>
                {showAvatar && <img src="/images/btn-avatar.png" alt="Менеджер" className={styles.managerAvatar} />}
            </button>
            <dialog ref={dialogRef} className={styles.modalDialog} onClick={handleDialogClick}>
                <div className={styles.modalWrapper}>
                    <Feedback title={title} subtitle={subtitle} formType={formType} modal />
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

export default function Product({ product = {}, cartAuthenticated = false, relatedProducts = [] }) {
    const relatedScrollRef = useRef(null);
    const [relatedScrollState, setRelatedScrollState] = useState({ atStart: true, atEnd: true });
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

    const syncRelatedScrollState = useCallback(() => {
        const scroller = relatedScrollRef.current;
        if (!scroller) return;
        const maxScroll = Math.max(0, scroller.scrollWidth - scroller.clientWidth);
        setRelatedScrollState({
            atStart: scroller.scrollLeft <= 1,
            atEnd: scroller.scrollLeft >= maxScroll - 1,
        });
    }, []);

    useEffect(() => {
        const scroller = relatedScrollRef.current;
        if (!scroller) return undefined;
        syncRelatedScrollState();
        window.addEventListener('resize', syncRelatedScrollState);
        return () => {
            window.removeEventListener('resize', syncRelatedScrollState);
        };
    }, [relatedProducts.length, syncRelatedScrollState]);

    const scrollRelated = (direction) => {
        const scroller = relatedScrollRef.current;
        if (!scroller) return;
        const firstCard = scroller.querySelector('[data-related-card]');
        const cardWidth = firstCard?.getBoundingClientRect().width || scroller.clientWidth / 2;
        const gap = Number.parseFloat(window.getComputedStyle(scroller).columnGap) || 0;
        scroller.scrollBy({ left: direction * (cardWidth + gap), behavior: 'smooth' });
    };

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
                            <span className={styles.imageSkuBadge}>{productSku}</span>
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
                                        <span className={`${styles.specName} ${styles.mobileMediumText}`}>Бренд</span>
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
                                        <span className={`${styles.specName} ${styles.mobileMediumText}`}>Категория</span>
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
                        
                        {/* Цена */}
                        <div className={`${styles.infoRow} ${styles.priceInfoRow}`}>
                            <span className={styles.priceLabel}>Цена:</span>
                            <span className={styles.priceValue}>{priceDisplay}</span>
                        </div>

                        {!cartAuthenticated && (
                            <div className={styles.loginPriceHint}>
                                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                                    <path d="M3.5 5.5h11l6 6-8 8-9-9v-5Z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
                                    <circle cx="8" cy="10" r="1.2" fill="currentColor" />
                                    <path d="m11 15 4-4m-.1 0h.1m-4.1 4h.1" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                                </svg>
                                <p>
                                    <Link href="/auth/account">Войдите в личный кабинет,</Link>{' '}
                                    чтобы получить более выгодные цены
                                </p>
                            </div>
                        )}

                        {/* Сроки доставки */}
                        <div className={`${styles.infoRow} ${styles.infoRowDivider}`}>
                            <span className={styles.infoLabel}>Сроки доставки:</span>
                            <span className={styles.infoValue}>{deliveryLabel}</span>
                        </div>

                        {/* Кнопки действий */}
                        <div className={styles.actionsContainer}>
                            {/* Кнопка "Добавить в корзину" */}
                            <div className={styles.cartBtnWrapper}>
                                <ProductAddToCart
                                    props_count={999}
                                    productId={product.id || 1}
                                    productSku={productSku}
                                    cartAuthenticated={cartAuthenticated}
                                />
                            </div>

                            {/* Кнопка помощи сохраняется на desktop/tablet */}
                            <div className={styles.desktopHelpButton}>
                                <ProductHelpButton />
                            </div>
                        </div>

                        <div className={styles.mobileProductContactStrip}>
                            <ProductContactStrip />
                        </div>

                        {/* Способы получения */}
                        <div className={styles.deliveryMethodsSection}>
                            <p className={styles.deliveryMethodsTitle}>Способы получения:</p>
                            <ul className={styles.deliveryMethodsList}>
                                <li>
                                    <span className={styles.mobileMediumText}>
                                        • Самовывоз <a href="#map" className={styles.addressLink}>г.Люберцы, ул. Каскадная 20к2, п.1.</a>
                                    </span>
                                </li>
                                <li>
                                    <span className={styles.mobileMediumText}>• Доставка ТК по всей России</span>
                                </li>
                            </ul>
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
                    <div className={styles.relatedHeader}>
                        <h2 className={styles.relatedTitle}>Вам так же может <span className={styles.sectionHeadingNoWrap}>быть интересно</span></h2>
                        <div className={styles.relatedControls}>
                            <button type="button" className={styles.relatedArrow} onClick={() => scrollRelated(-1)} disabled={relatedScrollState.atStart} aria-label="Прокрутить рекомендации влево" aria-controls="related-products-list">←</button>
                            <button type="button" className={styles.relatedArrow} onClick={() => scrollRelated(1)} disabled={relatedScrollState.atEnd} aria-label="Прокрутить рекомендации вправо" aria-controls="related-products-list">→</button>
                        </div>
                    </div>
                    <div id="related-products-list" ref={relatedScrollRef} onScroll={syncRelatedScrollState} className={styles.relatedGrid}>
                        {relatedProducts.slice(0, 8).map((item) => (
                            <div key={item.id || item.sku} data-related-card className={styles.relatedCard}>
                                <Link href={`/catalog/${encodeURIComponent(item.sku)}`} className={styles.relatedImagePlaceholder}>
                                    {item.image_url || item.image_path ? (
                                        <SafeImage
                                            src={item.image_url || item.image_path}
                                            alt={item.name || item.title || item.sku}
                                            className={styles.relatedProductImage}
                                        />
                                    ) : (
                                        <span className={styles.relatedSkuText}>{item.sku}</span>
                                    )}
                                </Link>
                                <Link href={`/catalog/${encodeURIComponent(item.sku)}`} className={styles.relatedItemLink}>
                                    <h3 className={styles.relatedItemTitle}>{item.name || item.title || item.sku}</h3>
                                </Link>
                                <div className={styles.relatedDetails}>
                                    <div className={styles.relatedDetailRow}>
                                        <span className={styles.relatedLabel}>Бренд</span>
                                        <span className={styles.relatedValue}>{item.brand_name || item.brand || '—'}</span>
                                    </div>
                                    <div className={styles.relatedDetailRow}>
                                        <span className={styles.relatedLabel}>Цена:</span>
                                        <span className={styles.relatedPriceValue}>{displayPrice(item.price)}</span>
                                    </div>
                                </div>
                                <div className={styles.relatedCartWrapper}>
                                    <ProductAddToCart
                                        props_count={item.count || item.quantity || 999}
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
