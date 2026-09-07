import Link from 'next/link';
import Image from 'next/image';
import { fetchPosts } from '@/services/postService';

export const metadata = {
  title: 'Новости — Запчасти для грузовых автомобилей | Трак Импорт',
  description: 'Полезные новости, обзоры запчастей, рекомендации по обслуживанию европейских грузовиков Mercedes, MAN, Scania, Volvo, DAF.',
};

export default async function BlogPage({ searchParams }) {
  const params = await searchParams;
  const search = params?.search || '';
  const page = parseInt(params?.page || '1', 10);

  const { posts, meta } = await fetchPosts({ page, search });

  return (
    <main style={{ backgroundColor: '#E3E3E3', color: '#1A1A1A', minHeight: '80vh', padding: '4rem 1.5rem 8rem 1.5rem' }}>
      <div style={{ maxWidth: '1140px', margin: '0 auto' }}>
        
        {/* Хлебные крошки */}
        <nav style={{ marginBottom: '2.5rem', fontSize: '1.4rem', color: '#666666' }}>
          <Link href="/" style={{ color: '#666666', textDecoration: 'none' }}>Главная</Link>
          <span style={{ margin: '0 0.8rem', color: '#888888' }}>/</span>
          <span style={{ color: '#1A1A1A', fontWeight: 600 }}>Новости</span>
        </nav>

        {/* Заголовок страницы и поиск */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginBottom: '4rem' }}>
          <div>
            <h1 style={{ fontSize: '3.6rem', fontWeight: 700, color: '#1A1A1A', lineHeight: 1.2, marginBottom: '1rem' }}>
              Новости Трак Импорт
            </h1>
            <p style={{ fontSize: '1.8rem', color: '#555555', maxWidth: '700px', lineHeight: 1.5 }}>
              Экспертные обзоры, советы по ремонту и обслуживанию седельных тягачей, новости поставок запчастей.
            </p>
          </div>

          {/* Поисковая строка по новостям */}
          <form method="GET" action="/blog" style={{ display: 'flex', gap: '1rem', maxWidth: '500px' }}>
            <input
              type="text"
              name="search"
              defaultValue={search}
              placeholder="Поиск по новостям..."
              style={{
                flex: 1,
                padding: '1.2rem 1.6rem',
                backgroundColor: '#FFFFFF',
                border: '1px solid #CCCCCC',
                borderRadius: '0.8rem',
                color: '#1A1A1A',
                fontSize: '1.5rem',
                outline: 'none'
              }}
            />
            <button
              type="submit"
              style={{
                padding: '1.2rem 2.4rem',
                backgroundColor: '#1A1A1A',
                color: '#FFFFFF',
                fontWeight: 600,
                fontSize: '1.5rem',
                border: 'none',
                borderRadius: '0.8rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              Найти
            </button>
          </form>
        </div>

        {/* Список новостей */}
        {posts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '6rem 2rem', backgroundColor: '#FFFFFF', borderRadius: '1rem', border: '1px solid #DDDDDD' }}>
            <p style={{ fontSize: '2rem', color: '#666666', marginBottom: '1.5rem' }}>Новости по вашему запросу не найдены.</p>
            <Link href="/blog" style={{ color: '#1A1A1A', fontSize: '1.6rem', textDecoration: 'underline' }}>
              Показать все новости
            </Link>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '3rem'
          }}>
            {posts.map((post) => {
              const formattedDate = post.published_at
                ? new Date(post.published_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
                : '';

              return (
                <article
                  key={post.id || post.slug}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '1.2rem',
                    overflow: 'hidden',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  }}
                >
                  <Link href={`/blog/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', height: '100%' }}>
                    {/* Обложка статьи */}
                    <div style={{ position: 'relative', width: '100%', height: '200px', backgroundColor: '#EEEEEE' }}>
                      {post.cover_image ? (
                        <Image
                          src={post.cover_image}
                          alt={post.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 360px"
                          style={{ objectFit: 'cover' }}
                          unoptimized={post.cover_image.startsWith('http')}
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#999', fontSize: '1.4rem' }}>
                          Трак Импорт
                        </div>
                      )}
                    </div>

                    {/* Мета-информация */}
                    <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '1.3rem', color: '#666666', marginBottom: '1.2rem' }}>
                        <span>{formattedDate}</span>
                        {post.views_count !== undefined && (
                          <span style={{ color: '#888888' }}>👁 {post.views_count}</span>
                        )}
                      </div>

                      {/* Заголовок */}
                      <h2 style={{ fontSize: '2rem', fontWeight: 600, color: '#1A1A1A', marginBottom: '1.2rem', lineHeight: 1.3 }}>
                        {post.title}
                      </h2>

                      {/* Анонс */}
                      <p style={{ fontSize: '1.4rem', color: '#555555', lineHeight: 1.6, marginBottom: '2rem', flexGrow: 1 }}>
                        {post.excerpt}
                      </p>

                      {/* Кнопка Читать далее */}
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', color: '#1A1A1A', fontWeight: 600, fontSize: '1.5rem', marginTop: 'auto' }}>
                        <span>Читать новость</span>
                        <span>→</span>
                      </div>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>
        )}

        {/* Пагинация */}
        {meta && meta.last_page > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '5rem' }}>
            {Array.from({ length: meta.last_page }, (_, i) => i + 1).map((pageNum) => (
              <Link
                key={pageNum}
                href={`/blog?page=${pageNum}${search ? `&search=${encodeURIComponent(search)}` : ''}`}
                style={{
                  padding: '1rem 1.6rem',
                  borderRadius: '0.6rem',
                  backgroundColor: pageNum === meta.current_page ? '#C9AC37' : '#242424',
                  color: pageNum === meta.current_page ? '#141313' : '#FFFFFF',
                  fontWeight: 600,
                  fontSize: '1.6rem',
                  textDecoration: 'none'
                }}
              >
                {pageNum}
              </Link>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}
