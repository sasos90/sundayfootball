/**
 * Created by saso on 3/14/17.
 */
export class HeaderStatus {

    constructor(
        private _text: string = "",
        private _animation: string = ""
    ) {}

    get text(): string {
        return this._text;
    }

    set text(value: string) {
        this._text = value;
    }

    /**
     * Use @HeaderStatusAnimation properties for that
     * @return {string}
     */
    get animation(): string {
        return this._animation;
    }

    set animation(value: string) {
        this._animation = value;
        setTimeout(() => {
            this.clear();
        }, 1000);
    }

    public clear() {
        this.text = "";
        this.animation = "";
    }
}
