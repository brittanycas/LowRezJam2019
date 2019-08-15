  var gameWidth = 64;
  var gameHeight = 64;
  var gameOver = false;
  var lastTime = 0;
  var movementTimer = 0;
  var gameStart = true;

  var config = {
      type: Phaser.AUTO,
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
        width: gameWidth,
        height: gameHeight,
        min: {
          width: 64,
          height: 64,
        },
        max: {
          width: 512,
          height: 512
        }
      },
      scene: {
          preload: preload,
          create: create,
          update: update,
      },
      physics: {
          default: 'arcade',
          arcade: {
              gravity: { y: 200 },
              debug: false
          }
      }
    };

  var game = new Phaser.Game(config);

  function preload ()
  {
    //Load in required assets
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
    this.load.spritesheet('badguy', 'assets/badskellsprite.png',
        { frameWidth: 7, frameHeight: 16});
    this.load.image('knife', 'assets/knife.png')
    this.load.spritesheet('dude',
        'assets/playersprite.png',
        { frameWidth: 7, frameHeight: 11 }
      );
  }

  function create ()
  {
      //set up world and camera
      this.physics.world.setBounds(0, 0, 384, 64);
      camera = this.cameras.main;
      camera.setBounds(0, 0, 384, 64);

      this.add.image(0, 0, 'background').setOrigin(0);

      //load in lava traps
      lavaTrap = this.physics.add.staticGroup();
      lavaTrap.create(97, 62, 'lava-md');
      lavaTrap.create(126, 62, 'lava-md');
      lavaTrap.create(208, 62, 'lava-lg');
      lavaTrap.create(280, 62, 'lava-md');
      lavaTrap.create(310, 62, 'lava-md');
      lavaTrap.create(340, 62, 'lava-md');
      lavaTrap.create(384, 62, 'lava-md');


      //load in static ground
      ground = this.physics.add.staticGroup();
      ground.create(43, 62, 'ground');
      ground.create(114, 62, 'ground-sm');
      ground.create(145, 62, 'ground-sm');
      ground.create(150, 62, 'ground-sm');
      ground.create(264, 62, 'ground-sm');
      ground.create(294, 62, 'ground-sm');
      ground.create(324, 62, 'ground-sm');
      ground.create(364, 62, 'goal-platform');

      //load floating platforms
      ground.create(85, 56, 'platform');
      ground.create(174, 54, 'platform');
      ground.create(191, 47, 'platform');
      ground.create(210, 41, 'platform');
      ground.create(220, 41, 'platform');
      ground.create(240, 53, 'platform');

      //load goal marker
      goal = this.physics.add.staticGroup();
      goal.create(366, 53, 'flag');

      //load in player
      player = this.physics.add.sprite(10, 20, 'dude');
      player.setCollideWorldBounds(true);
      player.setBounce(0.2);
      playerSpeed = 28;
      playerJump = -70;

      //load in player weapon
      class Pick extends Phaser.Physics.Arcade.Sprite{
        constructor (scene, x, y){
          super(scene, x, y, 'pick')
        }
        fire (x, y){
          this.body.reset(x,y);
          this.setActive(true);
          this.setVisible(true);
          this.setVelocity(55, -65);
        }
        preUpdate (time, delta){
          super.preUpdate(time, delta);
          if (this.x >= camera.worldView.right + 15){
            this.setActive(false);
            this.setVisible(false);
          }
        }
      }

      class Picks extends Phaser.Physics.Arcade.Group{
        constructor(scene){
          super(scene.physics.world, scene);
          this.createMultiple({
            frameQuantity: 3,
            key: 'pick',
            active: false,
            visible: false,
            classType: Pick
          });
        }

        firePick (x, y) {
          let pick = this.getFirstDead(false);
          if (pick){
            pick.enableBody();
            pick.fire(x, y);
          }
        }
      }

      picks = new Picks(this)
      this.physics.add.collider(picks, ground, touchGround, null, this);

      //load in bad guys

      class Enemy extends Phaser.Physics.Arcade.Sprite{
        constructor(scene, x, y){
          super(scene, x, y, 'badguy');
          scene.add.existing(this);
          scene.physics.add.existing(this);
          scene.physics.add.collider(this, ground);
          scene.physics.add.collider(picks, this, killEnemy, null, scene);
          this.setCollideWorldBounds(true);
          super.preUpdate();
        }
      }


      badguy = new Enemy(this, 60, 48);
      badguy2 = new Enemy(this, 191, 35);
      badguy3 = new Enemy(this, 294, 48);

      enemies = [badguy, badguy2, badguy3];

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

      //load in bad guys weapon
      class Knife extends Phaser.Physics.Arcade.Sprite{
        constructor (scene, x, y){
          super(scene, x, y, 'knife')
        }
        fire (x, y){
          this.body.reset(x,y);
          this.setActive(true);
          this.setVisible(true);
          this.setVelocity(-45, 0);
        }
        preUpdate (time, delta){
          super.preUpdate(time, delta);
          if (this.x >= camera.worldView.right + 15 || this.y > 64){
            this.setActive(false);
            this.setVisible(false);
          }
        }
      }

      class Knives extends Phaser.Physics.Arcade.Group{
        constructor(scene){
          super(scene.physics.world, scene);
          this.createMultiple({
            frameQuantity: 5,
            key: 'knife',
            active: false,
            visible: false,
            classType: Knife
          });
        }
        fireKnife (x, y) {
          let knife = this.getFirstDead(false);
          if (knife){
            knife.fire(x, y);
          }
        }
      }

      knives = new Knives(this)

      //set player collisions
      this.physics.add.collider(player, ground);
      this.physics.add.collider(player, lavaTrap, gameLost, null, this);
      this.physics.add.collider(player, goal, touchGoal, null, this);
      this.physics.add.collider(player, badguy, gameLost, null, this);
      this.physics.add.collider(player, knives, gameLost, null, this);

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

      //set camera to follow player
      camera.startFollow(player, true, 0.1);

      //set up keyboard inputs
      cursors = this.input.keyboard.createCursorKeys();
      spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

      if(gameStart === true){
        this.add.image(0, 0, 'title').setOrigin(0);
        this.add.text(4, 5, 'Dungeon\nAdventure', { fontFamily: '"Roboto Condensed"', fontSize: '13px' });
        this.add.text(13, 35, 'Press Space\nto start', { fontFamily: '"Roboto Condensed"', fontSize: '9px' });
      }
  }

  function update (time)
    {
      if(gameStart === true){
        this.physics.pause();
        if (cursors.space.isDown){
          gameStart = false;
          this.scene.restart();
        }
      }
      if (gameOver === true) {
          if (cursors.space.isDown) {
            this.scene.restart();
            gameOver = false;
        }
      }
      viewportLeft = camera.worldView.left;
      viewportTop = camera.worldView.top;
      camera.deadzone = new Phaser.Geom.Rectangle(0, 0, 4, 8);

      //Enemy movement
      if(Math.floor(time / 2000) > lastTime){
        enemies.forEach(function(el){
          if(el.active === true){
            knives.fireKnife(el.x, el.y);
            el.anims.play('fire');
            }
          })
        lastTime = Math.floor(time / 2000);
      }

      if((Math.round((time + 300)/ 2000) - lastTime)  > movementTimer){
        enemies.forEach(function(el){
          if(el.active === true){
            el.anims.play('stand');
            }
          })
      }

      //Player movement
      if (cursors.left.isDown){
          player.anims.play('left', true);
          if(player.x-5 > viewportLeft) {
              player.setVelocityX(-playerSpeed)
          }
          else {
            player.setVelocityX(0);
          }
      }
      else if (cursors.right.isDown){
          player.anims.play('right', true);
          player.setVelocityX(playerSpeed);
      }
      else {
          player.setVelocityX(0);
          player.anims.play('turn');
      }
      if (cursors.up.isDown && player.body.touching.down){
          player.setVelocityY(playerJump);
      }
      if (Phaser.Input.Keyboard.JustDown(spacebar)){
          picks.firePick(player.x, player.y);
      }

    }

    function touchGround(pick, ground){
      pick.setActive(false);
      pick.setVisible(false);
      pick.disableBody();
    }

    function gameLost(player, object){
      console.log(object);
      gameOver = true;
      this.physics.pause();
      player.setTint(0xff0000);
      player.anims.play('turn');
      camera.shake(200);
      this.add.text(viewportLeft + 15, 5, 'Game\nOver', { fontFamily: '"Roboto Condensed"', fontSize: '14px' });
      this.add.text(viewportLeft + 13, 35, 'Press Space\nto try again', { fontFamily: '"Roboto Condensed"', fontSize: '9px' });
    }

    function touchGoal(player, goal){
      gameOver = true;
      this.physics.pause();
      player.setTint(0x31f53e);
      player.anims.play('turn');
      this.add.text(viewportLeft + 15, 5, 'You\nWin!', { fontFamily: '"Roboto Condensed"', fontSize: '14px' });
      this.add.text(viewportLeft + 13, 35, 'Press Space\nstart again', { fontFamily: '"Roboto Condensed"', fontSize: '9px' });
    }

    function killEnemy(badguy, pick){
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
