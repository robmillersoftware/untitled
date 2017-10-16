export class HeightMapVertex extends Phaser.Point {
    constructor(x, y, h) {
        super(x, y);
        this.height = h;
    }
}