// ===== СИСТЕМА МАРШРУТОВ =====
let routesDatabase = {
    routes: []
};

// Загрузка данных о маршрутах
async function loadRoutesData() {
    try {
        const response = await fetch('./data/routes.json');
        const data = await response.json();
        routesDatabase = data;
        return data;
    } catch (error) {
        console.error('Ошибка при загрузке маршрутов:', error);
        return null;
    }
}

// ===== ЗАГРУЗКА МАРШРУТОВ =====
function loadRoutes() {
    const routesGrid = document.getElementById('routesGrid');

    // Очищаем контейнер
    routesGrid.innerHTML = '';

    routesDatabase.routes.forEach(route => {
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

// Фильтрация маршрутов
function filterRoutes(category) {
    document.querySelectorAll('.route-card').forEach(card => {
        if (category === 'all' || card.dataset.category.includes(category)) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

// Получение маршрута по ID
function getRouteById(routeId) {
    return routesDatabase.routes.find(r => r.id === parseInt(routeId));
}

// Экспорт функций
window.RoutesManager = {
    loadRoutesData,
    loadRoutes,
    filterRoutes,
    getRouteById,
    routesDatabase
};