import Phaser from "phaser";
import { LAYERS, GAME } from "../constants";
import AnimatedTiles from "phaser-animated-tiles/dist/AnimatedTiles.min.js";
class GameScene extends Phaser.Scene {
    constructor(test) {
        super({
            key: "GameScene"
        });
        this.player = null;
        this.count = null;
        this.platforms = null;
        this.floatingPlatforms = null;
        this.maces = null;
        this.score = 0;
    }

    setupCameraFollow() {
        this.cameras.main.setBounds(0, 0, GAME.WIDTH, GAME.HEIGHT);
        this.cameras.main.startFollow(this.player, true);
        this.cameras.main.setZoom(1.2);
    }

    addCoins() {
        this.coins = this.physics.add.group({
            key: LAYERS.COIN,
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 }
        });

        this.coins.children.iterate(function(child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });

        this.physics.add.collider(this.coins, this.platforms);
        this.physics.add.collider(this.coins, this.floatingPlatforms);
        this.physics.add.overlap(
            this.player,
            this.coins,
            this.collectCoin,
            null,
            this
        );
    }

    addPlayer() {
        this.player = this.physics.add.sprite(100, 450, LAYERS.PLAYER);
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);
        // this.player.body.setGravityY(800); Sets individual gravity level

        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.player, this.floatingPlatforms);

        this.anims.create({
            key: "left",
            frames: this.anims.generateFrameNumbers(LAYERS.PLAYER, {
                start: 0,
                end: 3
            }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: "turn",
            frames: [{ key: LAYERS.PLAYER, frame: 4 }],
            frameRate: 20
        });

        this.anims.create({
            key: "right",
            frames: this.anims.generateFrameNumbers(LAYERS.PLAYER, {
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
            .create(GAME.WIDTH / 2, GAME.HEIGHT, LAYERS.PLATFORM)
            .setScale(3)
            .refreshBody();
    }

    addFloatingPlatforms() {
        this.floatingPlatforms = this.physics.add.staticGroup();
        this.floatingPlatforms.create(200, 700, LAYERS.GRASS);
        this.floatingPlatforms.create(1000, 700, LAYERS.GRASS);
        this.floatingPlatforms
            .create(550, 500, LAYERS.GRASS)
            .setScale(3, 1)
            .refreshBody();
    }

    addMaces() {
        this.maces = this.physics.add.group({
            key: MACE,
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 100 }
        });
        this.maces.children.iterate(function(child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });
        this.physics.add.collider(this.maces, this.platforms);
        this.physics.add.collider(this.maces, this.floatingPlatforms);
    }

    collectCoin(player, coin) {
        coin.disableBody(true, true);
        this.score += 10;
        this.scoreText.setText(`Score: ${this.score}`);
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

    initializeScore() {
        this.scoreText = this.add.text(150, 200, "score: 0", {
            fontSize: "32px",
            fill: "#000"
        });
        this.scoreText.setScrollFactor(0);
        this.scoreText.setText(`Score: ${this.score}`);
    }

    preload() {
        this.load.tilemapTiledJSON(
            "hills-level-tilemap",
            "assets/tilemaps/hills-level.json"
        );
        this.load.image("tiles", "assets/images/sprite-sheet-summer.png");

        // this.load.image("hills", "assets/images/hills.png");
        // this.load.image(LAYERS.PLATFORM, "assets/images/platform.png");
        // this.load.image(LAYERS.GRASS, "assets/images/grass.png");
        // this.load.image(LAYERS.COIN, "assets/images/coin.png");
        // this.load.image(LAYERS.MACE, "assets/images/mace.png");
        this.load.spritesheet(LAYERS.PLAYER, "assets/images/player.png", {
            frameWidth: 32,
            frameHeight: 48
        });
    }

    create() {
        // this.physics.startSystem(Phaser.Physics.ARCADE);

        //Add the tilemap and tileset image. The first parameter in addTilesetImage
        //is the name you gave the tilesheet when importing it into Tiled, the second
        //is the key to the asset in Phaser
        debugger;
        var map = this.make.tilemap({
            key: "hills-level-tilemap",
            tileWidth: 128,
            tileHeight: 128
        });
        const tiles = map.addTilesetImage("tiles128", "tiles");
        const layer = map.createStaticLayer(0, tiles, 0, 0);

        //Add both the background and ground layers. We won't be doing anything with the
        //GroundLayer though
        this.backgroundlayer = map.createStaticLayer(
            "BackgroundLayer",
            tiles,
            0,
            0
        );
        // this.groundLayer = this.map.createStaticLayer("GroundLayer");

        //Before you can use the collide function you need to set what tiles can collide
        // this.map.setCollisionBetween(1, 100, true, "GroundLayer");

        //Change the world size to match the size of this layer
        // this.groundLayer.resizeWorld();

        // this.test();
        // this.add.tileSprite(0, 0, GAME.WIDTH, GAME.HEIGHT, "hills");
        // this.initializeScore();
        // this.addPlatforms();
        // this.addFloatingPlatforms();
        this.addPlayer();
        // this.addCoins();
        // this.addMaces();
        this.initializeKeyboard();
        this.setupCameraFollow();
    }

    update() {
        this.moveCharacter();
    }
}

export default GameScene;
