// ===== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ =====
const startPoint = [57.8138, 28.3496]; // Псковский вокзал
let map = null;
let currentRouteLayer = null;
let currentMarkers = [];
let routesDatabase = {
    routes: [] // Будет загружено из JSON файла
};

// ===== СИСТЕМА МАРШРУТОВ =====

// Функция для загрузки маршрутов из JSON файла
async function loadRoutesFromJSON(category = null) {
    try {
        // Проверяем наличие данных в кэше
        const cacheKey = category ? `routes_${category}` : 'routes_all';
        const cachedData = localStorage.getItem(cacheKey);

        // Если данные есть в кэше и они не старше 24 часов, используем их
        if (cachedData) {
            const { data, timestamp } = JSON.parse(cachedData);
            const now = new Date().getTime();
            const dayInMs = 24 * 60 * 60 * 1000;

            if (now - timestamp < dayInMs) {
                console.log(`Используем кэшированные данные для ${category ? `категории ${category}` : 'всех маршрутов'}`);

                if (category) {
                    // Если загружаем категорию, добавляем маршруты в базу данных
                    routesDatabase.routes = [...routesDatabase.routes, ...data.routes];
                } else {
                    // Если загружаем все маршруты, заменяем базу данных
                    routesDatabase = data;
                }

                return data;
            }
        }

        // Если кэша нет или он устарел, загружаем данные с сервера
        const file = category ? `data/routes_${category}.json` : 'data/routes_with_photos.json';
        const response = await fetch(file);
        const data = await response.json();

        // Сохраняем данные в кэш
        localStorage.setItem(cacheKey, JSON.stringify({
            data: data,
            timestamp: new Date().getTime()
        }));

        if (category) {
            // Если загружаем категорию, добавляем маршруты в базу данных
            routesDatabase.routes = [...routesDatabase.routes, ...data.routes];
        } else {
            // Если загружаем все маршруты, заменяем базу данных
            routesDatabase = data;
        }

        console.log(`Загружено ${data.routes.length} маршрутов${category ? ` категории ${category}` : ''}`);
        return data;
    } catch (error) {
        console.error('Ошибка при загрузке маршрутов:', error);

        // В случае ошибки пытаемся использовать устаревшие данные из кэша
        const cacheKey = category ? `routes_${category}` : 'routes_all';
        const cachedData = localStorage.getItem(cacheKey);

        if (cachedData) {
            const { data } = JSON.parse(cachedData);
            console.log(`Используем устаревшие данные из кэша для ${category ? `категории ${category}` : 'всех маршрутов'}`);

            if (category) {
                routesDatabase.routes = [...routesDatabase.routes, ...data.routes];
            } else {
                routesDatabase = data;
            }

            return data;
        }

        return null;
    }
}

// ===== ИНИЦИАЛИЗАЦИЯ =====
document.addEventListener('DOMContentLoaded', async function() {
    MapManager.initializeMap();
    MapManager.setupMapControls();
    UIManager.initializeEventListeners();

    // Загружаем маршруты из JSON файла
    await loadRoutesFromJSON();
    RoutesManager.loadRoutes();

    console.log('Приложение успешно инициализировано');
});

// ===== ГЛОБАЛЬНЫЕ ФУНКЦИИ =====
// Функция для отладки
function debugLog(message, data = null) {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log(`[DEBUG] ${message}`, data);
    }
}

// Экспорт глобальных функций
window.App = {
    debugLog
};
