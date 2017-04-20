/**
 * Created by saso on 3/28/17.
 */
import { Injectable }     from "@angular/core";

@Injectable()
export class LocalStorage {

    protected requests: Array<any> = [];

    public static get(key: string) : any {
        let value = window.localStorage[key];
        return typeof value !== "undefined" ? value : null;
    }

    public static set(key: string, value: any) : boolean {
        window.localStorage.setItem(key, value);
        return true;
    }

    public static remove(key: string): boolean {
        window.localStorage.removeItem(key);
        return true;
    }

    public static clear(): boolean {
        window.localStorage.clear();
        return true;
    }
}
