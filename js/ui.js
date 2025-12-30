// ===== НАВИГАЦИЯ =====
function initializeNavigation() {
    // Функция не используется в упрощенной версии
    return;
}

// ===== ОБРАБОТЧИКИ СОБЫТИЙ =====
function initializeEventListeners() {
    // Закрытие модального окна
    document.getElementById('modalClose').addEventListener('click', function() {
        document.getElementById('routeModal').style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    // Клик вне модального окна
    document.getElementById('routeModal').addEventListener('click', function(e) {
        if (e.target === this) {
            this.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // Кнопки "Исследовать" на карточках маршрутов
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('explore-route') ||
            e.target.closest('.explore-route')) {
            const button = e.target.classList.contains('explore-route') ?
                         e.target : e.target.closest('.explore-route');
            const routeId = parseInt(button.dataset.routeId);
            showRouteModal(routeId);
        }
    });
}

// ===== ЭФФЕКТЫ ПРИ СКРОЛЛЕ =====
function initializeScrollEffects() {
    // Функция не используется в упрощенной версии
    return;
}

// Экспорт функций
window.UIManager = {
    initializeNavigation,
    showRouteModal,
    initializeEventListeners,
    initializeScrollEffects
};
