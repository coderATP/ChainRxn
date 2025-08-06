import { BaseScene } from "./BaseScene.js";
//command handler for card movements
import { CommandHandler } from "../CommandHandler.js";
//movements
import { MarketToFoundationMovement } from "../movements/MarketToFoundationMovement.js";
import { MarketToPlayerMovement } from "../movements/MarketToPlayerMovement.js";
import { PlayerToMarketMovement } from "../movements/PlayerToMarketMovement.js";
import { PlayerToFoundationMovement } from "../movements/PlayerToFoundationMovement.js";
import { ComputerMovement } from "../movements/ComputerMovement.js";

import { ChainRxn } from "../ChainRxn.js";
import { eventEmitter } from "../events/EventEmitter.js";
import { Time } from "../events/Time.js";
import { GameplayUI } from "../ui/GameplayUI.js";


export class PlayScene extends BaseScene{
    constructor(config){
        super("PlayScene", config);
        this.config = config;
        this.commandHandler = new CommandHandler(this);
        this.chainRxn = new ChainRxn(this);
        this.textDisplayTimer = 0;
        this.textDisplayInterval = 2300;
    }
    
    showInterface(){
        const { PreloadScene } = this.game.scene.keys;
        this.hideAllScreens();
        this.showOne(this.playScreen, "grid", -1);
        this.showMultiple([this.playScreenTopUI, this.playScreenBottomUI], "flex", 0);
        this.preloadScene.audio.menuSong.stop();
        this.preloadScene.audio.playSong.play();

    }
    createCard(type, x, y){
        const card =  this.add.image(x,y,"cards").setName(type).setOrigin(0).setScale(0.8).setDepth(5).setInteractive()
        return card
    }
    createPileRect(x, y, w, h){
        const rect = new Phaser.Geom.Rectangle(x, y, w, h);
        this.graphics.strokeRectShape(rect).setDepth(0);
        return rect;
    }
    createDropZone(zoneType, x, y, w, h){
        const zone = this.add.zone(x, y, w, h).setRectangleDropZone(w, h).setDepth(10)
        .setName(zoneType).setOrigin(0);
        if(this.config.debug){
            this.add.rectangle(x, y, w, h, 0x09144ff, 0.0).setDepth(0).setOrigin(0);
        }
        return zone;
    }
    
    handleDragEvent(){
        this.input.on("drag", (pointer, gameobject, dragX, dragY)=>{
            //change position for a single card
          //  gameobject.setPosition(dragX, dragY);
            //change position for a stack of cards from tableau 

        })
        this.input.on("dragend", (pointer, gameobject, dropped)=>{
          //  gameobject.setPosition(gameobject.getData("x"), gameobject.getData("y")); 
           //for invalid moves, snap back to original location
        })
        return this;
    }
    
    handleDropEvent(){
        this.input.on("drop", (pointer, gameobject, dropZone)=>{
            switch(dropZone.name){
                //FOUNDATION DROP ZONE
                case "playerZone":{
                    //discard to foundation
                break;
                }
                //TABLEAU DROP ZONE
                case "enemyZone":{
                    //discard to tableau 
                break;
                }
                //DISCARD PILE ZONE
                case "foundationZone":{
                    //tableau to discard
                break;
                }
            }
        })
        return this;
    }
    
    handleClickEvent(){
        //all playScreen buttons are disabled, signals game hasn't started
        this.gameplayUI.gameplayButtons.forEach(btn=>{ this.onGameplayButtonPressed(btn)});   
        //flag to click screen once
        //..and send a market card to foundation
        let gameStarted = null;
        this.input.on("pointerdown", ()=>{
            if(gameStarted) return;
            //MARKET MOVEMENT TO DISCARD/FOUNDATION
            if(gameStarted) return;
            const command = new MarketToFoundationMovement(this);
            this.commandHandler.execute(command);
            //all playScreen buttons are revealed after 1 sec, signals game has started
            setTimeout (()=> {this.gameplayUI.gameplayButtons.forEach( btn=> this.onPlayersTurn(btn) ); },1000);
            gameStarted = true;
        });

        //PlayScene icons
        this.gameplayUI.instructionsIcon.hitArea.on("pointerup", ()=>{
            this.preloadScene.audio.buttonClickSound.play();
            eventEmitter.emit("PlayToTutorial");
        });
        this.gameplayUI.pauseIcon.hitArea.on("pointerup", ()=>{
            this.preloadScene.audio.buttonClickSound.play();
            eventEmitter.emit("PlayToPause");
        });
        this.gameplayUI.timeIcon.hitArea.on("pointerup", ()=>{
            //toggle clock sound
            this.preloadScene.audio.buttonClickSound.play(); 
            eventEmitter.emit("ToggleClockTick");
        }); 
        this.processEvents();
        return this;
    }
    
