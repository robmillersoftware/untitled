export class MapSite {
    constructor(x, y) {
        let height = Math.floor(Math.random() * MAX_TERRAIN_HEIGHT);
        this.center = new Phaser.Point(x, y);
        this.height = height;
        this.neighbors = [];
        this.edges = [];
        this.corners = [];
        this.color = hexFromHeight(this.height);
    }

    draw(graphics) {
        graphics.lineStyle(3, this.color);
        graphics.drawCircle(this.center.x, this.center.y, 3);
    }
}