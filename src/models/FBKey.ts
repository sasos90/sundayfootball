/**
 * Created by saso on 4/3/17.
 */
/**
 * Keys for firebase.
 */
export class FBKey {
    public static SETTINGS: any = {
        SCREEN: "SETTINGS_SCREEN",
        DISCARD: "SETTINGS_discard",
        SAVE: "SETTINGS_save"
    };

    public static GAME: any = {
        SCREEN: "GAME_SCREEN"
    };

    public static FINAL_RESULT: any = {
        BEST_SCORE: "FINAL_RESULT_best_score",
        REPLAY: "FINAL_RESULT_replay_the_game",
        MAIN_MENU: "FINAL_RESULT_to_mainmenu"
    };

    public static BOX: any = {
        MISSED: "BOX_missed_box"
    };

    public static SUBSCRIBE_TOPIC: any = {
        TAPPY_TAP: "tappytap"
    };
}
