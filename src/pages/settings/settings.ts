import { Component } from '@angular/core';
import {NavController, Platform, ToastController} from 'ionic-angular';
import {LSK} from "../../models/LSK";
import {LocalStorage} from "../../services/LocalStorage";
import {Firebase} from "@ionic-native/firebase";
import {FBKey} from "../../models/FBKey";

@Component({
    selector: 'settings',
    templateUrl: 'settings.html'
})
export class Settings {

    public pushNotifications: boolean = true;
    public sound: boolean = true;

    constructor(
        public navCtrl: NavController,
        public firebase: Firebase,
        public toast: ToastController,
        public platform: Platform
    ) {
        if (this.platform.is("cordova")) {
            this.firebase.logEvent(FBKey.SETTINGS.SCREEN, {}).then((success) => {
                console.log("FB: " + FBKey.SETTINGS.SCREEN, success);
            });
        }
    }

    ngOnInit() {
        this.pushNotifications = LocalStorage.get(LSK.PUSH_NOTIFICATIONS) === "true";
        this.sound = LocalStorage.get(LSK.SOUND) === "true";
    }

    public back() {
        if (this.platform.is("cordova")) {
            this.firebase.logEvent(FBKey.SETTINGS.DISCARD, {
                pushNotifications: this.pushNotifications,
                sound: this.sound
            }).then((success) => {
                console.log("FB: " + FBKey.SETTINGS.DISCARD, success);
            });
        }
        this.navCtrl.pop();
    }

    public save() {
	    if (this.platform.is("cordova")) {
            // firebase
            this.firebase.logEvent(FBKey.SETTINGS.SAVE, {
                pushNotifications: this.pushNotifications,
                sound: this.sound
            }).then((success) => {
                console.log("FB: " + FBKey.SETTINGS.SAVE, success);
            });

            if (this.pushNotifications === true) {
                // Subscribe for push notifications
                this.firebase.subscribe(FBKey.SUBSCRIBE_TOPIC.TAPPY_TAP).then((success) => {
                    console.debug("Subscribed for push notifications. Topic: ", FBKey.SUBSCRIBE_TOPIC.TAPPY_TAP, success);
                });
            } else {
                // Unsubscribe for push notifications
                this.firebase.unsubscribe(FBKey.SUBSCRIBE_TOPIC.TAPPY_TAP).then((success) => {
                    console.debug("Unsubscribed from push notifications. Topic: ", FBKey.SUBSCRIBE_TOPIC.TAPPY_TAP, success);
                });
            }
        }

        // save to storage
        LocalStorage.set(LSK.PUSH_NOTIFICATIONS, this.pushNotifications);
        LocalStorage.set(LSK.SOUND, this.sound);
        this.toast.create({
            message: "Settings saved",
            duration: 3000
        }).present();
        this.navCtrl.pop();
    }
}
