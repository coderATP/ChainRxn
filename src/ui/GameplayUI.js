import { Button } from "../entities/Button.js";
import { Icon } from "../entities/Icon.js";

export class GameplayUI {
    constructor(scene){
        this.scene = scene;
        
        scene.showMultiple([scene.playScreenTopUI, scene.playScreenBottomUI], "flex", 1);
        
        this.topContainer = document.getElementById("playScreenTop").getBoundingClientRect();
        this.timeIconRect = document.getElementById("time").getBoundingClientRect();
        this.instructionsIconRect = document.getElementById("instructions").getBoundingClientRect();
        this.pauseIconRect = document.getElementById("pause").getBoundingClientRect();

        this.bottomContainer = document.getElementById("playScreenBottom").getBoundingClientRect();
        this.buttonsRect = document.getElementById("gameplayButtons").getBoundingClientRect();
        this.swapBtnRect = document.getElementById("swapBtn").getBoundingClientRect();
        this.dealBtnRect = document.getElementById("dealBtn").getBoundingClientRect();
        this.undoBtnRect = document.getElementById("undoBtn").getBoundingClientRect();
        this.redoBtnRect = document.getElementById("redoBtn").getBoundingClientRect();
        this.endBtnRect = document.getElementById("endBtn").getBoundingClientRect();
        
        
        this.setBackgroundColor(this.topContainer, 0x330000, 0x0000ff, 1, 16);
        this.setBackgroundColor(this.bottomContainer, 0x330000, 0x0000ff, 1, 16);
        this.setBackgroundColor(this.buttonsRect, 0x73605b, 0x121212, 0.6, 8);
        
        this.createButtons();
        this.createIcons();
        scene.hideMultiple([scene.playScreenTopUI, scene.playScreenBottomUI]);
 
    }
    setBackgroundColor(rect, fillColor, borderColor, alpha = 1, radius = 8, lineWidth){
        this.graphics = this.scene.add.graphics().setDepth(0);
        this.graphics.clear();
        this.graphics.fillStyle(fillColor, alpha); // color & transparency
        this.graphics.fillRoundedRect(rect.left*devicePixelRatio,
            rect.top*devicePixelRatio,
            rect.width*devicePixelRatio,
            rect.height*devicePixelRatio,
            radius);
           
        if(!lineWidth) return this;
        this.graphics.lineStyle(lineWidth, borderColor, 1); //width, color and transparency
        this.graphics.strokeRoundedRect(rect.left*devicePixelRatio,
            rect.top*devicePixelRatio,
            rect.width*devicePixelRatio,
            rect.height*devicePixelRatio,
            8);
 
        return this; 
    }
    createIcons(){
        this.pauseIcon = new Icon(this.scene, "pause", this.pauseIconRect, "Pause");
        this.timeIcon = new Icon(this.scene, "time", this.timeIconRect, "00:00");
        this.instructionsIcon = new Icon(this.scene, "instructions", this.instructionsIconRect, "About");
        return this;
    }
    createButtons(){
        //FIVE GENERIC BTNS
        this.swapBtn= new Button(this.scene, this.swapBtnRect, "SWAP");
        this.dealBtn= new Button(this.scene, this.dealBtnRect, "DEAL");
        this.undoBtn= new Button(this.scene, this.undoBtnRect, "UNDO");
        this.redoBtn= new Button(this.scene, this.redoBtnRect, "REDO");
        this.endBtn = new Button(this.scene, this.endBtnRect, "END");
        this.gameplayButtons = [this.swapBtn, this.dealBtn, this.undoBtn, this.redoBtn, this.endBtn]; 
        return this;
    }
}