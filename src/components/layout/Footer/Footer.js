'use client'
import MadeBy from "@/components/ui/MadeBy/MadeBy";
import styles from "./footer.module.css";
import Image from "next/image";
import Link from 'next/link'
import headerStyles from "@/components/layout/Header/header.module.css";
import { COMPANY_PHONE, COMPANY_SOCIALS } from "@/lib/company-contacts";

export default function Footer() {

  return (
    <footer className={styles.footer}>
        <Link className="logo" href="/">
            {/* <img src="/img/logo.svg" alt="logo"> */}
            <Image
              src="/logo.svg"
              alt="logo"
              width={500} // дефолтное значение (для SSR)
              height={300}
              style={{
                width: 'calc(291vw/14.4)',
                height: 'auto',
              }}
            />
        </Link>
        <div className={`${styles.footer__item} ${styles.footer__item_top}`}>
            <div className={styles.phones}>
                <Link className={styles.phones__item} href={COMPANY_PHONE.href}>{COMPANY_PHONE.label}</Link>
                <div className={styles.footer__messengers}>
                    {COMPANY_SOCIALS.map((social) => (
                        <a
                            key={social.key}
                            className={`${headerStyles.messengerLink} ${headerStyles.mobileMessengerLink}`}
                            href={social.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            title={social.contact ? `${social.label}: ${social.contact}` : social.label}
                            aria-label={social.contact ? `${social.label}: ${social.contact}` : social.label}
                        >
                            <img className={`${headerStyles.messengerIcon} ${headerStyles.mobileMessengerIcon}`} src={social.icon} alt="" />
                        </a>
                    ))}
                </div>
            </div>
            <div className={styles.footer__nav}>
                <ul className={styles.footer__menu}>
                    <li className={styles.footer__menu_item}>
                        <Link
                            className={styles.footer__menu_link}
                            href="/oplata-i-dostavka"
                            aria-current="page"
                        >
                            Оплата и доставка
                        </Link>
                    </li>
                    <li className={styles.footer__menu_item}>
                        <Link
                            className={styles.footer__menu_link}
                            href="/garantii-i-vozvrat"
                            aria-current="page"
                        >
                            Гарантия и возврат
                        </Link>
                    </li>
                    <li className={styles.footer__menu_item}>
                        <Link
                            className={styles.footer__menu_link}
                            href="/catalog"
                            aria-current="page"
                        >
                            Каталог запчастей
                        </Link>
                    </li>
                    {/* <li className={styles.footer__menu_item}>
                        <Link
                            className={styles.footer__menu_link}
                            href="#"
                            aria-current="page"
                        >
                            О проекте
                        </Link>
                    </li> */}
                    <li className={styles.footer__menu_item}>
                        <Link
                            className={styles.footer__menu_link}
                            href="/blog"
                            aria-current="page"
                        >
                            Новости
                        </Link>
                    </li>
                    <li className={styles.footer__menu_item}>
                        <Link
                            className={styles.footer__menu_link}
                            href="/contacts"
                            aria-current="page"
                        >
                            Контакты
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
        <div className={`${styles.footer__item} ${styles.footer__item_bottom}`}>
            <div className={styles.footer__inner}>
                <div className={styles.footer__contacts}>
                    <Link className={styles.footer__contact} href="mailto:import-aa@mail.ru">
                        {/* <img src="/img/mail.svg" alt="mail"> */}
                        <Image
                              src="/mail.svg"
                              alt="mail"
                              width={500} // дефолтное значение (для SSR)
                              height={300}
                              style={{
                                width: 'calc(32vw/14.4)',
                                height: 'calc(32vw/14.4)',
                              }}
                            />
                        import-aa@mail.ru
                        </Link>
                    <Link className={styles.footer__contact} href="#">
                        {/* <img src="/img/location.svg" alt="location"> */}
                        <Image
                              src="/location.svg"
                              alt="location"
                              width={500} // дефолтное значение (для SSR)
                              height={300}
                              style={{
                                width: 'calc(32vw/14.4)',
                                height: 'calc(32vw/14.4)',
                              }}
                            />
                        111625, Москва, Каскадная улица, 20к2, пом.1
                    </Link>
                </div>
            </div>
            {/* {process.env.SITE_URL === 'https://truck-import.ru' && ( */}
              {/* <MadeBy/> */}
            {/* )} */}
            <Link className={styles.footer__privacy} href="/privacy">Политика<br/>конфиденциальности</Link>

        </div>
    </footer>
  )
}
