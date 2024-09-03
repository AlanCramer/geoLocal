// public/js/coordinates.js
class Coordinates {
    constructor(canvas, xyCoordsElement, latLongCoordsElement) {
        this.canvas = canvas;
        this.xyCoordsElement = xyCoordsElement;
        this.latLongCoordsElement = latLongCoordsElement;
        this.south = 39.612480;
        this.west = -105.198450;
        this.north = 39.646655;
        this.east = -105.130594;
    }

    latLongToXY(lat, lon) {
        const x = ((lon - this.west) / (this.east - this.west)) * this.canvas.width;
        const y = this.canvas.height - ((lat - this.south) / (this.north - this.south)) * this.canvas.height;
        return { x, y };
    }

    xyToLatLong(x, y) {
        const lon = this.west + (x / this.canvas.width) * (this.east - this.west);
        const lat = this.south + ((this.canvas.height - y) / this.canvas.height) * (this.north - this.south);
        return { lat, lon };
    }

    updateCoordinates(event) {
        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const { lat, lon } = this.xyToLatLong(x, y);

        this.xyCoordsElement.textContent = `${x.toFixed(2)}, ${y.toFixed(2)}`;
        this.latLongCoordsElement.textContent = `${lat.toFixed(6)}, ${lon.toFixed(6)}`;

        return { x, y, lat, lon };
    }
}
