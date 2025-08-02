import { BaseScene } from "./BaseScene.js";
import { eventEmitter } from "../events/EventEmitter.js";

export class MenuScene extends BaseScene{
    constructor(config){
        super("MenuScene", config);
        this.config = config;
        this.clicked = true;
    }
    
    showInterface(){
        this.ui.gameplayButtons.forEach(btn=>{
            eventEmitter.destroy("GAMEPLAY")
        })
        eventEmitter.destroy("GAMEPLAY");
        eventEmitter.destroy("TableSelectionToMenu")
        const { PreloadScene, PlayScene } = this.game.scene.keys; 
        eventEmitter.destroy("ConfirmToMenu"); 
        eventEmitter.destroy("GameCompleteToMenu");
        this.hideAllScreens();
        this.showOne(this.menuScreen, "grid", 0);
        this.scene.stop("PlayScene");
      //  PreloadScene.audio.playSong.isPlaying&& PreloadScene.audio.playSong.stop();
      //  !PreloadScene.audio.menuSong.isPlaying&& PreloadScene.audio.menuSong.play();
    }
    playButtonSound(){
        const { PreloadScene } = this.game.scene.keys;
        this.ui.menuBtns.forEach(btn=>{
            btn.addEventListener('click', ()=>{
                PreloadScene.audio.play(PreloadScene.audio.buttonClickSound);
            })
        })
        this.ui.tableSelectionBtns.forEach(btn=>{
            btn.addEventListener('click', ()=>{
                PreloadScene.audio.play(PreloadScene.audio.buttonClickSound);
            })
        })
        this.ui.pauseBtns.forEach(btn=>{
            btn.addEventListener('click', ()=>{
                PreloadScene.audio.play(PreloadScene.audio.buttonClickSound);
            })
        }) 
    }
    create(){
        const { PlayScene } = this.game.scene.keys;
        this.showInterface();
        this.playButtonSound()
        this.title = this.add.image(0,0,"title").setOrigin(0).setScale(1);
        this.title.setPosition(this.config.width/2 - this.title.displayWidth/2, 10);

        this.ui.menu_playBtn.addEventListener("click", ()=>{
            eventEmitter.emit("MenuToTableSelection");
        }) 
        this.ui.menu_optionsBtn.addEventListener("click", ()=>{
            eventEmitter.emit("MenuToOptions");
        })
        this.ui.menu_creditsBtn.addEventListener("click", ()=>{
            eventEmitter.emit("MenuToCredits");
        });
        this.ui.menu_exitBtn.addEventListener("click", ()=>{
            eventEmitter.emit("MenuToExit");
        });
        eventEmitter.once("MenuToTableSelection", ()=>{
            this.scene.start("TableSelectionScene");
        })
        eventEmitter.once("MenuToOptions", ()=>{
            this.scene.start("OptionsScene");
        })
        eventEmitter.once("MenuToCredits", ()=>{
            this.scene.start("CreditsScene");
        })
        eventEmitter.once("MenuToExit", ()=>{
            PlayScene.ui.confirmText.innerText = "Quit Game?";
            this.scene.start("ConfirmScene");
        })   
        this.tweens.add({
            targets: this.ui.menu_playBtn,
            alpha: 0.2,
            yoyo: true,
            repeat: -1,
            duration: 1000
        })
    }
}