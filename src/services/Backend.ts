import {Injectable} from "@angular/core";
import {Http, RequestOptionsArgs} from "@angular/http";
import {Config} from "./Config";
import {Device} from "@ionic-native/device";
import {IScoreRequest} from "../models/IScoreRequest";
import {ScoreModel} from "../models/ScoreModel";
import {IRankRequest} from "../models/IRankRequest";
import {Md5} from "ts-md5/dist/md5";
import {IHighscoresRequest} from "../models/IHighscoresRequest";
import {IRankForScoreRequest} from "../models/IRankForScoreRequest";
import {LSK} from "../models/LSK";
import {LocalStorage} from "./LocalStorage";
import {Platform} from "ionic-angular";
/**
 * Created by saso on 4/5/17.
 */
@Injectable()
export class Backend {

    public URL: string = Config.BACKEND_HOST + "rankings/";

    constructor(
        public device: Device,
        public http: Http,
        public platform: Platform
    ) {}

    public sendScore(total: number, levelReached: number, successCb: (rank: number) => any, errorCb: () => any) {
        this.platform.ready().then(() => {
            let url = this.URL + "sendScore";
            let date = new Date();
            let request: IScoreRequest = {
                time: this.getTodaysTimestamp(),
                score: total,
                levelReached: levelReached,
                deviceUuid: this.device.uuid || "TEST_DEVICE",
                name: LocalStorage.get(LSK.NAME),
                hash: null
            };
            request.hash = Backend.createHash(request);
            console.log("Request:", request);

            this.http.post(url, request).subscribe((response) => {
                // next
                console.log("Send score RESPONSE: ", response);
                let res = response.json();
                if (res.success) {
                    successCb(res.rank);
                } else {
                    errorCb();
                }
            }, (response) => {
                // error
                console.error(response);
                errorCb();
            }, () => {
                // complete
            });
        });
    }

    public getRank(successCb: (rank: number) => any, errorCb: () => any) {
        this.platform.ready().then(() => {
            let url = this.URL + "getRank";
            let request: IRankRequest = {
                deviceUuid: this.device.uuid || "TEST_DEVICE"
            };

            this.http.post(url, request).subscribe((response) => {
                // next
                console.log("Response: ", response.json());
                let res = response.json();
                if (res.success) {
                    successCb(res.rank);
                } else {
                    errorCb();
                }
            }, (response) => {
                // error
                console.error(response);
                errorCb();
            }, () => {
                // complete
            });
        });
    }

    public getRankForScore(total: number, successCb: (rank: number) => any, errorCb: () => any) {
        this.platform.ready().then(() => {
            let url = this.URL + "getRankForScore";
            let request: IRankForScoreRequest = {
                deviceUuid: this.device.uuid || "TEST_DEVICE",
                score: total
            };

            this.http.post(url, request).subscribe((response) => {
                // next
                console.log("Response: ", response.json());
                let res = response.json();
                if (res.success) {
                    successCb(res.rank);
                } else {
                    errorCb();
                }
            }, (response) => {
                // error
                console.error(response);
                errorCb();
            }, () => {
                // complete
            });
        });
    }

    public getHighscores(successCb: (highscores) => any, errorCb: () => any) {
        this.platform.ready().then(() => {
            let url = this.URL + "getHighscores";
            let request: IHighscoresRequest = {
                deviceUuid: this.device.uuid || "TEST_DEVICE"
            };

            this.http.post(url, request).subscribe((response) => {
                // next
                console.log("Response: ", response.json());
                let res = response.json();
                if (res.success) {
                    successCb(res);
                } else {
                    errorCb();
                }
            }, (response) => {
                // error
                console.error(response);
                errorCb();
            }, () => {
                // complete
            });
        });
    }

    public static createHash(request: IScoreRequest) : string {
        return Md5.hashStr(request.time + request.deviceUuid + request.levelReached + request.name + request.score + Config.SALT).toString();
    }


    private getTodaysTimestamp() : number {
        let now = new Date();
        let today = new Date();
        today.setUTCDate(now.getUTCDate());
        today.setUTCMonth(now.getUTCMonth())
        today.setUTCFullYear(now.getUTCFullYear())
        today.setUTCHours(0, 0, 0, 0);

        let timestamp = today.getTime() / 1000;
        return timestamp;
    }
}
