import { BaseScene } from "./BaseScene.js";
import { eventEmitter } from "../events/EventEmitter.js";

export class PauseScene extends BaseScene{
    constructor(config){
        super("PauseScene", config);
        this.config = config;
        this.gamePaused = null; //flag
    }
    
    showInterface(){
        this.hideOne(this.confirmScreen);
        this.showOne(this.pauseScreen, "grid", 0);
    }

    create(){
        const { PreloadScene } = this.game.scene.keys;
        this.preloadScene = PreloadScene;
        this.showInterface();
        this.handleGamePause();
        this.processEvents();
    }
    processEvents(){
        const { PlayScene } = this.game.scene.keys;
        eventEmitter.once("PauseToConfirm", ()=>{
            this.preloadScene.audio.popUpSound.play();
            this.scene.start("ConfirmScene");
        })
    }
    handleGamePause(){
        const { PlayScene } = this.game.scene.keys;
        PlayScene.watch.stopWatch();
        this.confirmText = document.getElementById("confirmText");
        //RESUME
        this.ui.pause_resumeBtn.addEventListener('click', ()=>{
            if(this.gamePaused){
                PlayScene.watch.resumeWatch(this.ui.timeText);
                this.scene.stop();
                if(this.scene.isPaused("PlayScene")) this.scene.resume("PlayScene");
                this.preloadScene.audio.play(this.preloadScene.audio.buttonClickSound);
                this.hideOne(this.pauseScreen);
                this.gamePaused = null; 
            }
            
        })
        //menu
        PlayScene.ui.pause_menuBtn.addEventListener('click', ()=>{
            this.confirmText.innerText = "Return to Menu?" 
            eventEmitter.emit("PauseToConfirm");
        })
        //OPTIONS
        PlayScene.ui.pause_optionsBtn.addEventListener('click', ()=>{
           // this.confirmText.innerText = "Restart?"
            eventEmitter.emit("PauseToOptions");
        })
        
    }
}