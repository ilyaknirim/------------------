// ===== ОБРАБОТКА ЖЕСТОВ СВАЙПА =====
document.addEventListener('DOMContentLoaded', function() {
    // Проверяем, является ли устройство мобильным
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (!isMobile) return;

    const filterTabs = document.querySelector('.filter-tabs');
    if (!filterTabs) return;

    let startX = 0;
    let scrollLeft = 0;
    let isDown = false;

    // Обработчики событий для свайпа
    filterTabs.addEventListener('mousedown', (e) => {
        isDown = true;
        startX = e.pageX - filterTabs.offsetLeft;
        scrollLeft = filterTabs.scrollLeft;
    });

    filterTabs.addEventListener('mouseleave', () => {
        isDown = false;
    });

    filterTabs.addEventListener('mouseup', () => {
        isDown = false;
    });

    filterTabs.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - filterTabs.offsetLeft;
        const walk = (x - startX) * 2; // Скорость прокрутки
        filterTabs.scrollLeft = scrollLeft - walk;
    });

    // Обработка касаний для мобильных устройств
    let touchStartX = 0;

    filterTabs.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    filterTabs.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;

        // Определяем направление свайпа
        if (Math.abs(diff) > 50) { // Минимальное расстояние для срабатывания свайпа
            const activeTab = document.querySelector('.filter-tab.active');
            const tabs = Array.from(document.querySelectorAll('.filter-tab'));
            const currentIndex = tabs.indexOf(activeTab);

            if (diff > 0 && currentIndex < tabs.length - 1) {
                // Свайп влево - следующая категория
                tabs[currentIndex + 1].click();
            } else if (diff < 0 && currentIndex > 0) {
                // Свайп вправо - предыдущая категория
                tabs[currentIndex - 1].click();
            }
        }
    });
});
