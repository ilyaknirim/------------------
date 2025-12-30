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

    // Переключение панели маршрутов
    document.getElementById('panelToggle').addEventListener('click', function() {
        const panel = document.getElementById('routesPanel');
        panel.classList.toggle('collapsed');
    });

    // Кнопки "Подробнее" на карточках маршрутов
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

// Экспорт функций
window.UIManager = {
    initializeEventListeners
};
