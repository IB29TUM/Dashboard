document.addEventListener('DOMContentLoaded', () => {
    mapboxgl.accessToken = 'pk.eyJ1IjoiaWI5OCIsImEiOiJjbGhhbTRuaXUwOGliM2Ruc3h2YTFoMG9yIn0.YtRfHX0vI6aXB6WBD6hajg';
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/navigation-night-v1',
        center: [11.5820, 48.1351], // Longitude and Latitude of Munich
        zoom: 12
    });

    map.addControl(new mapboxgl.NavigationControl());
});
