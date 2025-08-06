import { BaseScene } from "./BaseScene.js";
import { eventEmitter } from "../events/EventEmitter.js";

export class MenuScene extends BaseScene{
    constructor(config){
        super("MenuScene", config);
        this.config = config;
        this.clicked = true;
    }
    
    showInterface(){
        const { PreloadScene, PlayScene } = this.game.scene.keys; 
        this.hideAllScreens();
        this.showOne(this.menuScreen, "grid", 0);
        this.scene.stop("PlayScene");
        PreloadScene.audio.playSong.isPlaying&& PreloadScene.audio.playSong.stop();
        !PreloadScene.audio.menuSong.isPlaying&& PreloadScene.audio.menuSong.play();
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
        }, {once: true}) 
        this.ui.menu_optionsBtn.addEventListener("click", ()=>{
            eventEmitter.emit("MenuToOptions");
        }, {once: true} )
        this.ui.menu_creditsBtn.addEventListener("click", ()=>{
            eventEmitter.emit("MenuToCredits");
        }, {once: true});
        this.ui.menu_exitBtn.addEventListener("click", ()=>{
            eventEmitter.emit("MenuToExit");
        }, {once: true});
        eventEmitter.once("MenuToTableSelection", ()=>{
            this.scene.start("TableSelectionScene");
        });
        eventEmitter.once("MenuToOptions", ()=>{
            this.scene.start("OptionsScene");
        });
        eventEmitter.once("MenuToCredits", ()=>{
            this.scene.start("CreditsScene");
        });
        eventEmitter.once("MenuToExit", ()=>{
            PlayScene.ui.confirmText.innerText = "Quit Game?";
            this.scene.start("ConfirmScene");
        });
        this.tweens.add({
            targets: this.ui.menu_playBtn,
            alpha: 0.2,
            yoyo: true,
            repeat: -1,
            duration: 1000
        })
    }
}