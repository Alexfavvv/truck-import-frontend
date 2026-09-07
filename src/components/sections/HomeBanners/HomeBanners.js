'use client'

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import SafeImage from '@/components/ui/SafeImage/SafeImage';
import Feedback from '@/components/ui/Feedback/Feedback';
import styles from '@/app/home.module.css';
import headerStyles from '@/components/layout/Header/header.module.css';

export default function HomeBanners({ initialData }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const dialogRef = useRef(null);
  const heroGridRef = useRef(null);

  const openModal = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsModalOpen(true);
    dialogRef.current?.showModal();
  };

  const closeModal = () => {
    dialogRef.current?.close();
    setIsModalOpen(false);
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

  const handleScroll = () => {
    if (!heroGridRef.current) return;
    const { scrollLeft, clientWidth } = heroGridRef.current;
    if (clientWidth > 0) {
      const index = Math.round(scrollLeft / clientWidth);
      const clampedIndex = Math.min(Math.max(index, 0), 2);
      setActiveSlide(clampedIndex);
    }
  };

  const scrollToSlide = (index) => {
    if (!heroGridRef.current) return;
    const items = heroGridRef.current.children;
    // item 0 is heroLeft, item 1 is heroRight (which holds goldCard and darkManagerCard on desktop, but on mobile/tablet they flex out)
    // Actually on mobile heroRight display is contents, or we calculate scroll offset
    const cardWidth = heroGridRef.current.scrollWidth / 3;
    heroGridRef.current.scrollTo({
      left: index * cardWidth,
      behavior: 'smooth'
    });
    setActiveSlide(index);
  };

  const banners = initialData?.banners || [];
  const b1 = banners.find(b => b.id === 1) || { id: 1, link_type: 'callback' };
  const b2 = banners.find(b => b.id === 2) || { id: 2, link_type: 'link', link_url: '/catalog' };
  const b3 = banners.find(b => b.id === 3) || { id: 3, link_type: 'link', link_url: '/contacts' };

  const renderBanner = (banner, fallbackContent, className) => {
    const hasImage = !!(banner.image_pc || banner.image_tablet || banner.image_mobile);

    const content = hasImage ? (
      <picture className={styles.bannerPicture}>
        {banner.image_mobile && <source media="(max-width: 480px)" srcSet={banner.image_mobile} />}
        {banner.image_tablet && <source media="(max-width: 1024px)" srcSet={banner.image_tablet} />}
        <img
          src={banner.image_pc || banner.image_tablet || banner.image_mobile}
          alt={banner.name || "Banner"}
          className={styles.bannerImage}
        />
      </picture>
    ) : (
      fallbackContent
    );

    const cardStyle = hasImage ? { padding: 0, cursor: 'pointer', backgroundImage: 'none' } : {};

    if (banner.link_type === 'callback') {
      return (
        <div 
          className={className} 
          style={cardStyle} 
          onClick={(e) => openModal(e)}
        >
          {content}
        </div>
      );
    }

    if (banner.link_url) {
      return (
        <Link 
          href={banner.link_url} 
          className={className} 
          style={cardStyle}
        >
          {content}
        </Link>
      );
    }

    return (
      <div 
        className={className} 
        style={cardStyle}
      >
        {content}
      </div>
    );
  };

  // Default Fallbacks matching original designs
  const b1Fallback = (
    <>
      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>
          Прямые поставки новых, оригинальных запчастей для грузовых авто
        </h1>

        {/* Буллиты в виде белых плашек */}
        <div className={styles.heroPills}>
          <div className={styles.heroPill}>
            <span className={styles.pillCheck}>
              <Image src="/images/arrow-union.svg" alt="галочка" width={12} height={12} />
            </span>
            <span>Только оригиналы <strong>с официальной гарантией</strong></span>
          </div>

          <div className={styles.heroPill}>
            <span className={styles.pillCheck}>
              <Image src="/images/arrow-union.svg" alt="галочка" width={12} height={12} />
            </span>
            <span><strong>На 20% ниже</strong>, чем у конкурентов</span>
          </div>

          <div className={styles.heroPill}>
            <span className={styles.pillCheck}>
              <Image src="/images/arrow-union.svg" alt="галочка" width={12} height={12} />
            </span>
            <span>Доставка по всему миру <strong>за 45-70 дней</strong></span>
          </div>
        </div>
      </div>

      {/* Фото грузовика */}
      <div className={styles.truckImageWrapper}>
        <SafeImage
          src="/images/hero-truck.png"
          alt="Грузовой автомобиль"
          className={styles.truckImage}
        />
      </div>
    </>
  );

  const b2Fallback = (
    <div className={styles.goldCardHeader}>
      <div>
        <h2 className={styles.goldCardTitle}>
          Цены до <span className={styles.percentBig}>30%</span><br />ниже рыночных
        </h2>
        <p className={styles.goldCardText}>
          За счет поставок напрямую от производителей
        </p>
      </div>
      <div className={styles.arrowsImgWrapper}>
        <Image
          src="/images/arrows-r.png"
          alt="Стрелки"
          width={200}
          height={200}
          style={{ objectFit: 'contain' }}
        />
      </div>
    </div>
  );

  const b3Fallback = (
    <>
      <div className={styles.managerContent}>
        <h3 className={styles.managerTitle}>
          Персональный менеджер 24/7
        </h3>
        <ul className={styles.managerList}>
          <li className={styles.managerListItem}>
            <span className={styles.managerCheck}>✓</span> Подберет запчасть
          </li>
          <li className={styles.managerListItem}>
            <span className={styles.managerCheck}>✓</span> Оформит заказ
          </li>
          <li className={styles.managerListItem}>
            <span className={styles.managerCheck}>✓</span> Сопроводит доставку
          </li>
        </ul>
      </div>

      <div className={styles.arrowsImgWrapper}>
        <Image
          src="/images/hero-manager.png"
          alt="Менеджер"
          width={120}
          height={120}
          style={{ objectFit: 'contain' }}
        />
      </div>

      <div className={styles.managerBtn}>
        Написать менеджеру
      </div>
    </>
  );

  return (
    <>
      <div className={styles.bannerSliderContainer}>
        <section 
          ref={heroGridRef} 
          className={styles.heroGrid}
          onScroll={handleScroll}
        >
          {renderBanner(b1, b1Fallback, styles.heroLeft)}
          
          <div className={styles.heroRight}>
            {renderBanner(b2, b2Fallback, styles.goldCard)}
            {renderBanner(b3, b3Fallback, styles.darkManagerCard)}
          </div>
        </section>

        {/* Пагинация точки для мобильных и планшетов */}
        <div className={styles.sliderDots}>
          {[0, 1, 2].map((idx) => (
            <button
              key={idx}
              className={`${styles.sliderDot} ${activeSlide === idx ? styles.sliderDotActive : ''}`}
              onClick={() => scrollToSlide(idx)}
              aria-label={`Слайд ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Feedback Modal Overlay */}
      <dialog
        ref={dialogRef}
        className={headerStyles.modalDialog}
        onClick={handleDialogClick}
      >
        <div className={headerStyles.modalWrapper}>
          <Feedback />
          <button className={headerStyles.modalClose} onClick={closeModal} aria-label="Закрыть">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="#FFFFFF" strokeWidth="2">
              <path d="M1 1L19 19M19 1L1 19" />
            </svg>
          </button>
        </div>
      </dialog>
    </>
  );
}
