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
        GameConfig.canResurrectTime = 1;
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
    },
    /**
     * 得分计算
     * @param toolLength 道具长度
     * @param distance 站桩距离
     */
    culculateScore(node,toolLength,distance){
        var scoreInterval; //得分区间
        var num = parseInt(node.name.replace(/[^0-9]/ig, ""));
        var centerDistance = Math.floor(Math.abs(toolLength-( distance + node.width/2))); //道具顶点与下个站桩中心的距离
        if(num <= 3){
            scoreInterval = Math.floor(node.width/9);
            if(0 <= centerDistance && centerDistance <= 0.5*scoreInterval){
                GameDataManager.nextScore = 5;
                GameDataManager.addScoreGrade = 3;
            }
            else if(0.5*scoreInterval < centerDistance && centerDistance <= 1.5*scoreInterval){
                GameDataManager.nextScore = 4;
                GameDataManager.addScoreGrade = 2;
            }
            else if(1.5*scoreInterval < centerDistance && centerDistance <= 2.5*scoreInterval){
                GameDataManager.nextScore = 3;
                GameDataManager.addScoreGrade = 2;
            }
            else if(2.5*scoreInterval < centerDistance && centerDistance <= 3.5*scoreInterval){
                GameDataManager.nextScore = 2;
                GameDataManager.addScoreGrade = 1;
            }
            else if(3.5*scoreInterval < centerDistance && centerDistance <= 4.5*scoreInterval){
                GameDataManager.nextScore = 1;
                GameDataManager.addScoreGrade = 1;
            }
        }
        else{
            switch(num){
                case 4:
                    scoreInterval = Math.floor(node.width/7);
                    if(0 < centerDistance && centerDistance <= 0.5*scoreInterval){
                        GameDataManager.nextScore = 6;
                        GameDataManager.addScoreGrade = 3;
                    }
                    else if(0.5*scoreInterval <centerDistance && centerDistance <= 1.5*scoreInterval){
                        GameDataManager.nextScore = 5;
                        GameDataManager.addScoreGrade = 2;
                    }
                    else if(1.5*scoreInterval <centerDistance && centerDistance <= 2.5*scoreInterval){
                        GameDataManager.nextScore = 3;
                        GameDataManager.addScoreGrade = 2;
                    }
                    else if(2.5*scoreInterval <centerDistance && centerDistance <= 3.5*scoreInterval){
                        GameDataManager.nextScore = 1;
                        GameDataManager.addScoreGrade = 1;
                    }
                    break;
                case 5:
                    scoreInterval = Math.floor(node.width/5);
                    if(0 < centerDistance && centerDistance <= 0.5*scoreInterval){
                        GameDataManager.nextScore = 7;
                        GameDataManager.addScoreGrade = 3;
                    }
                    else if(0.5*scoreInterval <centerDistance && centerDistance <= 1.5*scoreInterval){
                        GameDataManager.nextScore = 4;
                        GameDataManager.addScoreGrade = 2;
                    }
                    else if(1.5*scoreInterval <centerDistance && centerDistance <= 2.5*scoreInterval){
                        GameDataManager.nextScore = 2;
                        GameDataManager.addScoreGrade = 1;
                    }
                    break;
                case 6:
                    scoreInterval = Math.floor(node.width/3);
                    if(0 < centerDistance && centerDistance <= 0.5*scoreInterval){
                        GameDataManager.nextScore = 8;
                        GameDataManager.addScoreGrade = 3;
                    }
                    else if(0.5*scoreInterval <centerDistance && centerDistance <= 1.5*scoreInterval){
                        GameDataManager.nextScore = 4;
                        GameDataManager.addScoreGrade = 2;
                    }
                    break;
            }
        }
    },
    /**
     * 激励式观看广告
     * @param {*} adId 广告id
     * @param {*} target 
     * @param {*} func  光看广告完成回调
     */
    createVideoAdv(adId,target,func){
        var target = target;
        //打开视频
        target = wx.createRewardedVideoAd({ adUnitId: adId })
        target.onLoad(() => {
            console.log('激励视频 广告加载成功')
        }),
        target.onError(err => {
            console.log(err)
            func();
        })
        target.offClose();
        target.onClose(res => {
            // 小于 2.1.0 的基础库版本，res 是一个 undefined
            if (res && res.isEnded || res === undefined) {
                func();
                console.log()
            }
            else {
                console.log('中途退出不会获得游戏奖励')
            }
        })
        target.show().catch(err => {
            target.load().then(() => target.show())
        })
    },
    /**
     * 创建banner广告
     * @param {*} func  广告调取失败回调
     */
    createBannerAdv(func){
        if(GameConfig.gameOverBannerAdv){
            GameConfig.gameOverBannerAdv.destroy();
            GameConfig.gameOverBannerAdv = wx.createBannerAd({
                adUnitId: 'adunit-14283a654627a2a0',
                style: {
                    left: 0,
                    top: GameConfig.systemInfo.screenHeight - 110,
                    width: GameConfig.systemInfo.screenWidth,
                    height: 110,
                }
            });
            GameConfig.gameOverBannerAdv.onLoad(() =>{
                console.log('banner 广告加载成功')
                GameConfig.gameOverBannerAdv.show(); 
              })
            GameConfig.gameOverBannerAdv.onError(err => {
                console.log(err)
                func();
              })
        }
        else{
            GameConfig.gameOverBannerAdv = wx.createBannerAd({
                adUnitId: 'adunit-14283a654627a2a0',
                style: {
                    left: 0,
                    top: GameConfig.systemInfo.screenHeight - 110,
                    width: GameConfig.systemInfo.screenWidth,
                    height: 110,
                }
            })
            GameConfig.gameOverBannerAdv.onLoad(() => {
                console.log('banner 广告加载成功')
                GameConfig.gameOverBannerAdv.show(); 
              })
            GameConfig.gameOverBannerAdv.onError(err => {
                console.log(err)
                func();
              })   
        }
    },
    /**
     * 获取当前日期
     */
    getDate(){
        var date = new Date();
        return date.toLocaleDateString(); 
    }
}
export default Util