// ===== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ =====
const startPoint = [57.8138, 28.3496]; // Псковский вокзал
let map = null;
let currentRouteLayer = null;
let currentMarkers = [];

// ===== СИСТЕМА МАРШРУТОВ =====
let routesDatabase = {
    routes: [] // Будет загружено из JSON файла
};

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
    UIManager.initializeNavigation();
    UIManager.initializeEventListeners();
    UIManager.initializeScrollEffects();

    // Загружаем маршруты из JSON файла
    await loadRoutesFromJSON();
    RoutesManager.loadRoutes();

    console.log('Приложение успешно инициализировано');
});

// ===== ГЛОБАЛЬНЫЕ ФУНКЦИИ =====
// Функция для загрузки HTML-компонентов
async function loadComponent(componentPath, targetElementId) {
    try {
        const response = await fetch(componentPath);
        const html = await response.text();
        document.getElementById(targetElementId).innerHTML = html;
        return true;
    } catch (error) {
        console.error(`Ошибка при загрузке компонента ${componentPath}:`, error);
        return false;
    }
}

// Функция для отладки
function debugLog(message, data = null) {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log(`[DEBUG] ${message}`, data);
    }
}

// Экспорт глобальных функций
window.App = {
    loadComponent,
    debugLog
};
