import "phaser";
import GameScene from "./scenes/GameScene";

const config = {
    type: Phaser.WEBGL,
    pixelArt: true,
    roundPixels: true,
    parent: "test",
    width: 1000,
    height: 1000,
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 800 },
            debug: false
        }
    },
    scene: [GameScene]
};

const game = new Phaser.Game(config);
