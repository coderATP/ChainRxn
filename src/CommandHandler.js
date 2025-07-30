export class CommandHandler{
    constructor(scene){
        this.scene = scene;
        //tracking undo and redo actions 
        this.moves = [];
        this.totalMoves = 0;
        this.movesToRedo = 0;
        this.movesToUndo = 0;
        this.playing = false;
    }
    
    execute(command){
        this.playing = true;
        command.execute();
        this.moves.push(command);
        this.movesToUndo++;
        this.movesToRedo = 0;
    }
    
    undo(){
        if(this.movesToUndo === 0) return;
        const command = this.moves.pop();

        if(!command) return;
        
        if(command.id === "playerMovement"){
            new PlayerMovement(this.scene, null, null).undo(command);
            this.movesToUndo--;
        }

        else if(command.id === "opponentMovement"){
           // new OpponentMovement(this.scene, null, null).undo();
            this.movesToUndo--;
        } 
    
    }
}