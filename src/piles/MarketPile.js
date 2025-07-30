export class MarketPile{
    constructor(scene, id){
        this.scene = scene;
        this.config = scene.config;
        this.id = id;
        this.container = undefined;
    }
    create(x,y,w,h){
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        
       //pile rectangle 
       this.rect = this.scene.createPileRect(x,y,w,h);
       //drop zone
       this.zone = this.scene.createDropZone("foundationZone", x,y,w,h);
       //name
       this.name = this.scene.add.text(0,0, this.id, { fontSize: "32px", fontFamily: "myOtherFont", color: "yellow"}).setOrigin(0).setScale(1)
       this.name.setPosition(x + w/2 -this.name.width/2, y+h-2);
       //container
       this.container = this.scene.add.container(x,y);
       return this; 
    }
}