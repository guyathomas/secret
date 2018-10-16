import "phaser";
import GameScene from "./scenes/GameScene";
import { GAME } from "./constants";
import Amplify, { API } from "aws-amplify";
import awsconfig from './aws-exports';

Amplify.configure(awsconfig);

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

window.initials = window.prompt('What are your initials?').slice(0,3);
API.get('topscore', '/topscores')
    .then(console.log)

const game = new Phaser.Game(config);
