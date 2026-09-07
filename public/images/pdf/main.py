import os
import re
import fitz  # PyMuPDF

def convert_pdfs_to_png():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Создаем папку 'png', если ее еще нет
    output_dir = os.path.join(current_dir, "png")
    os.makedirs(output_dir, exist_ok=True)
    
    def natural_sort_key(s):
        return [int(text) if text.isdigit() else text.lower() for text in re.split(r'(\d+)', s)]
    
    pdf_files = [f for f in os.listdir(current_dir) if f.lower().endswith('.pdf')]
    pdf_files.sort(key=natural_sort_key)
    
    if not pdf_files:
        print("PDF-файлы в этой папке не найдены.")
        return

    print(f"Найдено PDF-файлов: {len(pdf_files)}\n")

    # Целевая ширина в пикселях
    target_width = 1000

    for pdf_index, pdf_file in enumerate(pdf_files, start=1):
        pdf_path = os.path.join(current_dir, pdf_file)
        print(f"Обработка документа {pdf_index}: {pdf_file}...")

        # Получаем имя файла без расширения .pdf
        base_name = os.path.splitext(pdf_file)[0]

        try:
            doc = fitz.open(pdf_path)

            for page_index, page in enumerate(doc, start=1):
                # Рассчитываем коэффициент масштабирования под ширину 1000px
                rect = page.rect
                zoom = target_width / rect.width
                mat = fitz.Matrix(zoom, zoom)
                
                # Рендерим страницу с нужным размером
                pix = page.get_pixmap(matrix=mat)
                
                # Формируем путь для сохранения в папку 'png'
                output_filename = f"{base_name}-{page_index}.png"
                output_path = os.path.join(output_dir, output_filename)
                
                # Сохраняем в PNG
                pix.save(output_path)
                print(f"  └─ Сохранен файл в png/{output_filename} ({pix.width}x{pix.height} px)")
                
            doc.close()

        except Exception as e:
            print(f"  └─ Ошибка при обработке файла {pdf_file}: {e}")

    print("\nГотово! Все страницы успешно конвертированы в папку 'png'.")

if __name__ == "__main__":
    convert_pdfs_to_png()