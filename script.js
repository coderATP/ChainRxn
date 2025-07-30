import { ManufacturerScene } from "./src/scenes/ManufacturerScene.js";
import { PreloadScene } from "./src/scenes/PreloadScene.js";
import { MenuScene } from "./src/scenes/MenuScene.js";
import { TableSelectionScene } from "./src/scenes/TableSelectionScene.js";
import { PlayScene } from "./src/scenes/PlayScene.js";
import { PauseScene } from "./src/scenes/PauseScene.js";
import { ConfirmScene } from "./src/scenes/ConfirmScene.js";
import { GameCompleteScene } from "./src/scenes/GameCompleteScene.js";
import { OptionsScene } from "./src/scenes/OptionsScene.js";
import { CreditsScene } from "./src/scenes/CreditsScene.js";
import { TutorialScene} from "./src/scenes/TutorialScene.js";


const GAME_WIDTH = innerWidth * window.devicePixelRatio;
const GAME_HEIGHT = innerHeight * window.devicePixelRatio;
const ZOOM_FACTOR = 1;

const SHARED_CONFIG = {
    width: GAME_WIDTH, 
    height: GAME_HEIGHT,
    zoomFactor: ZOOM_FACTOR,
    topLeft: {
        x: ( GAME_WIDTH - (GAME_WIDTH/ZOOM_FACTOR) ) / 2,
        y: ( GAME_HEIGHT - (GAME_HEIGHT/ZOOM_FACTOR) ) / 2,
    },
    topRight: {
        x: ( ( GAME_WIDTH - (GAME_WIDTH/ZOOM_FACTOR) ) / 2 ) + (GAME_WIDTH/ZOOM_FACTOR),
        y: ( GAME_HEIGHT - (GAME_HEIGHT/ZOOM_FACTOR) ) / 2,
    },
    bottomRight: {
        x: ( ( GAME_WIDTH - (GAME_WIDTH/ZOOM_FACTOR) ) / 2 ) + (GAME_WIDTH/ZOOM_FACTOR),
        y: ( (GAME_HEIGHT - (GAME_HEIGHT/ZOOM_FACTOR) ) / 2 ) + (GAME_HEIGHT/ZOOM_FACTOR),
    },
    debug: true
};

const config= {
    type: Phaser.CANVAS,
    ...SHARED_CONFIG, 
    parent: "gameWrapper",
    backgroundColor: 0x005500,
    transparent: true,
    scale: {
         mode: Phaser.Scale.Fit,
         autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    pixelArt: false, 
    physics:{
        default: 'arcade',
        arcade:{
            debug: SHARED_CONFIG.debug,
        },
        matter:{
            debug: SHARED_CONFIG.debug,
        },

    },
    scene: [
        new ManufacturerScene(SHARED_CONFIG),
        new PreloadScene(SHARED_CONFIG),
        new MenuScene(SHARED_CONFIG),
        new TableSelectionScene(SHARED_CONFIG),
        new PlayScene(SHARED_CONFIG),
        new PauseScene(SHARED_CONFIG),
        new ConfirmScene(SHARED_CONFIG),
        new GameCompleteScene(SHARED_CONFIG),
        new OptionsScene(SHARED_CONFIG),
        new CreditsScene(SHARED_CONFIG),
        new TutorialScene(SHARED_CONFIG)
    ],
};

new Phaser.Game(config);