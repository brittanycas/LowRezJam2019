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
  preUpdate (scene, time, delta){
    super.preUpdate(time, delta);
    if (this.x >= 366){
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

export default Picks
