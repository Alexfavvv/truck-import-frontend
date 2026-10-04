'use client'

import { useEffect, useId, useRef, useState } from 'react';
import Link from 'next/link';
import styles from './feedback.module.css';

const CONTACT_METHODS = [
  { value: 'phone', label: 'Звонок по телефону', placeholder: '+7 (999) 999-99-99', type: 'tel' },
  { value: 'telegram', label: 'Telegram', placeholder: 'Телефон или @username', type: 'text' },
  { value: 'max', label: 'MAX', placeholder: 'Номер, привязанный к MAX', type: 'tel' },
];

function MethodIcon({ method, className }) {
  if (method === 'telegram' || method === 'max') {
    return <img className={className} src={method === 'telegram' ? '/images/icon-tg.png' : '/images/icon-max.png'} alt="" />;
  }

  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6.6 3.5 9.2 3c.7-.1 1.3.3 1.5 1l1 3.2c.2.6 0 1.2-.5 1.6l-1.6 1.3a14 14 0 0 0 5.3 5.3l1.3-1.6c.4-.5 1-.7 1.6-.5l3.2 1c.7.2 1.1.8 1 1.5l-.5 2.6c-.1.7-.8 1.2-1.5 1.2C10.6 19.6 4.4 13.4 4.4 5c0-.7.5-1.4 1.2-1.5Z" fill="currentColor" />
    </svg>
  );
}

export default function Feedback({
  title = 'Остались вопросы?',
  subtitle = 'Оставьте заявку, и мы свяжемся с Вами в ближайшее время',
  formType = 'selection',
  modal = false,
}) {
  const [contactMethod, setContactMethod] = useState('phone');
  const [contactValue, setContactValue] = useState('');
  const [agreeToPrivacy, setAgreeToPrivacy] = useState(true);
  const [methodOpen, setMethodOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState('');
  const methodRef = useRef(null);
  const feedbackRef = useRef(null);
  const fieldId = useId();
  const activeMethod = CONTACT_METHODS.find((method) => method.value === contactMethod) || CONTACT_METHODS[0];
  const splitAt = formType === 'price' || subtitle === 'Оставьте заявку, и мы свяжемся с Вами в течение 10 минут'
    ? 'с Вами'
    : title === 'Помощь в подборе'
      ? 'подобрать'
      : null;
  const splitIndex = splitAt ? subtitle.indexOf(splitAt) : -1;

  useEffect(() => {
    const onPointerDown = (event) => {
      if (methodRef.current && !methodRef.current.contains(event.target)) setMethodOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, []);

  useEffect(() => {
    if (!modal) return undefined;
    const dialog = feedbackRef.current?.closest('dialog');
    if (!dialog) return undefined;
    dialog.classList.add('feedbackDialog');
    return () => dialog.classList.remove('feedbackDialog');
  }, [modal]);

  useEffect(() => {
    if (!status) return undefined;
    const timeout = setTimeout(() => setStatus(''), 5000);
    return () => clearTimeout(timeout);
  }, [status]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!agreeToPrivacy || !contactValue.trim()) return;
    setSubmitting(true);
    setStatus('');

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contact_method: contactMethod,
          contact_value: contactValue.trim(),
          form_type: formType === 'price' ? 'price' : 'selection',
          agreeToPrivacy,
          pageUrl: window.location.href,
        }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || 'Не удалось отправить заявку');
      setStatus('success');
      setContactValue('');
      setAgreeToPrivacy(true);
    } catch (error) {
      console.error('Ошибка отправки заявки:', error);
      setStatus('error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section ref={feedbackRef} className={`${styles.feedback} ${modal ? styles.feedback_modal : ''}`} aria-label={title}>
      <h2 className={styles.feedback__title}>{title}</h2>
      <p className={styles.feedback__subtitle}>
        {splitIndex > 0 ? <>{subtitle.slice(0, splitIndex).trim()}<br />{subtitle.slice(splitIndex).trim()}</> : subtitle}
      </p>

      {status ? (
        <p className={status === 'success' ? styles.successText : styles.errorText} role="status">
          {status === 'success' ? 'Спасибо! Заявка отправлена.' : 'Не удалось отправить заявку. Попробуйте ещё раз.'}
        </p>
      ) : (
        <form onSubmit={handleSubmit} className={styles.feedback__form}>
          <label className={styles.fieldLabel} htmlFor={`contact-method-${fieldId}`}>Способ связи</label>
          <div className={styles.methodSelect} ref={methodRef}>
            <button
              id={`contact-method-${fieldId}`}
              className={styles.methodSelect__trigger}
              type="button"
              aria-haspopup="listbox"
              aria-expanded={methodOpen}
              onClick={() => setMethodOpen((open) => !open)}
            >
              <MethodIcon method={contactMethod} className={styles.methodIcon} />
              <span>{activeMethod.label}</span>
              <svg className={styles.chevron} viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m3 6 5 5 5-5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
            {methodOpen && (
              <div className={styles.methodSelect__options} role="listbox" aria-label="Способ связи">
                {CONTACT_METHODS.map((method) => (
                  <button
                    key={method.value}
                    type="button"
                    role="option"
                    aria-selected={contactMethod === method.value}
                    className={styles.methodSelect__option}
                    onClick={() => { setContactMethod(method.value); setContactValue(''); setMethodOpen(false); }}
                  >
                    <MethodIcon method={method.value} className={styles.methodIcon} />
                    <span>{method.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <input
            id={`contact-value-${fieldId}`}
            className={styles.contactInput}
            aria-label="Контакт"
            type={activeMethod.type}
            name="contact_value"
            placeholder={activeMethod.placeholder}
            autoComplete={activeMethod.type === 'tel' ? 'tel' : 'off'}
            value={contactValue}
            onChange={(event) => setContactValue(event.target.value)}
            required
            disabled={submitting}
          />

          <button className={styles.submitButton} type="submit" disabled={submitting || !contactValue.trim() || !agreeToPrivacy}>
            {submitting ? 'Отправляем...' : 'Оставить заявку'}
          </button>

          <label className={styles.checkbox}>
            <input
              type="checkbox"
              name="agreeToPrivacy"
              checked={agreeToPrivacy}
              onChange={(event) => setAgreeToPrivacy(event.target.checked)}
              required
              className={styles.checkbox__input}
            />
            <span className={styles.checkbox__control} />
            <span className={styles.checkbox__label}>
              Я даю согласие на обработку своих персональных данных, согласно <Link href="/privacy">политике конфиденциальности</Link>
            </span>
          </label>

          <div className={styles.quickContacts}>
            <span>Или свяжитесь с нами по тел: <a href="tel:+74957403306">+7 (495) 740-33-06</a></span>
            <span>либо напишите в <a href="https://t.me/truck_import" target="_blank" rel="noopener noreferrer"><img src="/images/icon-tg.png" alt="" /> Telegram</a>, <a href="https://max.mail.ru" target="_blank" rel="noopener noreferrer"><img src="/images/icon-max.png" alt="" /> MAX</a></span>
          </div>
        </form>
      )}
    </section>
  );
}
