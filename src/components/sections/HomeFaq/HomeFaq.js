'use client'
import React, { useState } from 'react';
import Image from 'next/image';
import styles from './HomeFaq.module.css';

const FAQ_DATA = [
  {
    q: "В какое время осуществляется доставка?",
    a: "В Санкт-Петербурге и регионах РФ доставка выполняется ежедневно с 08:00 до 23:00. Можно выбрать доставку либо в течение дня, либо в двухчасовой интервал. А также в точное время вплоть до конкретного часа."
  },
  {
    q: "Почему вам можно доверять?",
    a: "Наша компания уже много лет работает на рынке автозапчастей и поставляет только оригинальные запчасти с официальной гарантией от ведущих европейских производителей."
  },
  {
    q: "Как оформить заказ на доставку запчастей?",
    a: "Вы можете оформить заказ онлайн через каталог на сайте, либо обратиться к персональному менеджеру, который подберет необходимые артикулы и оформит заявку."
  },
  {
    q: "Сколько стоит доставка?",
    a: "Стоимость доставки рассчитывается индивидуально в зависимости от объема заказа, веса запчастей и региона доставки. При крупных оптовых заказах доставка бесплатная."
  },
  {
    q: "Какие способы и условия оплаты?",
    a: "Мы работаем по безналичному расчету с НДС и без НДС, а также принимаем оплату банковскими картами и через личный кабинет пользователя."
  }
];

export default function HomeFaq() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleAccordion = (idx) => {
    setOpenIndex(openIndex === idx ? -1 : idx);
  };

  return (
    <section className={styles.faqSection}>
      <h2 className={styles.faqTitle}>
        Вопросы-ответы
      </h2>
      <div className={styles.faqGrid}>
        {FAQ_DATA.map((item, idx) => {
          const isOpen = openIndex === idx;

          return (
            <div key={idx} className={styles.faqItem}>
              {/* Шапка вопроса (одинаковой высоты для всех) */}
              <div
                onClick={() => toggleAccordion(idx)}
                className={`${styles.faqTrigger} ${isOpen ? styles.faqTriggerOpen : ''}`}
              >
                <h3 className={styles.faqQuestion}>
                  {item.q}
                </h3>
                <span
                  className={styles.faqArrow}
                  style={{ transform: isOpen ? 'rotate(0deg)' : 'rotate(180deg)' }}
                >
                  <Image
                    src="/images/arrow-up-union.svg"
                    alt="Стрелка"
                    width={18}
                    height={18}
                    style={{
                      filter: isOpen ? 'brightness(0) invert(1)' : 'none'
                    }}
                  />
                </span>
              </div>

              {/* Текст ответа под темной шапкой на светлом фоне */}
              {isOpen && (
                <div className={styles.faqAnswer}>
                  <p className={styles.faqAnswerText}>
                    {item.a}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
