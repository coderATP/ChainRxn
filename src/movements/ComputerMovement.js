import { Movement } from "./Movement.js";
import { CommandHandler } from "../CommandHandler.js";
import { PlayerToFoundationMovement } from "./PlayerToFoundationMovement.js";
import { PlayerToMarketMovement } from "./PlayerToMarketMovement.js";
import { MarketToPlayerMovement } from "./MarketToPlayerMovement.js";


export class ComputerMovement extends Movement{
    constructor(scene){
        super(scene);
        this.id = "computerMovement";
        this.table = this.scene.chainRxn.table;
        this.lastIndexToDeal = -1;
        this.scene = scene;
        this.tempParticipants = this.table.opponents.slice();
        this.validContainersToDealFrom = [];
        this.validCardsToDealFrom = [];
        this.invalidContainersToDealFrom = [];
        this.invalidCardsToDealFrom = [];
    }
    
    determineEndOfRoundWinner(data, winnerPile){
        const score = this.table.foundationPile.container.length;
        const winner = winnerPile.id;
        data.forEach(cell=>{
            if(cell.id === winnerPile.id){
                cell.innerHTML = parseInt(cell.innerHTML) + score;
            }
        })
        return {winnerPile, winner, score};
    }
    
    resetContainers(){
        this.validContainersToDealFrom = [];
        this.validCardsToDealFrom = [];
        this.invalidContainersToDealFrom = [];
        this.invalidCardsToDealFrom = [];
    }
    
    addDataToContainers(containers){
        //determine which pile the computer will deal from (easy)
            // pile cannot be empty
        containers = containers.filter((container, index, array)=> container.length);
            // check which containers contain valid card to deal to foundation
                //top card on foundation must be 1 </> than the one to be dealt.
        this.topFoundationCard = this.table.foundationPile.container.list[this.table.foundationPile.container.length - 1];
        
        this.resetContainers();
        containers.forEach((container, index, array)=>{
            container.list.forEach(card=>{
                //hide container cards
                card.setFrame(59);
                if(card.getData("value") === this.topFoundationCard.getData("value") + 1 ||
                   card.getData("value") === this.topFoundationCard.getData("value") - 1){
                       this.validCardsToDealFrom.push(card);
                       this.validContainersToDealFrom.push(container);
                }
                else{
                       this.invalidCardsToDealFrom.push(card);
                       this.invalidContainersToDealFrom.push(container); 
                }
            })
        });
    }
    execute(){
        //CommandHandler is playing, don't allow user input
        this.scene.commandHandler.playing = true;
        //A RECURSIVE FUNCTION: keeps calling itself
        this.lastIndexToDeal++; //player starts
        if(this.lastIndexToDeal > this.tempParticipants.length-1){
            //enable all gameplay buttons, it's player's turn
            this.scene.gameplayUI.gameplayButtons.forEach(btn=>{
                this.scene.onPlayersTurn(btn);
            });
            //add a one-time event listener to end button
            this.scene.gameplayUI.endBtn.hitArea.once("pointerdown", this.scene.endTurn, this.scene);
            return;
        }
        
        const marketPile = this.table.marketPile;
        const foundationPile = this.table.foundationPile;
        let sourcePile = this.tempParticipants[this.lastIndexToDeal];
        
        //REVEAL CARD OF PARTICIPANT ONLY WHEN IT'S TIME TO DEAL
        const topCard = sourcePile.container.list[sourcePile.container.length-1];
        if(topCard) topCard.setFrame(topCard.getData("frame"));
        
        //take random card from non-empty pile and deal
        let randomCard = null;
        let containers = sourcePile.containers;
        const randomContainer = containers[Math.floor(Math.random() * containers.length)];
        

        this.addDataToContainers(containers);
        //determine which pile the computer will swap from (intermediate)
            //conditions to swap
            //computer will not swap from non-empty containers
            //computer won't (often) swap from dealable containers
            
            //GAME MODES LOGIC - EASY TO HARD MODES FOR SWAPPING
            //EASY: SWAP ANY UNDEALABLE CARDS, ALSO SWAP DEALABLE ONES 30% FREQUENTLY
            //MEDIUM: SWAP ANY UNDEALABLE CARDS, BUT DON'T SWAP DEALABLE ONES
            //HARD: SWAP ANY UNDEALABLE CARDS, ONLY IF VALUE 2<> TOP FOUNDATION CARD, DON'T SWAP DEALABLE ONES AT ALL
            const GAME_MODES = Object.freeze({
                EASY: 0,
                MEDIUM: 1,
                HARD: 2
            });
            //before entering game mode, set flags to prevent multiple calling
            this.movingToFoundation = false;
            this.movingToMarket = false;
            
            let gameMode = GAME_MODES.EASY
            switch(gameMode){
                case GAME_MODES.EASY:{
                    this.movingToFoundation = true;
                    //swap 90% of the time
                    let swapFrequency = Math.random();
                    let dealFrequency = Math.random();
                    let swapOrDealFirst = Math.random();
                    //swap first
                    if(swapOrDealFirst < 0.5){
                    }
                    //deal first
                    else{
                        
                    }
                   // if(swapFrequency > 0.9) return;
                    const randomInvalidContainer = this.invalidContainersToDealFrom[Math.floor(Math.random()*this.invalidCardsToDealFrom.length)];
                    if(!this.movingToFoundation) return;
                    //swap
                    let command, otherCommand;
                    //if there's a viable container to swap from, swap
                    if(randomInvalidContainer){
                        this.scene.textDisplayTimer = 0;
                        this.scene.ui.gameplayText.innerText = (sourcePile.id + " is swapping...");  
                        command = new PlayerToMarketMovement(this.scene, randomInvalidContainer);
                        this.scene.commandHandler.execute(command);
                        otherCommand = new MarketToPlayerMovement(this.scene, randomInvalidContainer);
                        this.scene.commandHandler.execute(otherCommand);
                    }
                    else{
                        this.scene.textDisplayTimer = 0;
                        this.scene.ui.gameplayText.innerText = (sourcePile.id + " opts not to swap"); 
                    }
                    //deal afterwards
                    setTimeout(()=>{
                        this.addDataToContainers(containers);
                        const randomValidContainer = this.validContainersToDealFrom[Math.floor(Math.random()*this.validCardsToDealFrom.length)];
                        if(!randomValidContainer){
                            this.scene.textDisplayTimer = 0;
                            this.scene.ui.gameplayText.innerText = (sourcePile.id + " has no valid card to deal"); 
                            return;
                        }
                        this.scene.textDisplayTimer = 0;
                        this.scene.ui.gameplayText.innerText = (sourcePile.id + " is dealing..."); 
                        const command = new PlayerToFoundationMovement(this.scene, randomValidContainer);
                        this.scene.commandHandler.execute(command);
                        this.movingToFoundation = false;
                    }, 1100);
                    
                    //NEXT PARTICIPANT
                    setTimeout(()=>{
                       // if(this.lastIndexToDeal > this.tempParticipants.length-1) return;
                        this.execute();
                    }, 2200)
                break;
            }
                
        }
    }
    
} 