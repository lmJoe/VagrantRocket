/*
* 工具;
*/
export default class Util{
    constructor(){
    }

    static getColor():string
    {
        return '#'+Math.floor(Math.random()*0xffffff).toString(16);
    }

    static removeAllChild(con:Laya.Sprite, keepNum:number = 0):void
    {
        while(con && con.numChildren>keepNum){
            con.removeChildAt(keepNum);
        }
    }
    
    static radianToAngle(value:number):number
    {
        return value * 180 / Math.PI;
    }

    //查找parts中是否包含targets，包含则返回下标数组，否则返回null
    static realIndexsOf(parts:Array<number>, targets:Array<number>):Array<number>
    {
        var indexs:Array<number> = [];
        var count:number = 0;
        //找下标
        for(var i:number=0; i<targets.length; i++)
        {
            for(var j:number=0; j<parts.length; j++)
            {
                if( !indexs[j] && parts[j] == targets[i] )
                {
                    indexs[j] = 1;
                    count ++;
                    break;
                }
            }
        }
        if(count != targets.length){
            return null;
        }else{
            return indexs.length==0 ? null : indexs;
        }
    }

    //查找parts中是否包含targets
    static realContain(parts:Array<number>, targets:Array<number>):boolean
    {
        return Util.realIndexsOf(parts, targets) != null;
    }

    /**
    * 检查是否是空字串
    */
    static isEmptyString(str:string):boolean
    {
        return !str || str.length==0;
    }


    /*只是正数*/
    public static getNumFromStr(str: string):number
    {
        if(Util.isEmptyString(str)){
            return null;
        }
        var numStr:string = "";
        var startFlag:boolean = false;
        for(var i:number=0; i<str.length; i++)
        {
            if( str.charCodeAt(i) >= 48 && str.charCodeAt(i) <= 57 ){
                // startFlag = true;
                numStr += str[i];
            }else{
                if(startFlag){
                    break;
                }
            }
        }
        return numStr.length>0 ? parseInt(numStr) : null;
    }

    /*时间格式化*/
    public static formatGameTime(gameTime:number, needMs:boolean=false):string
    {
        if(gameTime < 0)
        {
            if(needMs)
            {
                return "00:00:00";
            }else
            {
                return "00:00";
            }
        }
        let min:number = Math.floor( gameTime / (1000*60) );
        let second:number = Math.floor( (gameTime - min*1000*60) / 1000 );
        if(needMs)
        {
            let ms:number = Math.floor( (gameTime % 1000)/10 );
            return Util.numToTimeString(min)+':'+Util.numToTimeString(second)+':'+Util.numToTimeString(ms);
        }else
        {
            return Util.numToTimeString(min)+':'+Util.numToTimeString(second);
        }
    }

    private static numToTimeString(time:number):string
    {
        return time<10 ? '0'+time : ''+time;
    }

    /*数字格式化*/
    public static formatNumber(num:number):string
    {
        return ""+num;
        // let numStr:string = "";
        // while(num >= 1000)
        // {
        //     if(Math.floor(num/1000) > 0)
        //     {
        //         let temp:number = num % 1000;
        //         if(temp < 10){
        //             numStr = ",00" + temp;
        //         }else if(temp < 100){
        //             numStr = ",0" + temp;
        //         }else{
        //             numStr = "," + temp;
        //         }
        //         num = Math.floor(num/1000);
        //     }
        // }
        // return num+numStr;
    }
  
    /*数字补充  5 -> "005"*/
    public static strNumber(num:number, len:number):string
    {
        if(num == 0 && len == 1)
        {
            return "0"
        }
        let str:string = ""+num;
        for(var i=0; i<len; i++)
        {
            if(num < Math.pow(10,i) )
            {
                str = "0"+str;
            }
        }
        return str;
    }

    public static bezierCurve(t:number, stX:number, stY:number, ctrlX:number, ctrlY:number, endX:number, endY:number):Laya.Vector2
    {
        let tem = 1 - t;
        let tx = tem * tem * stX + 2 * t * tem * ctrlX + t * t * endX;
        let ty = tem * tem * stY + 2 * t * tem * ctrlY + t * t * endY;
        return new Laya.Vector2(tx, ty);
    }

    public static moneyFormat(money:number):string
    {
        let emptyStr:string = "";
        if( money < 1000 )
        {
            emptyStr = "" + money.toFixed(0); 
            // emptyStr = (money / 1000).toFixed(2) + "k";
        }
        if( money >= 1000 )
        {
            if(money%1000 == 0)
            {
                emptyStr = (money / 1000).toFixed() + "k";
            }else{
                emptyStr = (money / 1000).toFixed(2) + "k";
            }
        }
        if( money >= 1000000 )
        {
            emptyStr = (money / 1000000).toFixed(2) + "m";
        }
        if( money >= 1000000000 )
        {
            emptyStr = (money / 1000000000).toFixed(2) + "b";
        }
        if( money >= 1000000000000 )
        {
            emptyStr = (money / 1000000000000).toFixed(2) + "t";
        }
        if( money >= 1000000000000000 )
        {
            emptyStr = (money / 1000000000000000).toFixed(2) + "aa";
        }
        if( money >= 1000000000000000000 )
        {
            emptyStr = (money / 1000000000000000000).toFixed(2) + "ab";
        }
        if( money >= 1000000000000000000000 )
        {
            emptyStr = (money / 1000000000000000000000).toFixed(2) + "ac";
        }
        if( money >= 1000000000000000000000000 )
        {
            emptyStr = (money / 1000000000000000000000000).toFixed(2) + "ad";
        }
        if( money >= 100000000000000000000000000 )
        {
            emptyStr = (money / 100000000000000000000000000).toFixed(2) + "ae";
        }
        return emptyStr;
    }

    public static getDayNum(timeMs:number):number
    {
        let oneDayMs:number = 24*60*60*1000;
        return Math.ceil( timeMs/oneDayMs )
    }

    public static isToday(timeMs:number):boolean
    {
        let checkDate = new Date(timeMs);
        let nowDate = new Date();
        //日子相同且相差一天之内
        if(checkDate.getDate() == nowDate.getDate() && nowDate.getMilliseconds()-checkDate.getMilliseconds() <= 24*60*60*1000)
        {
            return true;
        }else{
            return false;
        }
    }
}