import { Table } from "./Table.js";
import { PlayerPile } from "../piles/PlayerPile.js";

export class TableFor3 extends Table{
    constructor(scene){
        super(scene);
        this.name = "tableFor3";
        this.enemy1Pile = new PlayerPile(this.scene, this.enemyNames[0]);
        this.enemy2Pile = new PlayerPile(this.scene, this.enemyNames[1]);
    }
    create(){
        for(let i = 0; i < 5; ++i){
            this.playerPile.create(
                (this.centerX - this.cardWidth/2)/2 + i*this.cardWidth,
                this.containerRect.bottom - this.cardHeight,
                this.cardWidth,
                this.cardHeight,
                i+1
            );
            this.playerPile.generateName().setNameParams(
                this.playerPile.x + this.playerPile.width/2 - this.playerPile.name.width/2,
                this.playerPile.y + this.playerPile.height,
            );
            this.enemy1Pile.create(
                this.containerRect.x + this.radius,
                this.containerRect.top + i*this.cardHeight/2,
                this.cardWidth,
                this.cardHeight,
                i+1
            );
            this.enemy2Pile.create(
                this.containerRect.right - this.cardWidth - this.radius,
                this.containerRect.top + i*this.cardHeight/2,
                this.cardWidth,
                this.cardHeight,
                i+1
            );
        }
        this.enemy1Pile.generateName().setNameParams(
            this.enemy1Pile.rects[0].x + this.enemy1Pile.rects[0].width/2 - this.enemy1Pile.name.width/2,
            this.enemy1Pile.rects[0].y - this.enemy1Pile.name.height,
        );  
        this.enemy2Pile.generateName().setNameParams(
            this.enemy2Pile.rects[0].x + this.enemy2Pile.rects[0].width/2 - this.enemy2Pile.name.width/2,
            this.enemy2Pile.rects[0].y - this.enemy2Pile.name.height,
        );
        this.participants.unshift(this.enemy1Pile, this.enemy2Pile, this.playerPile);
        this.opponents.push(this.enemy1Pile, this.enemy2Pile);
        //create scoreboard
        this.scoreboard = this.hud.createScoreboard(this.participants);
        super.create();
        this.addCardToPiles(this.participants, this.marketPile);
        return this;
    }

}