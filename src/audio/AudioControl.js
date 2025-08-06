export class AudioControl{
    constructor(scene){
        this.menuSong = scene.sound.add('menuSong');
        this.playSong = scene.sound.add('playSong');
        this.playerWinSound = scene.sound.add('playerWinSound');
        this.opponentWinSound = scene.sound.add('opponentWinSound');
        this.gameCompleteSound = scene.sound.add('gameCompleteSound');
        this.errorSound = scene.sound.add('errorSound');

        this.menuSong.loop = true;
        
        this.buttonClickSound = scene.sound.add('buttonClickSound');
        this.drawSound = scene.sound.add('drawSound');
        this.clockTickSound = scene.sound.add('clockTickSound');
        this.popUpSound = scene.sound.add('popUpSound');
        this.songs = [ /*this.menuSong, this.playSong */];
        this.sounds = [this.drawSound, this.popUpSound, this.gameCompleteSound, this.playerWinSound, this.opponentWinSound, this.buttonClickSound, this.clockTickSound, this.errorSound];
        //REDUCE VOLUME AT STARTUP, UNLESS OTHERWISE SPECIFIED BY USER
        this.opponentWinSound.volume = 0.5;
        //this.playSong.volume = 1;
        this.clockTickSound.volume = 0.2;
        this.buttonClickSound.volume = 0.2;
    }
    
    play(audio){
        audio.currentTime = 0;
        audio.play();
    }
    
    stop(audio){
        audio.currentTime = 0;
        audio.pause();
    }
    stopAllSongs(){
        this.songs.forEach(song=>{
            //song.currentTime = 0;
            //song.pause();
        })
    }
    
}