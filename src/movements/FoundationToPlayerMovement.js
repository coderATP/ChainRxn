import { Movement } from "./Movement.js";

export class FoundationToPlayerMovement extends Movement{
    constructor(scene, targetPile){
        super(scene);
        this.id = "foundationToPlayerMovement";
        this.targetPile = targetPile;
        this.table = this.scene.elewenjewe.table;
    }
    
    execute(){
        const sourcePile = this.table.foundationPile;
        const targetPile = this.targetPile;
        //play right sound for player
        if(targetPile.id === "Player") this.preloadScene.audio.playerWinSound.play();
        else this.preloadScene.audio.opponentWinSound.play(); 
             
        for(let i = 0; i < sourcePile.container.length; ++i){

            const originalCard = sourcePile.container.list[i];
            this.scene.tweens.add({
                targets: originalCard,
                y: targetPile.y - sourcePile.y,
                x: targetPile.x - sourcePile.x,
                duration: 800,
                ease: "Quadratic",
                onComplete: ()=>{
                    const card = this.scene.createCard(targetPile.id+"Card", originalCard.getData("x"), originalCard.getData("y"))
                        .setInteractive({draggable: false})
                        .setFrame(52)
                    card.setData({
                        x: card.x,
                        y: card.y,
                        frame: originalCard.getData("frame"),
                        suit: originalCard.getData("suit"),
                        colour: originalCard.getData("colour"),
                        value: originalCard.getData("value")
                    });
                
                    targetPile.container.addAt(card, 0);
                    //set position of new card
                    targetPile.container.list.forEach((card, i)=>{
                        card.setPosition(-i*0.5, -i*0.5)
                        card.setData({x: card.x, y: card.y})
                        if(targetPile.id === "Player") card.setFrame(card.getData("frame"));
                    })
                    //destroy original card
                    originalCard.destroy();
                }
            });
            
        }
    }
}