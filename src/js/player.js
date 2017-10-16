export class Player {
    constructor(game) {
        this.game = game;
        this.sprite = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'player');
        this.sprite.anchor.x = 0.5;
        this.sprite.anchor.y = 0.5;

        //this.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
        //this.sprite.body.bounce.y = 0.2;
        //this.sprite.body.gravity.y = 400;
        //this.sprite.body.collideWorldBounds = true;

        this.sprite.animations.add('left', [0, 1, 2, 3], 10, true);
        this.sprite.animations.add('right', [5, 6, 7, 8], 10, true);
    }

    handleInput(key) {
        switch(key) {
            case 'up':
                //if (this.sprite.body.touching.down && this.hitPlatform) {
                //    this.sprite.body.velocity.y = -350;
               // }
                break;
            case 'left':
                //this.sprite.body.velocity.x = -175;
                //this.sprite.animations.play('left');
                break;
            case 'down':
                break;
            case 'right':
                //this.sprite.body.velocity.x = 175;
                //this.sprite.animations.play('right');
                break;
            default:
                //this.sprite.body.velocity.x = 0;
                //this.sprite.animations.stop();
                //this.sprite.frame = 4;
        }
    }
}