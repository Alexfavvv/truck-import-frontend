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
    theme = "default"
}) {
    return (
        <div className={styles.brands}>
            {brands.map((item, index) => {
                const brand = typeof item === 'string' ? { slug: item } : item;
                return (
                    <Link href={brand.href || `/brands/${brand.slug}`} key={brand.slug || index} className={styles.brands__link}>
                        <img
                            className={`${styles.brands__item} ${theme === 'gray' ? styles.brands__item_gray : ''}`}
                            src={`/brands/${brand.image || brand.slug}.svg`}
                            alt={`${brand.label || brand.slug} logo`}
                            loading="lazy"
                        />
                        {brand.label && <span className={styles.brands__label}>{brand.label}</span>}
                    </Link>
                );
            })}
        </div>
    );
}
