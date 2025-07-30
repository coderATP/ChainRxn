
export class UIEventsHandler{
    constructor(scene){
        this.scene = scene;
        //play scene icons 
        this.undoIcon = document.getElementById("undo");
        this.redoIcon = document.getElementById("redo");
        this.instructionsIcon = document.getElementById("instructions");
        this.settingsIcon = document.getElementById("settings");
        this.leaderboardIcon = document.getElementById("leaderboard");
        this.scoreIcon = document.getElementById("score");
        this.pauseIcon = document.getElementById("pause");
        this.hintIcon = document.getElementById("hint");
        this.movesIcon = document.getElementById("moves");
        this.timeIcon = document.getElementById("time");
        this.marketSection = document.getElementById("marketSection");
        this.playSceneIcons = [this.instructionsIcon, this.pauseIcon];
        //options
        this.options_menuBtn = document.getElementById("options_menuBtn");
        this.sfx_controller = document.getElementById("options_sfx");
        this.music_controller = document.getElementById("options_music");
        this.volume_controllers = [this.sfx_controller, this.music_controller]; 
        //credits buttons 
        this.credits_menuBtn = document.getElementById("credits_menuBtn");
        //pause buttons
        this.pause_resumeBtn = document.getElementById("pause_resumeBtn");
        this.pause_optionsBtn = document.getElementById("pause_optionsBtn");
        this.pause_tutorialBtn = document.getElementById("pause_tutorialBtn");
        this.pause_saveBtn = document.getElementById("pause_saveBtn");
        this.pause_menuBtn = document.getElementById("pause_menuBtn");
        this.pauseBtns = [this.pause_resumeBtn, this.pause_optionsBtn, this.pause_tutorialBtn, this.pause_saveBtn, this.pause_menuBtn];
        //play
        this.undoText = document.getElementById("undoText");
        this.redoText = document.getElementById("redoText");
        this.instructionsText = document.getElementById("instructionsText");
        this.settingsText = document.getElementById("settingsText");
        this.leaderboardText = document.getElementById("leaderboardText");
        this.scoreText = document.getElementById("scoreText");
        this.pauseText = document.getElementById("pauseText");
        this.hintText = document.getElementById("hintText");
        this.movesText = document.getElementById("movesText");
        this.timeText = document.getElementById("timeText");
        this.cameraIcon = document.getElementById("canvasRef");
        //win
        this.levelCompleteTotalScoreText = document.getElementById("winner");
        this.levelCompleteTotalMovesText = document.getElementById("total_rounds");
        this.levelCompleteTimeBonusText = document.getElementById("most_winner");
        this.levelCompleteTotalScoreText = document.getElementById("jackpot_win");
        this.levelCompleteTotalMovesText = document.getElementById("smallest_win");
        this.levelCompleteTimeBonusText = document.getElementById("motm");
        
        this.levelComplete_replayBtn = document.getElementById("levelComplete_replayBtn");
        this.levelComplete_menuBtn = document.getElementById("levelComplete_menuBtn");
        this.levelComplete_newGameBtn = document.getElementById("levelComplete_newGameBtn");
        //menu
        this.menu_playBtn = document.getElementById("menu_playBtn");
        this.menu_optionsBtn = document.getElementById("menu_optionsBtn");
        this.menu_leaderboardBtn = document.getElementById("menu_leaderboardBtn");
        this.menu_creditsBtn = document.getElementById("menu_creditsBtn");
        this.menu_exitBtn = document.getElementById("menu_exitBtn");
        this.menu_continueBtn = document.getElementById("menu_continueBtn"); 
        this.menuBtns = [this.menu_playBtn, this.menu_continueBtn, this.menu_optionsBtn, this.menu_leaderboardBtn, this.menu_creditsBtn, this.menu_exitBtn];
         
        //TableSelection
        this.tableSelection_submitBtn = document.getElementById("tableSelection_submitBtn");
        this.tableSelection_backBtn = document.getElementById("tableSelection_backBtn");
        this.tableSelectionBtns = [this.tableSelection_backBtn, this.tableSelection_submitBtn];
        //this.addClickSound();
        //confirm
        this.confirmText = document.getElementById("confirmText");
        //tutorial
        this.tutorial_backBtn = document.getElementById("tutorial_backBtn");
        this.tutorial_section1Paragraph = document.getElementById("message_1");
        this.tutorial_section2Paragraph = document.getElementById("message_2");
        this.tutorial_section3Paragraph = document.getElementById("message_3");
        this.tutorial_section4Paragraph = document.getElementById("message_4");
        this.tutorial_section5Paragraph = document.getElementById("message_5");
        this.tutorial_section6Paragraph = document.getElementById("message_6");
        this.tutorial_section7Paragraph = document.getElementById("message_7");
        this.tutorial_section8Paragraph = document.getElementById("message_8");
        this.tutorial_section9Paragraph = document.getElementById("message_9");
        this.tutorial_section10Paragraph = document.getElementById("message_10");

    }
    
    changeID(element, newID){
        element.id = newID;
    }
    
}