export class Chain extends Phaser.Physics.Arcade.Image{
    constructor(scene, x, y){
        super(scene, x, y, "gold_chain");
        this.scene = scene;
        scene.add.existing(this);
        this.actualWidth = this.width;
        this.init();
    }
    
    init(){
        this.setOrigin(0).setDepth(2).setScale(1).setDepth(0).setVisible(false);
    }
    rotateTowards(target){
        const adj = target.x - this.x;
        const opp = target.y - this.y;
        const hyp = Math.hypot(adj, opp);
        
        this.setVisible(true);
        this.displayWidth = hyp;
        this.displayHeight =  hyp*(this.texture.source[0].height / this.texture.source[0].width);
        
        this.scene.tweens.add({
            targets: this,
            duration: 300,
            rotation: Phaser.Math.Angle.BetweenPoints
                    (this, {x: target.x + target.displayWidth/2,
                    y: target.y + target.displayHeight/2 }
                    ),
            repeat: 0, 
            onComplete: ()=>{
                this.retract();
            }
        }) 

        return this;
    }
    retract(){
        this.scene.tweens.add({
            targets: this,
            duration: 700,
            displayWidth: 0,
            repeat: 0,
            onComplete: ()=>{
                
            }
        })
    }
}