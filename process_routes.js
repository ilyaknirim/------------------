// Скрипт для разделения маршрутов по категориям
const fs = require('fs');
const path = require('path');

// Путь к файлу с маршрутами
const routesPath = path.join(__dirname, 'data', 'routes_with_photos.json');

// Проверяем существование файла с маршрутами
if (!fs.existsSync(routesPath)) {
    console.error(`Файл не найден: ${routesPath}`);
    process.exit(1);
}

// Читаем файл с маршрутами
try {
    const routesData = JSON.parse(fs.readFileSync(routesPath, 'utf8'));
    const routes = routesData.routes;

    // Создаем объекты для хранения маршрутов по категориям
    const cityRoutes = { routes: [] };
    const natureRoutes = { routes: [] };
    const historyRoutes = { routes: [] };
    const easyRoutes = { routes: [] };

    // Распределяем маршруты по категориям
    routes.forEach(route => {
        if (route.category && Array.isArray(route.category)) {
            if (route.category.includes('city')) {
                cityRoutes.routes.push(route);
            }
            if (route.category.includes('nature')) {
                natureRoutes.routes.push(route);
            }
            if (route.category.includes('history')) {
                historyRoutes.routes.push(route);
            }
            if (route.category.includes('easy')) {
                easyRoutes.routes.push(route);
            }
        }
    });

    // Сохраняем маршруты по категориям в отдельные файлы
    fs.writeFileSync('data/routes_city.json', JSON.stringify(cityRoutes, null, 2));
    fs.writeFileSync('data/routes_nature.json', JSON.stringify(natureRoutes, null, 2));
    fs.writeFileSync('data/routes_history.json', JSON.stringify(historyRoutes, null, 2));
    fs.writeFileSync('data/routes_easy.json', JSON.stringify(easyRoutes, null, 2));

    console.log('Маршруты успешно разделены по категориям!');
    console.log(`Всего обработано маршрутов: ${routes.length}`);
    console.log(`Городских маршрутов: ${cityRoutes.routes.length}`);
    console.log(`Природных маршрутов: ${natureRoutes.routes.length}`);
    console.log(`Исторических маршрутов: ${historyRoutes.routes.length}`);
    console.log(`Маршрутов для начинающих: ${easyRoutes.routes.length}`);
} catch (error) {
    console.error('Ошибка при обработке маршрутов:', error);
    process.exit(1);
}
