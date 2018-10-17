import GameDataManager from '../gameDataManager';
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
    },
    /**
     * 返回随机数，范围 0~multiple的整数
     * @param multiple 随机数上限
     */
    randomNum(multiple){
        return Math.floor(Math.random()*multiple);
    },
    /**
     * 计算道具所转角度
     * @param multiple 随机数上限
     */
    getAngle(start,end){
        var diff_x = end.x - start.x,
            diff_y = end.y - start.y;
        return 90-360*Math.atan(diff_y/diff_x)/(2*Math.PI);
    }
}
export default Util