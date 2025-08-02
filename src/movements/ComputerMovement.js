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
    
    execute(){
        //CommandHandler is playing, don't allow user input
        this.scene.commandHandler.playing = true;
        //A RECURSIVE FUNCTION: keeps calling itself
        this.lastIndexToDeal++; //player starts
        
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
        
        //determine which pile the computer will deal from (easy)
            // pile cannot be empty
        containers = containers.filter((container, index, array)=> container.length);
            // check which containers contain valid card to deal to foundation
                //top card on foundation must be 1 </> than the one to be dealt.
        const topFoundationCard = foundationPile.container.list[foundationPile.container.length - 1];
        
        const validContainersToDealFrom = [];
        const validCardsToDealFrom = [];
        const invalidContainersToDealFrom = [];
        const invalidCardsToDealFrom = []; 
        containers.forEach((container, index, array)=>{
            container.list.forEach(card=>{
                if(card.getData("value") === topFoundationCard.getData("value") + 1 ||
                   card.getData("value") === topFoundationCard.getData("value") - 1){
                       validCardsToDealFrom.push(card);
                       validContainersToDealFrom.push(container);
                }
                else{
                       invalidCardsToDealFrom.push(card);
                       invalidContainersToDealFrom.push(container); 
                }
            })
            
        });
        
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
                  //  let randomNumber = Math.random();
                  //  if(randomNumber > 0.9) return;
                    const randomInvalidContainer = invalidContainersToDealFrom[Math.floor(Math.random()*invalidCardsToDealFrom.length)];
                    if(!this.movingToFoundation) return;
                    const command = new PlayerToMarketMovement(this.scene, randomInvalidContainer);
                    this.scene.commandHandler.execute(command);
                    const otherCommand = new MarketToPlayerMovement(this.scene, randomInvalidContainer);
                    this.scene.commandHandler.execute(otherCommand);
                    this.movingToFoundation = false;
                break;
                }
            }
 
    }
    
    resetDealerIndexIfNobodyWins(){
        if(this.lastIndexToDeal >= this.table.participants.length-1){
            this.lastIndexToDeal = -1;
        } 
    }
    continueDealing(){
        //first player deals again if nobody wins 
        this.resetDealerIndexIfNobodyWins();
        let nextPileToDeal = this.tempParticipants[this.lastIndexToDeal+1];
        //but first check if next pile to deal is empty or not
        
        //OPTION 1: next pile to deal is empty 
        if(nextPileToDeal.container.length === 0){
            //if empty, check if market pile also isn't empty and move a card from market to it,
            //then resume executing/dealing
            const marketPile = this.table.marketPile;
            //OPTION a: MARKET PILE ISN'T EMPTY 
            if(marketPile.container.length){
                const command = new MarketMovement(this.scene, nextPileToDeal);
                this.scene.commandHandler.execute(command); 
                //wait (for 1 sec) till card arrives from market, then deal
                setTimeout(()=>{
                    //after arriving from market,
                        if(nextPileToDeal.id === "Player"){
                            //allow (internal) card swapping to favour player
                            this.swapPlayerCardsBasedOnDifficultyLevel();
                            const playerPileTopmostCard = this.table.playerPile.container.list[this.table.playerPile.container.list.length - 1];
                            //allow player to click card before executing
                            playerPileTopmostCard.once("pointerdown", ()=>{ this.execute() })
                    }
                    else this.execute();    
                }, 1100) 
            }
            //OPTION b: MARKET PILE IS EMPTY
            else{
                //WinnerMovement is called
                //that is, winner plays three times consecutively hoping to win that round
                //and bust the next player to deal whose pile is empty
                const command = new WinnerMovement(this.scene, this.recentWinner.winnerPile, nextPileToDeal, this.lastIndexToDeal, this.tempParticipants);
                this.scene.commandHandler.execute(command);
            }

        }
        //OPTION 2: next pile to deal isn't empty
        //just keep dealing
        else{
            if(nextPileToDeal.id === "Player"){
                //allow (internal) card swapping to favour player
                this.swapPlayerCardsBasedOnDifficultyLevel();
                const playerPileTopmostCard = this.table.playerPile.container.list[this.table.playerPile.container.list.length - 1];
                //allow player to click card before executing
                playerPileTopmostCard.once("pointerdown", ()=>{ this.execute() })
            }
            else this.execute();   
        }
    }
    
    swapPlayerCardsBasedOnDifficultyLevel(){
        const { elewenjewe } = this.scene;
        const randomNumber = Math.random();
        
        switch(elewenjewe.difficulty){
            case "easy":{
                randomNumber < 0.85 && this.scene.swapPlayerTopCard();
              break;
            }
            case "normal":{
                randomNumber < 0.65 && this.scene.swapPlayerTopCard(); 
              break;
            } 
            case "hard": {
                randomNumber < 0.45 && this.scene.swapPlayerTopCard();
                break;
            }
            case "legend": {
                randomNumber < 0.25 && this.scene.swapPlayerTopCard();
                break;
            }
            case "hell": {
                //randomNumber < 0 && this.scene.swapPlayerTopCard();
                break;
            }
            default: {break;}
        }
    }
} 