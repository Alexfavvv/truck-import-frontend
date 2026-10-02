"use client";
import { useState, useEffect, useCallback } from "react";
import { apiGetCart, apiPostCart, cartRowKeyMatchesProduct, ensureAuthenticatedForCart } from '@/lib/cart-api';
import CartAuthChoiceModal from '@/components/ui/CartAuthChoiceModal/CartAuthChoiceModal';
import styles from "./productaddtocart.module.css";

function applyCartPayload(data, productId, productSku, setCount) {
  const items = Array.isArray(data?.i) ? data.i : [];
  const currentCount =
    items.find((x) => cartRowKeyMatchesProduct(x[0], productId, productSku))?.[1] || 0;
  setCount(currentCount);
}

export default function ProductAddToCartClient({
  productId,
  productSku,
}) {
  const [count, setCount] = useState(0);
  const [adding, setAdding] = useState(false);
  const [authChoiceOpen, setAuthChoiceOpen] = useState(false);

  const fetchCart = useCallback(async () => {
    try {
      const data = await apiGetCart();
      applyCartPayload(data, productId, productSku, setCount);
    } catch (error) {
      console.error('Ошибка загрузки корзины:', error);
    }
  }, [productId, productSku]);

  useEffect(() => {
    void fetchCart();
  }, [fetchCart]);

  useEffect(() => {
    const onRefresh = () => {
      void fetchCart();
    };
    const onCartUpdated = (event) => {
      if (Array.isArray(event.detail?.i)) applyCartPayload(event.detail, productId, productSku, setCount);
      else void fetchCart();
    };
    window.addEventListener('catalog-auth-refresh', onRefresh);
    window.addEventListener('cart-updated', onCartUpdated);
    return () => {
      window.removeEventListener('catalog-auth-refresh', onRefresh);
      window.removeEventListener('cart-updated', onCartUpdated);
    };
  }, [fetchCart, productId, productSku]);

  const handleAdd = useCallback(async () => {
    if (adding || count > 0) return;
    const ok = await ensureAuthenticatedForCart();
    if (!ok) {
      setAuthChoiceOpen(true);
      await fetchCart();
      return;
    }
    setAdding(true);
    try {
      const data = await apiPostCart({ action: 'set', productId, quantity: 1 });
      applyCartPayload(data, productId, productSku, setCount);
    } catch (error) {
      if (error?.status === 401) {
        setAuthChoiceOpen(true);
        await fetchCart();
        return;
      }
      console.error('Ошибка обновления корзины:', error);
    } finally {
      setAdding(false);
    }
  }, [adding, count, productId, productSku, fetchCart]);

  return (
    <>
      <CartAuthChoiceModal open={authChoiceOpen} onClose={() => setAuthChoiceOpen(false)} />
      <div className={styles.cart__button}>
        {count > 0 ? (
          <button type="button" className={`${styles.cart__button_enabled} ${styles.cart__button_added}`} disabled>
            Товар в корзине <span className={styles.cart__check} aria-hidden="true">✓</span>
          </button>
        ) : (
          <button
            type="button"
            className={styles.cart__button_enabled}
            aria-label={`Добавить ${productSku} в корзину`}
            onClick={() => void handleAdd()}
            disabled={adding}
          >
            Добавить в корзину
          </button>
        )}
      </div>
    </>
  );
}
