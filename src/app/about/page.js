'use client'

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Brands from "@/components/ui/Brands/Brands";
import HomeFaq from "@/components/sections/HomeFaq/HomeFaq";
import Feedback from "@/components/ui/Feedback/Feedback";
import styles from "./page.module.css";

export default function AboutPage() {
    const dialogRef = useRef(null);

    const closeModal = () => {
        dialogRef.current?.close();
    };

    const openModal = () => {
        dialogRef.current?.showModal();
    };

    const handleDialogClick = (e) => {
        const dialog = dialogRef.current;
        if (!dialog) return;
        const rect = dialog.getBoundingClientRect();
        const isClickOutside = (
            e.clientX < rect.left ||
            e.clientX > rect.right ||
            e.clientY < rect.top ||
            e.clientY > rect.bottom
        );
        if (isClickOutside) {
            closeModal();
        }
    };

    return (
        <main className={styles.aboutPage}>
            <div className={styles.contentWrapper}>

                {/* --- ХЛЕБНЫЕ КРОШКИ --- */}
                <nav className={styles.breadcrumbs}>
                    <Link href="/">Главная</Link>
                    <span className={styles.breadcrumbArrow}>→</span>
                    <span className={styles.breadcrumbCurrent}>О нас</span>
                </nav>

                {/* --- 1. ГЛАВНЫЙ БАННЕР HERO --- */}
                <section className={styles.heroSection}>
                    <h1 className={styles.heroTitle}>
                        Truck-import - ведущий поставщик новых, оригинальных запчастей для грузовых авто с 2001 года
                    </h1>
                    
                    <div className={styles.heroBanner}>
                        {/* Фон: about-bg.png */}
                        <img
                            src="/images/about-bg.png"
                            alt="Фон склада Truck-Import"
                            className={styles.heroBgImage}
                        />

                        {/* Менеджер: manager-full.png */}
                        <div className={styles.heroManagerWrapper}>
                            <img
                                src="/images/manager-full.png"
                                alt="Старший менеджер Андрей Никитин"
                                className={styles.heroManagerImg}
                            />
                            
                        </div>
                    </div>
                </section>

                {/* --- 2. БЛОК С БРЕНДАМИ --- */}
                <section className={styles.brandsContainer}>
                    <Brands
                        brands={["daf", "volvo", "kolbenschmidt", "hengst", "scania", "man", "mercedes"]}
                        theme="gray"
                    />
                </section>

                {/* --- 3. НАДЕЖНЫЙ ПОСТАВЩИК (ADVANTAGES) --- */}
                <section className={styles.trustSection}>
                    <div className={styles.trustGrid}>
                        {/* Левая колонка: 3 карточки */}
                        <div className={styles.trustFeatures}>

                            <h2 className={styles.trustTitle}>
                                Truck-import - ваш надежный поставщик запчастей
                            </h2>
                            
                            <div className={styles.trustCard}>
                                <h3 className={styles.trustCardTitle}>
                                    Запчасти напрямую из Европы
                                </h3>
                                <p className={styles.trustCardText}>
                                    Оригинальные запчасти для грузовых авто. Оригинальные
                                </p>
                            </div>

                            <div className={styles.trustCard}>
                                <h3 className={styles.trustCardTitle}>
                                    Гарантия на каждую запчасть
                                </h3>
                                <p className={styles.trustCardText}>
                                    Оригинальные запчасти для грузовых авто. Оригинальные
                                </p>
                            </div>

                            <div className={styles.trustCard}>
                                <h3 className={styles.trustCardTitle}>
                                    Прозрачный процесс заказа и доставки
                                </h3>
                                <p className={styles.trustCardText}>
                                    Оригинальные запчасти для грузовых авто. Оригинальные
                                </p>
                            </div>
                        </div>

                        {/* Правая колонка: 2 фото склада */}
                        <div className={styles.trustImages}>
                            <img
                                src="/images/warehouse-1.jpg"
                                alt="Склад автозапчастей 1"
                                className={styles.trustImg}
                            />
                            <img
                                src="/images/warehouse-2.jpg"
                                alt="Склад автозапчастей 2"
                                className={styles.trustImg}
                            />
                        </div>
                    </div>
                </section>

                {/* --- БЛОК 6: "ВОПРОСЫ-ОТВЕТЫ" --- */}
                <HomeFaq />

                {/* --- 5. КАРТА ДОСТАВКИ ПО РОССИИ --- */}
                <section className={styles.mapSection}>
                    {/* Контент поверх карты */}
                    <div className={styles.mapOverlay}>
                        <h2 className={styles.mapTitle}>
                            Доставляем запчасти из Европы по всей России в срок <span className={styles.mapTitleHighlight}>от 15 рабочих дней</span>
                        </h2>
                        
                        <button
                            type="button"
                            className={styles.mapCalcButton}
                            onClick={openModal}
                        >
                            Рассчитать стоимость доставки
                        </button>
                    </div>

                    {/* Фоновое изображение карты */}
                    <div className={styles.mapImageWrapper}>
                        <img
                            src="/images/about-map.png"
                            alt="Карта доставки по России"
                            className={styles.mapImg}
                        />
                    </div>
                </section>

                {/* --- 6. ОПТОВАЯ ПРОДАЖА (TEXT BLOCK) --- */}
                <section className={styles.wholesaleSection}>
                    <h2 className={styles.wholesaleTitle}>
                        Оптовая продажа запчастей для грузовиков
                    </h2>
                    
                    <div className={styles.wholesaleText}>
                        <p>
                            Оптовая продажа запчастей для грузовиков — это одно из ключевых направлений нашей деятельности. Мы приглашаем к сотрудничеству магазины грузовых автозапчастей, оптовых покупателей и других партнеров, заинтересованных во взаимовыгодном сотрудничестве. Наша компания уже много лет работает на рынке автозапчастей и зарекомендовала себя как надежного партнера для клиентов, которые ценят качество, низкую цену и оперативность в отправке товара.
                        </p>
                        <p>
                            У нас представлен большой ассортимент оригинальных запчастей и их аналогов, что позволяет удовлетворить потребности даже самых требовательных клиентов. В наличии запчасти различных брендов, включая системы тормозной безопасности, задние фонари, комплектующие для кабины и многое другое. Если вы хотите заказать товар оптом, просто укажите номер телефона или оставьте запрос на сайте — отдел оптовых продаж свяжется с вами, чтобы обсудить условиями сотрудничества.
                        </p>
                        <p>
                            Мы предлагаем уникальные возможности для тех, кто ищет качественные запчасти оптом в Москве и по всей РФ. Наша база данных содержит информацию о наличии товара, его кодах и характеристиках, что делает поиск удобным и быстрым. Мы регулярно обновляем прайс-лист, чтобы предоставить актуальные данные о ценах и новых поступлениях.
                        </p>
                        <p>
                            Предлагаем не только стандартный набор грузовых запчастей, но и редкие позиции, которые сложно найти в фирменных магазинах или у других оптовых компаний. Это позволяет нам быть лидерами в своей нише и поддерживать большую клиентскую базу. Каждый клиент может рассчитывать на индивидуальный подход, официальные сертификаты качества и плодотворного сотрудничества.
                        </p>
                    </div>
                </section>

            </div>

            {/* Модальное окно */}
            <dialog
                ref={dialogRef}
                className={styles.modalDialog}
                onClick={handleDialogClick}
            >
                <div className={styles.modalWrapper}>
                    <Feedback
                        title="Рассчитать стоимость доставки"
                        subtitle="Оставьте контакт, и мы поможем рассчитать стоимость доставки"
                        formType="selection"
                        modal
                    />
                    <button className={styles.modalClose} onClick={closeModal} aria-label="Закрыть">
                        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="#FFFFFF" strokeWidth="2">
                            <path d="M1 1L19 19M19 1L1 19" />
                        </svg>
                    </button>
                </div>
            </dialog>
        </main>
    );
}
