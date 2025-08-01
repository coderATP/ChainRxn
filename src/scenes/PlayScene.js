import { BaseScene } from "./BaseScene.js";
//command handler for card movements
import { CommandHandler } from "../CommandHandler.js";
//movements
import { PlayerMovement } from "../movements/PlayerMovement.js";
import { MarketToFoundationMovement } from "../movements/MarketToFoundationMovement.js";
import { MarketToPlayerMovement } from "../movements/MarketToPlayerMovement.js";
import { PlayerToMarketMovement } from "../movements/PlayerToMarketMovement.js";
import { PlayerToFoundationMovement } from "../movements/PlayerToFoundationMovement.js";

import { ChainRxn } from "../ChainRxn.js";
import { eventEmitter } from "../events/EventEmitter.js";
import { Time } from "../events/Time.js";
import { UIEventsHandler } from "../events/UIEventsHandler.js";


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
        eventEmitter.destroy("PlayToPause");
        eventEmitter.destroy("ConfirmToPause");
        eventEmitter.destroy("ConfirmToMenu"); 
        eventEmitter.destroy("ConfirmToRestart");
        eventEmitter.destroy("TableSelectionToPlay");
        
        this.hideAllScreens();
        this.showOne(this.playScreen, "grid", -1);
        this.showMultiple([this.playScreenTopUI, this.playScreenBottomUI], "flex", 0);
       // PreloadScene.audio.menuSong.stop();
        //PreloadScene.audio.playSong.play();
    }
    createCard(type, x, y){
        const card =  this.add.image(x,y,"cards").setName(type).setOrigin(0).setScale(window.devicePixelRatio/2.5);
        return card
    }
    createPileRect(x, y, w, h){
        const rect = new Phaser.Geom.Rectangle(x, y, w, h);
        this.graphics.strokeRectShape(rect);
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
        //all playScreen buttons are hidden
        this.ui.gameplayButtons.forEach(btn=>{ btn.hidden = true; }); 
        //flag to click screen once
        //..and send a market card to foundation
        let gameStarted = null;
        this.input.on("pointerdown", ()=>{
            if(gameStarted) return;
            //MARKET MOVEMENT TO DISCARD/FOUNDATION
            if(gameStarted) return;
            const command = new MarketToFoundationMovement(this);
            this.commandHandler.execute(command);
            gameStarted = true;
            //all playScreen buttons are revealed, signals game started
            this.ui.gameplayButtons.forEach(btn=>{ btn.hidden = false; });  
        });

        //PlayScene icons
        this.ui.playSceneIcons.forEach(icon=>{
            icon.addEventListener('click', (e)=>{
               if(e.currentTarget.id === "pause"){
                    eventEmitter.emit("PlayToPause");
                }
               else if(e.currentTarget.id === "instructions"){
                    eventEmitter.emit("PlayToTutorial");
                } 
            })
        });
        this.processEvents();
        return this;
    }
    
    onGameplayButtonPressed(btn){
        btn.disabled = true;
        btn.style.backgroundColor = "gray";
    }
    
    processEvents(){
        const { GameCompleteScene, PauseScene, TutorialScene } = this.game.scene.keys;
        PauseScene.gamePaused = false;
        TutorialScene.tutorialMode = false;
        eventEmitter.on("PlayToPause", ()=>{
            //flags to avoid multiple event calling
            if(!PauseScene.gamePaused){
                this.scene.pause();
                this.preloadScene.audio.popUpSound.play();
                this.scene.launch("PauseScene");
                PauseScene.gamePaused = true;
            }
        })
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
        })
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
    
    listenToGameplayEvents(){
        //last action
        this.lastAction = "";
        //flags
        let swapping, dealing;
        this.ui.gameplayButtons.forEach(btn=>{
            
            btn.addEventListener("click", (e)=>{
                this.preloadScene.audio.play(this.preloadScene.audio.popUpSound);
                let zoneIndex;
                switch(e.target.id){
                    //SWAP
                    case "swapBtn" : {
                        this.lastAction = "swap";
                        this.swapping = true; //flag to only swap once
                        this.textDisplayTimer = 0;
                        this.ui.gameplayText.innerText = ("tap which card to swap");
                        
                        //movement
                        this.input.on("pointerdown", (pointer, gameobject)=>{
                            if(!gameobject[0]) return;
                            zoneIndex = gameobject[0].getData("index");
                            
                            switch(zoneIndex){
                                case 0: case 1: case 2: case 3: case 4:{
                                    if(!this.swapping) return;
                                    if(this.lastAction !== "swap") return;
                                    //read zone index
                                    const containers = this.chainRxn.table.playerPile.containers;
                                    const container = containers[zoneIndex];

                                    //gray out button, indicates swapping has been done
                                    this.onGameplayButtonPressed(e.target);
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
                        
                    break;
                    }
                    //DEAL
                    case "dealBtn" : {
                       this.lastAction = "deal";
                        this.dealing = true; // flag to only deal once
                        this.textDisplayTimer = 0;
                        this.ui.gameplayText.innerText = ("tap which card to deal");
                        
                        //movement
                        this.input.on("pointerdown", (pointer, gameobject)=>{
                            if(!gameobject[0]) return;
                            zoneIndex = gameobject[0].getData("index");
                            
                            switch(zoneIndex){
                                case 0: case 1: case 2: case 3: case 4:{
                                    if(!this.dealing) return;
                                    if(this.lastAction !== "deal") return;
                                    const containers = this.chainRxn.table.playerPile.containers;
                                    const container = containers[zoneIndex];

                                    //reveal chain and rotate towards dealer
                                    this.chainRxn.table.chain.rotateTowards(container);
                                    //gray out button, indicates dealing has been done
                                    this.onGameplayButtonPressed(e.target);
                                    //execute deal to foundation
                                    const command = new PlayerToFoundationMovement(this, container);
                                    this.commandHandler.execute(command); 
                                    this.dealing = false; //can no longer deal 
                                break;
                                }
                            }
                        });
                        
                    break;
                    }
                    //UNDO
                    case "undoBtn": {
                        this.lastAction = "undo";
                        this.textDisplayTimer = 0;
                        this.ui.gameplayText.innerText = ("undoing last action");
                    break;
                    }
                    //REDO
                    case "redoBtn": {
                        this.lastAction = "redo";
                        this.textDisplayTimer = 0;
                        this.ui.gameplayText.innerText = ("redoing last action");
                    break;
                    }
                    //END
                    case "endBtn": {
                        this.lastAction = "end";
                        this.textDisplayTimer = 0;
                        this.ui.gameplayText.innerText = ("turn ended");
                    break;
                    } 
                }
            })
        })
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
        this.listenToGameplayEvents();
        this.showInterface();
       
        //ui
        this.ui = new UIEventsHandler(this);
        //watch
        this.watch = new Time(this);
        this.watch.setUpWatch(this.ui.timeText).startWatch(this.ui.timeText);
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