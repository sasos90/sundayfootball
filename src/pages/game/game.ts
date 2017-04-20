import { Component } from '@angular/core';

import {NavController, Platform} from 'ionic-angular';
import {BoxModel} from "../../models/BoxModel";
import {GameModel} from "../../models/GameModel";
import {CountdownTimer} from "../../models/CountdownTimer";
import {ScoreModel} from "../../models/ScoreModel";
import {HeaderStatus} from "../../models/HeaderStatus";
import {NativeAudio} from "@ionic-native/native-audio";
import {LocalStorage} from "../../services/LocalStorage";
import {LSK} from "../../models/LSK";
import {Firebase} from "@ionic-native/firebase";
import {FBKey} from "../../models/FBKey";
import {MyApp} from "../../app/app.component";
import {AdMob, AdMobOptions} from '@ionic-native/admob';
import {Device} from "@ionic-native/device";

@Component({
    selector: 'game',
    templateUrl: 'game.html'
})
export class Game {

    // style elements
    private gameWrapper: HTMLElement;
    private gameElement: any;

    /**
     * Model for requestAnimationFrame - countdown animation.
     */
    public timer = new CountdownTimer(5000);
    /**
     * Actual level.
     */
    public level: number = 1;
    public readySetGo: boolean = false;
    public gameInProgress: boolean = true;
    public showTapInstruction: boolean = true;
    public finalResult: boolean = false;
    public score: ScoreModel = new ScoreModel();
    public adPrepared: boolean = false;

    /**
     * Game data
     */
    public gameModel: GameModel;
    private exposedTimeout: number;
    public exposed: boolean = false;
    public headerStatus: HeaderStatus = new HeaderStatus("HIT");
    private gameCounter: number = 0;

    constructor(
        public navCtrl: NavController,
        public nativeAudio: NativeAudio,
        public firebase: Firebase,
        public platform: Platform,
        public admob: AdMob,
        public device: Device
    ) {
        if (this.platform.is("cordova")) {
            this.firebase.logEvent(FBKey.GAME.SCREEN, {}).then((success) => {
                console.log("FB: " + FBKey.GAME.SCREEN, success);
            });
        }
        this.preloadSounds();
    }

    ngOnInit() {
        this.generateGameModel();
        this.gameWrapper = window.document.getElementById("game-wrapper");
        this.gameElement = window.document.querySelectorAll(".game").item(0);

        // hide the game layout
        this.gameWrapper.classList.add("invisible");
        this.setLayoutPosition();

        // start first level
        this.showReadySetGo();
        this.prepareInterstitialAd();
        window.onresize = (event) => {
            this.setLayoutPosition();
        };
    }

    private setLayoutPosition() {

        let width = this.gameWrapper.offsetWidth;
        let height = this.gameWrapper.offsetHeight;
        if (width >= height) {
            this.gameElement.style.width = height + "px";
        } else {
            this.gameElement.style.width = "100%";
        }

        // show the game layout
        this.gameWrapper.classList.remove("invisible");
    }

    public startGame() {
        this.beforeGame();
        this.startUpdateFrame();
        console.debug("GAME STARTED!");
    }

    private startUpdateFrame() {
        // run animation frame with countdown timers
        this.timer.rafId = window.requestAnimationFrame((now) => this.updateFrame(now));
    }

    private beforeGame() {
        this.hideReadySetGo();
        this.headerStatus.clear();
        this.gameInProgress = true;
        this.showTapInstruction = false;
        // reset countdown timer
        this.timer.resetToStart();
        // expose the boxes
        this.exposeBoxes();
    }

    public exposeBoxes() {
        clearTimeout(this.exposedTimeout);
        this.exposed = true;
        this.exposedTimeout = setTimeout(() => {
            this.exposed = false;
        }, 500);
    }

    public boxWasTapped(box: BoxModel) {
        this.getGame().handleBoxClick(box);
    }

    public getGame() : GameModel {
        return this.gameModel;
    }

