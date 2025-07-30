import { Movement } from "./Movement.js";
import { FoundationToMarketMovement } from "./FoundationToMarketMovement.js";
import { MarketMovement } from "./MarketMovement.js";
import { PlayerMovement } from "./PlayerMovement.js";

import { eventEmitter } from "../events/EventEmitter.js";


export class WinnerMovement extends Movement{
    constructor(scene, sourcePile, nextPileToDeal, lastIndexToDeal, tempParticipants){
        super(scene);
        this.id = "playerMovement";
        this.sourcePile = sourcePile;
        this.nextPileToDeal = nextPileToDeal;
        this.lastIndexToDeal = lastIndexToDeal;
        this.tempParticipants = tempParticipants;
        this.table = this.scene.elewenjewe.table;
        this.winnerDealCountToWin = 1;
    }
    
    execute(){
        //if(!this.card) return;
        const sourcePile = this.sourcePile;
        const targetPile = this.table.foundationPile;
        if(!sourcePile.container.length){
            alert("last winner pile empty");
            return;
        }
        this.card = sourcePile.container.list[sourcePile.container.length-1];
        this.card.setFrame(this.card.getData("frame"));
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
                    sourceZone: sourcePile.id+"Zone",
                    frame: this.card.getData("frame"),
                    suit: this.card.getData("suit"),
                    colour: this.card.getData("colour"),
                    value: this.card.getData("value")
                });
                
                targetPile.container.add(card);
                card.setPosition(0, 0);
                card.setData({x: card.x, y: card.y}) 
                sourcePile.container.list.pop();
                
                //OPTION A: SOMEONE WINS
                const cardBelow = targetPile.container.list[targetPile.container.length-1];
                const cardTop = targetPile.container.list[targetPile.container.length-2];
                if(targetPile.container.length > 1 &&
                    cardTop.getData("suit") === cardBelow.getData("suit") 
                ){
                    //if there are more than one player left, remove the empty pile that's next to deal
                    if(this.tempParticipants.length > 2){
                        this.removeEmptyNextPileToDeal();
                    }
                    //otherwise, declare last-player-standing as winner
                    else{
                        alert(sourcePile.id + " wins!!");
                        eventEmitter.emit("GameComplete");
                    }
                }
                //OPTION B: NOBODY WINS
                else{
                    //last winner deals 3 times consecutively to bust a participant who's next to deal
                    if(this.winnerDealCountToWin < 2){
                        //play draw card sound
                        this.preloadScene.audio.play(this.preloadScene.audio.drawSound);
                        this.execute();
                        this.winnerDealCountToWin++;
                    }
                    else{
                        alert("sorry, " + sourcePile.id + "☹️, send foundation cards to market");
                        this.moveFoundationCardsToMarket();
                        setTimeout(()=>{
                            const command = new MarketMovement(this.scene, this.nextPileToDeal);
                            this.scene.commandHandler.execute(command); 
                        }, 1100);
                        setTimeout(()=>{
                            const command = new PlayerMovement(this.scene);
                            this.scene.commandHandler.execute(command); 
                        }, 2200) 
                    }
                    
                } 
            }
        })
    }
    removeEmptyNextPileToDeal(){
        const pileToRemove = this.tempParticipants[this.lastIndexToDeal+1];

        //SWAP NAMES and AND GRAY OUT INACTIVE PARTICIPANTS
        // because dealing is still clockwise, but if busted player isn't first index, it's pile is being played on
        //this would confuse user and prevent them from knowing the active participants
        this.swapParticipants(this.table.participants[0], pileToRemove);
        this.table.participants[0].name.setColor('gray');
        
        alert("✈️Go home, " + pileToRemove.id + ", you were busted by " + this.sourcePile.id );
        //since tempParticipants is a shallow copy,
        //deleting the original copy will modify both their members
        this.table.participants.splice(pileToRemove, 1);
  
  
        this.moveFoundationCardsToMarket();
        setTimeout(()=>{
            const command = new PlayerMovement(this.scene);
            this.scene.commandHandler.execute(command); 
        }, 1100)  

    }
    moveFoundationCardsToMarket(){
        const command = new FoundationToMarketMovement(this.scene);
        this.scene.commandHandler.execute(command);  
    }
    swapParticipants(a, b){
        //cards
        if(!a.container.list.length && b.container.list.length){
            //console.log(a.name.text + " is empty");
            this.transferCardBetweenPiles(b, a);
        }
        else if(a.container.list.length && !b.container.list.length){
            //console.log(b.name.text + " is empty");
            this.transferCardBetweenPiles(a, b);
        } 
        //name
        if(a.name.text === b.name.text) return;
        let temp = a.name.text;
        a.name.text = b.name.text;
        b.name.text = temp;
        temp = null;

    }
    transferCardBetweenPiles(pileA, pileB){
        let i = 0;
            while(i < pileA.container.list.length){
                const originalCard = pileA.container.list[i];
                const card = this.scene.createCard(pileB.id+"Card", 0,0)
                    .setInteractive({draggable: false})
                    .setFrame(52);
                card.setData({
                    x: card.x,
                    y: card.y,
                    sourceZone: pileB.id+"Zone",
                    frame: originalCard.getData("frame"),
                    suit: originalCard.getData("suit"),
                    colour: originalCard.getData("colour"),
                    value: originalCard.getData("value")
                });
                
                pileB.container.add(card);
                card.setPosition(-i*0.5, -i*0.5);
                card.setData({x: card.x, y: card.y}) 
                pileA.container.list.pop();
                
                i++;
            }
    }
}