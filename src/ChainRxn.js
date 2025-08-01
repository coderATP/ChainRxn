import { TableFor2 } from "./tables/TableFor2.js";
import { TableFor3 } from "./tables/TableFor3.js";
import { TableFor4 } from "./tables/TableFor4.js";


export class ChainRxn{
    static CARD_BACK_FRAMES = [52, 53, 54, 55, 56];
    static CARD_VALUES = [1,2,3,4,5,6,7,8,9,10,11,12,13];
    static CARD_START_FRAMES = {
        CLUB: 0,
        DIAMOND: 13,
        HEART: 26,
        SPADE: 39
    }
    static CARD_COLOURS = {
        CLUB: "BLACK",
        DIAMOND: "RED",
        HEART: "RED",
        SPADE: "BLACK"
    } 
    static CARD_SUITS = ["CLUB", "DIAMOND", "HEART", "SPADE"];
    constructor(scene){
        this.scene = scene;
        this.config = scene.config;
        this.opponentPiles = [];
        this.deck = [];
        this.table = undefined;
    }
    createDeck(){
        for(let i = 0; i < ChainRxn.CARD_SUITS.length; ++i ){
            
            const startFrame = Object.values(ChainRxn.CARD_START_FRAMES)[i];
            for(let j = 0; j < 13; ++j){
               const card = this.scene.createCard("null", 0, 0)
                   .setOrigin(0)
                   .setFrame(52)
                   .setData({
                       frame: startFrame + j,
                       value: j+1,
                       suit: ChainRxn.CARD_SUITS[i],
                       colour: Object.values(ChainRxn.CARD_COLOURS)[i],
                       index: "unknown"
                   })
               
               this.deck.push(card);
            }
        }
        return this.deck;
    }
    
    getNumberOfOpponents(number){
        return number;
    }
    
    createTable(){
        let table;
        const { TableSelectionScene } = this.scene.game.scene.keys;
        this.numberOfOpponents = TableSelectionScene.registry.get("numberOfOpponents");
        this.difficulty = TableSelectionScene.registry.get("difficulty");
        this.gameMode = TableSelectionScene.registry.get("gameMode");

        switch(this.numberOfOpponents){
            case 2:{
                table = new TableFor2(this.scene).create();
            break;
            }
            case 3:{
                table = new TableFor3(this.scene).create(); 
            break;
            }
            case 4:{
                table = new TableFor4(this.scene).create(); 
            break;
            }
            default: {
                
                break;
            }
        }
        return table;
    }
    shuffleDeck(){
        let tempDeck = [];
        while(this.deck.length){
            const randomPos = Math.floor(Math.random() * this.deck.length);
            const randomCard = (this.deck.splice(randomPos, 1))[0];
            tempDeck.push(randomCard);
        }
        this.deck = tempDeck;
        tempDeck = [];
        return this.deck;
    }
    newGame(){
        if(!this.deck.length) this.deck = this.createDeck();
        this.shuffleDeck();
        this.table = this.createTable();

        this.rows = [];
        this.row = this.table.hud.addRowToScoreboard(this.table.scoreboard);
        this.rows.push(this.row);
        this.data = this.table.hud.addDataToRow(this.row, this.table.participants);
        
        this.scene.commandHandler.playing = false;
        
    }
    
    onRestart(){
        this.deck = [];
        this.table = null;
        this.row = null;
        this.data = null;
    }
}