    onGameplayButtonPressed(btn){
        btn.hitArea.disableInteractive();
        btn.enterInactiveState();
    }
    onPlayersTurn(btn){
        btn.hitArea.setInteractive();
        btn.enterRestState();
    }
    processEvents(){
        const { GameCompleteScene, PauseScene, TutorialScene } = this.game.scene.keys;
        //flags
        TutorialScene.tutorialMode = false;
        PauseScene.gamePaused = false;
        //TO PAUSE SCENE
        eventEmitter.on("PlayToPause", ()=>{
            
            this.lastAction = "";
            this.textDisplayTimer = this.textDisplayInterval;
            
            if(PauseScene.gamePaused) return;
            if(!this.scene.isPaused("PlayScene")){
                this.scene.pause(); 
                this.scene.launch("PauseScene");
            }
            PauseScene.gamePaused = true;
        });
        //TO TUTORIAL SCENE
        eventEmitter.on("PlayToTutorial", ()=>{
            //flags to avoid multiple event calling
            if(!TutorialScene.tutorialMode){
                this.scene.pause();
                this.preloadScene.audio.popUpSound.play();
                this.scene.launch("TutorialScene");
                TutorialScene.tutorialMode = true;
            }
        }) 
        eventEmitter.on("GameComplete", ()=>{
            //PAUSE GAME
            if(!this.scene.isPaused("PlayScene")) this.scene.pause();
            this.scene.launch("GameCompleteScene");
            this.preloadScene.audio.popUpSound.play();
            //this.preloadScene.audio.playSong.stop();
            GameCompleteScene.gamePaused = true;
        });
        eventEmitter.on("ToggleClockTick", ()=>{
            this.watch.canPlayTickSound = !this.watch.canPlayTickSound;
        });
    }
     
    shuffle(array){
        let tempDeck = [];
        while(array.length){
            const randomPos = Math.floor(Math.random() * array.length);
            const randomCard = (array.splice(randomPos, 1))[0];
            tempDeck.push(randomCard);
        }
        array = tempDeck;
        tempDeck = [];
        return array;
    }
 
    adjustInGameTextDisplayRate(delta){
        if(this.textDisplayTimer < this.textDisplayInterval){
            this.textDisplayTimer+= delta;
            this.showOne(this.playByPlayScreen, "grid", 0);
        }
        else{
            this.hideOne(this.playByPlayScreen);
            this.textDisplayTimer = this.textDisplayInterval;
        }
    }
    
    dealCard(event){
        let zoneIndex; 
        this.lastAction = "deal";
                this.dealing = true; // flag to only deal once
                this.textDisplayTimer = 0;
                this.ui.gameplayText.innerText = ("tap which card to deal");
               
        //movement
        this.chainRxn.table.playerPile.containers.forEach(container=>{
            container.setDepth(50)
            container.list.forEach(card=>{
                card.setDepth(50).setTint(0x00ff00)
                card.once("pointerdown", ()=>{
                    const zoneIndex = container.getData("index");
                    
                    switch(zoneIndex){
                        case 0: case 1: case 2: case 3: case 4:{
                            if(!this.dealing) return;
                            if(this.lastAction !== "deal") return;

                            const playerCard = container.list[0];
                            const foundationContainer = this.chainRxn.table.foundationPile.container;
                            const foundationCard = foundationContainer.list[foundationContainer.length-1];
                           
                            //execute deal to foundation
                            //only if container isn't empty
                            if(!playerCard){
                                 // alert("P" + (zoneIndex+1)+" is not valid");
                                  this.textDisplayTimer = 0;
                                  this.ui.gameplayText.innerText = ("P" + (zoneIndex+1) +" is empty");
                                  this.preloadScene.audio.play(this.preloadScene.audio.errorSound);
                                  return;
                            }  
                            //only if cards are 1</> each other
                            if(foundationCard.getData("value") !== playerCard.getData("value")+1 &&
                              foundationCard.getData("value") !== playerCard.getData("value")-1 ){
                                 // alert("P" + (zoneIndex+1)+" is not valid");
                                  this.textDisplayTimer = 0;
                                  this.ui.gameplayText.innerText = ("P" + (zoneIndex+1) +"(" + playerCard.getData("value")+") is not valid");
                                  this.preloadScene.audio.play(this.preloadScene.audio.errorSound);
                                  return;
                            }
                            const command = new PlayerToFoundationMovement(this, container);
                            this.commandHandler.execute(command); 
                            //gray out button, indicates dealing was successful
                           // this.onGameplayButtonPressed(event.target);        
                             
                            this.dealing = false; //can no longer deal 
                        break;
                        }
                    } 
                })
            })
        })
    }
    swapCard(){
        let zoneIndex;
        this.lastAction = "swap";
        this.swapping = true; //flag to only swap once
        this.textDisplayTimer = 0;
        this.ui.gameplayText.innerText = ("tap which card to swap");
        //movement
        this.chainRxn.table.playerPile.containers.forEach(container=>{
            container.setDepth(50)
            container.list.forEach(card=>{
                card.setDepth(50).setTint(0x00ff00)
                card.once("pointerdown", ()=>{
                    const zoneIndex = container.getData("index");

                    switch(zoneIndex){
                        case 0: case 1: case 2: case 3: case 4:{
                            if(!this.swapping) return;
                            if(this.lastAction !== "swap") return;
                            //disable button, indicates swap button has been clicked
                            this.onGameplayButtonPressed(this.gameplayUI.swapBtn); 
                            //exchange card with market
                            const command = new MarketToPlayerMovement(this, container);
                            this.commandHandler.execute(command);
                            const otherCommand = new PlayerToMarketMovement(this, container);
                            this.commandHandler.execute(otherCommand); 
                            this.swapping = false; //can no longer swap  
                            break;
                        }
                    }
                })
            })
        })
    }
    
