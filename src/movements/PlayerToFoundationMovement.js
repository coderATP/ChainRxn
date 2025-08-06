import { Movement } from "./Movement.js";
import { eventEmitter } from "../events/EventEmitter.js";

export class PlayerToFoundationMovement extends Movement{
    constructor(scene, playerContainer){
        super(scene);
        this.sourceContainer = playerContainer;
        this.id = "playerToFoundationMovement";
        this.table = this.scene.chainRxn.table;
    }
    
    execute(){
        
        const targetPile = this.table.foundationPile;
        const sourceContainer = this.sourceContainer;
        this.card = sourceContainer.list[sourceContainer.length-1];
        this.targetY = targetPile.y - sourceContainer.y;
        this.targetX = targetPile.x - sourceContainer.x;
        //reveal chain and rotate towards dealer
        this.scene.chainRxn.table.chain.rotateTowards(sourceContainer); 
       
        this.scene.tweens.add({
            targets: this.card,
            y: this.targetY,
            x: this.targetX,
            duration: 1000,
            onComplete: ()=>{
                const card = this.scene.createCard(sourceContainer.id+"Card")
                    .setInteractive({draggable: false})
                    .setFrame(this.card.getData("frame"));
                card.setData({
                    x: card.x,
                    y: card.y,
                    sourceZone: "marketZone",
                    frame: this.card.getData("frame"),
                    suit: this.card.getData("suit"),
                    colour: this.card.getData("colour"),
                    value: this.card.getData("value")
                });
                
                targetPile.container.add(card);
                targetPile.container.list.forEach((elem, i)=>{
                    elem.setPosition(0, -i*2);
                    elem.setData({x: card.x, y: card.y})  
                })
                sourceContainer.list.shift();
                this.card = null;
                
                //CHECK IF THERE IS A WINNER
                let sourcePile;
                this.table.participants.forEach((participant)=>{
                    if(participant.id === sourceContainer.getData("ownerID")){
                        sourcePile = participant;
                        return;
                    }
                });
                let emptyContainers = 0;
                sourcePile.containers.forEach((container)=>{
                    if(!container.length) emptyContainers++;
                });
                if (emptyContainers === 5){
                    eventEmitter.emit("GameComplete");
                }
            }
        })
    }
}