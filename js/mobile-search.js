// ===== ФУНКЦИОНАЛЬНОСТЬ ПОИСКА =====
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const searchClearBtn = document.getElementById('searchClearBtn');

    if (!searchInput || !searchClearBtn) return;

    // Функция для выполнения поиска
    function performSearch(query) {
        // Если запрос пустой, показываем все маршруты
        if (!query.trim()) {
            RoutesManager.loadRoutes();
            return;
        }

        // Приводим запрос к нижнему регистру для нечувствительного к регистру поиска
        const searchTerm = query.toLowerCase().trim();

        // Фильтруем маршруты по названию и описанию
        const filteredRoutes = routesDatabase.routes.filter(route => {
            const titleMatch = route.title.toLowerCase().includes(searchTerm);
            const descriptionMatch = route.description.toLowerCase().includes(searchTerm);

            // Также ищем по точкам маршрута
            const pointsMatch = route.points.some(point => 
                point.title.toLowerCase().includes(searchTerm) || 
                point.description.toLowerCase().includes(searchTerm)
            );

            return titleMatch || descriptionMatch || pointsMatch;
        });

        // Отображаем результаты поиска
        displaySearchResults(filteredRoutes, searchTerm);
    }

    // Функция для отображения результатов поиска
    function displaySearchResults(results, searchTerm) {
        const routesGrid = document.getElementById('routesGrid');

        // Очищаем контейнер
        routesGrid.innerHTML = '';

        // Показываем сообщение о количестве найденных маршрутов
        const resultsHeader = document.createElement('div');
        resultsHeader.className = 'search-results-header';
        resultsHeader.innerHTML = `
            <h3>Результаты поиска: "${searchTerm}"</h3>
            <p>Найдено маршрутов: ${results.length}</p>
        `;
        routesGrid.appendChild(resultsHeader);

        // Если ничего не найдено
        if (results.length === 0) {
            const noResults = document.createElement('div');
            noResults.className = 'no-results';
            noResults.innerHTML = `
                <i class="fas fa-search"></i>
                <h3>Ничего не найдено</h3>
                <p>Попробуйте изменить поисковый запрос</p>
            `;
            routesGrid.appendChild(noResults);
            return;
        }

        // Добавляем найденные маршруты
        results.forEach((route, index) => {
            setTimeout(() => {
                const routeCard = RoutesManager.createRouteCard(route);
                routesGrid.appendChild(routeCard);
            }, index * 100); // Задержка для анимации
        });
    }

    // Обработчик ввода в поле поиска с задержкой (debounce)
    let searchTimeout;
    searchInput.addEventListener('input', function(e) {
        const query = e.target.value;

        // Показываем или скрываем кнопку очистки
        searchClearBtn.style.display = query ? 'flex' : 'none';

        // Отменяем предыдущий таймаут
        clearTimeout(searchTimeout);

        // Устанавливаем новый таймаут для выполнения поиска
        searchTimeout = setTimeout(() => {
            performSearch(query);
        }, 300); // Задержка 300 мс
    });

    // Обработчик нажатия на кнопку очистки
    searchClearBtn.addEventListener('click', function() {
        searchInput.value = '';
        searchClearBtn.style.display = 'none';
        RoutesManager.loadRoutes();
    });

    // Обработчик нажатия Enter в поле поиска
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const query = e.target.value;
            performSearch(query);
        }
    });
});
