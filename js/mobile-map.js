// ===== КАРТА =====
function initializeMap() {
    map = L.map('mainMap').setView(startPoint, 14);

    // Основной слой OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18
    }).addTo(map);

    // Маркер стартовой точки
    L.marker(startPoint, {
        icon: L.divIcon({
            html: '<div class="custom-marker start-marker"><i class="fas fa-flag"></i></div>',
            iconSize: [30, 30],
            className: 'custom-start-marker'
        })
    }).addTo(map)
    .bindPopup('<b>Псковский железнодорожный вокзал</b><br>Начало всех маршрутов')
    .openPopup();

    // Обработчик успешного определения местоположения
    map.on('locationfound', function(e) {
        L.marker(e.latlng).addTo(map)
            .bindPopup("Вы здесь!")
            .openPopup();
        L.circle(e.latlng, e.accuracy/2).addTo(map);
    });
}

// ===== ОТОБРАЖЕНИЕ МАРШРУТА НА КАРТЕ =====
function displayRouteOnMap(route) {
    // Очищаем предыдущий маршрут
    if (currentRouteLayer) {
        map.removeLayer(currentRouteLayer);
    }
    currentMarkers.forEach(marker => map.removeLayer(marker));
    currentMarkers = [];

    // Создаём линию маршрута
    const routePoints = route.points.map(p => p.coords);
    currentRouteLayer = L.polyline(routePoints, {
        color: route.color || '#4ecdc4',
        weight: 4,
        opacity: 0.8,
        smoothFactor: 1,
        className: 'route-line'
    }).addTo(map);

    // Добавляем маркеры точек
    route.points.forEach((point, index) => {
        let markerClass = 'custom-marker';
        if (point.type === 'start') markerClass += ' start-marker';
        if (point.type === 'end') markerClass += ' end-marker';

        const marker = L.marker(point.coords, {
            icon: L.divIcon({
                html: `
                    <div class="${markerClass}">
                        <i class="fas ${point.icon}"></i>
                        <div class="marker-number">${index + 1}</div>
                    </div>
                `,
                iconSize: [30, 30],
                className: 'custom-route-marker'
            })
        }).addTo(map);

        marker.bindPopup(`
            <div style="max-width: 300px;">
                <h4 style="margin: 0 0 10px; color: #1a2b3c;">${point.title}</h4>
                <p style="margin: 0 0 10px;">${point.description}</p>
                <div style="background: #f0f8ff; padding: 10px; border-radius: 8px; margin-top: 10px;">
                    <strong style="color: #4ecdc4;">Чем заняться:</strong><br>
                    ${point.activity}
                </div>
                <div style="margin-top: 10px; font-style: italic; color: #666;">
                    <i class="fas fa-heart"></i> Настроение: ${point.emotion}
                </div>
            </div>
        `);

        currentMarkers.push(marker);
    });

    // Устанавливаем границы карты
    map.fitBounds(currentRouteLayer.getBounds(), { padding: [50, 50] });
}

// ===== УПРАВЛЕНИЕ КАРТОЙ =====
function setupMapControls() {
    // Кнопка определения местоположения
    document.getElementById('locateBtn').addEventListener('click', function() {
        map.locate({setView: true, maxZoom: 16});
    });

    // Кнопка слоев (заглушка для будущей функциональности)
    document.getElementById('layersBtn').addEventListener('click', function() {
        // Здесь можно добавить функционал переключения слоев карты
        alert('Функционал переключения слоев будет добавлен в следующей версии');
    });
}

// Экспорт функций
window.MapManager = {
    initializeMap,
    displayRouteOnMap,
    setupMapControls,
    startPoint,
    map: () => map
};
