// Скрипт для сборки проекта
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Начинаем сборку проекта...');

// Создаем директорию для сборки, если она не существует
const buildDir = path.join(__dirname, 'build');
if (!fs.existsSync(buildDir)) {
    fs.mkdirSync(buildDir, { recursive: true });
}

// Копируем HTML файлы
console.log('Копирование HTML файлов...');
const htmlFiles = ['index.html', 'mobile.html'];
htmlFiles.forEach(file => {
    fs.copyFileSync(path.join(__dirname, file), path.join(buildDir, file));
});

// Создаем директории в build
const dirs = ['css', 'js', 'data', 'images'];
dirs.forEach(dir => {
    const buildDirPath = path.join(buildDir, dir);
    if (!fs.existsSync(buildDirPath)) {
        fs.mkdirSync(buildDirPath, { recursive: true });
    }
});

// Копируем CSS файлы
console.log('Копирование CSS файлов...');
const cssFiles = fs.readdirSync(path.join(__dirname, 'css'));
cssFiles.forEach(file => {
    fs.copyFileSync(
        path.join(__dirname, 'css', file),
        path.join(buildDir, 'css', file)
    );
});

// Копируем JS файлы
console.log('Копирование JS файлов...');
const jsFiles = fs.readdirSync(path.join(__dirname, 'js'));
jsFiles.forEach(file => {
    fs.copyFileSync(
        path.join(__dirname, 'js', file),
        path.join(buildDir, 'js', file)
    );
});

// Копируем файлы данных
console.log('Копирование файлов данных...');
const dataFiles = fs.readdirSync(path.join(__dirname, 'data'));
dataFiles.forEach(file => {
    fs.copyFileSync(
        path.join(__dirname, 'data', file),
        path.join(buildDir, 'data', file)
    );
});

// Оптимизация изображений, если директория существует
if (fs.existsSync(path.join(__dirname, 'images'))) {
    console.log('Копирование изображений...');

    // Проверяем, существует ли директория с оптимизированными изображениями
    const optimizedImagesDir = path.join(__dirname, 'images_optimized');
    const sourceImagesDir = path.join(__dirname, 'images');

    // Копируем оптимизированные изображения, если они есть
    if (fs.existsSync(optimizedImagesDir)) {
        copyDir(optimizedImagesDir, path.join(buildDir, 'images'));
    } else {
        // Иначе копируем исходные изображения
        copyDir(sourceImagesDir, path.join(buildDir, 'images'));
    }
}

// Функция для рекурсивного копирования директории
function copyDir(src, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }

    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

// Создаем файл с информацией о сборке
const buildInfo = {
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    files: {
        html: htmlFiles.length,
        css: cssFiles.length,
        js: jsFiles.length,
        data: dataFiles.length
    }
};

fs.writeFileSync(
    path.join(buildDir, 'build-info.json'),
    JSON.stringify(buildInfo, null, 2)
);

console.log('Сборка проекта завершена!');
console.log(`Файлы сохранены в директорию: ${buildDir}`);
console.log('Информация о сборке сохранена в build-info.json');
