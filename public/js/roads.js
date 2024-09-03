// public/js/roads.js
class Roads {
    constructor(ctx, canvas) {
        this.ctx = ctx;
        this.canvas = canvas;
        this.canvasHelper = new Canvas(ctx);
        this.coordinates = new Coordinates(canvas);
        this.roads = [];
        this.highlightedRoad = null;
    }

    async fetchRoads() {
        const bbox = `${this.coordinates.south},${this.coordinates.west},${this.coordinates.north},${this.coordinates.east}`;
        const query = `
        [out:json];
        (
          way["highway"](${bbox});
        );
        out geom;
        `;
        const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

        const response = await fetch(url);
        const data = await response.json();
        this.processRoadData(data);
    }

    async fetchRoads2() {
        const bbox = `${this.coordinates.south},${this.coordinates.west},${this.coordinates.north},${this.coordinates.east}`;
    
        // Use the server API to fetch roads, which will handle DB checks and API calls
        const url = `/api/roads?south=${this.coordinates.south}&west=${this.coordinates.west}&north=${this.coordinates.north}&east=${this.coordinates.east}`;
    
        try {
            const response = await fetch(url);
            const data = await response.json();
            this.processRoadData(data);
        } catch (error) {
            console.error('Error fetching roads:', error);
        }
    } 

    processRoadData(data) {
        this.roads = data.elements.map(way => ({
            id: way.id,
            name: way.tags.name || "Unnamed Road",
            tags: way.tags,
            geometry: way.geometry.map(point => this.coordinates.latLongToXY(point.lat, point.lon))
        }));
    }

    drawRoads() {
        this.canvasHelper.clear(this.canvas.width, this.canvas.height);
        this.roads.forEach(road => this.canvasHelper.drawRoad(road, road === this.highlightedRoad));
    }

    findNearestRoad(x, y) {
        let minDistance = Infinity;
        let nearestRoad = null;

        for (const road of this.roads) {
            for (let i = 1; i < road.geometry.length; i++) {
                const p1 = road.geometry[i - 1];
                const p2 = road.geometry[i];
                const distance = distanceToSegment({ x, y }, p1, p2);

                if (distance < minDistance) {
                    minDistance = distance;
                    nearestRoad = road;
                }
            }
        }

        return minDistance < 10 ? nearestRoad : null;
    }

    highlightRoad(road) {
        if (road !== this.highlightedRoad) {
            this.highlightedRoad = road;
            this.drawRoads();
        }
    }
}
