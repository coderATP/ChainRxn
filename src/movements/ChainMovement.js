import { Movement } from "./Movement.js";
import { CommandHandler } from "../CommandHandler.js";
import { FoundationToPlayerMovement } from "./FoundationToPlayerMovement.js";
import { MarketMovement } from "./MarketMovement.js";
import { WinnerMovement } from "./WinnerMovement.js";


export class PlayerMovement extends Movement{
    constructor(scene){
        super(scene);
        this.id = "playerMovement";
        this.targetX = 0;
        this.targetY = -200;
        this.table = this.scene.elewenjewe.table;
        this.lastIndexToDeal = this.table.participants.length - 2;
        this.scene = scene;
        this.tempParticipants = this.table.participants.slice();
 
    }
    
    execute(){
        this.scene.tweens.add({
            targets: this.table.chain,
            width: 20,
            ease: "Cubic",
            duration: 500,
        }) 
    }
} 