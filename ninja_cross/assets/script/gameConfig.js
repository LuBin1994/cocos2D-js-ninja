var GameConfig = {
    /**
     * 游戏配置参数
     */
    isScreemCanTouch: true,        //游戏屏幕是否能触摸
    gameBgMoveSpeed: 1,            //背景移动速度
    gameMoveSpeed: 8,              //游戏移动速度
    stickLength: 0,                //棍子初始长度
    stickLengthSpeed: 5,           //棍子变长速度
    minMultiProbability: 0.2,      //多分值站桩最小抽取概率
    MaxMultiProbability: 0.5,      //多分值站桩最大抽取概
    canResurrectTime: 0,           //能复活次数
    sharkJumpDurTime: 30,          //鲨鱼跳跃间隔时间(秒)
    MAIN_MENU_NUM: "ninja_crossing",           // 主选择菜单
    IS_WX:true,                    //当前是否是微信环境(游戏发布时改为true)
    difficulty:1,                  //游戏难度  {1-10}
    /**
     * 数据存储
     */
    IS_AUTHORIZE:false,            //是否授权
    auths_Btn:null,                //授权按钮
    INTER_URL:"https://wg.iwckj.com/risk/",   //接口
    LOG_URL:"https://log-ninja.iwckj.com/",     //日志接口
    env:"2",                       //环境  0:开发   1：测试   2：线上
    haveCheckLogin:false,          //是否检查登陆
    haveSetMode:false,             //是否设置模式
    //用户系统信息
    systemInfo:{
        system:null,
        brand:null,
        model:null,
        pixelRatio:null,
        screenWidth:null,
        screenHeight:null,
        version:null,
        platform:null,
        sdkVersion:null,
        benchmarkLevel:null
    },
    //配置信息
    config:{},
    //由他人分享进入的数据
    enterShareConfig:{
        enterShareCode:'',
        path:''
    },
    //用户信息
    userInfo:{
        nickName:null,                 //用户昵称
        avatarUrl:null,                //用户头像
        country:null,                  //用户国籍
        province:null,                 //用户所在省份
        city:null,                     //用户所在城市
        sex:null,                      //用户性别
        code:null,                     //用户登录凭证
    },
};
export default GameConfig