export class Camera {
    constructor(game) {
        this.game = game;
    }

    handleInput(key) {
        switch(key) {
            case 'up':
                this.game.camera.y -= 40;
                break;
            case 'left':
                this.game.camera.x -= 40;
                break;
            case 'down':
                this.game.camera.y += 40;
                break;
            case 'right':
                this.game.camera.x += 40;
                break;
            default:
        }
    }
}