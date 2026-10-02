'use client';

import React, { useState, useEffect, Suspense, useCallback } from 'react';
import Link from 'next/link';
import styles from './productlist.module.css';
import { apiGetCart, apiPostCart, cartRowKeyMatchesProduct, ensureAuthenticatedForCart } from '@/lib/cart-api';
import CartAuthChoiceModal from '@/components/ui/CartAuthChoiceModal/CartAuthChoiceModal';

export default function ProductList({ products }) {
  const { innerWidth } = useWindowSize();
  const [cart, setCart] = useState({ i: [] });
  const [authChoiceOpen, setAuthChoiceOpen] = useState(false);

  const fetchCart = useCallback(async () => {
    const data = await apiGetCart();
    setCart({ i: Array.isArray(data.i) ? data.i : [] });
  }, []);

  useEffect(() => {
    void fetchCart();
  }, [fetchCart]);

  useEffect(() => {
    const onRefresh = () => {
      void fetchCart();
    };
    const onCartUpdated = (event) => {
      if (Array.isArray(event.detail?.i)) setCart({ i: event.detail.i });
      else void fetchCart();
    };
    window.addEventListener('catalog-auth-refresh', onRefresh);
    window.addEventListener('cart-updated', onCartUpdated);
    return () => {
      window.removeEventListener('catalog-auth-refresh', onRefresh);
      window.removeEventListener('cart-updated', onCartUpdated);
    };
  }, [fetchCart]);

  if (!innerWidth) return null;

  return (
    <>
      <CartAuthChoiceModal open={authChoiceOpen} onClose={() => setAuthChoiceOpen(false)} />
      {products.map(product => (
        <Suspense key={product.id} fallback={<p>Loading...</p>}>
          <ProductItem
            product={product}
            cart={cart}
            onNeedAuth={() => setAuthChoiceOpen(true)}
            fetchCart={fetchCart}
          />
        </Suspense>
      ))}
    </>
  );
}

function ProductItem({ product, cart, onNeedAuth, fetchCart }) {
  // количество товара берется **из актуального состояния cart**
  const currentCount =
    cart.i.find((x) => cartRowKeyMatchesProduct(x[0], product.id, product.sku))?.[1] || 0;

  const [adding, setAdding] = useState(false);
  const numericPrice = Number(String(product.price ?? '').replace(/\s/g, '').replace(',', '.'));
  const priceDisplay = Number.isFinite(numericPrice) && numericPrice > 0 ? `${product.price} ₽` : 'Цена по запросу';

  const handleAdd = async () => {
    if (adding || currentCount > 0) return;
    const ok = await ensureAuthenticatedForCart();
    if (!ok) {
      onNeedAuth?.();
      await fetchCart();
      return;
    }
    setAdding(true);
    try {
      await apiPostCart({ action: 'set', productId: product.id, quantity: 1 });
      await fetchCart();
    } catch (e) {
      if (e?.status === 401) {
        onNeedAuth?.();
        await fetchCart();
        return;
      }
      console.error(e);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className={styles.product__card}>
      <div className={styles.product__image_container}>
        <Link href={`/catalog/${product.sku}`}>
          <div className={styles.product__image}>
            <p>{product.sku}</p>
          </div>
        </Link>
      </div>

      <div className={styles.product__code}>
        <Link href={`/catalog/${product.sku}`}>{product.sku}</Link>
      </div>

      <div className={styles.product__data}>
        <span className={styles.product__name}>
          <Link href={`/catalog/${product.sku}`}>
            <span className={styles.product__name_value}>{product.name}</span>
          </Link>
        </span>

        <span className={styles.product__brand}>
          <span className={styles.product__brand_name}>Бренд: </span>
          <span className={styles.product__brand_value}>
            {product.brand ? (
              <Link href={`/brands/${product.brand}`}>{product.brand_name || product.brand}</Link>
            ) : (
              <span>{product.brand_name || '—'}</span>
            )}
          </span>
        </span>

        <span className={styles.product__price}>
          <span className={styles.product__price_name}>Цена: </span>
          <span className={styles.product__price_value}>{priceDisplay}</span>
        </span>

        <div className={styles.cart__button}>
          {currentCount > 0 ? (
            <button className={`${styles.cart__button_enabled} ${styles.cart__button_added}`} type="button" disabled>
              Товар в корзине <span className={styles.cart__check} aria-hidden="true">✓</span>
            </button>
          ) : (
            <button
              className={styles.cart__button_enabled}
              type="button"
              onClick={() => void handleAdd()}
              disabled={adding}
            >
              Добавить в корзину
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    innerWidth: undefined,
    innerHeight: undefined,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight,
      });
    }

    if (typeof window !== 'undefined') {
      handleResize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  return windowSize;
}
