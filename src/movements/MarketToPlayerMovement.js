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
        //hide opponent's card, display player's card
        this.card.setFrame(targetContainer.getData("ownerID") === 'P' ? this.card.getData("frame") : 59);
        
        this.targetY = targetContainer.y - sourcePile.y;
        this.targetX = targetContainer.x - sourcePile.x;
       
        this.scene.tweens.add({
            targets: this.card,
            y: this.targetY,
            x: this.targetX,
            duration: 1000,
            onComplete: ()=>{
                const card = this.scene.createCard(targetContainer.getData("ownerID")+"Card")
                    .setInteractive({draggable: false})
                    .setFrame(targetContainer.getData("ownerID") === 'P' ? this.card.getData("frame") : 59);
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
                
                sourcePile.container.list.pop();
                this.card = null;
            }
        })
    }
}