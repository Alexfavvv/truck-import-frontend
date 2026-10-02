'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import ProductList from '@/components/ui/ProductList/ProductList';
import headerSearchStyles from './headerSearch.module.css';

export default function HeaderSearch({ style, onOpenChange, isOpenFromParent }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  
  const inputRef = useRef(null);
  const wrapperRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [previewVisible, setPreviewVisible] = useState(false);

  const fetchResults = useCallback(async (q) => {
    if (!q.trim()) {
      setResults([]);
      setTotalCount(0);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      if (res.ok) {
        setResults(data.products || []);
        setTotalCount(data.totalCount ?? 0);
      } else {
        setResults([]);
        setTotalCount(0);
      }
    } catch {
      setResults([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, []);

  // Выполнение поиска при отправке формы или вводе
  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    if (!query.trim()) return;
    setPreviewVisible(false);
    closeSearch();
    router.push(`/catalog?q=${encodeURIComponent(query.trim())}`);
  };

  useEffect(() => {
    const q = query.trim();
    if (isOpen || q.length < 3) {
      setPreview(null);
      return;
    }
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&limit=5`, { signal: controller.signal });
        const data = await res.json();
        if (!res.ok) throw new Error('Search failed');
        const products = Array.isArray(data.products) ? data.products : [];
        const normalized = q.toLowerCase();
        const best = products.find((item) => String(item.sku || '').toLowerCase() === normalized)
          || products.find((item) => String(item.sku || '').toLowerCase().startsWith(normalized))
          || products[0] || null;
        setPreview(best);
      } catch (error) {
        if (error.name !== 'AbortError') setPreview(null);
      }
    }, 300);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, isOpen]);

  useEffect(() => {
    const onPointerDown = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) setPreviewVisible(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, []);

  // Debounce search input при открытом окне
  useEffect(() => {
    if (!isOpen) return;
    if (query.trim().length < 3) {
      setResults([]);
      setTotalCount(0);
      return;
    }
    const t = setTimeout(() => fetchResults(query), 300);
    return () => clearTimeout(t);
  }, [isOpen, query, fetchResults]);

  // Закрытие по ESC
  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e) => {
      if (e.key === 'Escape') closeSearch();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  // Блокировка скролла страницы
  useEffect(() => {
    if (isOpen) {
      document.documentElement.classList.add('stop-scrolling');
      document.body.classList.add('stop-scrolling');
    } else {
      document.documentElement.classList.remove('stop-scrolling');
      document.body.classList.remove('stop-scrolling');
    }
    return () => {
      document.documentElement.classList.remove('stop-scrolling');
      document.body.classList.remove('stop-scrolling');
    };
  }, [isOpen]);

  useEffect(() => {
    closeSearch();
    setPreviewVisible(false);
  }, [pathname]);

  useEffect(() => {
    if (isOpenFromParent === false && isOpen) {
      closeSearch();
    }
  }, [isOpenFromParent, isOpen]);

  const openSearch = () => {
    setIsOpen(true);
    onOpenChange?.(true);
  };

  const closeSearch = () => {
    setIsOpen(false);
    onOpenChange?.(false);
  };

  return (
    <div ref={wrapperRef} className={headerSearchStyles.headerSearchWrapper} style={style}>
      {/* Кнопка открытия поиска для мобильных версий */}
      <button
        type="button"
        className={headerSearchStyles.headerSearch__mobileTrigger}
        onClick={openSearch}
        aria-label="Поиск по сайту"
      >
        <span className={headerSearchStyles.headerSearch__iconContainer}>
          <svg
            className={headerSearchStyles.headerSearch__icon}
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </span>
      </button>

      {/* Основная поисковая строка (Десктоп / Планшет) */}
      <form onSubmit={handleSearchSubmit} className={headerSearchStyles.headerSearch__desktopBar}>
        <div className={headerSearchStyles.headerSearch__inputContainer}>
          <input
            type="text"
            className={headerSearchStyles.headerSearch__input}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPreview(null); setPreviewVisible(true); }}
            onFocus={() => setPreviewVisible(true)}
            placeholder="Введите номер запчасти"
          />
          {query && (
            <button
              type="button"
              className={headerSearchStyles.headerSearch__clearBtn}
              onClick={() => {
                setQuery('');
                setResults([]);
                setPreview(null);
                setPreviewVisible(false);
              }}
              aria-label="Очистить"
            >
              ✕
            </button>
          )}
          <button type="submit" className={headerSearchStyles.headerSearch__submitBtn} aria-label="Искать">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
        </div>
      </form>

      {previewVisible && preview && !isOpen && (
        <Link
          href={`/catalog/${encodeURIComponent(preview.sku)}`}
          className={headerSearchStyles.preview}
          onClick={() => setPreviewVisible(false)}
        >
          <span className={headerSearchStyles.previewImage}>
            {preview.image_url ? <img src={preview.image_url} alt="" /> : <span>{preview.sku}</span>}
          </span>
          <span className={headerSearchStyles.previewDetails}>
            <span className={headerSearchStyles.previewSku}>{preview.sku}</span>
            <span className={headerSearchStyles.previewTitle}>{preview.title || preview.name}</span>
            <span className={headerSearchStyles.previewBrand}>{preview.brand_name || preview.brand || '—'}</span>
            <span className={headerSearchStyles.previewPrice}>
              {Number(String(preview.price ?? '').replace(/\s/g, '').replace(',', '.')) > 0
                ? `${preview.price} ₽` : 'Цена по запросу'}
            </span>
          </span>
        </Link>
      )}

      {/* Полноэкранное окно с результатами поиска */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Результаты поиска"
          className={headerSearchStyles.headerSearchModal}
        >
          {/* Кнопка-крестик закрытия в правом верхнем углу */}
          <button
            type="button"
            className={headerSearchStyles.headerSearchModal__closeIconButton}
            onClick={closeSearch}
            aria-label="Закрыть поиск"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          {/* Шапка модального окна со строкой редактирования поиска */}
          <div className={headerSearchStyles.headerSearchModal__header}>
            <div className={headerSearchStyles.headerSearch__inputContainer}>
              <input
                ref={inputRef}
                type="text"
                className={headerSearchStyles.headerSearch__input}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSearchSubmit(e); }}
                placeholder="Введите номер запчасти"
              />
              {query && (
                <button
                  type="button"
                  className={headerSearchStyles.headerSearch__clearBtn}
                  onClick={() => setQuery('')}
                  aria-label="Очистить"
                >
                  ✕
                </button>
              )}
              <button 
                type="button" 
                onClick={() => fetchResults(query)} 
                className={headerSearchStyles.headerSearch__submitBtn} 
                aria-label="Искать"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </button>
            </div>
          </div>

          {/* Контент с результатами */}
          <div className={headerSearchStyles.headerSearchModal__body}>
            {loading && (
              <div className={headerSearchStyles.headerSearch__status}>
                <div className={headerSearchStyles.spinner}></div>
                <p>Поиск запчастей...</p>
              </div>
            )}
            {!loading && query.trim().length > 0 && query.trim().length < 3 && (
              <p className={headerSearchStyles.headerSearch__hint}>Введите минимум 3 символа для поиска</p>
            )}
            {!loading && results.length > 0 && (
              <div className={headerSearchStyles.headerSearch__resultsContainer}>
                <p className={headerSearchStyles.headerSearch__count}>
                  Результаты по запросу «<span>{query}</span>»: найдено товаров <span>{totalCount}</span>
                </p>
                <div className={headerSearchStyles.headerSearch__products}>
                  <ProductList products={results} />
                </div>
              </div>
            )}
            {!loading && query.trim().length >= 3 && results.length === 0 && totalCount === 0 && (
              <div className={headerSearchStyles.headerSearch__empty}>
                <p className={headerSearchStyles.headerSearch__emptyTitle}>Ничего не найдено</p>
                <p className={headerSearchStyles.headerSearch__emptyDesc}>
                  Проверьте правильность написания артикула или номера детали
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
