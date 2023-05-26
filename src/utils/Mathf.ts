/*
* 模拟;
*/
export default class Mathf{
    constructor(){
    }

    public static lerp(aa:number, bb:number, t:number):number
    {
        return aa+(bb-aa)*t;
    }

    public static curveEvaluate(t:number,max:number=1, min:number=0):number
    {
        // min = Math.min(min, max);
        // max = Math.max(min, max);
        return min+(max-min)*t;
    }

    public static range(min:number, max:number):number
    {
        let rmin = Math.min(min, max);
        let rmax = Math.max(min, max);
        return Math.random()*(rmax - rmin) + rmin;
    }

    public static rangeWithInvert(min:number, max:number):number
    {
        let isInvert:boolean = Math.random() > 0.5;
        let value:number = Mathf.range(min, max);
        return isInvert ? -1*value : value;
    }

    public static clamp(value:number, min:number, max:number):number
    {
        if(value < min){
            return min;
        }
        if(value > max)
        {
            return max;
        }
        return value;
    }

    public static getPointInCube(extent:Laya.Vector3):Laya.Vector3
	{
        let numx:number = Math.random()*2-1;
        let numy:number = Math.random()*2-1;
        let numz:number = Math.random()*2-1;
		return new Laya.Vector3(numx * extent.x, numy * extent.y, numz * extent.z);
	}

    public static getPointInsideSphere(radius:number=1):Laya.Vector3
    {
        let vec3:Laya.Vector3;
        do
        {
            vec3 = Mathf.getPointInCube(Laya.Vector3._ONE.clone());
        }
        while(Laya.Vector3.distanceSquared(new Laya.Vector3(0,0,0), vec3) > 1);
        if(radius != 1)
        {
            vec3.x = vec3.x*radius;
            vec3.y = vec3.y*radius;
            vec3.z = vec3.z*radius;
        }
        return vec3;
    }
}