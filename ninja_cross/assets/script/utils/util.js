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
            cc.audioEngine.playEffect(btnSound,false,1);
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
            cc.audioEngine.playEffect(btnSound,false,1);
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
        switch(num){
            case 1:
                GameConfig.MaxMultiProbability = 0.2;
                GameConfig.sharkJumpDurTime = 40;
                break;
            case 2:
                GameConfig.MaxMultiProbability = 0.25;
                GameConfig.sharkJumpDurTime = 37;
                break;
            case 3:
                GameConfig.MaxMultiProbability = 0.3;
                GameConfig.sharkJumpDurTime = 34;
                break;
            case 4:
                GameConfig.MaxMultiProbability = 0.35;
                GameConfig.sharkJumpDurTime = 31;
                break;
            case 5:
                GameConfig.MaxMultiProbability = 0.4;
                GameConfig.sharkJumpDurTime = 28;
                break;
            case 6:
                GameConfig.MaxMultiProbability = 0.5;
                GameConfig.sharkJumpDurTime = 25;
                break;
            case 7:
                GameConfig.MaxMultiProbability = 0.6;
                GameConfig.sharkJumpDurTime = 22;
                break;
            case 8:
                GameConfig.MaxMultiProbability = 0.7;
                GameConfig.sharkJumpDurTime = 19;
                break;
            case 9:
                GameConfig.MaxMultiProbability = 0.8;
                GameConfig.sharkJumpDurTime = 16;
                break;
            case 10:
                GameConfig.MaxMultiProbability = 0.9;
                GameConfig.sharkJumpDurTime = 13;
                break;
        }
    },
    /**
     * 游戏日志
     * @param logLevel 日志等级
     * @param logRemark 日志备注
     */
    gameLog(logLevel,logRemark){
        wx.request({
            url:GameConfig.LOG_URL+'submit',
            data:{
                'code':2,
                'env':2,
                'content':GameConfig.config,
                'level':logLevel,
                'remark':logRemark
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded',
                'sessionId':'SESSION='+wx.getStorageSync('sessionId')
            },
            method:"POST",
            seccuss(res){
                console.log('日志接口访问成功')
                console.log(res.data)
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