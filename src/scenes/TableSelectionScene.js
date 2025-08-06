import { BaseScene } from "./BaseScene.js";
import { eventEmitter } from "../events/EventEmitter.js";

export class TableSelectionScene extends BaseScene{
    constructor(config){
        super("TableSelectionScene", config);
        this.config = config;
    }
    
    showInterface(){
        this.scene.stop("PlayScene");
        eventEmitter.destroy("MenuToTableSelection"); 
        this.hideAllScreens();
        this.showOne(this.tableSelectionScreen, "grid", 0);
    }
    /*restricted*/
    getCheckedRadioElementFromGrandParentDiv(div){
        const grandparentDiv = document.getElementById(div);
        let checkedRadioElement = undefined;
        Object.values(grandparentDiv.children).forEach(parentDiv=>{
            Object.values(parentDiv.children).forEach(radioInput=>{
                if(radioInput.checked) checkedRadioElement = radioInput; 
            })
        })
        return checkedRadioElement;
    }
    
    create(){
        const { MenuScene } = this.game.scene.keys;
        MenuScene.clicked = true;
        this.showInterface();
        this.ui.tableSelection_submitBtn.addEventListener("click", ()=>{
            eventEmitter.emit("TableSelectionToPlay");
        }, {once: true}) 
        this.ui.tableSelection_backBtn.addEventListener("click", ()=>{
            eventEmitter.emit("TableSelectionToMenu");
        }, {once: true});
        eventEmitter.once("TableSelectionToPlay", ()=>{
            const numberOfOpponents = this.getCheckedRadioElementFromGrandParentDiv("participants").value;
            const difficulty = this.getCheckedRadioElementFromGrandParentDiv("difficulties").value;
            const gameMode = this.getCheckedRadioElementFromGrandParentDiv("gameModes").value;
            
            this.registry.set("numberOfOpponents", parseInt(numberOfOpponents));
            this.registry.set("difficulty", difficulty);
            this.registry.set("gameMode", gameMode);
            this.scene.start("PlayScene");
        })
        eventEmitter.once("TableSelectionToMenu", ()=>{
            this.scene.start("MenuScene");
        }) 
    }
}