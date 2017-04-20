import {Component, Input, EventEmitter, Output} from '@angular/core';
import {BoxModel} from "../../models/BoxModel";
import {NativeAudio} from "@ionic-native/native-audio";
import {LocalStorage} from "../../services/LocalStorage";
import {LSK} from "../../models/LSK";
import {Firebase} from "@ionic-native/firebase";
import {FBKey} from "../../models/FBKey";
import {Platform} from "ionic-angular";

@Component({
    selector: 'box',
    template: `
        <div class="box-wrapper" [ngClass]="{hit: hit}" *ngIf="!hideBox">
            <div class="box front" [ngStyle]="{'background': box.color}" (tap)="tap(box)" (click)="tap(box)" (swipe)="tap(box)" [ngClass]="{target: box.doesMatch(target) && exposed}"></div>
            <!-- Remove back figure if you don't want the whole flip but just 50% -->
            <div class="box back" [ngStyle]="{'background': box.color}" (tap)="tap(target)" (click)="tap(target)" (swipe)="tap(target)" ></div>
        </div>`
})
export class BoxComponent {

    @Input() box: BoxModel;
    @Input() target: BoxModel;
    @Output() onBoxTap = new EventEmitter();
    public hit: boolean = false;
    @Input() exposed: boolean = false;
    public hideBox: boolean = false;
    private tapped: boolean = false;

    constructor(
        public nativeAudio: NativeAudio,
        public firebase: Firebase,
        public platform: Platform
    ) {}

    ngOnInit() {}

    public tap(tappedBox: BoxModel) {
        if (!this.tapped) {
            this.tapped = true;
            if (this.target.doesMatch(tappedBox)) {
                // HIT SUCCESSED
                this.onSuccessHit();
            } else {
                // store missed box on firebase
                if (this.platform.is("cordova")) {
                    this.firebase.logEvent(FBKey.BOX.MISSED, {}).then((success) => {
                        console.log("FB: " + FBKey.BOX.MISSED, success);
                    });
                }
                if (LocalStorage.get(LSK.SOUND) === "true") {
                    this.nativeAudio.play("miss");
                }
                this.onBoxTap.emit(this.box);
                this.box.color = this.target.color;
                setTimeout(() => {
                    this.tapped = false;
                }, 100);
            }
        }
    }

    private onSuccessHit() {
        // handle object data
        this.box.isHit = true;

        // call output
        this.onBoxTap.emit(this.box);

        // handle component view
        this.hit = true;
        setTimeout(() => {
            this.hideBox = true;
        }, 300);
    }
}
