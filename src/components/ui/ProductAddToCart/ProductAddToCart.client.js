"use client";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { apiGetCart, apiPostCart, cartRowKeyMatchesProduct, ensureAuthenticatedForCart } from '@/lib/cart-api';
import CartAuthChoiceModal from '@/components/ui/CartAuthChoiceModal/CartAuthChoiceModal';
import styles from "./productaddtocart.module.css";

function applyCartPayload(data, productId, productSku, setCount, setInputValue) {
  const items = Array.isArray(data?.i) ? data.i : [];
  const currentCount =
    items.find((x) => cartRowKeyMatchesProduct(x[0], productId, productSku))?.[1] || 0;
  setCount(currentCount);
  setInputValue(String(currentCount));
}

export default function ProductAddToCartClient({
  props_count = 0,
  productId,
  productSku,
}) {
  const [count, setCount] = useState(0);
  const [inputValue, setInputValue] = useState("0");
  const [authChoiceOpen, setAuthChoiceOpen] = useState(false);

  const fetchCart = useCallback(async () => {
    try {
      const data = await apiGetCart();
      applyCartPayload(data, productId, productSku, setCount, setInputValue);
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
    window.addEventListener('catalog-auth-refresh', onRefresh);
    return () => window.removeEventListener('catalog-auth-refresh', onRefresh);
  }, [fetchCart]);

  const handleCountChange = useCallback(async (newCount) => {
    const validatedCount = Math.max(0, Math.min(newCount, props_count));

    if (validatedCount > 0) {
      const ok = await ensureAuthenticatedForCart();
      if (!ok) {
        setAuthChoiceOpen(true);
        await fetchCart();
        return;
      }
    }

    try {
      const data = await apiPostCart({ action: 'set', productId, quantity: validatedCount });
      applyCartPayload(data, productId, productSku, setCount, setInputValue);
    } catch (error) {
      if (error?.status === 401) {
        if (validatedCount > 0) setAuthChoiceOpen(true);
        await fetchCart();
        return;
      }
      console.error('Ошибка обновления корзины:', error);
    }
  }, [count, productId, productSku, props_count, fetchCart]);

  const handleInputBlur = async () => {
    const numValue = parseInt(inputValue, 10) || 0;
    await handleCountChange(numValue);
  };

  const handleInputKeyDown = async (e) => {
    if (e.key === "Enter") {
      await handleInputBlur();
    }
  };

  return (
    <>
      <CartAuthChoiceModal open={authChoiceOpen} onClose={() => setAuthChoiceOpen(false)} />
      {count === 0 ? (
        <div className={`${styles.cart__button} ${styles.cart__button_add}`}>
          {props_count > 0 ? (
            <button
              type="button"
              className={styles.cart__button_enabled}
              aria-label={`Добавить ${productSku} в корзину`}
              onClick={() => void handleCountChange(1)}
            >
              Добавить в корзину
            </button>
          ) : (
            <button
              type="button"
              className={styles.cart__button_disabled}
              disabled
              aria-label="Товара нет в наличии"
            >
              Нет в наличии
            </button>
          )}
        </div>
      ) : (
        <div className={styles.cart__button}>
          <button
            type="button"
            className={styles.cart__button_enabled}
            onClick={() => void handleCountChange(count - 1)}
            aria-label="Уменьшить количество"
          >
            -
          </button>

          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onBlur={() => void handleInputBlur()}
            onKeyDown={(e) => void handleInputKeyDown(e)}
            max={props_count}
            min="0"
            className={styles.counter__input}
            aria-label={`Количество товара ${productSku}`}
          />

          <button
            type="button"
            className={styles.cart__button_enabled}
            onClick={() => void handleCountChange(count + 1)}
            disabled={count >= props_count}
            aria-label="Увеличить количество"
          >
            +
          </button>
        </div>
      )}
    </>
  );
}
