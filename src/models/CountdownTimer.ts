/**
 * Created by saso on 1/21/17.
 *
 * requestFrameAnimation JS feature.
 * rafId: Reference ID for requestAnimationFrame javascript function, so we can cancel it later
 */
export class CountdownTimer {

    private _requestAnimationFrameId: any;
    private _lastFrameTimestamp: number = null;

    private _percentage: number = 0;
    private _progress: number = 0;

    constructor(
        private _start: number
    ) {}

    get rafId(): any {
        return this._requestAnimationFrameId;
    }
    set rafId(value: any) {
        this._requestAnimationFrameId = value;
    }
    get lastFrame(): number {
        return this._lastFrameTimestamp;
    }
    set lastFrame(value: number) {
        this._lastFrameTimestamp = value;
    }
    get percentage(): number {
        return this._percentage;
    }
    set percentage(value: number) {
        this._percentage = value;
    }
    get progress(): number {
        return this._progress;
    }
    set progress(value: number) {
        // set progress
        this._progress = this.calculateProgress(value);
        // set percentage
        this.percentage = this.calculatePercentage();
    }
    get start(): number {
        return this._start;
    }
    set start(value: number) {
        this._start = value;
    }

    public resetToStart() {
        this.lastFrame = null;
        this.percentage = 100;
        this.progress = this.start;
    }

    public resetToZero() {
        this.progress = this.start;
    }

    public addTime(miliseconds: number) {
        this.lastFrame += miliseconds;
    }

    private calculateProgress(progress: number) : number {
        return (Math.round(progress) - this.start) * -1;
    }

    private calculatePercentage() : number {
        return this.progress * 100 / this.start;
    }

    public cancelAnimation() {
        window.cancelAnimationFrame(this.rafId);
    }
}
