import { Component } from '@angular/core';
import {NavController, Platform, ToastController} from 'ionic-angular';
import {LSK} from "../../models/LSK";
import {LocalStorage} from "../../services/LocalStorage";
import {Firebase} from "@ionic-native/firebase";
import {FBKey} from "../../models/FBKey";

@Component({
    selector: 'moregames',
    templateUrl: 'moregames.html'
})
export class MoreGames {

    constructor(
        public navCtrl: NavController,
        public firebase: Firebase,
        public platform: Platform
    ) {
        if (this.platform.is("cordova")) {
            this.firebase.logEvent(FBKey.MORE_GAMES.SCREEN, {}).then((success) => {
                console.log("FB: " + FBKey.MORE_GAMES.SCREEN, success);
            });
        }
    }

    public back() {
        this.navCtrl.pop();
    }
}
