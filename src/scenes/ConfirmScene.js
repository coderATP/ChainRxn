import { BaseScene } from "./BaseScene.js";
import { eventEmitter } from "../events/EventEmitter.js";

export class ConfirmScene extends BaseScene{
    constructor(config){
        super("ConfirmScene", config);
        this.config = config;

    }
    
    showInterface(){
        this.hideMultiple([this.pauseScreen, this.levelCompleteScreen, this.menuScreen]);
        this.showOne(this.confirmScreen, "grid", 0)
    }

    create(){
        this.gamePaused = true;
        this.showInterface();
        this.handleConfirm();
    }
    handleConfirm(){
        let clicked = false;
        const { PreloadScene, PauseScene, PlayScene } = this.game.scene.keys;
        noBtn.addEventListener("click", ()=>{
            switch(PlayScene.ui.confirmText.innerText){
                case "Return to Menu?" : case "Restart?":{
                    eventEmitter.emit("ConfirmToPause"); 
                break;
                }
                case "Quit Game?": {
                    eventEmitter.emit("ConfirmToMenu"); 
                break;
                }
                default:{
                break;
                }
            }
        })
        yesBtn.addEventListener("click", ()=>{
            if(PlayScene.ui.confirmText.innerText === "Return to Menu?") eventEmitter.emit("ConfirmToMenu");
            else if(PlayScene.ui.confirmText.innerText === "Quit Game?") eventEmitter.emit("ConfirmToQuit");
            else if(PlayScene.ui.confirmText.innerText === "Restart?") eventEmitter.emit("ConfirmToRestart");
        }) 
        eventEmitter.once("ConfirmToPause", ()=>{
            PreloadScene.audio.popUpSound.play();
            this.scene.start("PauseScene");
        })
        eventEmitter.once("ConfirmToMenu", ()=>{
            PreloadScene.audio.popUpSound.play();
            this.scene.start("MenuScene");
        })
        eventEmitter.once("ConfirmToQuit", ()=>{
            PreloadScene.audio.popUpSound.play();
            this.hideAllScreens();
            document.body.backgroundColor = "black";
            this.config.transparent = false;
            this.game.destroy(true, true);
            window.open("", "_blank", "", true);
        })
        eventEmitter.once("ConfirmToRestart", ()=>{
            PreloadScene.audio.popUpSound.play();
            this.hideOne(this.confirmScreen);
            PlayScene.watch.resetWatch(PlayScene.ui.timeText).setUpWatch(PlayScene.ui.timeText);
            this.scene.stop();
            PlayScene.chainRxn.table.participants.forEach(participant=>{
                while(participant.container.length) participant.container.list.pop();
            })
            while(PlayScene.chainRxn.table.foundationPile.container.length){
                PlayScene.chainRxn.table.foundationPile.container.list.pop();
            }
            while(PlayScene.chainRxn.table.marketPile.container.length){
                PlayScene.chainRxn.table.marketPile.container.list.pop();
            }
            PlayScene.chainRxn.onRestart();
            //setTimeout(()=>{this.scene.resume('PlayScene')}, 1)
           
        })  
    
    }

}