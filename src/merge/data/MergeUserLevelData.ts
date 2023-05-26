//合成等级 起始为1
export default class MergeUserLevelData
{
    public readonly user_level:number;
    public readonly max_plane:number;

    // "1": {
    //     "user_level": "1",
    //     "max_plane": 4,
    //     "level_up_reward": 0,
    //     "reward_diamond": 0
    //   },

    constructor(data:any)
    {
        this.user_level = data.user_level;
        this.max_plane = data.max_plane;
    }
}