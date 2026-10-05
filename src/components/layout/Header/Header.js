'use client'
import styles from "./header.module.css";
import Image from "next/image";
import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import HeaderSearch from "../../ui/Search/HeaderSearch";
import Feedback from "@/components/ui/Feedback/Feedback";
import { apiGetCart } from "@/lib/cart-api";
import { COMPANY_PHONE, COMPANY_SOCIALS } from "@/lib/company-contacts";

const topNavLinks = [
  { title: "Каталог запчастей", href: "/catalog" },
  { title: "Двигатели и блоки", href: "/engines" },
  { title: "Оплата и доставка", href: "/oplata-i-dostavka" },
  { title: "О компании", href: "/about" },
  { title: "Гарантия и оплата", href: "/garantii-i-vozvrat" },
  { title: "Контакты", href: "/contacts" },
];

export default function Header() {
  const pathname = usePathname();
  const [burgerActive, setBurgerActive] = useState(false);
  const [cartCount, setCartCount] = useState(0);
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

  useEffect(() => {
    let active = true;
    const updateCartCount = async (event) => {
      try {
        const data = event?.detail || await apiGetCart();
        if (!active) return;
        const items = Array.isArray(data?.i) ? data.i : [];
        setCartCount(items.reduce((total, item) => total + (Number(item?.[1]) || 0), 0));
      } catch {
        if (active) setCartCount(0);
      }
    };
    void updateCartCount();
    window.addEventListener('cart-updated', updateCartCount);
    window.addEventListener('catalog-auth-refresh', updateCartCount);
    return () => {
      active = false;
      window.removeEventListener('cart-updated', updateCartCount);
      window.removeEventListener('catalog-auth-refresh', updateCartCount);
    };
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
              <Link
                key={idx}
                href={link.href}
                className={`${styles.topNavLink} ${link.href === "/engines" ? styles.enginesNavLink : ""}`}
              >
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
              <a href={COMPANY_PHONE.href} className={styles.phoneLink}>
                {COMPANY_PHONE.label}
              </a>
              <button className={styles.callbackBtn} onClick={openModal}>
                Заказать звонок
              </button>
            </div>

            <div className={styles.messengersRow}>
              {COMPANY_SOCIALS.map((social) => (
                <a key={social.key} href={social.href} target="_blank" rel="noopener noreferrer" className={styles.messengerLink} title={social.contact ? `${social.label}: ${social.contact}` : social.label} aria-label={social.contact ? `${social.label}: ${social.contact}` : social.label}>
                  <img src={social.icon} alt="" className={styles.messengerIcon} />
                </a>
              ))}
            </div>
          </div>

          <div className={styles.actionsGroup}>
            <Link href="/auth/account" prefetch={false} className={styles.accountBtn} aria-label="Личный кабинет">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </Link>

            <Link href="/cart" prefetch={false} className={styles.cartBtn}>
              <span>Корзина</span>
              {cartCount > 0 && <span className={styles.cartBadge}>{cartCount}</span>}
            </Link>
          </div>
        </div>
      </div>

      {/* --- MOBILE ONLY HEADER (Visible for screens <= 768px) --- */}
      <div className={styles.mobileHeader}>
        {/* Mobile Top Row */}
        <div className={styles.mobileTopRow}>
          <div className={styles.mobilePhoneGroup}>
            <a href={COMPANY_PHONE.href} className={styles.mobilePhoneLink}>
              {COMPANY_PHONE.label}
            </a>
            <div className={styles.mobileOnlineBadge}>
              Сейчас онлайн <span className={styles.mobileOnlineDot}>•</span>
            </div>
          </div>

          <div className={styles.mobileMessengersRow}>
            {COMPANY_SOCIALS.map((social) => (
              <a key={social.key} href={social.href} target="_blank" rel="noopener noreferrer" className={styles.mobileMessengerLink} title={social.contact ? `${social.label}: ${social.contact}` : social.label} aria-label={social.contact ? `${social.label}: ${social.contact}` : social.label}>
                <img src={social.icon} alt="" className={styles.mobileMessengerIcon} />
              </a>
            ))}
          </div>
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
            <Link href="/auth/account" prefetch={false} className={styles.mobileAccountBtn} aria-label="Личный кабинет">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#B19448" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </Link>

            <Link href="/cart" prefetch={false} className={styles.mobileCartBtn} aria-label="Корзина">
              <span>Корзина</span>
              {cartCount > 0 && <span className={styles.cartBadge}>{cartCount}</span>}
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
                <a href={COMPANY_PHONE.href} className={styles.drawerPhone}>{COMPANY_PHONE.label}</a>
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
          <Feedback
            title="Заказать звонок"
            subtitle="Оставьте заявку, и мы свяжемся с Вами в течение 10 минут"
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
    </header>
  );
}
