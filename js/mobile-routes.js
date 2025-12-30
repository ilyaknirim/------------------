// ===== ЗАГРУЗКА МАРШРУТОВ =====
function loadRoutes() {
    const routesGrid = document.getElementById('routesGrid');

    // Очищаем контейнер
    routesGrid.innerHTML = '';

    // Проверяем, загружены ли маршруты
    if (routesDatabase.routes.length === 0) {
        routesGrid.innerHTML = '<div class="loading-message">Загрузка маршрутов...</div>';
        return;
    }

    // Перемешиваем маршруты
    const shuffledRoutes = [...routesDatabase.routes].sort(() => Math.random() - 0.5);

    shuffledRoutes.forEach(route => {
        const routeCard = createRouteCard(route);
        routesGrid.appendChild(routeCard);
    });
}

function createRouteCard(route) {
    const card = document.createElement('div');
    card.className = 'route-card';
    card.dataset.routeId = route.id;

    // Иконки категорий
    const categoryIcons = {
        'city': 'fa-city',
        'nature': 'fa-tree',
        'history': 'fa-landmark',
        'easy': 'fa-walking'
    };

    const categoryNames = {
        'city': 'Городской',
        'nature': 'Природный',
        'history': 'Исторический',
        'easy': 'Для начинающих'
    };

    card.innerHTML = `
        <div class="route-image" style="background-image: url('images/routes/${route.image || 'default-route.jpg'}');">
            <div class="route-type">
                ${route.category.map(cat => `<i class="fas ${categoryIcons[cat]}"></i>`).join(' ')}
                ${route.category.map(cat => categoryNames[cat]).join(', ')}
            </div>
        </div>
        <div class="route-content">
            <h3 class="route-title">${route.title}</h3>
            <p class="route-description">${route.description}</p>
            <div class="route-meta">
                <div class="route-stats">
                    <div class="route-stat">
                        <i class="fas fa-road"></i>
                        <span>${route.distance}</span>
                    </div>
                    <div class="route-stat">
                        <i class="fas fa-clock"></i>
                        <span>${route.duration}</span>
                    </div>
                </div>
                <button class="route-btn explore-route" data-route-id="${route.id}">
                    Подробнее <i class="fas fa-arrow-right"></i>
                </button>
            </div>
        </div>
    `;

    return card;
}

// Получение маршрута по ID
function getRouteById(routeId) {
    return routesDatabase.routes.find(r => r.id === parseInt(routeId));
}

// ===== МОДАЛЬНОЕ ОКНО МАРШРУТА =====
function showRouteModal(routeId) {
    const route = getRouteById(routeId);
    if (!route) return;

    const modal = document.getElementById('routeModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalSubtitle = document.getElementById('modalSubtitle');
    const modalBody = document.getElementById('modalBody');

    modalTitle.textContent = route.title;
    modalSubtitle.textContent = route.description;

    // Заполняем содержимое модального окна
    modalBody.innerHTML = `
        <div class="modal-map" id="modalMap"></div>

        <h3>Детали маршрута</h3>
        <div style="background: rgba(0,0,0,0.1); padding: 20px; border-radius: 12px; margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                <div>
                    <div style="font-size: 0.9rem; color: #666;">Расстояние</div>
                    <div style="font-size: 1.2rem; font-weight: bold; color: #4A90E2;">${route.distance}</div>
                </div>
                <div>
                    <div style="font-size: 0.9rem; color: #666;">Время</div>
                    <div style="font-size: 1.2rem; font-weight: bold; color: #4A90E2;">${route.duration}</div>
                </div>
                <div>
                    <div style="font-size: 0.9rem; color: #666;">Сложность</div>
                    <div style="font-size: 1.2rem; font-weight: bold; color: #4A90E2;">${route.difficulty}</div>
                </div>
            </div>
        </div>

        <h3>Точки маршрута</h3>
        <div style="max-height: 300px; overflow-y: auto; padding-right: 10px;">
            ${route.points.map((point, index) => `
                <div class="route-point">
                    <div class="point-header">
                        <div class="point-number">${index + 1}</div>
                        <h4 class="point-title">${point.title}</h4>
                    </div>
                    ${point.image ? `<img src="images/points/${point.image}" alt="${point.title}" style="width: 100%; border-radius: 8px; margin-bottom: 10px;">` : ''}
                    <p class="point-description">${point.description}</p>
                    <div class="point-activity">
                        <strong>Чем заняться:</strong> ${point.activity}
                    </div>
                    <div class="point-emotion">
                        <i class="fas fa-heart"></i> ${point.emotion}
                    </div>
                </div>
            `).join('')}
        </div>

        <div class="tips-section">
            <h4 class="tips-title">
                <i class="fas fa-lightbulb"></i> Советы для путешественника
            </h4>
            <ul style="padding-left: 20px; margin-top: 10px;">
                <li>Наденьте удобную обувь</li>
                <li>Возьмите воду и лёгкий перекус</li>
                <li>Зарядите телефон и скачайте офлайн-карту</li>
                <li>Сообщите о своём маршруте друзьям</li>
            </ul>
        </div>

        <div class="action-buttons">
            <button class="action-button primary-button" onclick="downloadRoute(${route.id})">
                <i class="fas fa-download"></i> Скачать маршрут
            </button>
            <button class="action-button secondary-button" onclick="shareRoute(${route.id})">
                <i class="fas fa-share-alt"></i> Поделиться
            </button>
        </div>
    `;

    // Инициализируем карту в модальном окне
    setTimeout(() => {
        const modalMap = L.map('modalMap').setView(route.points[0].coords, 14);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(modalMap);

        // Отображаем маршрут на мини-карте
        const modalRoutePoints = route.points.map(p => p.coords);
        L.polyline(modalRoutePoints, {
            color: route.color,
            weight: 3,
            opacity: 0.8
        }).addTo(modalMap);

        // Добавляем маркеры
        route.points.forEach((point, index) => {
            L.marker(point.coords, {
                icon: L.divIcon({
                    html: `<div style="background: ${route.color}; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 2px solid white;">${index + 1}</div>`,
                    iconSize: [24, 24]
                })
            }).addTo(modalMap)
            .bindPopup(point.title);
        });

        modalMap.fitBounds(L.polyline(modalRoutePoints).getBounds(), { padding: [20, 20] });
    }, 100);

    // Показываем модальное окно
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';

    // Отображаем маршрут на основной карте
    MapManager.displayRouteOnMap(route);
}

// ===== ГЛОБАЛЬНЫЕ ФУНКЦИИ =====
window.shareRoute = function(routeId) {
    const route = getRouteById(routeId);
    if (route && navigator.share) {
        navigator.share({
            title: route.title,
            text: `Маршрут по Пскову: ${route.description}`,
            url: window.location.href
        });
    } else {
        alert(`Скопируйте ссылку для маршрута "${route.title}"`);
    }
};

window.downloadRoute = function(routeId) {
    const route = getRouteById(routeId);
    if (route) {
        // Здесь будет генерация GPX-файла
        alert(`Маршрут "${route.title}" готов к скачиванию!`);
    }
};

// Экспорт функций
window.RoutesManager = {
    loadRoutesData: () => {
        return new Promise((resolve) => {
            if (routesDatabase.routes.length > 0) {
                resolve(routesDatabase);
            } else {
                // Если маршруты еще не загружены, ждем загрузки
                const checkData = setInterval(() => {
                    if (routesDatabase.routes.length > 0) {
                        clearInterval(checkData);
                        resolve(routesDatabase);
                    }
                }, 100);
            }
        });
    },
    loadRoutes,
    getRouteById,
    routesDatabase
};
