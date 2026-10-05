import Image from "next/image";
import Link from 'next/link';
import SearchWithResults from "@/components/ui/Search/SearchWithResults";
import Brands from "@/components/ui/Brands/Brands";
import HomeFaq from "@/components/sections/HomeFaq/HomeFaq";
import SafeImage from "@/components/ui/SafeImage/SafeImage";
import { fetchPosts } from "@/services/postService";
import { fetchPageSettings } from "@/services/pageService";
import HomeBanners from "@/components/sections/HomeBanners/HomeBanners";
import styles from "./home.module.css";

export async function generateMetadata() {
  return {
    title: "Грузовые запчасти оптом в Москве | truck-import.ru",
    description: "Запчасти для грузовых автомобилей оптом в Москве. Продажа оригинальных и аналоговых запчастей для MAN, MERCEDES, VOLVO, DAF, SCANIA, IVECO, и других марок.",
  };
}

export default async function Home() {
  const { posts } = await fetchPosts({ page: 1 });
  const latestPosts = posts.slice(0, 4);
  const pageSettings = await fetchPageSettings('home');

  return (
    <main className={styles.homePage}>
      <div className={styles.contentContainer}>

        {/* --- БЛОК 1: HERO БАННЕРЫ --- */}
        <HomeBanners initialData={pageSettings} />

        {/* --- ЛОГОТИПЫ БРЕНДОВ --- */}
        <section className={styles.brandsSection}>
          <Brands
            brands={["man", "daf", "mercedes", "scania", "kolbenschmidt", "hengst", "volvo"]}
            theme="gray"
          />
        </section>

        {/* --- БЛОК 2: "TRUCK-IMPORT - ЭТО" --- */}
        <section>
          <h2 className={styles.featuresSectionTitle}>
            Truck-import - это
          </h2>
          <div className={styles.featuresGrid}>
            
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>+</div>
              <h3 className={styles.featureTitle}>
                Только оригиналы из Европы
              </h3>
              <p className={styles.featureText}>
                Оригинальные запчасти для грузовых авто. Прямые поставки от официальных дистрибьюторов.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>+</div>
              <h3 className={styles.featureTitle}>
                Гарантия на каждую запчасть
              </h3>
              <p className={styles.featureText}>
                Предоставляем официальную гарантию производителя и полный пакет сопроводительных документов.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>+</div>
              <h3 className={styles.featureTitle}>
                Прозрачный процесс заказа и доставки
              </h3>
              <p className={styles.featureText}>
                Отслеживайте статус заказа, платежные документы и этапы логистики в реальном времени.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>+</div>
              <h3 className={styles.featureTitle}>
                Более 4 000 000 запчастей в каталоге
              </h3>
              <p className={styles.featureText}>
                Огромный ассортимент комплектующих в наличии на складе и под заказ.
              </p>
            </div>

          </div>
        </section>

        {/* --- БЛОК 3: "ПОЛНЫЙ КОНТРОЛЬ НАД ВАШИМИ ЗАКАЗАМИ" --- */}
        <section className={styles.controlBanner}>
          <div className={styles.controlGrid}>
            
            {/* Левая часть: таймлайн шагов */}
            <div className={styles.controlLeft}>
              <h2 className={styles.controlTitle}>
                Полный контроль над вашими заказами
              </h2>

              <div className={styles.timelineList}>
                <div className={styles.timelineLine} />

                <div className={styles.timelineItem}>
                  <span className={styles.timelineDot} />
                  <h3 className={styles.timelineItemTitle}>Оформляйте заказы онлайн</h3>
                  <p className={styles.timelineItemText}>Получайте уведомления о ваших заказах</p>
                </div>

                <div className={styles.timelineItem}>
                  <span className={styles.timelineDot} />
                  <h3 className={styles.timelineItemTitle}>Получайте счет на оплату</h3>
                  <p className={styles.timelineItemText}>Получайте уведомления о ваших заказах</p>
                </div>

                <div className={styles.timelineItem}>
                  <span className={styles.timelineDot} />
                  <h3 className={styles.timelineItemTitle}>Следите за статусом заказов</h3>
                  <p className={styles.timelineItemText}>Получайте уведомления о ваших заказах</p>
                </div>

                <div className={styles.timelineItem}>
                  <span className={styles.timelineDot} />
                  <h3 className={styles.timelineItemTitle}>Получайте уведомления о ваших заказах</h3>
                  <p className={styles.timelineItemText}>Получайте уведомления о ваших заказах</p>
                </div>
              </div>
            </div>

            {/* Правая часть: Ноутбук и Менеджер */}
            <div className={styles.controlRight}>
              <SafeImage
                src="/images/laptop-dashboard.png"
                alt="Макет личного кабинета"
                className={styles.laptopImg}
              />

              <div className={styles.mobileControlImageClip}>
                <div className={styles.mobileControlImageWrap}>
                  <SafeImage
                    src="/images/order-control-mobile.png"
                    alt="Карточки личного кабинета: поиск запчастей, отслеживание доставки и акт об оплате"
                    className={styles.mobileControlImage}
                  />
                </div>
              </div>

              <div className={styles.managerFullWrapper}>
                <SafeImage
                  src="/images/manager-full.png"
                  alt="Старший менеджер Андрей Никитин"
                  className={styles.managerFullImg}
                />
                
                
              </div>
            </div>

          </div>
        </section>

        {/* --- БЛОК 4: "САМЫЙ ШИРОКИЙ АССОРТИМЕНТ" --- */}
        <section className={styles.assortmentSection}>
          <div className={styles.assortmentGrid}>
            
            {/* Фотографии склада слева */}
            <div className={styles.assortmentPhotos}>
              <div className={styles.assortmentPhotoCard}>
                <SafeImage
                  src="/images/warehouse-1.jpg"
                  alt="Склад запчастей"
                  className={styles.assortmentImg}
                />
              </div>
              <div className={styles.assortmentPhotoCard}>
                <SafeImage
                  src="/images/warehouse-2.jpg"
                  alt="Стеллажи с деталями"
                  className={styles.assortmentImg}
                />
              </div>
            </div>

            {/* Текст справа */}
            <div className={styles.assortmentText}>
              <h2 className={styles.assortmentTitle}>
                Самый широкий ассортимент
              </h2>
              <h3 className={styles.assortmentSubtitle}>
                Более 4 000 000 деталей
              </h3>

              <div className={styles.assortmentParagraphs}>
                <p>
                  Наша компания готова предложить широкий ассортимент запчастей для грузовиков, включая тормозную систему, амортизаторы, диски, элементы кабины и многое другое. Мы сотрудничаем с проверенными поставщиками запчастей для грузовых автомобилей по оптовым ценам, чтобы обеспечить наличие товара на складе в разных городах России. Благодаря прямым контактам с брендами, мы поддерживаем конкурентоспособные цены и регулярно обновляем каталог новыми поступлениями.
                </p>
                <p>
                  Вся продукция сертифицирована, и мы гарантируем высокий уровень качества каждой детали. Независимо от того, какой запрос вы оставите на сайте или какую позицию ищете через поиск, наши специалисты оперативно свяжутся с вами, чтобы помочь найти нужное наименование. Мы предлагаем как оригинальные запасные части, так и аналоги, которые являются надежным решением для коммерческого транспорта, включая полуприцепы и технику HOWO.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* --- БЛОК 5: "НОВОСТИ И ОБНОВЛЕНИЯ" --- */}
        <section>
          <div className={styles.newsHeader}>
            <h2 className={styles.newsTitle}>
              Новости и обновления
            </h2>
            <Link href="/blog" className={styles.newsLink}>
              Все новости →
            </Link>
          </div>

          <div className={styles.newsGrid}>
            {latestPosts.map((post) => (
              <article key={post.id || post.slug} className={styles.newsCard}>
                <Link href={`/blog/${post.slug}`} className={styles.newsCardLink}>
                  <div className={styles.newsImageWrapper}>
                    {post.cover_image ? (
                      <Image
                        src={post.cover_image}
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 300px"
                        className={styles.newsImg}
                        unoptimized={post.cover_image.startsWith('http')}
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <SafeImage
                        src="/images/warehouse-1.jpg"
                        alt="Новость"
                        className={styles.newsImg}
                      />
                    )}
                  </div>
                  <div className={styles.newsCardBody}>
                    <h3 className={styles.newsCardTitle}>
                      {post.title}
                    </h3>
                    <p className={styles.newsCardExcerpt}>
                      {post.excerpt}
                    </p>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </section>

        {/* --- БЛОК 6: "ВОПРОСЫ-ОТВЕТЫ" --- */}
        <HomeFaq />

        {/* --- БЛОК 7: "ОПТОВАЯ ПРОДАЖА ЗАПЧАСТЕЙ" --- */}
        <section className={styles.wholesaleSeoSection}>
          <h2 className={styles.wholesaleSeoTitle}>
            Оптовая продажа запчастей для грузовиков
          </h2>
          <div className={styles.wholesaleSeoText}>
            <p>
              Оптовая продажа запчастей для грузовиков — это одно из ключевых направлений нашей деятельности. Мы приглашаем к сотрудничеству магазины грузовых запчастей, оптовых покупателей и других партнеров, заинтересованных во взаимовыгодном сотрудничестве. Наша компания уже много лет работает на рынке автозапчастей и зарекомендовала себя как надежного партнера для клиентов, которые ценят качество, низкую цену и оперативность в отправке товара.
            </p>
            <p>
              У нас представлен большой ассортимент оригинальных запчастей и их аналогов, что позволяет удовлетворить потребности даже самых требовательных клиентов. В наличии запчасти различных брендов, включая системы тормозной безопасности, задние фонари, комплектующие для кабины и многое другое. Если вы хотите заказать товар оптом, просто укажите номер телефона или оставьте запрос на сайте — отдел оптовых продаж свяжется с вами, чтобы обсудить условия сотрудничества.
            </p>
            <p>
              Мы предлагаем уникальные возможности для тех, кто ищет качественные запчасти оптом в Москве и по всей РФ. Наша база данных содержит информацию о наличии товара, его кодах и характеристиках, что делает поиск удобным и быстрым. Мы регулярно обновляем прайс-лист, чтобы предоставить актуальные данные о ценах и новых поступлениях.
            </p>
            <p>
              Предлагаем не только стандартный набор грузовых запчастей, но и редкие позиции, которые сложно найти в фирменных магазинах или у других оптовых компаний. Это позволяет нам быть лидерами в своей нише и поддерживать большую клиентскую базу. Каждый клиент может рассчитывать на индивидуальный подход, официальные сертификаты качества и плодотворное сотрудничество.
            </p>
          </div>
        </section>

      </div>
    </main>
  );
}
