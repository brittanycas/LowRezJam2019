import Picks from '../items/Pick.js'
import Knives from '../items/Knives.js'

var gameOver = false;
var levelComplete = false;
var lastTime = 0;
var movementTimer = 0;
var playerSpeed = 28;
var playerJump = -70;

class LevelOne extends Phaser.Scene {
  constructor(config){
    super({key: 'LevelOne'})
  }
  preload(){
    this.load.image('title', 'assets/title.png')
    this.load.image('background', 'assets/background.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('ground-sm', 'assets/platform-sm.png')
    this.load.image('platform', 'assets/platform1.png');
    this.load.image('goal-platform', 'assets/platform-goal.png')
    this.load.image('lava-md', 'assets/lava-md.png');
    this.load.image('lava-lg', 'assets/lava-lg.png');
    this.load.image('flag', 'assets/flag.png');
    this.load.image('pick', 'assets/pick.png');
    this.load.audio('lose', 'assets/lose.wav');
    this.load.audio('win', 'assets/win.wav');
    this.load.audio('walk', 'assets/footsteps.wav');
    this.load.audio('stab', 'assets/stab-knife.wav');
    this.load.audio('pickdrop', 'assets/pickdrop.wav');
    this.load.spritesheet('badguy', 'assets/badskellsprite.png',
        { frameWidth: 7, frameHeight: 16});
    this.load.image('knife', 'assets/knife.png')
    this.load.spritesheet('dude',
        'assets/playersprite.png',
        { frameWidth: 7, frameHeight: 11 }
      );
  }
  create(){
    //set up world and camera
    this.physics.world.setBounds(0, 0, 384, 64);
    this.cameras.main.setBounds(0, 0, 384, 64);
    document.getElementById('level').innerHTML = "1"

    this.add.image(0, 0, 'background').setOrigin(0);

    //load in lava traps
    var lavaTrap = this.physics.add.staticGroup();
    lavaTrap.create(97, 62, 'lava-md');
    lavaTrap.create(126, 62, 'lava-md');
    lavaTrap.create(208, 62, 'lava-lg');
    lavaTrap.create(280, 62, 'lava-md');
    lavaTrap.create(310, 62, 'lava-md');
    lavaTrap.create(340, 62, 'lava-md');
    lavaTrap.create(384, 62, 'lava-md');

    //load in static ground
    var ground = this.physics.add.staticGroup();
    ground.create(42, 62, 'ground');
    ground.create(114, 62, 'ground-sm');
    ground.create(145, 62, 'ground-sm');
    ground.create(150, 62, 'ground-sm');
    ground.create(264, 62, 'ground-sm');
    ground.create(294, 62, 'ground-sm');
    ground.create(324, 62, 'ground-sm');
    ground.create(364, 62, 'goal-platform');

    //load floating platforms
    ground.create(84, 56, 'platform');
    ground.create(174, 54, 'platform');
    ground.create(191, 47, 'platform');
    ground.create(210, 41, 'platform');
    ground.create(220, 41, 'platform');
    ground.create(240, 53, 'platform');

    //load goal marker
    var goal = this.physics.add.staticGroup();
    goal.create(366, 53, 'flag');

    //load in player
    this.player = this.physics.add.sprite(10, 20, 'dude');
    this.player.setCollideWorldBounds(true);
    this.player.setBounce(0.2);

    //load player weapon
    this.picks = new Picks(this)
    this.physics.add.collider(this.picks, ground, touchGround, null, this);

    //load in enemies
    class Enemy extends Phaser.Physics.Arcade.Sprite{
      constructor(scene, x, y){
        super(scene, x, y, 'badguy');
        scene.add.existing(this);
        scene.physics.add.existing(this);
        scene.physics.add.collider(this, ground);
        scene.physics.add.collider(scene.picks, this, killEnemy, null, scene);
        this.setCollideWorldBounds(true);
        super.preUpdate();
      }
    }

    var badguy = new Enemy(this, 60, 48);
    var badguy2 = new Enemy(this, 191, 35);
    var badguy3 = new Enemy(this, 294, 48);

    this.enemies = [badguy, badguy2, badguy3];

    this.anims.create({
        key: 'stand',
        frames: [ { key: 'badguy', frame: 0 } ],
        frameRate: 20,
    });
    this.anims.create({
        key: 'fire',
        frames: [ { key: 'badguy', frame: 1 } ],
        frameRate: 1,
    });

    this.knives = new Knives(this)

    //set player collisions
    this.physics.add.collider(this.player, ground);
    this.physics.add.collider(this.player, lavaTrap, gameLost, null, this);
    this.physics.add.collider(this.player, goal, touchGoal, null, this);
    this.physics.add.collider(this.player, this.enemies, gameLost, null, this);
    this.physics.add.collider(this.player, this.knives, gameLost, null, this);

    //set player animations
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });
    this.anims.create({
        key: 'turn',
        frames: [ { key: 'dude', frame: 4 } ],
        frameRate: 20
    });
    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    this.walking = this.sound.add('walk', {loop: true});
    this.walking.play();
    this.walking.pause();

