import {BoxModel} from "./BoxModel";
import {BoxList} from "./BoxList";
import {ColorHelper} from "../helpers/ColorHelper";
import {ArrayHelper} from "../helpers/ArrayHelper";
import {Dimension} from "./Dimension";
import {Game} from "../pages/game/game";
import {ScoreModel} from "./ScoreModel";
import {HeaderStatus} from "./HeaderStatus";
import {LocalStorage} from "../services/LocalStorage";
import {LSK} from "./LSK";
/**
 * Created by saso on 1/17/17.
 */
export class GameModel {

    private _targetBox: BoxModel;
    private _boxList: BoxList;
    /**
     * Definition of awarded streaks.
     */
    private static STREAK_AWARD = [5, 10, 20, 30, 50, 80, 100, 150, 200, 250, 300, 400, 500, 600, 700, 800, 900, 1000, 1200, 1400, 1600, 1800, 2000];
    /**
     * Game data
     */
    private score: ScoreModel;
    // private timer: CountdownTimer;
    private headerStatus: HeaderStatus;
    private boxClickImplementations: Array<(game: GameModel, boxHit: BoxModel) => void> = [
        (game: GameModel, box: BoxModel) => {
            if (box.isHit) {
                this.handleBoxHit(game, box);
                if (game.allBoxesAreHit()) {
                    if (LocalStorage.get(LSK.SOUND) === "true") {
                        this.gameInstance.nativeAudio.play("hit");

                    }
                    // set another target
                    let untouchedBox: BoxModel = game.boxList.findUntouchedBox();
                    if (untouchedBox) {
                        game.targetBox = untouchedBox;
                        this.gameInstance.exposeBoxes();
                    } else {
                        // everything was hit
                        this.sumScoreUp();
                        setTimeout(() => {
                            this.gameInstance.onLevelFinish();
                        }, 300);
                    }
                }
            } else {
                this.handleBoxMiss(box);
            }
        }
    ];

    constructor(
        private level: number,
        private numberOfBoxes: Dimension,
        private gameInstance: Game
    ) {
        this.initGameProperties();
        // setup game
        this.generateTarget();
        this.generateBoxes();
    }

    private sumScoreUp() {
        // Timer progress is the remaining miliseconds - which is the score to add eventually
        let timeLeft = Math.round(this.gameInstance.timer.progress / 100);
        let multiplier = (Math.log(this.score.maxStreak) + 1);
        let points: number = Math.round((timeLeft + this.level) * multiplier);
        console.debug(this.level + " LVL points: " + points, "Time left: " + timeLeft, "* Combo: " + multiplier + " [" + this.score.maxStreak + "]");
        this.score.add(points);
        this.score.levelReached = this.level;
    }

    get targetBox(): BoxModel {
        return this._targetBox;
    }

    set targetBox(value: BoxModel) {
        this._targetBox = value;
    }

    get boxList(): BoxList {
        return this._boxList;
    }

    set boxList(value: BoxList) {
        this._boxList = value;
    }

    public handleBoxClick(boxHit: BoxModel) {
        this.boxClickImplementations[0](this, boxHit);//this, boxClicked);
    }

    public allBoxesAreHit() : boolean {
        return this.boxList.allHit(this.targetBox);
    }

    private generateTarget() {
        this.targetBox = new BoxModel(ColorHelper.getRandomColor());
    }

    public generateBoxes() {
        let nrTargetColors: number = this.level;
        if (nrTargetColors > 8) {
            nrTargetColors = 8;
        }
        this.boxList = new BoxList();
        // populate target boxes
        for (let i = 0; i < nrTargetColors; i++) {
            this.boxList.push(new BoxModel(this.targetBox.color));
        }
        // add missing boxes
        while (this.boxList.length < this.numberOfBoxes) {
            let randomColor = ColorHelper.getRandomColor();
            if (randomColor !== this.targetBox.color) {
                this.boxList.push(new BoxModel(randomColor));
            }
        }
        ArrayHelper.shuffleArray(this.boxList);
    }

    public static generateDimensionForGame(level: number) {
        if (level === 1 || level === 2) {
            return Dimension.DIM_2X2;
        } else if (level === 3) {
            return Dimension.DIM_3X3;
        } else if (level === 4) {
            return Dimension.DIM_4X4;
        } else if (level === 5) {
            return Dimension.DIM_5X5;
        }
        return Dimension.DIM_6X6;
    }

    public static generateNewGame(level: number, gameInstance: Game) : GameModel {
        return new GameModel(
            level,
            GameModel.generateDimensionForGame(level),
            gameInstance
        );
    }

    private initGameProperties() {
        this.score = this.gameInstance.score;
        // this.timer = this.gameInstance.timer;
        this.headerStatus = this.gameInstance.headerStatus;
    }

    /**
     * Action when the box is hit.
     */
    private handleBoxHit(game: GameModel, box: BoxModel) {
        this.score.streak++;

        this.levelSpecificBoxHit(game, box);
    }

    /**
     * Penalty when the box is missed.
     */
    private handleBoxMiss(box: BoxModel) {
        this.score.streak = 0;
        this.gameInstance.timer.addTime(-1000);
    }

    private levelSpecificBoxHit(game: GameModel, box: BoxModel) {
        this.generalBoxHit(game, box);
        if (game.allBoxesAreHit()) {
            this.gameInstance.timer.addTime(1000);
        }
    }

    private generalBoxHit(game: GameModel, box: BoxModel) {
        // if (GameModel.STREAK_AWARD.indexOf(this.score.streak) !== -1) {
            // this.headerStatus.text = "STREAK: " + this.score.streak;
            // this.headerStatus.animation = HeaderStatusAnimation.FONT_EMBOSED;
        // }
    }

    public static getCountDownTime(level: number) : number {
        if (level < 4) {
            return 3000;
        } else if (level >= 4 && level < 5) {
            return 7000;
        } else if (level >= 5 && level < 8) {
            return 8000;
        }
        let countDownTime: number = 10000;
        countDownTime -= (level * 40);
        return countDownTime;
    }
}
