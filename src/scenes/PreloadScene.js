import { BaseScene } from "./BaseScene.js";
import { AudioControl } from "../audio/AudioControl.js";


export class PreloadScene extends BaseScene{
    constructor(config) {
        super("PreloadScene", config);
        this.config = config;
    }
    
    showInterface(){
        this.hideAllScreens();
        this.showOne(this.preloadScreen, "grid");
    }

    loadFiles(){
        let audioFileIndex = 0;
        this.text = "sounds";
        const audioFiles = [
            ['menuSong', "sounds/menu.mp3"],
            ['errorSound', "sounds/error_sound.wav"],
            ['clockTickSound', "sounds/clock.ogg"], 
            ['playSong', "sounds/new_game.ogg"],
            ['drawSound', "sounds/draw.wav"],
            ['playerWinSound', "sounds/player_win.ogg"],
            ['opponentWinSound', "sounds/opponent_win.wav"],
            ['gameCompleteSound', "sounds/game_complete.wav"],
            ['buttonClickSound', "sounds/button_sound.wav"],
            ['popUpSound', "sounds/pop_up.ogg"],
        ]
        this.load.audio(...audioFiles[audioFileIndex]);
        this.load.on("filecomplete", ()=>{
                audioFileIndex++;
                if(audioFileIndex < audioFiles.length){
                    this.load.audio(...audioFiles[audioFileIndex]);
                }
                else{
                    this.text = "images";
                    this.load.image("title", "../images/title.png");
                    this.load.image("chip", "../images/chip.png");
                    this.load.image("time", "../images/time.png");
                    this.load.image("pause", "../images/pause.png");
                    this.load.image("instructions", "../images/instructions.png");

                    this.load.image("gold_chain", "../images/gold_chain.png");
                    this.load.spritesheet("cards", "../images/cards.png",
                        {frameWidth: 88, frameHeight: 128});
                }
            })

    }
    
    preload(){
       // this.showInterface();
        this.registry.set('assetsTotal', 0);
        // track and display assets loading progress
        //added 1 new file
        this.load.on("addfile", ()=>{
            this.registry.inc("assetsTotal", 1);
        });

        this.loadingText = this.add.text(0,0, "", { font: "32px myFont"})
                .setOrigin(0)
                .setStyle({fill: 'white'})
        this.loadingText.setPosition(this.config.width/2 - this.loadingText.width/2, this.config.height/2 - this.loadingText.height/2);
        this.loadingText2 = this.add.text(0,0, "Please wait", { font: "32px myFont"})
                .setOrigin(0)
                .setStyle({fill: 'white'})
         
        //while files are still being added...
        this.load.on("progress", (progress)=>{
            this.loadingText.setText( "loading "+this.text + "..." );
            this.loadingText.setPosition(this.config.width/2 - this.loadingText.width/2, this.config.height/2 - this.loadingText.height/2);
            this.loadingText2.setPosition(this.config.width/2 - this.loadingText2.width/2,  this.loadingText.y + this.loadingText.height+5);
        });
        
        //when file adding is done...
        this.load.on("complete", ()=>{
            //load animations (this has to wait till now since it requires textures to first load)
            //load animations here
            this.loadingText.setText("tap anywhere to continue");
            this.loadingText.setPosition(this.config.width/2 - this.loadingText.width/2, this.config.height/2 - this.loadingText.height/2);

            this.loadingText2.destroy();
            this.input.once("pointerdown", ()=>{
                //request fullscreen
                this.toggleFullscreen();
                setTimeout(()=>{this.scene.start("MenuScene")},500)
                
            });
        })
        this.loadFiles(); 
    }
    
    toggleFullscreen(){
        if(!document.fullscreenElement){
            //full screen
            document.documentElement.requestFullscreen();
            //portrait mode only
            if (screen.orientation && screen.orientation.lock) {
                    screen.orientation.lock('portrait').catch((error) => {
                        console.warn('Failed to lock screen orientation:', error);
                    });
                   // this.onResize();
                }
        }else if(document.exitFullscreen){
            document.exitFullscreen();
        }
    } 
    onResize(){
        window.addEventListener("resize", ()=>{
            this.config.width = screen.availWidth * devicePixelRatio;
            this.config.height = screen.availHeight * devicePixelRatio; 
        })
    }
    create(){
        this.audio = new AudioControl(this);
    }
    
}