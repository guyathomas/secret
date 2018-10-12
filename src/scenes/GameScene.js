import Phaser from "phaser";
import { PLAYER, BACKGROUND, PLATFORM, GAME, GRASS, COIN, MACE } from "../constants";

const INITIAL_MACE_DELAY = 1000;
const INITIAL_COIN_COUNT = 11;
class GameScene extends Phaser.Scene {
    constructor(test) {
        super({
            key: "GameScene"
        });
        this.player = null;
        this.score = 0;
        this.maceDelay = INITIAL_MACE_DELAY;
        this.coinCount = INITIAL_COIN_COUNT;
    }

    setupCameraFollow() {
        this.cameras.main.setBounds(0, 0, GAME.WIDTH, GAME.HEIGHT);
        this.cameras.main.startFollow(this.player, true);
        this.cameras.main.setZoom(1.2);
    }

    addCoins() {
      this.coins = this.physics.add.group({
        key: COIN,
        repeat: this.coinCount,
        setXY: { x: 12, y: 0, stepX: 70 },
      });

      this.coins.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
      });

      this.physics.add.collider(this.coins, this.platforms);
      this.physics.add.collider(this.coins, this.floatingPlatforms);
      this.physics.add.overlap(this.player, this.coins, this.collectCoin, null, this);
    }

    addPlayer() {
        this.player = this.physics.add.sprite(100, 450, PLAYER);
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);
        // this.player.body.setGravityY(800); Sets individual gravity level

        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.player, this.floatingPlatforms);

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

    addFloatingPlatforms() {
        this.floatingPlatforms = this.physics.add.staticGroup();
        this.floatingPlatforms.create(200, 700, GRASS);
        this.floatingPlatforms.create(1000, 700, GRASS);
        this.floatingPlatforms
            .create(550, 500, GRASS)
            .setScale(3, 1)
            .refreshBody();
    }

    addMaces() {
      this.maces = this.physics.add.group({
        key: MACE,
        setXY: { x: Math.random() * 900, y: 0 },
      });
      // this.maces.children.iterate(function (child) {
      //   child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
      // });
      // this.physics.add.collider(this.maces, this.platforms);
      // this.physics.add.collider(this.maces, this.floatingPlatforms);
      this.physics.add.collider(this.player, this.maces, this.hitMace, null, this);
    }

    collectCoin(player, coin) {
      coin.disableBody(true, true);
      this.score += 10;
      this.scoreText.setText(`Score: ${this.score}`);
      if (this.coins.countActive(true) === 0) {
        this.physics.pause();
        this.player.setTint(0x32CD32);
        this.player.anims.play('turn');
        this.maceDelay -= 100;
        this.coinCount += 5;
        setTimeout( () => this.scene.restart(), 5000);
      }
    }

    hitMace(player, mace) {
      this.physics.pause();
      this.player.setTint(0xff0000);
      this.player.anims.play('turn');
      this.score = 0;
      this.scoreText.setText(`Score: ${this.score}`);
      this.maceDelay = INITIAL_MACE_DELAY;
      this.coinCount = INITIAL_COIN_COUNT;
      setTimeout( () => this.scene.restart(), 5000);
    }

    moveCharacter() {
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-300);

            this.player.anims.play("left", true);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(300);

            this.player.anims.play("right", true);
        } else {
            this.player.setVelocityX(0);

            this.player.anims.play("turn");
        }
        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-800);
        }
    }

    initializeKeyboard() {
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    initializeScore() {
      this.scoreText = this.add.text(150, 200, 'score: 0', { fontSize: '32px', fill: '#000' });
      this.scoreText.setScrollFactor(0);
      this.scoreText.setText(`Score: ${this.score}`);
    }

    preload() {
        this.load.image(BACKGROUND, "assets/images/background.png");
        this.load.image(PLATFORM, "assets/images/platform.png");
        this.load.image(GRASS, "assets/images/grass.png");
        this.load.image(COIN, "assets/images/coin.png");
        this.load.image(MACE, "assets/images/mace.png");
        this.load.spritesheet(PLAYER, "assets/images/player.png", {
            frameWidth: 32,
            frameHeight: 48
        });
    }

    create() {
        this.add.sprite(400, 240, BACKGROUND);
        this.initializeScore();
        this.addPlatforms();
        this.addFloatingPlatforms();
        this.addPlayer();
        this.addCoins();
        this.time.addEvent({
          delay: this.maceDelay,
          callback: this.addMaces,
          callbackScope: this,
          loop: true,
        });
        this.initializeKeyboard();
        this.setupCameraFollow();
    }

    update() {
        this.moveCharacter();
    }
}

export default GameScene;
