import Phaser from 'phaser';

class GameScene extends Phaser.Scene {
    constructor(test) {
        super({
            key: 'GameScene'
        });
    }

    preload() {
        this.load.image('background', 'assets/images/background.png');
    }

    create() {
        this.add.sprite(400, 240, 'background');
    }
}

export default GameScene;