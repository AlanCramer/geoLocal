// public/js/app.js
document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById('mapCanvas');
    const ctx = canvas.getContext('2d');
    const xyCoords = document.getElementById('xy-coords');
    const latLongCoords = document.getElementById('latlong-coords');
    const roadInfo = document.createElement('p');
    document.getElementById('coordinates').appendChild(roadInfo);

    const roads = new Roads(ctx, canvas);
    const coordinates = new Coordinates(canvas, xyCoords, latLongCoords);

    // Initialize the canvas with the roads
    roads.fetchRoads().then(() => roads.drawRoads());

    // Handle mouse movement
    canvas.addEventListener('mousemove', (event) => {
        const { x, y, lat, lon } = coordinates.updateCoordinates(event);
        const road = roads.findNearestRoad(x, y);
        
        if (road) {
            roadInfo.textContent = `Road: ${road.name}, Tags: ${JSON.stringify(road.tags)}`;
        } else {
            roadInfo.textContent = "No road nearby";
        }

        roads.highlightRoad(road);
    });
});
