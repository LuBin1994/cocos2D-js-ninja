import GameDataManager from '../gameDataManager';
import GameConfig from '../gameConfig'
var Util = {
    /**
     * 普通按钮触摸效果
     * @param NODE 按钮节点
     * @param btnSound 按钮音效
     * @param CALLBACKS touchend回调函数
     */
    btnEvent(NODE,btnSound,CALLBACKS){
        NODE.on('touchstart',function(){
            NODE.setScale(0.8);
            if(GameDataManager.canSoundPlay){
                cc.audioEngine.playEffect(btnSound,false,1);
            }
        });
        NODE.on('touchend',function(){
            NODE.setScale(1);
            CALLBACKS && CALLBACKS();
        });
        NODE.on('touchcancel',function () {
            NODE.setScale(1);
            CALLBACKS && CALLBACKS();
        })
    },
    /**
     * 模式选择按钮触摸效果
     * @param NODE 按钮节点
     * @param btnSound 按钮音效
     * @param CALLBACKS touchend回调函数
     */
    modeBtnEvent(NODE,btnSound,CALLBACKS){
        NODE.on('touchstart',function(){
            if(GameDataManager.canSoundPlay){
                cc.audioEngine.playEffect(btnSound,false,1);
            }
        });
        NODE.on('touchend',function(){
            CALLBACKS && CALLBACKS();
        });
    },
    /**
     * 游戏开始或重开数据初始化
     */
    gameStartDataInit(){
        GameDataManager.totalScore = 0;
        GameDataManager.isMove = false;
        GameDataManager.isSuccess = false;
        GameDataManager.canDrop = false;
        GameDataManager.move = 0;
        GameDataManager.isAnimate = false;
        GameDataManager.isLengthen = false;
        GameDataManager.isStartLengthen = false;
        GameDataManager.isGameOver = false;
        GameDataManager.isHideSub = false;
    },
    /**
     * 本局游戏继续数据初始化
     */
    gameContinueDataInit(){
        GameDataManager.isMove = false;
        GameDataManager.isSuccess = false;
        GameDataManager.canDrop = false;
        GameDataManager.move = 0;
        GameDataManager.isAnimate = false;
        GameDataManager.isLengthen = false;
        GameDataManager.isStartLengthen = false;
        GameDataManager.isGameOver = false;
        GameDataManager.isHideSub = false;
    },
    /**
     * 返回随机数，范围 0~multiple的整数
     * @param multiple 随机数上限
     */
    randomNum(multiple){
        return Math.floor(Math.random()*multiple);
    },
    /**
     * 游戏难度设置
     * @param num 游戏难度等级
     */
    setGameDifficulty(num){
        GameConfig.MaxMultiProbability = 0.13+0.7*num;
        GameConfig.sharkJumpDurTime = 40-3*num;
    },
    /**
     * 游戏日志
     * @param error 内容
     */
    gameLog(error){
        var str = error
        wx.request({
            url:GameConfig.LOG_URL+'submit',
            data:{
                'code':2,
                'env':GameConfig.env,
                'content':str,
                'system':GameConfig.systemInfo.system,
                'brand':GameConfig.systemInfo.brand,
                'model':GameConfig.systemInfo.model,
                'pixelRatio':GameConfig.systemInfo.pixelRatio,
                'screenWidth':GameConfig.systemInfo.screenWidth,
                'screenHeight':GameConfig.systemInfo.screenHeight,
                'version':GameConfig.systemInfo.version,
                'platform':GameConfig.systemInfo.platform,
                'sdkVersion':GameConfig.systemInfo.sdkVersion,
                'benchmarkLevel':GameConfig.systemInfo.benchmarkLevel,
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                'sessionId':'SESSION='+wx.getStorageSync('sessionId')
            },
            method:"POST",
            seccuss(res){
                if(res.data.status){
                    console.log('日志提交成功')
                }
                else{
                  console.log(res.data.info)
              }
            }
        })
    }
}
export default Util