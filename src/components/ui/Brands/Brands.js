'use client'
import styles from "./brands.module.css";
import Link from 'next/link';

export default function Brands({
    brands = [
        "man",
        "daf",
        "mercedes",
        "scania",
        "kolbenschmidt",
        "hengst",
        "volvo"
    ],
    theme = "default",
    mobileMarquee = false
}) {
    const renderBrand = (item, index, duplicate = false) => {
        const brand = typeof item === 'string' ? { slug: item } : item;
        return (
            <Link
                href={brand.href || `/brands/${brand.slug}`}
                key={`${brand.slug || index}${duplicate ? '-duplicate' : ''}`}
                className={styles.brands__link}
                aria-hidden={duplicate ? 'true' : undefined}
                tabIndex={duplicate ? -1 : undefined}
            >
                <img
                    className={`${styles.brands__item} ${theme === 'gray' ? styles.brands__item_gray : ''}`}
                    src={`/brands/${brand.image || brand.slug}.svg`}
                    alt={duplicate ? '' : `${brand.label || brand.slug} logo`}
                    loading="lazy"
                />
                {brand.label && <span className={styles.brands__label}>{brand.label}</span>}
            </Link>
        );
    };

    return (
        mobileMarquee ? (
            <div className={`${styles.brands} ${styles.brands_marquee}`}>
                <div className={styles.brands__track}>
                    <div className={styles.brands__group}>
                        {brands.map((item, index) => renderBrand(item, index))}
                    </div>
                    <div className={styles.brands__group} aria-hidden="true">
                        {brands.map((item, index) => renderBrand(item, index, true))}
                    </div>
                </div>
            </div>
        ) : (
            <div className={styles.brands}>
                {brands.map((item, index) => renderBrand(item, index))}
            </div>
        )
    );
}
