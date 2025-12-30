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
async function loadRoutesFromJSON() {
    try {
        const response = await fetch('data/routes.json');
        const data = await response.json();
        routesDatabase = data;
        console.log(`Загружено ${data.routes.length} маршрутов`);
        return data;
    } catch (error) {
        console.error('Ошибка при загрузке маршрутов:', error);
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
