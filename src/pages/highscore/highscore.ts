import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {Backend} from "../../services/Backend";
import {Device} from "@ionic-native/device";
import {LSK} from "../../models/LSK";
import {LocalStorage} from "../../services/LocalStorage";

@Component({
    selector: 'highscore',
    templateUrl: 'highscore.html'
})
export class HighScore {

    // TODO: WHen error: choose another RED color because it is not readable.

    // TODO needs interface
    public allTimeHighscores: Array<any> = [];
    public notTop10Rank: any;
    public rankingError: boolean = false;
    public name: string = LocalStorage.get(LSK.NAME) || "Sunday Team";

    constructor(
        public navCtrl: NavController,
        public device: Device,
        public backend: Backend
    ) {}

    ngOnInit() {
        this.backend.getHighscores((highscores) => {
            this.allTimeHighscores = highscores.allTime;
            this.notTop10Rank = highscores.userRank;
        }, () => {
            this.rankingError = true;
        });
    }

    public back() {
        this.navCtrl.pop();
    }
}
