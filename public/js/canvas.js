// public/js/canvas.js
class Canvas {
    constructor(ctx) {
        this.ctx = ctx;
    }

    clear(width, height) {
        this.ctx.clearRect(0, 0, width, height);
    }

    drawRoad(road, isHighlighted = false) {
        this.ctx.strokeStyle = isHighlighted ? 'yellow' : 'blue';
        this.ctx.lineWidth = isHighlighted ? 4 : 2;

        this.ctx.beginPath();
        road.geometry.forEach((point, index) => {
            if (index === 0) {
                this.ctx.moveTo(point.x, point.y);
            } else {
                this.ctx.lineTo(point.x, point.y);
            }
        });
        this.ctx.stroke();
    }
}
