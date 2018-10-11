import "phaser";
import GameScene from "./scenes/GameScene";
import { GAME } from "./constants";

const config = {
    type: Phaser.WEBGL,
    pixelArt: true,
    roundPixels: true,
    parent: "content",
    width: GAME.WIDTH,
    height: GAME.HEIGHT,
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
