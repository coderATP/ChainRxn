export class WinnerIndicator extends Phaser.Physics.Arcade.Image{
    constructor(scene, x, y){
        super(scene, x, y, "chip");
        this.scene = scene;
        scene.add.existing(this);
        
        this.init();
    }
    
    init(){
        this.setOrigin(0).setDepth(2).setScale(0.125);
    }
    moveToCurrentWinner(sourcePile){
        this.scene.tweens.add({
            targets: this,
            x: sourcePile.x,
            y: sourcePile.y,
            ease: "Cubic",
            duration: 500,
        })
        this.scene.tweens.add({
            targets: this,
            ease: "Linear",
            duration: 2000,
            alpha: 0.3,
            yoyo: true,
            repeat: -1,
        }) 
    }
}