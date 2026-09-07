import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { fetchPostBySlug } from '@/services/postService';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const data = await fetchPostBySlug(slug);

  if (!data || !data.post) {
    return {
      title: 'Новость не найдена | Трак Импорт',
    };
  }

  const { post } = data;
  return {
    title: `${post.meta_title || post.title} | Новости Трак Импорт`,
    description: post.meta_description || post.excerpt,
    keywords: post.meta_keywords,
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const data = await fetchPostBySlug(slug);

  if (!data || !data.post) {
    notFound();
  }

  const { post, recent = [] } = data;

  const formattedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
    : '';

  return (
    <main style={{ backgroundColor: '#E3E3E3', color: '#1A1A1A', minHeight: '80vh', padding: '4rem 1.5rem 8rem 1.5rem' }}>
      <div style={{ maxWidth: '1140px', margin: '0 auto' }}>
        
        {/* Хлебные крошки */}
        <nav style={{ marginBottom: '3rem', fontSize: '1.4rem', color: '#666666' }}>
          <Link href="/" style={{ color: '#666666', textDecoration: 'none' }}>Главная</Link>
          <span style={{ margin: '0 0.8rem', color: '#888888' }}>/</span>
          <Link href="/blog" style={{ color: '#666666', textDecoration: 'none' }}>Новости</Link>
          <span style={{ margin: '0 0.8rem', color: '#888888' }}>/</span>
          <span style={{ color: '#1A1A1A', fontWeight: 600 }}>{post.title}</span>
        </nav>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '4rem' }}>
          {/* Контент статьи */}
          <article style={{ backgroundColor: '#FFFFFF', padding: '3.5rem', borderRadius: '1.6rem', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
            {/* Заголовок */}
            <h1 style={{ fontSize: '3.6rem', fontWeight: 700, color: '#1A1A1A', lineHeight: 1.25, marginBottom: '1.5rem' }}>
              {post.title}
            </h1>

            {/* Мета-данные */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'center', fontSize: '1.4rem', color: '#666666', marginBottom: '3rem', paddingBottom: '1.5rem', borderBottom: '1px solid #EEEEEE' }}>
              {formattedDate && <span>📅 {formattedDate}</span>}
              {post.author && <span>✍️ Автор: {post.author}</span>}
              {post.views_count !== undefined && <span>👁 Просмотров: {post.views_count}</span>}
            </div>

            {/* Обложка статьи */}
            {post.cover_image && (
              <div style={{ position: 'relative', width: '100%', height: '420px', borderRadius: '1.2rem', overflow: 'hidden', marginBottom: '3.5rem', backgroundColor: '#F0F0F0' }}>
                <Image
                  src={post.cover_image}
                  alt={post.title}
                  fill
                  style={{ objectFit: 'cover' }}
                  priority
                  unoptimized={post.cover_image.startsWith('http')}
                  referrerPolicy="no-referrer"
                />
              </div>
            )}

            {/* Текст статьи */}
            <div
              className="blog-content"
              style={{
                fontSize: '1.7rem',
                lineHeight: 1.8,
                color: '#333333',
              }}
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Кнопка "Назад в новости" */}
            <div style={{ marginTop: '5rem', paddingTop: '3rem', borderTop: '1px solid #EEEEEE' }}>
              <Link
                href="/blog"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1.2rem 2.4rem',
                  backgroundColor: '#1A1A1A',
                  color: '#FFFFFF',
                  borderRadius: '0.8rem',
                  fontWeight: 600,
                  fontSize: '1.6rem',
                  textDecoration: 'none'
                }}
              >
                <span>←</span>
                <span>Вернуться ко всем новостям</span>
              </Link>
            </div>
          </article>

          {/* Рекомендуемые статьи */}
          {recent.length > 0 && (
            <section style={{ marginTop: '2rem' }}>
              <h3 style={{ fontSize: '2.4rem', fontWeight: 700, color: '#1A1A1A', marginBottom: '2.5rem' }}>
                Читайте также
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2.5rem' }}>
                {recent.map((item) => (
                  <Link
                    key={item.id || item.slug}
                    href={`/blog/${item.slug}`}
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '1.2rem',
                      padding: '2rem',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                      textDecoration: 'none',
                      color: 'inherit',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}
                  >
                    <h4 style={{ fontSize: '1.7rem', fontWeight: 600, color: '#1A1A1A', marginBottom: '1rem', lineHeight: 1.3 }}>
                      {item.title}
                    </h4>
                    <p style={{ fontSize: '1.4rem', color: '#1A1A1A', fontWeight: 600, marginTop: 'auto' }}>
                      Читать далее →
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          )}

        </div>
      </div>

      <style>{`
        .blog-content h2 {
          font-size: 2.6rem;
          color: #1A1A1A;
          margin-top: 3rem;
          margin-bottom: 1.5rem;
          font-weight: 700;
        }
        .blog-content h3 {
          font-size: 2.1rem;
          color: #222222;
          margin-top: 2.5rem;
          margin-bottom: 1.2rem;
          font-weight: 600;
        }
        .blog-content p {
          margin-bottom: 1.8rem;
        }
        .blog-content ul, .blog-content ol {
          margin-bottom: 2rem;
          padding-left: 2.5rem;
        }
        .blog-content li {
          margin-bottom: 0.8rem;
          list-style-type: disc;
        }
        .blog-content ol li {
          list-style-type: decimal;
        }
        .blog-content blockquote {
          background-color: #F5F5F5;
          border-left: 4px solid #1A1A1A;
          padding: 1.5rem 2rem;
          margin: 2.5rem 0;
          border-radius: 0 0.8rem 0.8rem 0;
        }
        .blog-content img {
          max-width: 100%;
          height: auto;
          border-radius: 0.8rem;
          margin: 2rem 0;
        }
      `}</style>
    </main>
  );
}
