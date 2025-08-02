import { Movement } from "./Movement.js";

export class ComputerToMarketMovement extends Movement{
    constructor(scene, playerContainer){
        super(scene);
        this.sourceContainer = playerContainer;
        this.id = "computerToMarketMovement";
        this.table = this.scene.chainRxn.table;
    }
    
    execute(){
        const targetPile = this.table.marketPile;
        const sourceContainer = this.sourceContainer;
        this.card = sourceContainer.list[0];
        this.targetY = targetPile.y - sourceContainer.y;
        this.targetX = targetPile.x - sourceContainer.x;
       
        this.scene.tweens.add({
            targets: this.card,
            y: this.targetY,
            x: this.targetX,
            duration: 1000,
            onComplete: ()=>{
                const card = this.scene.createCard(sourceContainer.id+"Card")
                    .setInteractive({draggable: false})
                    .setFrame(52);
                card.setData({
                    x: card.x,
                    y: card.y,
                    sourceZone: "playerZone",
                    frame: this.card.getData("frame"),
                    suit: this.card.getData("suit"),
                    colour: this.card.getData("colour"),
                    value: this.card.getData("value")
                });
                
                targetPile.container.addAt(card, 0);
                sourceContainer.list.shift();
                this.card = null;
            }
        })
    }
}