export class PlayerPile{
    constructor(scene, id){
        this.scene = scene;
        this.id = id;
        this.rects = [];
        this.zones = [];
        this.container = undefined;
        this.containerIndex = undefined;
        this.containers = [];
        this.names = [];
    }
    create(x,y,w,h, containerIndex = 0){
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        this.containerIndex = containerIndex;
       //pile rectangles
       this.rect = this.scene.createPileRect(x,y,w,h)
       this.rects.push(this.rect);
       //container
       this.zone = this.scene.createDropZone(this.id + "Zone", x,y,w,h)
       this.zone.setData({index: containerIndex-1});
       this.zones.push(this.zone)
       this.container = this.scene.add.container(x, y).setSize(w,h)//.setInteractive();
       this.container.setData({index: containerIndex-1, ownerID: this.id});
 
       this.containers.push(this.container);

       return this; 
    }
    generateName(){
       //name
       let tag;
       if(this.id === "P") tag = this.id+this.containerIndex;
       else tag = this.id;
       this.name = this.scene.add.text(0,0, tag, { fontSize: "32px", fontFamily: "myOtherFont", color: "gold"}).setOrigin(0)
       return this;
    }
    setNameParams(x, y){
       this.name.setPosition(x/* + w/2 - name.width/2*/, y/*+h*/);
       this.names.push(name);
       return this;
    }
}