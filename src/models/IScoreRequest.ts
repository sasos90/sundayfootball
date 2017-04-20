/**
 * Created by saso on 4/4/17.
 */
export interface IScoreRequest {
    time: number;
    score: number;
    levelReached: number;
    deviceUuid: string;
    name: string;
    hash: string;
}
