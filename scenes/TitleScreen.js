class TitleScreen extends Phaser.Scene{
  constructor(config){
    super({key: 'TitleScreen'})
  }
  preload(){
    this.load.image('title', 'assets/title.png');
  }
  create(){
    this.add.image(0, 0, 'title').setOrigin(0);
    this.add.text(4, 5, 'Dungeon\nAdventure', { fontFamily: '"Roboto Condensed"', fontSize: '13px' });
    this.add.text(13, 35, 'Press Space\nto start', { fontFamily: '"Roboto Condensed"', fontSize: '9px' });
  }
  update(){
    let cursors = this.input.keyboard.createCursorKeys();
    let spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    if (Phaser.Input.Keyboard.JustDown(spacebar)){
        this.scene.start('LevelOne');
    }
  }
}

export default TitleScreen
