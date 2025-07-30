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
       this.rects.push(this.scene.createPileRect(x,y,w,h));
       //drop zone
       this.zones.push(this.scene.createDropZone("playerZone", x,y,w,h));
       //container
       this.containers.push(this.scene.add.container(x,y));
       this.container = this.containers[0]

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