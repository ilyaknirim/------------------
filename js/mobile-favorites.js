// ===== ФУНКЦИОНАЛЬНОСТЬ ИЗБРАННЫХ МАРШРУТОВ =====
document.addEventListener('DOMContentLoaded', function() {
    // Функция для получения избранных маршрутов из localStorage
    function getFavorites() {
        const favorites = localStorage.getItem('favoriteRoutes');
        return favorites ? JSON.parse(favorites) : [];
    }

    // Функция для сохранения избранных маршрутов в localStorage
    function saveFavorites(favorites) {
        localStorage.setItem('favoriteRoutes', JSON.stringify(favorites));
    }

    // Функция для добавления маршрута в избранное
    function addToFavorites(routeId) {
        const favorites = getFavorites();
        if (!favorites.includes(routeId)) {
            favorites.push(routeId);
            saveFavorites(favorites);
            updateFavoriteButtons();
            console.log(`Маршрут ${routeId} добавлен в избранное`);
        }
    }

    // Функция для удаления маршрута из избранного
    function removeFromFavorites(routeId) {
        const favorites = getFavorites();
        const index = favorites.indexOf(routeId);
        if (index !== -1) {
            favorites.splice(index, 1);
            saveFavorites(favorites);
            updateFavoriteButtons();
            console.log(`Маршрут ${routeId} удален из избранного`);
        }
    }

    // Функция для проверки, является ли маршрут избранным
    function isFavorite(routeId) {
        const favorites = getFavorites();
        return favorites.includes(routeId);
    }

    // Функция для обновления состояния кнопок избранного
    function updateFavoriteButtons() {
        document.querySelectorAll('.favorite-btn').forEach(btn => {
            const routeId = parseInt(btn.dataset.routeId);
            if (isFavorite(routeId)) {
                btn.classList.add('active');
                btn.innerHTML = '<i class="fas fa-heart"></i> В избранном';
            } else {
                btn.classList.remove('active');
                btn.innerHTML = '<i class="far fa-heart"></i> В избранное';
            }
        });
    }

    // Функция для отображения избранных маршрутов
    function showFavorites() {
        const favorites = getFavorites();
        if (favorites.length === 0) {
            const routesGrid = document.getElementById('routesGrid');
            routesGrid.innerHTML = `
                <div class="no-favorites">
                    <i class="far fa-heart"></i>
                    <h3>У вас нет избранных маршрутов</h3>
                    <p>Добавляйте маршруты в избранное, чтобы они всегда были под рукой</p>
                </div>
            `;
            return;
        }

        // Получаем данные о маршрутах
        RoutesManager.loadRoutesData().then(data => {
            const favoriteRoutes = data.routes.filter(route => favorites.includes(route.id));

            const routesGrid = document.getElementById('routesGrid');
            routesGrid.innerHTML = '';

            // Показываем заголовок
            const header = document.createElement('div');
            header.className = 'favorites-header';
            header.innerHTML = '<h3>Избранные маршруты</h3>';
            routesGrid.appendChild(header);

            // Добавляем избранные маршруты
            favoriteRoutes.forEach((route, index) => {
                setTimeout(() => {
                    const routeCard = RoutesManager.createRouteCard(route);
                    routesGrid.appendChild(routeCard);
                }, index * 100);
            });
        });
    }

    // Обработчики событий для кнопок избранного
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('favorite-btn') ||
            e.target.closest('.favorite-btn')) {
            e.preventDefault();
            e.stopPropagation();

            const button = e.target.classList.contains('favorite-btn') ?
                         e.target : e.target.closest('.favorite-btn');
            const routeId = parseInt(button.dataset.routeId);

            if (isFavorite(routeId)) {
                removeFromFavorites(routeId);
            } else {
                addToFavorites(routeId);
            }
        }
    });

    // Добавляем кнопку избранного в карточку маршрута
    const originalCreateRouteCard = RoutesManager.createRouteCard;
    RoutesManager.createRouteCard = function(route) {
        const card = originalCreateRouteCard(route);

        // Находим контейнер с мета-информацией
        const routeMeta = card.querySelector('.route-meta');
        if (routeMeta) {
            // Создаем кнопку избранного
            const favoriteBtn = document.createElement('button');
            favoriteBtn.className = 'route-btn favorite-btn';
            favoriteBtn.dataset.routeId = route.id;

            if (isFavorite(route.id)) {
                favoriteBtn.classList.add('active');
                favoriteBtn.innerHTML = '<i class="fas fa-heart"></i> В избранном';
            } else {
                favoriteBtn.innerHTML = '<i class="far fa-heart"></i> В избранное';
            }

            // Добавляем кнопку после статистики
            routeStats = routeMeta.querySelector('.route-stats');
            if (routeStats) {
                routeStats.after(favoriteBtn);
            }
        }

        return card;
    };

    // Добавляем вкладку "Избранное" в фильтры
    const filterTabs = document.querySelector('.filter-tabs');
    if (filterTabs) {
        const favoritesTab = document.createElement('button');
        favoritesTab.className = 'filter-tab';
        favoritesTab.dataset.category = 'favorites';
        favoritesTab.innerHTML = '<i class="fas fa-heart"></i> Избранное';

        // Добавляем обработчик для вкладки "Избранное"
        favoritesTab.addEventListener('click', function() {
            // Удаляем активный класс у всех вкладок
            document.querySelectorAll('.filter-tab').forEach(tab => tab.classList.remove('active'));

            // Добавляем активный класс к текущей вкладке
            this.classList.add('active');

            // Показываем избранные маршруты
            showFavorites();
        });

        // Вставляем вкладку после последней
        const lastTab = filterTabs.lastElementChild;
        lastTab.after(favoritesTab);
    }

    // Экспорт функций для использования в других модулях
    window.FavoritesManager = {
        getFavorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        showFavorites
    };
});
