import Util from "../utils/Util";

/*
* 星球配置;
*/
export default class PlanetConfig
{
    public readonly id:number;
    public readonly planetType:number;
    public readonly planetColor:number;
    public readonly planetMesh:string;
    public readonly planetRadius:number;

    // "1": {
    //     "id": "1",
    //     "planetType": 1,
    //     "planetColor": 1,
    //     "planetMesh": "planet_01"
    //   },

    constructor(data:any)
    {
        this.id = data.id;
        this.planetType = data.planetType;
        this.planetColor = data.planetColor;
        this.planetMesh = data.planetMesh;
        this.planetRadius = data.planetRadius;
    }

    public get planetSkin():string
    {
        return "planet_"+Util.strNumber(this.planetType, 2)+"_"+Util.strNumber(this.planetColor, 3);
    }

    public get isEarth():boolean
    {
        return this.planetMesh == "planet_07";
    }
}