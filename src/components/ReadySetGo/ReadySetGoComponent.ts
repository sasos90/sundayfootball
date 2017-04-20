import {Component, Input, EventEmitter, Output} from '@angular/core';
import {BoxModel} from "../../models/BoxModel";

@Component({
    selector: 'ready-set-go',
    template: `
        <div class="ready-set-go-wrapper">
            <div class="relative-wrapper">
                <div class="step one" *ngIf="readySetGo == 0">{{ '3' }}</div>
                <div class="step two" *ngIf="readySetGo == 1">{{ '2' }}</div>
                <div class="step two" *ngIf="readySetGo == 2">{{ '1' }}</div>
            </div>
        </div>
        <div class="overlay-background"></div>`
})
export class ReadySetGoComponent {

    @Input() targetBox: BoxModel;
    @Output() countdownFinished = new EventEmitter();

    public readySetGo: number = -1;

    constructor() {}

    ngOnInit() {
        setTimeout(() => {
            // initial timeout
            this.readySetGo++;
            setTimeout(() => {
                this.readySetGo++;
                setTimeout(() => {
                    this.readySetGo++;
                    setTimeout(() => {
                        this.countdownFinished.emit();
                    }, 700);
                }, 700);
            }, 700);
        }, 500);
    }
}
