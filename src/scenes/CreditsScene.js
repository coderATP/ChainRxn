/**@type {import("../typings/phaser")} */
import { BaseScene } from "./BaseScene.js";
import { eventEmitter } from "../events/EventEmitter.js";
//import { ui } from "../ui.js";

export class CreditsScene extends BaseScene{
    constructor(config){
        super("CreditsScene", config);
        this.config = config;
    }
    
    destroyEvents(){
        eventEmitter.destroy("MenuToCredits");
    }
    
    enter(){
        this.destroyEvents();
        this.hideAllScreens();
        this.showOne(this.creditsScreen, "grid", 0);
    }
    
    create(){
        this.enter();
        this.initEvents();
        const { PreloadScene } = this.game.scene.keys;
        eventEmitter.once("CreditsToMenu", ()=>{
            this.scene.start("MenuScene");
        })
    }
    
    initEvents(){
        this.ui.credits_menuBtn.addEventListener('click', ()=>{
            eventEmitter.emit("CreditsToMenu");
        }) 
    }
}