import { BaseScene } from "./BaseScene.js";
//command handler for card movements
import { CommandHandler } from "../CommandHandler.js";
//movements
import { PlayerMovement } from "../movements/PlayerMovement.js";
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
        const zone = this.add.zone(x, y, w, h).setRectangleDropZone(w+30, h+30).setDepth(-2)
        .setName(zoneType).setOrigin(0);
        if(this.config.debug){
            this.add.rectangle(x, y, w, h, 0x09144ff, 0.0).setDepth(200).setOrigin(0);
        }
        return zone;
    }
    
    handleDragEvent(){
        this.input.on("drag", (pointer, gameobject, dragX, dragY)=>{
            //change position for a single card
            gameobject.setPosition(dragX, dragY);
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
           gameobject.setDepth(0).setAlpha(1);
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
        //player card
        this.chainRxn.table.playerPile.container.list.forEach((card)=>{
            card.on("pointerdown", ()=>{
              /*  if(this.commandHandler.playing) return;
                const command = new PlayerMovement(this);
                this.commandHandler.execute(command);
                */
            }) 
        })
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
    create(){
        const { PreloadScene } = this.game.scene.keys;
        this.preloadScene = PreloadScene;
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
    
    update(time, delta){

    }
}