    endTurn(){
        this.lastAction = "end";
        this.textDisplayTimer = 0;
        this.ui.gameplayText.innerText = "turn ended";
        this.computerExecuting = true;
        if(!this.computerExecuting) return;
        const command = new ComputerMovement(this);
        this.commandHandler.execute(command);
        this.computerExecuting = false; //stop executing
        //disable all gameplay buttons, to indicate it's no longer player's turn
        this.gameplayUI.gameplayButtons.forEach(btn=>{
            this.onGameplayButtonPressed(btn);
        })
    }
    undoMove(event){
        this.lastAction = "undo";
        this.textDisplayTimer = 0;
        this.ui.gameplayText.innerText = ("undoing last action"); 
    }
    redoMove(event){
        this.lastAction = "redo";
        this.textDisplayTimer = 0;
        this.ui.gameplayText.innerText = ("redoing last action"); 
    }
    
    listenToGameplayEvents(){
        //last action
        this.lastAction = "";
        //flags
        this.swapping = false; this.dealing = false; this.computerExecuting = false;
        this.preloadScene.audio.play(this.preloadScene.audio.popUpSound);
        //add event listeners to each button
        //some multiple events, others one-time
        this.gameplayUI.swapBtn.hitArea.on("pointerdown", this.swapCard, this);
        this.gameplayUI.dealBtn.hitArea.on("pointerdown", this.dealCard, this);
        this.gameplayUI.endBtn.hitArea.once("pointerdown", this.endTurn, this);
        this.gameplayUI.undoBtn.hitArea.on("pointerdown", this.undoMove, this);
        this.gameplayUI.redoBtn.hitArea.on("pointerdown", this.redoMove, this);
    }
    swapPlayerTopCard(){
        const foundationCardsArray = this.elewenjewe.table.foundationPile.container.list;
        const playerCardsArray = this.elewenjewe.table.playerPile.container.list;
        let foundationTopmostCard = foundationCardsArray[foundationCardsArray.length-1];
        let playerTopmostCard = playerCardsArray[0]; 
        let cardToSwap;
        
        if(!foundationCardsArray.length || !playerCardsArray.length) return;
        for(let i = playerCardsArray.length-1; i >= 0; --i){
            const playerCard = playerCardsArray[i];
            if(foundationTopmostCard.getData("suit") === playerCard.getData("suit")){
                cardToSwap = playerCard;
                break;
            }
        }
        if(cardToSwap){
            this.elewenjewe.table.playerPile.container.bringToTop(cardToSwap);
            playerCardsArray.forEach((card, i)=>{
                card.setPosition(-i*0.5, -i*0.5)
                card.setData({x: card.x, y: card.y})
                card.setFrame(card.getData("frame"))
            })
        }
        return cardToSwap;
    }
    
    sortPile(array){
        array.sort((a, b)=> a.getData("value") - b.getData("value"))
    }
    
    
    create(){
        const { PreloadScene } = this.game.scene.keys;
        this.preloadScene = PreloadScene;
        this.showInterface();
       
        //ui
        this.gameplayUI = new GameplayUI(this,0,0);
        this.listenToGameplayEvents();

        //watch
        this.watch = new Time(this);
        this.watch.setUpWatch(this.gameplayUI.timeIcon.label).startWatch(this.gameplayUI.timeIcon.label);
        //graphics creation
        this.graphics = this.add.graphics({lineStyle:  {width: 1, color: "0xffffff"} })
        //game
        this.chainRxn.newGame();
        
        //events
        this.handleDragEvent().handleDropEvent().handleClickEvent();
       
    }
    
    update(time, delta){
        this.adjustInGameTextDisplayRate(delta);
    }
}