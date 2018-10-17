import "phaser";
import GameScene from "./scenes/GameScene";
import { GAME } from "./constants";
import sanitizeHtml from 'sanitize-html';
import Amplify, { API } from "aws-amplify";
import awsconfig from './aws-exports';

Amplify.configure(awsconfig);
Amplify.Logger.LOG_LEVEL = 'DEBUG'

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
const topScoreElem = document.getElementById('top-score');
API.get('topscore', '/topscores')
    .then(response => {
        const topScoreMarkup = response
            .sort((a, b) => b.score - a.score)
            .slice(0,20)
            .map(entry => {
                return `<li><p>${sanitizeHtml(entry.name)}</p><p>${sanitizeHtml(entry.score)}</p>`
            })
            .join('');
        
        topScoreElem.innerHTML = `<ul>${topScoreMarkup}</ul>`
        
    })

const game = new Phaser.Game(config);
