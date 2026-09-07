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
            {brands.map((item, index) => (
                <Link href={`/brands/${item}`} key={index} className={styles.brands__link}>
                    <img
                        className={`${styles.brands__item} ${theme === 'gray' ? styles.brands__item_gray : ''}`}
                        src={`/brands/${item}.svg`}
                        alt={`${item} logo`}
                        loading="lazy"
                    />
                </Link>
            ))}
        </div>
    );
}