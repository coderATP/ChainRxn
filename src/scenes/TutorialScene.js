/**@type {import("../typings/phaser")} */
import { BaseScene } from "./BaseScene.js";
import { eventEmitter } from "../events/EventEmitter.js";
import { tutorial } from "../utils/Tutorial.js";

export class TutorialScene extends BaseScene{
    constructor(config){
        super("TutorialScene", config);
        this.config = config;
        this.tutorialMode = null; //flag
    }
    
    showInterface(){
        this.hideOne(this.confirmScreen);
        this.showOne(this.tutorialScreen, "grid", 0);
    }

    create(){
        const { PreloadScene } = this.game.scene.keys;
        this.preloadScene = PreloadScene;
        
        this.addTutorials();
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
        this.ui.tutorial_backBtn.addEventListener('click', ()=>{
            if(this.tutorialMode){
                PlayScene.watch.resumeWatch(this.ui.timeText);
                this.scene.stop();
                if(this.scene.isPaused("PlayScene")) this.scene.resume("PlayScene");
                this.preloadScene.audio.play(this.preloadScene.audio.buttonClickSound);
                this.hideOne(this.tutorialScreen);
                this.tutorialMode = null; 
            }

        })
    }
    
    addTutorials(){
        this.ui.tutorial_section1Paragraph.innerText = tutorial.section_1;
        this.ui.tutorial_section2Paragraph.innerText = tutorial.section_2;
        this.ui.tutorial_section3Paragraph.innerText = tutorial.section_3;
        this.ui.tutorial_section4Paragraph.innerText = tutorial.section_4;
        this.ui.tutorial_section5Paragraph.innerText = tutorial.section_5;
        this.ui.tutorial_section6Paragraph.innerText = tutorial.section_6;
        this.ui.tutorial_section7Paragraph.innerText = tutorial.section_7;
        this.ui.tutorial_section8Paragraph.innerText = tutorial.section_8;
        this.ui.tutorial_section9Paragraph.innerText = tutorial.section_9;
        this.ui.tutorial_section10Paragraph.innerText = tutorial.section_10;
    }
}