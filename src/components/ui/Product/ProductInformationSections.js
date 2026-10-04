import Brands from '@/components/ui/Brands/Brands';
import styles from './product.module.css';

export default function ProductInformationSections() {
  return (
    <>
      <section className={styles.trustSection}>
        <div className={styles.trustGrid}>
          <div className={styles.trustFeatures}>
            <h2 className={styles.trustTitle}>Truck-import - ваш надежный <span className={styles.sectionHeadingNoWrap}>поставщик запчастей</span></h2>
            <div className={styles.trustCard}>
              <h3 className={styles.trustCardTitle}>Запчасти напрямую из Европы</h3>
              <p className={styles.trustCardText}>Оригинальные запчасти для грузовых авто. Оригинальные</p>
            </div>
            <div className={styles.trustCard}>
              <h3 className={styles.trustCardTitle}>Гарантия на каждую запчасть</h3>
              <p className={styles.trustCardText}>Оригинальные запчасти для грузовых авто. Оригинальные</p>
            </div>
            <div className={styles.trustCard}>
              <h3 className={styles.trustCardTitle}>Прозрачный процесс заказа и доставки</h3>
              <p className={styles.trustCardText}>Оригинальные запчасти для грузовых авто. Оригинальные</p>
            </div>
          </div>

          <div className={styles.trustImages}>
            <img src="/images/warehouse-1.jpg" alt="Склад автозапчастей 1" className={styles.trustImg} />
            <img src="/images/warehouse-2.jpg" alt="Склад автозапчастей 2" className={styles.trustImg} />
          </div>
        </div>
      </section>

      <section className={styles.wholesaleSection}>
        <h2 className={styles.wholesaleTitle}>Оптовая продажа запчастей <span className={styles.sectionHeadingNoWrap}>для грузовиков</span></h2>
        <div className={styles.wholesaleTextContainer}>
          <p>
            Оптовая продажа запчастей для грузовиков — это одно из ключевых направлений нашей деятельности. Мы приглашаем к сотрудничеству магазины грузовых автозапчастей, оптовых покупателей и других партнеров, заинтересованных во взаимовыгодном сотрудничестве. Наша компания уже много лет работает на рынке автозапчастей и зарекомендовала себя как надежного партнера для клиентов, которые ценят качество, низкую цену и оперативность в отправке товара.
          </p>
          <p>
            У нас представлен большой ассортимент оригинальных запчастей и их аналогов, что позволяет удовлетворить потребности даже самых требовательных клиентов. В наличии запчасти различных брендов, включая системы тормозной безопасности, задние фонари, комплектующие для кабины и многое другое. Если вы хотите заказать товар оптом, просто укажите номер телефона или оставьте запрос на сайте — отдел оптовых продаж свяжется с вами, чтобы обсудить условиями сотрудничества.
          </p>
        </div>
      </section>

      <section className={styles.brandsSection}>
        <Brands
          brands={["man", "daf", "mercedes", "scania", "kolbenschmidt", "hengst", "volvo"]}
          theme="gray"
          mobileMarquee
        />
      </section>
    </>
  );
}
