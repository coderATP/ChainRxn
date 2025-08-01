import { Movement } from "./Movement.js";

export class MarketToPlayerMovement extends Movement{
    constructor(scene, playerContainer){
        super(scene);
        this.targetContainer = playerContainer;
        this.id = "marketToPlayerMovement";
        this.table = this.scene.chainRxn.table;
    }
    
    execute(){
        
        const sourcePile = this.table.marketPile;
        const targetContainer = this.targetContainer;
        this.card = sourcePile.container.list[sourcePile.container.length-1];
        this.card.setFrame(this.card.getData("frame"));
        
        this.targetY = targetContainer.y - sourcePile.y;
        this.targetX = targetContainer.x - sourcePile.x;
       
        this.scene.tweens.add({
            targets: this.card,
            y: this.targetY,
            x: this.targetX,
            duration: 1000,
            onComplete: ()=>{
                const card = this.scene.createCard(targetContainer.id+"Card")
                    .setInteractive({draggable: false})
                    .setFrame(this.card.getData("frame"));
                card.setData({
                    x: card.x,
                    y: card.y,
                    sourceZone: "marketZone",
                    frame: this.card.getData("frame"),
                    suit: this.card.getData("suit"),
                    colour: this.card.getData("colour"),
                    value: this.card.getData("value"),
                    index: targetContainer.getData("index")
                });
                
                targetContainer.add(card);
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
                this.card = null;
            }
        })
    }
}