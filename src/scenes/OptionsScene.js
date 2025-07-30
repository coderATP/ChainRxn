/**@type {import("../typings/phaser")} */
import { BaseScene } from "./BaseScene.js";
import { eventEmitter } from "../events/EventEmitter.js";
//import { ui } from "../ui.js";

export class OptionsScene extends BaseScene{
    constructor(config){
        super("OptionsScene", config);
        this.config = config;
    }
    
    destroyEvents(){
        eventEmitter.destroy("MenuToOptions");
    }
    
    enter(){
        this.destroyEvents();
        this.hideAllScreens();
        this.showOne(this.optionsScreen, "grid", 0);
    }
    
    create(){
        this.enter();
        this.initEvents();
        const { PreloadScene } = this.game.scene.keys;
        eventEmitter.once("OptionsToMenu", ()=>{
            this.scene.start("MenuScene");
        })
        
        //adjust sfx
        this.ui.sfx_controller.addEventListener('change', ()=>{
            PreloadScene.audio.sounds.forEach(sound=>{
                sound.volume = this.ui.sfx_controller.value * 0.1;
                
            })
        })
        this.ui.music_controller.addEventListener('change', ()=>{
            PreloadScene.audio.songs.forEach(song=>{
                song.volume = this.ui.music_controller.value * 0.1;
                
            })
        }) 
    }
    
    
    initEvents(){
        this.ui.options_menuBtn.addEventListener('click', ()=>{
            eventEmitter.emit("OptionsToMenu");
        }) 
    }
}