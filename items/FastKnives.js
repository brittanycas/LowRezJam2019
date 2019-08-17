class FastKnife extends Phaser.Physics.Arcade.Sprite{
  constructor (scene, x, y){
    super(scene, x, y, 'fastknife')
  }
  fire (x, y){
    this.body.reset(x,y);
    this.setActive(true);
    this.setVisible(true);
    this.setVelocity(-70, 0);
  }
  preUpdate (time, delta){
    super.preUpdate(time, delta);
    if (this.x >= 364 || this.y > 64){
      this.setActive(false);
      this.setVisible(false);
    }
  }
}

class FastKnives extends Phaser.Physics.Arcade.Group{
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

export default FastKnives
