import { COMPANY_PHONE, COMPANY_SOCIALS } from '@/lib/company-contacts';
import styles from './productContactStrip.module.css';

const SOCIAL_ORDER = ['max', 'whatsapp', 'telegram'];

export default function ProductContactStrip() {
  const socialsByKey = Object.fromEntries(COMPANY_SOCIALS.map((social) => [social.key, social]));

  return (
    <div className={styles.strip}>
      <a className={styles.phoneCard} href={COMPANY_PHONE.href}>
        <span className={styles.phoneLabel}>Помощь в подборе</span>
        <span className={styles.phoneNumber}>{COMPANY_PHONE.label}</span>
      </a>
      {SOCIAL_ORDER.map((key) => {
        const social = socialsByKey[key];
        if (!social) return null;
        return (
          <a
            key={social.key}
            className={`${styles.socialButton} ${styles[social.key]}`}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.label}
            title={social.label}
          >
            <img src={social.icon} alt="" />
          </a>
        );
      })}
    </div>
  );
}
