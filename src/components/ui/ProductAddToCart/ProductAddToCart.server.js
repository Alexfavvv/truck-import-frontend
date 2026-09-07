import styles from "./productaddtocart.module.css";
import Image from "next/image";

export default function ProductAddToCartServer({ 
  props_count = 0, 
  productId,
  productSku 
}) {
  return (
    <div 
      className={`${styles.cart__button} ${styles.cart__button_add}`} 
      id={`add-to-cart-button-${productId}`}
      data-product-id={productId}
    >
      {props_count > 0 ? (
        <button
          className={styles.cart__button_enabled}
          type="button"
          aria-label={`Добавить ${productSku} в корзину`}
        >
          Добавить в корзину
        </button>
      ) : (
        <button 
          className={styles.cart__button_disabled} 
          disabled
          aria-label="Товара нет в наличии"
        >
          Нет в наличии
        </button>
      )}
    </div>
  );
}