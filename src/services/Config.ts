import {Environment} from "../models/Environment";
/**
 * Created by saso on 4/3/17.
 */
export class Config {
    public static ENV: Environment = Environment.LIVE;
    public static VERSION: string = "1.5.0";
    public static SALT: string = "*k9[unD1LrQSQ2_";

    // backend host config
    public static BACKEND_ENV: Environment = Environment.LIVE;
    public static HOST_TEST: string = "http://localhost:3000/";
    public static HOST_LIVE: string = "https://tappytap-backend.sasosabotin.si/";

    public static getBackendHost() : string {
        switch (Config.BACKEND_ENV) {
            case Environment.DEVELOP:
                return Config.HOST_TEST;
            case Environment.LIVE:
                return Config.HOST_LIVE;
        }
    }
    public static BACKEND_HOST: string = Config.getBackendHost();
}
