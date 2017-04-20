import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
    selector: 'instructions',
    templateUrl: 'instructions.html'
})
export class Instructions {

    constructor(public navCtrl: NavController) {}

    ngOnInit() {}

    public back() {
        this.navCtrl.pop();
    }
}
