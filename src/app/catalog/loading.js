import styles from './loading.module.css';

export default function Loading() {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.loadingCard}>
        <div className={styles.spinnerWrapper}>
          <div className={styles.spinnerRing} />
        </div>
        <p className={styles.spinnerText}>Загрузка каталога</p>
      </div>
    </div>
  );
}
