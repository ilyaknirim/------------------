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
    card.className = 'route-card fade-in-up';
    card.dataset.category = route.category.join(' ');
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
        <div class="route-image" style="background: linear-gradient(135deg, ${route.color}40, ${route.color}80);">
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
                    <div class="route-stat">
                        <i class="fas fa-mountain"></i>
                        <span>${route.difficulty}</span>
                    </div>
                </div>
                <button class="route-btn explore-route" data-route-id="${route.id}">
                    Исследовать <i class="fas fa-arrow-right"></i>
                </button>
            </div>
        </div>
    `;

    return card;
}

// Фильтрация маршрутов (не используется в упрощенной версии)
function filterRoutes(category) {
    // Функция не используется в упрощенной версии
    return;
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
        <div class="grid grid-2">
            <div>
                <h3>Детали маршрута</h3>
                <div style="background: rgba(0,0,0,0.1); padding: 20px; border-radius: var(--radius-medium); margin-bottom: 20px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                        <div>
                            <div style="font-size: 0.9rem; color: var(--text-secondary);">Расстояние</div>
                            <div style="font-size: 1.2rem; font-weight: bold; color: var(--accent-primary);">${route.distance}</div>
                        </div>
                        <div>
                            <div style="font-size: 0.9rem; color: var(--text-secondary);">Время</div>
                            <div style="font-size: 1.2rem; font-weight: bold; color: var(--accent-primary);">${route.duration}</div>
                        </div>
                        <div>
                            <div style="font-size: 0.9rem; color: var(--text-secondary);">Сложность</div>
                            <div style="font-size: 1.2rem; font-weight: bold; color: var(--accent-primary);">${route.difficulty}</div>
                        </div>
                    </div>
                </div>

                <h3>Точки маршрута</h3>
                <div style="max-height: 400px; overflow-y: auto; padding-right: 10px;">
                    ${route.points.map((point, index) => `
                        <div style="background: rgba(0,0,0,0.05); padding: 20px; border-radius: var(--radius-medium); margin-bottom: 15px; border-left: 4px solid ${route.color};">
                            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                                <div style="width: 30px; height: 30px; background: ${route.color}; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold;">
                                    ${index + 1}
                                </div>
                                <h4 style="margin: 0;">${point.title}</h4>
                            </div>
                            <p style="margin-bottom: 10px;">${point.description}</p>
                            <div style="background: rgba(78, 205, 196, 0.1); padding: 10px; border-radius: var(--radius-small);">
                                <strong style="color: var(--accent-primary);">Чем заняться:</strong> ${point.activity}
                            </div>
                            <div style="margin-top: 10px; font-style: italic; color: var(--text-secondary);">
                                <i class="fas fa-heart"></i> ${point.emotion}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div>
                <h3>На карте</h3>
                <div id="modalMap" style="height: 400px; border-radius: var(--radius-medium); overflow: hidden; margin-bottom: 20px;"></div>

                <div style="background: rgba(255, 107, 107, 0.1); padding: 20px; border-radius: var(--radius-medium); border-left: 4px solid var(--color-sunset);">
                    <h4 style="color: var(--color-sunset); margin-bottom: 10px;">
                        <i class="fas fa-lightbulb"></i> Советы для путешественника
                    </h4>
                    <ul style="padding-left: 20px;">
                        <li>Наденьте удобную обувь</li>
                        <li>Возьмите воду и лёгкий перекус</li>
                        <li>Зарядите телефон и скачайте офлайн-карту</li>
                        <li>Сообщите о своём маршруте друзьям</li>
                    </ul>
                </div>

                <div style="margin-top: 20px;">
                    <button class="route-btn" style="width: 100%; padding: 15px; font-size: 1.1rem;" onclick="downloadRoute(${route.id})">
                        <i class="fas fa-download"></i> Скачать маршрут (GPX)
                    </button>
                    <button class="route-btn" style="width: 100%; margin-top: 10px; padding: 15px; font-size: 1.1rem; background: var(--bg-secondary);" onclick="shareRoute(${route.id})">
                        <i class="fas fa-share-alt"></i> Поделиться с друзьями
                    </button>
                </div>
            </div>
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
    filterRoutes,
    getRouteById,
    routesDatabase
};
