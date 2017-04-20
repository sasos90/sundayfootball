/**
 * Created by saso on 1/17/17.
 */
export class ColorHelper {

    public static MATERIAL_COLORS: Array<string> = [
        "#f43325",
        "#3F51B5",
        "#4CAF50",
        "#FFEB3B",
        "#795548",
        "#55aef6"
    ];

    public static getRandomColor() {
        let randomIndex = Math.floor((Math.random() * ColorHelper.MATERIAL_COLORS.length));
        return ColorHelper.MATERIAL_COLORS[randomIndex];
    }
}
