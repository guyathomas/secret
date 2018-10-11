import Phaser from "phaser";
import { PLAYER, BACKGROUND, PLATFORM, GAME } from "../constants";
class GameScene extends Phaser.Scene {
    constructor(test) {
        super({
            key: "GameScene"
        });
        this.player = null;
    }

    setupCameraFollow() {
        this.cameras.main.setBounds(0, 0, GAME.WIDTH, GAME.HEIGHT);
        this.cameras.main.startFollow(this.player, true);
        this.cameras.main.setZoom(1.2);
    }

    addPlayer() {
        this.player = this.physics.add.sprite(100, 450, PLAYER);
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);
        // this.player.body.setGravityY(800); Sets individual gravity level

        this.physics.add.collider(this.player, this.platforms);

        this.anims.create({
            key: "left",
            frames: this.anims.generateFrameNumbers(PLAYER, {
                start: 0,
                end: 3
            }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: "turn",
            frames: [{ key: PLAYER, frame: 4 }],
            frameRate: 20
        });

        this.anims.create({
            key: "right",
            frames: this.anims.generateFrameNumbers(PLAYER, {
                start: 5,
                end: 8
            }),
            frameRate: 10,
            repeat: -1
        });
    }

    addPlatforms() {
        this.platforms = this.physics.add.staticGroup();
        this.platforms
            .create(GAME.WIDTH / 2, GAME.HEIGHT, PLATFORM)
            .setScale(3)
            .refreshBody();
    }

    moveCharacter() {
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160);

            this.player.anims.play("left", true);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);

            this.player.anims.play("right", true);
        } else {
            this.player.setVelocityX(0);

            this.player.anims.play("turn");
        }
        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-1000);
        }
    }

    initializeKeyboard() {
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    preload() {
        this.load.image(BACKGROUND, "assets/images/background.png");
        this.load.image(PLATFORM, "assets/images/platform.png");
        this.load.spritesheet(PLAYER, "assets/images/player.png", {
            frameWidth: 32,
            frameHeight: 48
        });
    }

    create() {
        this.add.sprite(400, 240, BACKGROUND);
        this.addPlatforms();
        this.addPlayer();
        this.initializeKeyboard();
        this.setupCameraFollow();
    }

    update() {
        this.moveCharacter();
    }
}

export default GameScene;
