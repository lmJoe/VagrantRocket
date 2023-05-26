/*
* 星系评论;
*/
export default class SolarComment
{
    public readonly id:number;
    public readonly name:string;
    public readonly desc:string;
    public readonly order:number;


    // "playercomment11": {
    //     "id": 1,
    //     "name": "playercomment11",
    //     "desc": "开发组：人生就像一场太空旅行，当你们离开太阳系就要和地球告别，遇到新的人并经历新的故事。祝旅途顺利！",
    //     "order": 1
    //   },

    constructor(data:any)
    {
        this.id = data.id;
        this.name = data.name;
        this.desc = data.desc;
        this.order = data.order;
    }
}