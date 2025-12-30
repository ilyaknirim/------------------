// ===== ОБРАБОТЧИКИ СОБЫТИЙ =====
function initializeEventListeners() {
    // Закрытие модального окна
    document.getElementById('modalClose').addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        closeModal();
    });

    // Клик вне модального окна
    document.getElementById('routeModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });

    // Закрытие модального окна по клавише Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
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

    // Обработчики для вкладок фильтрации
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            // Удаляем активный класс у всех вкладок
            document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));

            // Добавляем активный класс к текущей вкладке
            this.classList.add('active');

            // Получаем категорию для фильтрации
            const category = this.dataset.category;

            // Загружаем отфильтрованные маршруты
            if (category === 'all') {
                RoutesManager.loadRoutes();
            } else {
                RoutesManager.loadRoutes(category);
            }
        });
    });
}

// Функция для закрытия модального окна
function closeModal() {
    const modal = document.getElementById('routeModal');
    if (modal && modal.style.display !== 'none') {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Функция для открытия модального окна
function openModal() {
    const modal = document.getElementById('routeModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

// Экспорт функций
window.UIManager = {
    initializeEventListeners,
    closeModal,
    openModal
};
