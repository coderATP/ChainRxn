import { Table } from "./Table.js";
import { PlayerPile } from "../piles/PlayerPile.js";

export class TableFor2 extends Table{
    constructor(scene){
        super(scene);
        this.name = "tableFor2";
        this.enemy1Pile = new PlayerPile(this.scene, this.enemyNames[0]);
    }
    create(){
        for(let i = 0; i < 5; ++i){
            this.playerPile.create(
                30+(this.containerRect.left + this.radius) + i * this.cardWidth,
                this.containerRect.bottom - this.cardHeight,
                this.cardWidth,
                this.cardHeight,
                i+1
            );
            this.playerPile
            .generateName()
            .setNameParams(
                this.playerPile.x + this.playerPile.width/2 - this.playerPile.name.width/2,
                this.playerPile.y + this.playerPile.height,
            );
            this.enemy1Pile.create(
                (this.containerRect.right - this.cardWidth - this.radius) - this.cardWidth*(4-i),
                this.containerRect.top,
                this.cardWidth,
                this.cardHeight,
                i+1
            );
        }
        
        this.enemy1Pile.generateName().setNameParams(
            this.enemy1Pile.rects[0].x + this.enemy1Pile.rects[0].width*5/2 - this.enemy1Pile.name.width/2,
            this.enemy1Pile.rects[0].y - this.enemy1Pile.name.height,
        );
        this.participants.unshift(this.enemy1Pile, this.playerPile);
        //create scoreboard
        this.scoreboard = this.hud.createScoreboard(this.participants);
        super.create();
        this.addCardToPiles(this.participants, this.marketPile);
        return this;
    }

}