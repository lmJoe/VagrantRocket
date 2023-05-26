/*
* ArrayUtil;
*/
export default class ArrayUtil{
    constructor(){
    }
    /*
    *洗牌算法
    *思路：
    *   有n个数据的数据列，从第一个元素开始，随机取出数据列中元素与之交换，依次进行n次交换，即可得到一个随机排列的数据列
    */
    public static shuffleSort(arr:Array<any>):void
    {
        if(ArrayUtil.arrayIsNullOrEmpty(arr)){
            return;
        }
        for (var i:number=0; i<arr.length-1; i++) 
        {
			var j:number = Math.floor( arr.length*Math.random() )
			ArrayUtil.swap(arr, i, j);
		}
    }

    private static swap(arr:Array<any>, ii, jj):void
    {
        if (ii == jj) {
			return;
		}
        var temp = arr[ii];
		arr[ii] =  arr[jj];
        arr[jj] = temp;
    }

    public static arrayIsNullOrEmpty(arr):boolean
    {
        return !(arr && arr.length>0);
    }

    public static getRandomInArray(arr:Array<any>):any
    {
        return arr[ Math.floor( arr.length*Math.random() ) ];
    }
}