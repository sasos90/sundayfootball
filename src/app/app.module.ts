import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { Page2 } from '../pages/page2/page2';
import {Game} from "../pages/game/game";
import {BoxComponent} from "../components/box/box";
import {ReadySetGoComponent} from "../components/ReadySetGo/ReadySetGoComponent";
import {FinalResultComponent} from "../components/FinalResult/FinalResultComponent";
import {BrowserModule, HammerGestureConfig, HAMMER_GESTURE_CONFIG} from "@angular/platform-browser";
import {MainMenu} from "../pages/mainmenu/mainmenu";
import {Instructions} from "../pages/instructions/instructions";
import {HighScore} from "../pages/highscore/highscore";
import {Settings} from "../pages/settings/settings";
import {SplashScreen} from "@ionic-native/splash-screen";
import {StatusBar} from "@ionic-native/status-bar";
import {NativeAudio} from "@ionic-native/native-audio";
import {Firebase} from "@ionic-native/firebase";
import {AdMob} from '@ionic-native/admob';
import {Device} from "@ionic-native/device";
import {Backend} from "../services/Backend";
import {HttpModule} from "@angular/http";

export class MyHammerConfig extends HammerGestureConfig  {
    overrides = <any>{
        "tap": {
            time: 1000,
            threshold: 9999999
        } // override default settings
    }
}

@NgModule({
    declarations: [
        MyApp,
        Game,
        BoxComponent,
        Page2,
        ReadySetGoComponent,
        FinalResultComponent,
        MainMenu,
        Instructions,
        HighScore,
        Settings
    ],
    imports: [
        IonicModule.forRoot(MyApp),
        BrowserModule,
        HttpModule
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        Game,
        Page2,
        ReadySetGoComponent,
        FinalResultComponent,
        MainMenu,
        Instructions,
        HighScore,
        Settings
    ],
    providers: [
        StatusBar,
        SplashScreen,
        NativeAudio,
        Firebase,
        AdMob,
        Device,
        Backend,
        {provide: ErrorHandler, useClass: IonicErrorHandler},
        {provide: HAMMER_GESTURE_CONFIG, useClass: MyHammerConfig}
    ]
})
export class AppModule {}
