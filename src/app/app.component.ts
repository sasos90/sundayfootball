import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';

import {MainMenu} from "../pages/mainmenu/mainmenu";
import {StatusBar} from "@ionic-native/status-bar";
import {SplashScreen} from "@ionic-native/splash-screen";
import {Firebase} from "@ionic-native/firebase";
import {LocalStorage} from "../services/LocalStorage";
import {LSK} from "../models/LSK";
import { AdMob, AdMobOptions, AdSize, AdExtras } from '@ionic-native/admob';
import {Config} from "../services/Config";
import {Environment} from "../models/Environment";
import {Device} from "@ionic-native/device";
import {FBKey} from "../models/FBKey";

@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    @ViewChild(Nav) nav: Nav;

    rootPage: any = MainMenu;

    constructor(
        public platform: Platform,
        public statusBar: StatusBar,
        public splashScreen: SplashScreen,
        public firebase: Firebase,
        public admob: AdMob,
        public device: Device
    ) {
        this.initializeApp();
    }

    initializeApp() {
        this.platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            this.initLocalStorageValues();

            if (this.platform.is("cordova")) {
                // FIREBASE - TOKEN
                this.firebase.onTokenRefresh().subscribe((token: string) => {
                    console.log("Firebase token: " + token);
                    LocalStorage.set(LSK.FIREBASE_TOKEN, token);
                });

                // FIREBASE - SUBSCRIBE TO SUBSCRIBE_TOPIC
                this.firebase.subscribe(FBKey.SUBSCRIBE_TOPIC.SUNDAY_FOOTBALL).then(() => {
                    console.debug("Subscribed for push notifications. Topic: ", FBKey.SUBSCRIBE_TOPIC.SUNDAY_FOOTBALL);
                });

                // FIREBASE - permissions for push notifications - iOS
                if (this.platform.is("ios") && !this.firebase.hasPermission()) {
                    this.firebase.grantPermission();
                }

                // device uuid
                console.log("Device uuid:", this.device.uuid);
                // admob AD
                this.admob.createBanner(<AdMobOptions> {
                    adId: "ca-app-pub-8663484789528557/3805501628",
                    position: this.admob.AD_POSITION.BOTTOM_CENTER,
                    isTesting: MyApp.isTestingBanner(this.device)
                }).then((par) => {
                    console.log("ADMOB", par);
                });
            }

            this.statusBar.styleDefault();
            this.splashScreen.hide();
        });
    }

    public static isTestingBanner(device: Device) : boolean {
        // list the device.uuid which will have the test banner
        let arrayOfDevices: Array<string> = [
            "7b9ba921977ca9d0", // Saso
            "37e758f5d5c8f245"  // Masa
        ];
        let isTestingBanner = Config.ENV === Environment.DEVELOP || arrayOfDevices.indexOf(device.uuid) !== -1;
        console.log("Is testing banner?", isTestingBanner);
        return isTestingBanner;
    }

    private initLocalStorageValues() {
        // push notifications
        let pushNotifications = LocalStorage.get(LSK.PUSH_NOTIFICATIONS);
        if (!pushNotifications) {
            LocalStorage.set(LSK.PUSH_NOTIFICATIONS, true);
        }
        // sound
        let sound = LocalStorage.get(LSK.SOUND);
        if (!pushNotifications) {
            LocalStorage.set(LSK.SOUND, true);
        }
    }
}
