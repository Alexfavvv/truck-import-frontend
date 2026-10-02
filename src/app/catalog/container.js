"use client";
import { useSearchParams, useRouter } from "next/navigation";
import useSWR from "swr";
import { LIMIT } from "./constants";
import ProductList from '@/components/ui/ProductList/ProductList';
import styles from './page.module.css';
import BrandFilter from '@/components/ui/BrandFilter/BrandFilter';
import { useState, useEffect } from "react";
import Loading from "./loading";

const fetcher = async (path) => {
  const response = await fetch(`/api/${path}&limit=${LIMIT}`);
  if (!response.ok) throw new Error('Failed to fetch products');
  return response.json();
};

export const ProductsContainer = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1");
  const query = searchParams.get("q")?.trim() || "";
  const brandsParam = searchParams.get("brand");
  const modelsParam = searchParams.get("model");

  // Инициализируем состояния из URL параметров
  const [selectedBrands, setSelectedBrands] = useState(brandsParam ? brandsParam.split(",") : []);
  const [selectedModels, setSelectedModels] = useState(modelsParam ? modelsParam.split(",") : []);

  // Синхронизируем состояния при изменении URL
  useEffect(() => {
    setSelectedBrands(brandsParam ? brandsParam.split(",") : []);
    setSelectedModels(modelsParam ? modelsParam.split(",") : []);
  }, [brandsParam, modelsParam]);

  const { data, error, isLoading } = useSWR(
    query ? `search?q=${encodeURIComponent(query)}&page=${page}` : `products?page=${page}${
      selectedBrands.length > 0 ? `&brand=${selectedBrands.join(",")}` : ''
    }${
      selectedModels.length > 0 ? `&model=${selectedModels.join(",")}` : ''
    }`,
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
    }
  );

  // Обновление URL при изменении фильтров
  const updateFilters = (newBrands, newModels) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', '1'); // Сбрасываем на первую страницу при изменении фильтров

    if (newBrands.length > 0) {
      params.set('brand', newBrands.join(","));
    } else {
      params.delete('brand');
    }

    if (newModels.length > 0) {
      params.set('model', newModels.join(","));
    } else {
      params.delete('model');
    }

    router.replace(`?${params.toString()}`);
  };

  const handleBrandChange = (brands) => {
    setSelectedBrands(brands);
    updateFilters(brands, selectedModels);
  };

  const handleModelChange = (models) => {
    setSelectedModels(models);
    updateFilters(selectedBrands, models);
  };

  const updatePage = (newPage) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage);
    router.replace(`?${params.toString()}`);
  };

  // Получаем данные
  const products = (query ? data?.products : data?.paginatedProducts) || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / LIMIT);
  const allModels = data?.allModels || [];
  const allBrands = data?.allBrands || [];

  if (isLoading) return <Loading/>;
  if (error) return <div className={styles.error}>Ошибка загрузки: {error.message}</div>;

  return (
    <>
      <aside className={styles.filters}>

        <BrandFilter
          title="Производитель"
          allBrands={allBrands}
          selectedBrands={selectedBrands}
          onChange={handleBrandChange}
        />
        {/* <BrandFilter
          title="Модель"
          allBrands={allModels}
          selectedBrands={selectedModels}
          onChange={handleModelChange}
        /> */}
      </aside>
            <div className={styles.container}>
              {totalCount !== 0 && <>
                <div className={styles.products}>

                    <ProductList products={products} />

                </div>

                <div className={styles.pagination}>


                    {/* Всегда показываем первую страницу, если она не активна */}
                    {page > 1 && (
                        <button
                            onClick={() => updatePage(1)}
                            className={1 === page ? styles.active : ""}
                        >
                            1
                        </button>
                    )}

                    {/* Кнопка "предыдущая" */}
                    {page > 1 && (
                        <button onClick={() => updatePage(page - 1)}>
                            <svg className={styles.arrow_prev} width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path fillRule="evenodd" clipRule="evenodd" d="M13.3427 0.92888L19.7067 7.29284C20.0972 7.68336 20.0972 8.31653 19.7067 8.70705L13.3427 15.071C12.9522 15.4615 12.319 15.4615 11.9285 15.071C11.538 14.6805 11.538 14.0473 11.9285 13.6568L16.5854 8.99995L1 8.99995C0.447715 8.99995 0 8.55223 0 7.99995C0 7.44766 0.447715 6.99995 1 6.99995L16.5854 6.99995L11.9285 2.34309C11.538 1.95257 11.538 1.3194 11.9285 0.92888C12.319 0.538355 12.9522 0.538355 13.3427 0.92888Z" fill="#BCA134"/>
                            </svg>
                        </button>
                    )}

                    {/* Многоточие, если есть разрыв между первой и текущей страницей */}
                    {page > 3 && <span className={styles.ellipsis}>...</span>}

                    {/* Показываем 2 страницы перед текущей */}
                    {/* {page > 3 && (
                        <button onClick={() => updatePage(page - 2)}>
                            {page - 2}
                        </button>
                    )} */}
                    {page > 2 && (
                        <button onClick={() => updatePage(page - 1)}>
                            {page - 1}
                        </button>
                    )}

                    {/* Текущая страница */}
                    <button className={styles.active}>{page}</button>

                    {/* Показываем 2 страницы после текущей */}
                    {page + 2 <= totalPages && (
                        <button onClick={() => updatePage(page + 1)}>
                            {page + 1}
                        </button>
                    )}
                    {/* {page + 3 <= totalPages && (
                        <button onClick={() => updatePage(page + 2)}>
                            {page + 2}
                        </button>
                    )} */}

                    {/* Многоточие, если есть разрыв между текущей и последней страницей */}
                    {page < totalPages - 2 && (
                        <span className={styles.ellipsis}>...</span>
                    )}

                    {/* Кнопка "следующая" */}
                    {page < totalPages && (
                        <button onClick={() => updatePage(page + 1)}>
                          <svg className={styles.arrow_next} width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M13.3427 0.92888L19.7067 7.29284C20.0972 7.68336 20.0972 8.31653 19.7067 8.70705L13.3427 15.071C12.9522 15.4615 12.319 15.4615 11.9285 15.071C11.538 14.6805 11.538 14.0473 11.9285 13.6568L16.5854 8.99995L1 8.99995C0.447715 8.99995 0 8.55223 0 7.99995C0 7.44766 0.447715 6.99995 1 6.99995L16.5854 6.99995L11.9285 2.34309C11.538 1.95257 11.538 1.3194 11.9285 0.92888C12.319 0.538355 12.9522 0.538355 13.3427 0.92888Z" fill="#BCA134"/>
                          </svg>
                        </button>
                    )}

                    {/* Всегда показываем последнюю страницу, если она не активна */}
                    {page < totalPages && (
                        <button
                            onClick={() => updatePage(totalPages)}
                            className={totalPages === page ? styles.active : ""}
                        >
                            {totalPages}
                        </button>
                    )}
                </div>
              </>}
              {totalCount === 0 && <>
                <div className={styles.empty}>Товары не найдены</div>
              </>}
            </div>
        </>
    );
};
