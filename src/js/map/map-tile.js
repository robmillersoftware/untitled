import {MapSite} from './map-site';

export class MapTile {
    constructor(x, y, sprite, detail = 1) {
        this.sprite = sprite;
        this.paddedBounds = new Phaser.Rectangle(x + 3, y + 3, 
            this.sprite.width - 6, this.sprite.height - 6);
        this.sites = this.generateRandomSites(detail);
    }

    generateRandomSites(detail) {
        let rtn = [];
        let edgeSize = Math.floor(this.paddedBounds.width / (10 * detail));

        let faces = [];
        for (let i = 0; i < 10 * detail; i++) {
            for (let j = 0; j < 10 * detail; j++) {
                let x = Math.floor(this.paddedBounds.left + edgeSize * i);
                let y = Math.floor(this.paddedBounds.topLeft.y + edgeSize * j);
                faces.push(new Phaser.Rectangle(x, y, edgeSize, edgeSize));
            }
        }

        while (faces.length !== 0) {
            let randIdx = Math.floor(Math.random() * (faces.length - 1));
            let randX = Math.floor(Math.random() * edgeSize);
            let randY = Math.floor(Math.random() * edgeSize);

            rtn.push(new MapSite(faces[randIdx].topLeft.x + randX, faces[randIdx].topLeft.y + randY));
            faces.splice(randIdx, 1);
        }

        return rtn;
    }

    drawSites(graphics) {
        this.sites.forEach((site, i) => {
            site.draw(graphics);
        });
    }

    get centers() {
        let rtn = [];
        this.sites.forEach((site, i) => {
            rtn.push(site.center);
        });
        return rtn;
    }
}