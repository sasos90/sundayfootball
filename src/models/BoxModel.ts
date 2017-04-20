/**
 * Created by saso on 1/12/17.
 */
export class BoxModel {

    constructor(
        private _color: string,
        public isHit: boolean = false
    ) {}

    get color(): string {
        return this._color;
    }

    set color(value: string) {
        this._color = value;
    }

    public doesMatch(box: BoxModel) : boolean {
        return this.color === box.color;
    }
}
