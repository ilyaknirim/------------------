// ===== ИНИЦИАЛИЗАЦИЯ ПРИЛОЖЕНИЯ =====
document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Загружаем данные о маршрутах
        await RoutesManager.loadRoutesData();

        // Инициализируем компоненты
        MapManager.initializeMap();
        MapManager.setupMapControls();
        UIManager.initializeNavigation();
        RoutesManager.loadRoutes();
        UIManager.initializeEventListeners();
        UIManager.initializeScrollEffects();

        console.log('Приложение успешно инициализировано');
    } catch (error) {
        console.error('Ошибка при инициализации приложения:', error);
    }
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