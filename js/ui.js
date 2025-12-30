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

// Экспорт функций
window.UIManager = {
    initializeNavigation,
    showRouteModal,
    initializeEventListeners,
    initializeScrollEffects
};
