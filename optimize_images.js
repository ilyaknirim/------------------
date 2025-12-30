// Скрипт для оптимизации изображений
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Пути к директориям с изображениями
const imagesDir = path.join(__dirname, 'images');
const optimizedDir = path.join(__dirname, 'images_optimized');

// Создаем директорию для оптимизированных изображений, если она не существует
if (!fs.existsSync(optimizedDir)) {
    fs.mkdirSync(optimizedDir, { recursive: true });
}

// Функция для оптимизации одного изображения
async function optimizeImage(inputPath, outputPath) {
    try {
        await sharp(inputPath)
            .resize({ width: 800, height: 600, fit: 'inside', withoutEnlargement: true })
            .jpeg({ quality: 80, progressive: true })
            .toFile(outputPath);

        // Получаем размеры исходного и оптимизированного файлов
        const originalSize = fs.statSync(inputPath).size;
        const optimizedSize = fs.statSync(outputPath).size;
        const reduction = ((originalSize - optimizedSize) / originalSize * 100).toFixed(2);

        console.log(`Оптимизировано: ${path.basename(inputPath)} - Сжато на ${reduction}%`);
        return true;
    } catch (error) {
        console.error(`Ошибка при оптимизации ${inputPath}:`, error);
        return false;
    }
}

// Функция для рекурсивной обработки всех изображений в директории
async function optimizeDirectory(dir, subDir = '') {
    const currentDir = path.join(dir, subDir);
    const items = fs.readdirSync(currentDir);

    for (const item of items) {
        const itemPath = path.join(currentDir, item);
        const stats = fs.statSync(itemPath);

        if (stats.isDirectory()) {
            // Рекурсивно обрабатываем поддиректории
            const newSubDir = path.join(subDir, item);
            const optimizedSubDir = path.join(optimizedDir, newSubDir);

            if (!fs.existsSync(optimizedSubDir)) {
                fs.mkdirSync(optimizedSubDir, { recursive: true });
            }

            await optimizeDirectory(dir, newSubDir);
        } else if (/\.(jpg|jpeg|png)$/i.test(item)) {
            // Обрабатываем только изображения
            const inputPath = path.join(currentDir, item);
            const outputPath = path.join(optimizedDir, subDir, item);

            await optimizeImage(inputPath, outputPath);
        }
    }
}

// Запускаем оптимизацию
console.log('Начинаем оптимизацию изображений...');
optimizeDirectory(imagesDir)
    .then(() => {
        console.log('Оптимизация изображений завершена!');
        console.log(`Оптимизированные изображения сохранены в директорию: ${optimizedDir}`);
    })
    .catch(error => {
        console.error('Ошибка при оптимизации изображений:', error);
    });
