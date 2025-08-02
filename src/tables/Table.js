import { PlayerPile } from "../piles/PlayerPile.js";
import { FoundationPile } from "../piles/FoundationPile.js";
import { MarketPile } from "../piles/MarketPile.js";
import { WinnerIndicator } from "../entities/WinnerIndicator.js";
import { Chain } from "../entities/Chain.js";
import { HUD } from "../hud/Hud.js";


export class Table{
    constructor(scene){
        this.scene = scene;
        this.config = scene.config;
        this.graphics = scene.graphics;
        this.participants = [];
        this.opponents = [];
        //enemy random names
        this.enemyNames = ["Jerry", "Phil", "Dean", "Bush", "Meg", "Ann", "Tina"]
        this.enemyNames = scene.shuffle(this.enemyNames);
        
        this.cardWidth = this.scene.chainRxn.deck[0].displayWidth;
        this.cardHeight = this.scene.chainRxn.deck[0].displayHeight;
        
        this.marginX = this.config.width*0.025;
        this.width = this.height = this.config.width - this.marginX*2;
        this.marginY = this.config.height/2 - this.height/2;
        this.radius = 20;
        
        this.containerRect = new Phaser.Geom.Rectangle(
            this.marginX,
            this.marginY,
            this.width,
            this.height
        );
        //table centre
        this.centerX = (this.containerRect.left + this.containerRect.right)/2;
        this.centreY = (this.containerRect.top + this.containerRect.bottom)/2; 
        
        this.graphics.fillStyle(0x007700, 2)
        this.graphics.fillRoundedRect(
            this.containerRect.x,
            this.containerRect.y,
            this.containerRect.width,
            this.containerRect.height,
            this.radius
        );
        //TABLE ENTITIES
        //piles
        this.playerPile = new PlayerPile(this.scene, "P");
        this.foundationPile = new FoundationPile(scene, "foundation");
        this.marketPile = new MarketPile(scene, "Market");
        //chain
        this.chain = new Chain(scene,0,0);
        //HUD
        this.hud = new HUD(scene);
       //most recent winner indicator
       this.recentWinnerIndicator = new WinnerIndicator(this.scene, 0, 0);
    }
    
    create(){
        //create market pile
        const marketSection = this.scene.ui.marketSection.getBoundingClientRect();
        const marketMiddle = (marketSection.x + marketSection.width/2) * window.devicePixelRatio;
        this.marketPile.create(
            marketMiddle - this.cardWidth/2,
            marketSection.height*window.devicePixelRatio - this.cardHeight, 
            this.cardWidth,
            this.cardHeight
        );
        //create foundation pile 
        this.foundationPile.create(
            this.centerX - this.cardWidth/2,
            this.centreY - this.cardHeight/2,
            this.cardWidth,
            this.cardHeight
        );
        //chain 
        this.chain.setPosition(this.foundationPile.x + this.foundationPile.width/2, this.foundationPile.y + this.foundationPile.height/2)
       // this.chain.rotate({x: this.config.width, y: this.config.height})
        
    }
    
    addCardToPiles(participantsArray, market){
        const tempDeck = this.scene.chainRxn.deck;
        //market.container.add(tempDeck.splice(0, 4)); 
 
        for(let i = participantsArray.length; i > 0; --i){
            const pile = tempDeck.splice(0, 5);
            participantsArray[i-1].containers.forEach((container, j)=>{
                container.add(pile.splice(0, 1));
                container.list.forEach((card)=>{
                    card.setData("index", j);
                })
            });
            //set card info
            this.setParticipantsCardsData(pile);
            
            //set card name
            pile.forEach((card, j)=>{
                card.setName(participantsArray[i-1].id+"Card")
            })
        }
        //add remaining cards to market pile and set data accordingly
        market.container.add(tempDeck.splice(0, tempDeck.length )); 
        this.setMarketCardsData(market.container.list);
        return this;
    }
    
    setParticipantsCardsData(pile){
        pile.forEach((card, i)=>{
            card.setPosition(-i*0.5-this.cardWidth/2, -i*0.5-this.cardHeight/2)
            .setFrame(card.getData("frame"))
            .setInteractive({draggable: false})
            
            card.setData({
                frame: card.getData("frame"),
                colour: card.getData("colour"),
                value: card.getData("value"),
                suit: card.getData("suit"),
                x: card.x,
                y: card.y,
                cardIndex: i
            });
        });
        this.playerPile.containers.forEach(container=>{
            container.list.forEach(card=>{
                card.setFrame(card.getData("frame"));
            }) 
        })
        return this;
    }
    
    setMarketCardsData(pile){
        pile.forEach((card, i)=>{
            card.setPosition(0, -i*0.5)
            .setName("marketCard")
            .setFrame(card.getData("frame"))
            .setInteractive({draggable: false})
            
            card.setData({
                frame: card.getData("frame"),
                colour: card.getData("colour"),
                value: card.getData("value"),
                suit: card.getData("suit"),
                x: card.x,
                y: card.y,
                cardIndex: i
            });
        });

        return this;
    } 
}