export default class ScoreUtil{
    constructor(){
    }

    private static readonly ScorePrefix:number = 1000;

    public static packageServerScore(score:number, solarNum:number):number
    {
        return score*ScoreUtil.ScorePrefix + solarNum;
    } 

    public static parseServerScore(serverScore:number):Array<number>
    {
        let solarNum = serverScore % ScoreUtil.ScorePrefix;
        let score = Math.floor(serverScore / ScoreUtil.ScorePrefix);
        return [score, solarNum];
    }

}