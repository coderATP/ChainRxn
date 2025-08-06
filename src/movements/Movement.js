export class Movement{
    constructor(scene){
        this.scene = scene;
        this.config = scene.config;
        this.graphics = scene.graphics;
        const { PreloadScene } = scene.game.scene.keys;
        this.preloadScene = PreloadScene;
    }
    
    execute(){}
    undo(){}
    redo(){}
}