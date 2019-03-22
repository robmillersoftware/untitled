export class LoadScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'load',
        });
    }

    preload() {
        this.loadAssets();
        //this.add.image(this.centerX(), this.centerY(), 'logo');
        this.createProgressBar(this.centerX(), this.centerY() + 200);
    }


    loadAssets () {
        this.load.image('floor', 'assets/top-down/floor.png');
        this.load.start();
    }

    createProgressBar (x, y) {
        // size & position
        let width = 400;
        let height = 20;
        let xStart = x - width / 2;
        let yStart = y - height / 2;

        // border size
        let borderOffset = 2;

        let borderRect = new Phaser.Geom.Rectangle(
            xStart - borderOffset,
            yStart - borderOffset,
            width + borderOffset * 2,
            height + borderOffset * 2);

        let border = this.add.graphics({
            lineStyle: {
                width: 5,
                color: 0xaaaaaa
            }
        });
        border.strokeRectShape(borderRect);

        let progressbar = this.add.graphics();

        let updateProgressbar = function (percentage) {
            progressbar.clear();
            progressbar.fillStyle(0xffffff, 1);
            progressbar.fillRect(xStart, yStart, percentage * width, height);
        };

        this.load.on('progress', updateProgressbar);

        this.load.once('complete', function () {
            this.load.off('progress', updateProgressbar);
            //this.scene.start('menu');
            this.scene.start('play');
        }, this);
    }

    centerX() {
        return this.sys.game.config.width / 2;
    }

    centerY() {
        return this.sys.game.config.height / 2;
    }
}