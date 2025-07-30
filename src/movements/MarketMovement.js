import { Movement } from "./Movement.js";

export class MarketMovement extends Movement{
    constructor(scene, targetPile){
        super(scene, null);
        this.id = "marketMovement";
        this.targetPile = targetPile;
        this.table = this.scene.elewenjewe.table;
    }
    
    execute(){
       // this.scene.audio.play(this.scene.audio.drawSound); 

        const sourcePile = this.table.marketPile;
        const targetPile = this.targetPile;
        this.card = sourcePile.container.list[sourcePile.container.length-1];
        this.targetY = targetPile.y - sourcePile.y;
        this.targetX = targetPile.x - sourcePile.x;
       
        targetPile.container.setDepth(0); sourcePile.container.setDepth(1); 
        this.scene.tweens.add({
            targets: this.card,
            y: this.targetY,
            x: this.targetX,
            duration: 1000,
            onComplete: ()=>{
                const card = this.scene.createCard(targetPile.id+"Card")
                    .setInteractive({draggable: false})
                    .setFrame(this.card.getData("frame"));
                card.setData({
                    x: card.x,
                    y: card.y,
                    sourceZone: "enemy1Zone",
                    frame: this.card.getData("frame"),
                    suit: this.card.getData("suit"),
                    colour: this.card.getData("colour"),
                    value: this.card.getData("value")
                });
                
                targetPile.container.add(card);
                card.setPosition(0, 0);
                card.setData({x: card.x, y: card.y}) 
                
                this.originalCardData = {
                    x: this.card.x,
                    y: this.card.y,
                    cardIndex: sourcePile.length,
                    frame: this.card.getData("frame"),
                    value: this.card.getData("value"),
                    suit: this.card.getData("suit"),
                    colour: this.card.getData("colour"), 
                } 
                sourcePile.container.list.pop();
            }
        })
    }
}