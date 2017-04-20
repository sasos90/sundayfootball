/**
 * Created by saso on 1/17/17.
 */
export class ArrayHelper {

    public static shuffleArray(array: Array<any>) : void {
        let temporaryValue;
        for (let i = 0; i < array.length; i++) {
            let randomIndex = Math.floor(Math.random() * array.length);
            temporaryValue = array[randomIndex];
            array[randomIndex] = array[i];
            array[i] = temporaryValue;
        }
    }
}