    /**
     * Each game frame
     * @param now
     */
    private updateFrame(now: number) {

        if (!this.timer.lastFrame) {
            this.timer.lastFrame = now;
        }
        let progress: number = now - this.timer.lastFrame;

        this.timer.rafId = window.requestAnimationFrame((now) => this.updateFrame(now));
        this.frame(progress);
    }

    /**
     * Logic of the game with animations.
     * After 5 seconds the game is done.
     *
     * @param progress Miliseconds for actual progress
     */
    private frame(progress: number) {
        this.timer.progress = progress;

        if (this.timer.progress <= 0) {
            // game is finished - countdown timer elapsed
            console.debug("GAME FINISHED!");
            // totally hide progress bar because it was still visible sometimes
            this.timer.resetToZero();
            this.timer.cancelAnimation();
            this.gameFinished();
        }
    }

    /**
     * Handle stuff after level is finished. Should not start the game here.
     */
    public onLevelFinish() {
        // go to next level
        this.level++;
        // generate new level game
        this.generateGameModel();
        this.timer = new CountdownTimer(GameModel.getCountDownTime(this.level));
        // expose the boxes
        this.exposeBoxes();
        // Stop the countdown timer
        // this.timer.cancelAnimation();
    }

    /**
     * Prepare everything to run next level and start counting down (ready set go)
     */
    private replayTheGame() {
        // 1. show instructions
        this.headerStatus.text = "HIT";
        // new level (increase)
        this.level = 1;
        this.generateGameModel();
        // Handle view
        // Hide final result wrapper
        this.hideFinalResult();
        this.score.reset();
        // Set game in progress flag to hide progress bar and boxes
        this.gameInProgress = true;
        this.showTapInstruction = true;
        // Start counting down READY SET GO for next level
        this.showReadySetGo();
        this.prepareInterstitialAd();
    }

    private gameFinished() {
        this.gameCounter++;
        // Method for showing the final score result of the game
        this.showFinalResult();
        this.showInterstitialAd();
    }

    private generateGameModel() {
        this.gameModel = GameModel.generateNewGame(this.level, this);
    }

    private showFinalResult() {
        this.finalResult = true;
    }

    private showInterstitialAd() {
        if (this.adPrepared && this.isEveryFifth()) {
            // admob AD
            console.debug("Show INTERSTITIAL AD");
            this.admob.showInterstitial();
            this.adPrepared = false;
        }
    }

    private hideFinalResult() {
        this.finalResult = false;
    }

    private showReadySetGo() {
        this.readySetGo = true;
    }

    private prepareInterstitialAd() {
        if (this.platform.is("cordova") && !this.adPrepared) {
            // Full screen AD
            this.admob.prepareInterstitial(<AdMobOptions> {
                adId: "ca-app-pub-8663484789528557/3381319629",
                position: this.admob.AD_POSITION.CENTER,
                isTesting: MyApp.isTestingBanner(this.device),
                autoShow: false
            }).then((par) => {
                console.log("ADMOB interstitial prepared", par);
                this.adPrepared = true;
            });
        }
    }

    private hideReadySetGo() {
        this.readySetGo = false;
    }

    public getLevelClassSuffix() : number|string {
        if (this.level < 6) {
            return this.level;
        }
        return "max";
    }

    private preloadSounds() {
        if (LocalStorage.get(LSK.SOUND) === "true") {
            // preload sounds
            this.nativeAudio.preloadSimple("hit", "assets/sounds/hit.mp3");
            this.nativeAudio.preloadSimple("miss", "assets/sounds/miss.mp3");
        } else {
            // unload audio from memory
            this.nativeAudio.unload("hit");
            this.nativeAudio.unload("miss");
        }
    }

    /**
     * Show AD on every fifth finish of the game, starting after 2nd replay.
     * @return {boolean}
     */
    private isEveryFifth() {
        return this.gameCounter % 5 === 2;
    }
}
