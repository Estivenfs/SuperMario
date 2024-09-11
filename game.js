
import { createAnimations } from "./animations.js";
const config = {
    type: Phaser.AUTO,
    width: 256,
    height: 244,
    backgroundColor: '#049cd8',
    parent: 'game',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload,
        create,
        update
    }
};

const game = new Phaser.Game(config);

function preload() {
    this.load.image('cloud1', 'assets/scenery/overworld/cloud1.png');
    this.load.spritesheet('mario', 'assets/entities/mario.png', { frameWidth: 18, frameHeight: 16 });
    this.load.image('floorbricks', 'assets/scenery/overworld/floorbricks.png');
    this.load.audio("gameover", "assets/sound/music/gameover.mp3");
}

function create() {
    this.add.image(100, 50, 'cloud1')
        .setOrigin(0, 0)
        .setScale(0.15);
    
    // this.mario = this.add.sprite(50, 210, 'mario').setOrigin(0, 1);
    this.mario = this.physics.add.sprite(50, 100, 'mario').setOrigin(0, 1).setGravityY(300)
        .setCollideWorldBounds(true);
    // creamos los limites del mundo
    this.physics.world.setBounds(0, 0, 2000, config.height);

    this.cameras.main.setBounds(0, 0, 2000, config.height);
    this.cameras.main.startFollow(this.mario);

    createAnimations(this);
    // this.physics.add.existing(this.mario);
    this.floor = this.physics.add.staticGroup();
    this.floor.create(0, config.height - 32, 'floorbricks').setOrigin(0, 0).refreshBody();
    this.floor.create(150, config.height - 32, 'floorbricks').setOrigin(0, 0).refreshBody();

    //añadimos la colisión entre mario y el suelo
    this.physics.add.collider(this.mario, this.floor);
    this.keys = this.input.keyboard.createCursorKeys();
}

function update() {
    if (this.mario.isDead) {
        return;
    }
    if (this.keys.left.isDown) {
        this.mario.x -= 2;
        if (this.mario.body.touching.down) {
            this.mario.anims.play('mario-walk', true);
        }
        // this.mario.anims.play('mario-walk', true);
        this.mario.flipX = true;
    } else if (this.keys.right.isDown) {
        this.mario.x += 2;
        if (this.mario.body.touching.down) {
            this.mario.anims.play('mario-walk', true);
        }
        // this.mario.anims.play("mario-walk", true);
        this.mario.flipX = false;
    } else {
        if (this.mario.body.touching.down){
            this.mario.anims.play('mario-idle', true);
        }
        // this.mario.anims.play('mario-idle', true);
    }

    if (this.keys.up.isDown && this.mario.body.touching.down) {
        this.mario.setVelocityY(-300);
        this.mario.anims.play('mario-jump', true);
    }

    if (this.mario.y >= config.height && !this.mario.isDead) {
        this.mario.isDead = true;
        this.mario.anims.play('mario-dead', true);
        this.mario.setVelocityY(-300);
        this.mario.setCollideWorldBounds(false);
        this.sound.add('gameover', { volume: 0.2 }).play();
        setTimeout(() => {
            this.scene.restart();
        }, 2000);
        
        
    }
}