    //set camera to follow player
    this.cameras.main.startFollow(this.player, true, 0.1);

    //set up keyboard inputs
    this.cursors = this.input.keyboard.createCursorKeys();
    this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  }

  update(time){
    if(levelComplete === true){
      if (Phaser.Input.Keyboard.JustDown(this.spacebar)){
          levelComplete = false;
          this.scene.start('LevelTwo');
      }
    }
    let viewportLeft = this.cameras.main.worldView.left;
    let viewportTop = this.cameras.main.worldView.top;
    this.cameras.main.deadzone = new Phaser.Geom.Rectangle(0, 0, 4, 8);

    //Enemy movement
    if(Math.floor(time / 2000) > lastTime){
      this.enemies.forEach(el => {
        if(el.active === true){
          this.knives.fireKnife(el.x, el.y);
          el.anims.play('fire');
          }
        })
      lastTime = Math.floor(time / 2000);
    }

    if((Math.round((time + 300)/ 2000) - lastTime)  > movementTimer){
      this.enemies.forEach(function(el){
        if(el.active === true){
          el.anims.play('stand');
          }
        })
    }

    //Player movement
    if (this.cursors.left.isDown){
      if(this.player.x-5 > 0) {
            this.player.setVelocityX(-playerSpeed);
            this.player.anims.play('left', true);
            if(this.walking.isPaused){
              this.walking.resume();
            }
        }
        else {
          this.player.setVelocityX(0);
          this.player.anims.play('left', true);
          if(this.walking.isPaused){
            this.player.x = 5;
            this.player.y = 50;
            this.walking.resume();
          }
        }
    }
    else if (this.cursors.right.isDown){
      if(this.player.x < 8 && this.player.y > 58){
        this.player.x = 5;
        this.player.y = 50;
      }
        this.player.anims.play('right', true);
        this.player.setVelocityX(playerSpeed);
        if(this.walking.isPaused){
          this.walking.resume();
        }
    }
    else {
        this.player.setVelocityX(0);
        this.walking.pause();
        this.player.anims.play('turn');
        }
    if (this.cursors.up.isDown && this.player.body.touching.down){
        this.walking.pause();
        this.player.setVelocityY(playerJump);
    }
    if (Phaser.Input.Keyboard.JustDown(this.spacebar)){
        this.picks.firePick(this.player.x, this.player.y);
    }
  }
}

function touchGround(pick, ground){
  pick.setActive(false);
  pick.setVisible(false);
  pick.disableBody();
  this.sound.add('pickdrop').play();
}

function gameLost(player, object){
  if(object.active){
  this.sound.add('lose').play()
  gameOver = true;
  this.physics.pause();
  player.setTint(0xff0000);
  player.anims.play('turn');
  this.time.addEvent({
    delay: 100,
    callback: () =>{
      this.scene.start('GameOver');
      }
    })
  }
}

function touchGoal(player, goal){
  this.sound.add('win').play()
  levelComplete = true;
  this.physics.pause();
  player.setTint(0x31f53e);
  player.anims.play('turn');
  this.add.text(this.cameras.main.worldView.left + 5, 5, 'Level\nComplete!', { fontFamily: '"Roboto Condensed"', fontSize: '14px' });
  this.add.text(this.cameras.main.worldView.left + 11, 37, 'Press Space\nto continue', { fontFamily: '"Roboto Condensed"', fontSize: '8px' });
}

function killEnemy(badguy, pick){
  this.sound.add('stab').play()
  badguy.setTint(0xff0000);
  badguy.disableBody();
  badguy.setActive(false);
  this.time.addEvent({
    delay: 100,
    callback: () =>{
      badguy.setVisible(false);
    }
  })
}

export default LevelOne;
