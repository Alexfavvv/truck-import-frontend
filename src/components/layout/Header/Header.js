'use client'
import styles from "./header.module.css";
import Image from "next/image";
import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import HeaderSearch from "../../ui/Search/HeaderSearch";
import Feedback from "@/components/ui/Feedback/Feedback";
import { fetchPageSettings } from "@/services/pageService";

const topNavLinks = [
  { title: "Каталог запчастей", href: "/catalog" },
  { title: "Двигатели и блоки", href: "/engines" },
  { title: "Оплата и доставка", href: "/oplata-i-dostavka" },
  { title: "О компании", href: "/about" },
  { title: "Гарантия и оплата", href: "/garantii-i-vozvrat" },
  { title: "Контакты", href: "/contacts" },
];

const DEFAULT_MESSENGERS = {
  max_link: 'https://max.mail.ru',
  whatsapp_link: 'https://wa.me/79006044614',
  telegram_link: 'https://t.me/truck_import',
};

export default function Header() {
  const pathname = usePathname();
  const [burgerActive, setBurgerActive] = useState(false);
  const dialogRef = useRef(null);
  const [messengers, setMessengers] = useState(DEFAULT_MESSENGERS);

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

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetchPageSettings('site_settings');
        if (res && res.messengers) {
          const hasLinks = Object.values(res.messengers).some(val => val && String(val).trim() !== '');
          if (hasLinks) {
            setMessengers({
              max_link: res.messengers.max_link || '',
              whatsapp_link: res.messengers.whatsapp_link || '',
              telegram_link: res.messengers.telegram_link || '',
            });
          } else {
            setMessengers(DEFAULT_MESSENGERS);
          }
        } else {
          setMessengers(DEFAULT_MESSENGERS);
        }
      } catch (err) {
        setMessengers(DEFAULT_MESSENGERS);
      }
    }
    loadSettings();
  }, []);

  useEffect(() => {
    closeModal();
    setBurgerActive(false);
  }, [pathname]);

  return (
    <header className={styles.headerContainer}>
      {/* --- DESKTOP ONLY HEADER (Visible for screens > 768px) --- */}
      <div className={styles.desktopHeader}>
        {/* Top Navigation Bar */}
        <div className={styles.topBar}>
          <nav className={styles.topNav}>
            {topNavLinks.map((link, idx) => (
              <Link key={idx} href={link.href} className={styles.topNavLink}>
                {link.title}
              </Link>
            ))}
          </nav>

          <div className={styles.topRight}>
            <div className={styles.onlineBadge}>
              Сейчас онлайн <span className={styles.onlineDot} />
            </div>
            <div className={styles.addressText}>
              Москва, Каскадная улица, 20к2, пом.1
            </div>
          </div>
        </div>

        {/* Main Header Row */}
        <div className={styles.mainHeader}>
          <Link href="/" className={styles.logoLink}>
            <Image
              src="/logo.svg"
              alt="TRUCK IMPORT"
              width={145}
              height={45}
              className={styles.logoImage}
              priority
            />
          </Link>

          <div className={styles.searchContainer}>
            <HeaderSearch />
          </div>

          <div className={styles.phoneGroup}>
            <div className={styles.phoneItem}>
              <a href="tel:+74957403306" className={styles.phoneLink}>
                +7 (495) 740-33-06
              </a>
              <button className={styles.callbackBtn} onClick={openModal}>
                Заказать звонок
              </button>
            </div>

            {Object.values(messengers).some(Boolean) && (
              <div className={styles.messengersRow}>
                {messengers.max_link && (
                  <a href={messengers.max_link} target="_blank" rel="noopener noreferrer" className={styles.messengerLink} title="MAX">
                    <img src="/images/icon-max.png" alt="MAX" className={styles.messengerIcon} />
                  </a>
                )}
                {messengers.whatsapp_link && (
                  <a href={messengers.whatsapp_link} target="_blank" rel="noopener noreferrer" className={styles.messengerLink} title="WhatsApp">
                    <img src="/images/icon-wa.png" alt="WhatsApp" className={styles.messengerIcon} />
                  </a>
                )}
                {messengers.telegram_link && (
                  <a href={messengers.telegram_link} target="_blank" rel="noopener noreferrer" className={styles.messengerLink} title="Telegram">
                    <img src="/images/icon-tg.png" alt="Telegram" className={styles.messengerIcon} />
                  </a>
                )}
              </div>
            )}
          </div>

          <div className={styles.actionsGroup}>
            <Link href="/auth/account" className={styles.accountBtn} aria-label="Личный кабинет">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </Link>

            <Link href="/cart" className={styles.cartBtn}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              <span>Корзина</span>
            </Link>
          </div>
        </div>
      </div>

      {/* --- MOBILE ONLY HEADER (Visible for screens <= 768px) --- */}
      <div className={styles.mobileHeader}>
        {/* Mobile Top Row */}
        <div className={styles.mobileTopRow}>
          <div className={styles.mobilePhoneGroup}>
            <a href="tel:+74957403306" className={styles.mobilePhoneLink}>
              +7 (495) 740-33-06
            </a>
            <div className={styles.mobileOnlineBadge}>
              Сейчас онлайн <span className={styles.mobileOnlineDot}>•</span>
            </div>
          </div>

          {Object.values(messengers).some(Boolean) && (
            <div className={styles.mobileMessengersRow}>
              {messengers.max_link && (
                <a href={messengers.max_link} target="_blank" rel="noopener noreferrer" className={styles.mobileMessengerLink} title="MAX">
                  <img src="/images/icon-max.png" alt="MAX" className={styles.mobileMessengerIcon} />
                </a>
              )}
              {messengers.whatsapp_link && (
                <a href={messengers.whatsapp_link} target="_blank" rel="noopener noreferrer" className={styles.mobileMessengerLink} title="WhatsApp">
                  <img src="/images/icon-wa.png" alt="WhatsApp" className={styles.mobileMessengerIcon} />
                </a>
              )}
              {messengers.telegram_link && (
                <a href={messengers.telegram_link} target="_blank" rel="noopener noreferrer" className={styles.mobileMessengerLink} title="Telegram">
                  <img src="/images/icon-tg.png" alt="Telegram" className={styles.mobileMessengerIcon} />
                </a>
              )}
            </div>
          )}
        </div>

        {/* Mobile Bottom Row */}
        <div className={styles.mobileBottomRow}>
          <div className={styles.mobileLeftGroup}>
            <button 
              className={styles.burgerBtn} 
              onClick={() => setBurgerActive(!burgerActive)}
              aria-label="Открыть меню"
            >
              <span className={styles.burgerLine}></span>
              <span className={styles.burgerLine}></span>
              <span className={styles.burgerLine}></span>
            </button>

            <Link href="/" className={styles.mobileLogoLink}>
              <Image
                src="/logo.svg"
                alt="TRUCK IMPORT"
                width={125}
                height={38}
                className={styles.mobileLogoImage}
                priority
              />
            </Link>
          </div>

          <div className={styles.mobileActionsGroup}>
            <Link href="/auth/account" className={styles.mobileAccountBtn} aria-label="Личный кабинет">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#B19448" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </Link>

            <Link href="/cart" className={styles.mobileCartBtn} aria-label="Корзина">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1A1A1A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Mobile Search Row - visible under header on all pages */}
        <div className={styles.mobileSearchRow}>
          <HeaderSearch />
        </div>
      </div>

      {/* Mobile Drawer Slide-out Navigation */}
      {burgerActive && (
        <div className={styles.drawerOverlay} onClick={() => setBurgerActive(false)}>
          <div className={styles.drawerContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.drawerHeader}>
              <span className={styles.drawerTitle}>Навигация</span>
              <button className={styles.drawerClose} onClick={() => setBurgerActive(false)} aria-label="Закрыть">
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="#FFFFFF" strokeWidth="2">
                  <path d="M1 1L19 19M19 1L1 19" />
                </svg>
              </button>
            </div>
            <nav className={styles.drawerNav}>
              {topNavLinks.map((link, idx) => (
                <Link key={idx} href={link.href} className={styles.drawerNavLink} onClick={() => setBurgerActive(false)}>
                  {link.title}
                </Link>
              ))}
            </nav>
            <div className={styles.drawerFooter}>
              <div className={styles.drawerPhoneGroup}>
                <a href="tel:+74957403306" className={styles.drawerPhone}>+7 (495) 740-33-06</a>
                <p className={styles.drawerHours}>Пн-Пт: 9:00 - 18:00</p>
              </div>
              <button className={styles.drawerCallbackBtn} onClick={() => { setBurgerActive(false); openModal(); }}>
                Заказать звонок
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Callback Modal */}
      <dialog
        ref={dialogRef}
        className={styles.modalDialog}
        onClick={handleDialogClick}
      >
        <div className={styles.modalWrapper}>
          <Feedback />
          <button className={styles.modalClose} onClick={closeModal} aria-label="Закрыть">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="#FFFFFF" strokeWidth="2">
              <path d="M1 1L19 19M19 1L1 19" />
            </svg>
          </button>
        </div>
      </dialog>
    </header>
  );
}
