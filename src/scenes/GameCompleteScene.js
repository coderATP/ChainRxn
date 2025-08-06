import { BaseScene } from "./BaseScene.js";
import { eventEmitter } from "../events/EventEmitter.js";

export class GameCompleteScene extends BaseScene{
    constructor(config){
        super("GameCompleteScene", config);
        this.config = config;
        this.gamePaused = true;
    }
    
    showInterface(){
        this.showOne(this.levelCompleteScreen, "grid", 0);
    }

    create(){
        const { PreloadScene } = this.game.scene.keys;
        this.preloadScene = PreloadScene; 
        this.showInterface();
        this.handleGameComplete();
        this.processEvents();
    }
    processEvents(){
        const { PlayScene } = this.game.scene.keys;

        eventEmitter.once("GameCompleteToMenu", ()=>{
            if(this.gamePaused){
                this.preloadScene.audio.popUpSound.play();
                PlayScene.watch.resetWatch(PlayScene.ui.timeText);
                this.scene.start("TableSelectionScene"); 
                this.gamePaused = false;
            }

        })
        eventEmitter.once("GameCompleteToNewGame", ()=>{
            if(this.gamePaused){
                PlayScene.watch.resetWatch(PlayScene.ui.timeText);
                this.scene.stop();
                this.preloadScene.audio.popUpSound.play(); 
                this.hideOne(this.levelCompleteScreen);
                this.scene.launch("PlayScene"); 
                this.gamePaused = false;
            }

        })
        eventEmitter.on("GameCompleteToRestart", ()=>{
            if(this.gamePaused){
                PlayScene.watch.resetWatch(PlayScene.ui.timeText).setUpWatch(PlayScene.ui.timeText);
                PlayScene.audio.popUpSound.play();
                PlayScene.solitaire.onClickRestartButton();
                PlayScene.commandHandler.reset();
                PlayScene.updateMoves();
                PlayScene.updateScore();
                this.hideOne(this.levelCompleteScreen);
                if(this.scene.isPaused("PlayScene")) this.scene.resume("PlayScene");
                this.gamePaused = false;
            }

        })
    }
    handleGameComplete(){
        const { PlayScene } = this.game.scene.keys;
        //PlayScene.chainRxn.displayEndOfGameStatistics();
        PlayScene.watch.stopWatch();
        //NEW GAME
        levelComplete_newGameBtn.addEventListener('click', ()=>{
            eventEmitter.emit("GameCompleteToNewGame");
        })
        //MENU
        levelComplete_menuBtn.addEventListener('click', ()=>{
            eventEmitter.emit("GameCompleteToMenu");
        })
        
    }
}