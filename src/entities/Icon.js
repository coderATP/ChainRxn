export class Icon{
    constructor(scene, texture, DOMRect, text){
        this.scene = scene;
        this.rect = DOMRect;
        this.graphics = scene.add.graphics().setDepth(0);
        //background
        this.setBackgroundColor(DOMRect, 0xd09683, 0x000000, 1, 4);
       //image
        this.icon = scene.add.image(DOMRect.x*devicePixelRatio, DOMRect.y*devicePixelRatio, texture)
            .setOrigin(0).setDepth(0).setScale(1.5);
        //center image horizontally
        const paddingX = (DOMRect.width*devicePixelRatio - this.icon.width)/2;
        const paddingY = (DOMRect.height*devicePixelRatio - this.icon.height)/2;
        this.icon.setPosition(
            DOMRect.x*devicePixelRatio + paddingX,
            DOMRect.y*devicePixelRatio
        ); 
      //label (text)
        this.label = scene.add.text(0,0,text,
            {fontSize: "22px", fontFamily: "myOtherFont", color: "white"}
        ).setOrigin(0).setDepth(3); 
        //center text
        this.label.setPosition(
            DOMRect.x*devicePixelRatio + paddingX,
            DOMRect.bottom*devicePixelRatio - this.label.height
        );
        
        //interactive
        this.hitArea = scene.add.rectangle(DOMRect.x*devicePixelRatio, DOMRect.y*devicePixelRatio, DOMRect.width*devicePixelRatio, DOMRect.height*devicePixelRatio)
            .setDepth(0).setOrigin(0).setInteractive()
            .on("pointerdown", this.enterActiveState, this)
            .on("pointerover", this.enterHoverState, this)
            .on("pointerout", this.enterRestState, this) 
        scene.add.existing(this);
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
    
    changeBG(fillColor, strokeColor){
        this.graphics.clear(); 
        this.graphics.fillStyle(fillColor, 1); // Darker blue on hover
        this.graphics.fillRoundedRect(this.rect.left*devicePixelRatio,
            this.rect.top*devicePixelRatio,
            this.rect.width*devicePixelRatio,
            this.rect.height*devicePixelRatio,
            8);
        if(!strokeColor) return;
        this.graphics.lineStyle(2, strokeColor, 1);
        this.graphics.strokeRoundedRect(this.rect.left*devicePixelRatio,
            this.rect.top*devicePixelRatio,
            this.rect.width*devicePixelRatio,
            this.rect.height*devicePixelRatio,
            8); 
    }
    enterHoverState() {
        const fillColor = 0xff0000;
        const strokeColor = 0x004085;
        this.changeBG(fillColor, strokeColor);
    }

    enterRestState() {
        const fillColor = 0xd09683;
        const strokeColor = 0x0056b3;
        this.changeBG(fillColor);
    }

    enterActiveState() {
        const fillColor = 0xff0000;
        const strokeColor = 0x002752;
        this.changeBG(fillColor, strokeColor); 
    } 
}