'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from './productaddtocart.module.css';
import CartAuthChoiceModal from '@/components/ui/CartAuthChoiceModal/CartAuthChoiceModal';
import { ensureAuthenticatedForCart } from '@/lib/cart-api';

/**
 * Гость (SSR): по клику — `GET /api/auth/session` → при cookie проверка ЛК `auth/status`;
 * если вход живой — refresh RSC (покажется счётчик корзины), иначе модалка SSO.
 */
export default function GuestAddToCartTrigger({ props_count = 0, productSku }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleClick = async () => {
    if (await ensureAuthenticatedForCart()) {
      router.refresh();
      return;
    }
    setOpen(true);
  };

  return (
    <>
      <CartAuthChoiceModal open={open} onClose={() => setOpen(false)} />
      <div className={`${styles.cart__button} ${styles.cart__button_add}`}>
        {props_count > 0 ? (
          <button
            type="button"
            className={styles.cart__button_enabled}
            aria-label={`Добавить ${productSku} в корзину`}
            onClick={() => void handleClick()}
          >
            Добавить в корзину
          </button>
        ) : (
          <button type="button" className={styles.cart__button_disabled} disabled aria-label="Товара нет в наличии">
            Нет в наличии
          </button>
        )}
      </div>
    </>
  );
}
