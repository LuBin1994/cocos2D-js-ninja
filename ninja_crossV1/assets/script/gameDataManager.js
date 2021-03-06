//游戏运行数据
var GameDataManager = {
    canSoundPlay: false,    //音效能否播放
    totalScore:0,           //总分数
    nextScore:0,            //站台分值
    addScoreGrade:1,        //加分等级
    isMove:false,           //画面是否移动
    isSuccess:false,        //当前是否成功
    canDrop:false,          //人数是否能掉落
    move:0,                 //当前回合移动
    moveDistance:0,         //当前回合移动距离
    isAnimate:false,        //是否正在动画
    isShowFog:false,        //是否显示烟雾
    isGameOver:false,       //游戏是否结束
    isLengthen: false,      //道具是否变长
    isStartLengthen:false,  //道具是否开始变长
    toolChoose: 2,          //道具选择，0 ：木棍 ，1 ： 桥梁 ，2 ：跳跃
    gameId:0,               //当局游戏ID
    isBreakRecord:false,    //当局成绩是否破纪录
    isHideSub:false,        //是否隐藏子域内容
    rankMax:5,              //可看排行榜次数
    everydayGameMax:5,      //可玩游戏次数
    switchModelMax:3,       //可切换模式次数
}
export default GameDataManager
