// ===== НАВИГАЦИЯ =====
function initializeNavigation() {
    const header = document.getElementById('header');
    const navLinks = document.querySelectorAll('.nav-link');

    // Скролл хедера
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Активная секция в навигации
        const sections = document.querySelectorAll('section');
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;

            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // Плавный скролл
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== МОДАЛЬНОЕ ОКНО МАРШРУТА =====
function showRouteModal(routeId) {
    const route = RoutesManager.getRouteById(routeId);
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

    // Фильтрация маршрутов
    document.querySelectorAll('.category-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const category = this.dataset.category;

            // Обновляем активную вкладку
            document.querySelectorAll('.category-tab').forEach(t => {
                t.classList.remove('active');
            });
            this.classList.add('active');

            // Фильтруем маршруты
            RoutesManager.filterRoutes(category);
        });
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
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);

    // Наблюдаем за элементами, которые должны появляться при скролле
    document.querySelectorAll('.route-card, .section-header, .category-tabs').forEach(el => {
        observer.observe(el);
    });
}

// ===== ГЛОБАЛЬНЫЕ ФУНКЦИИ =====
window.shareRoute = function(routeId) {
    const route = RoutesManager.getRouteById(routeId);
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
    const route = RoutesManager.getRouteById(routeId);
    if (route) {
        // Здесь будет генерация GPX-файла
        alert(`Маршрут "${route.title}" готов к скачиванию!`);
    }
};

// Экспорт функций
window.UIManager = {
    initializeNavigation,
    showRouteModal,
    initializeEventListeners,
    initializeScrollEffects
};