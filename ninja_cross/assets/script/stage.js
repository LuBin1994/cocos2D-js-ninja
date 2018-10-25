import gameConfig from './gameConfig' ;
import GameDataManager from './gameDataManager';
import Util from './utils/util' ;
cc.Class({
    extends: cc.Component,
    properties: {
        stagePrefabs: [],
        doneStage: 0,//已通过的站台数
        canRecycle: false,
        currentPlat: {
            default: null,
            type: cc.node,
        },
        nextPlat: {
            default: null,
            type: cc.node,
        },
        nextTwoPlat: {
            default: null,
            type: cc.node,
        }
    },
    onLoad() {
        var _this = this;
        this.configInit();
        this.stagePrefabInit(function () { _this.stageInit(); });
    },
    init: function (game) {
        this.game = game;
    },
    configInit:function(){
        this.node.opacity = 255;
        this.canRecycle = false;
        this.doneStage = 0;
    },
    gameInit: function () {
        this.destroyAll();
        this.configInit();
        this.stageInit();
    },
    //对象池，预制初始化
    stagePrefabInit: function (callbacks) {
        var _this = this;
        try {
            cc.loader.loadRes("stage/stage" + 1, function (err, prefab) {
                _this.stagePrefabs.push(prefab);
                cc.loader.loadRes("stage/stage" + 2, function (err, prefab) {
                    _this.stagePrefabs.push(prefab);
                    cc.loader.loadRes("stage/stage" + 3, function (err, prefab) {
                        _this.stagePrefabs.push(prefab);
                        cc.loader.loadRes("stage/stage" + 4, function (err, prefab) {
                            _this.stagePrefabs.push(prefab);
                            cc.loader.loadRes("stage/stage" + 5, function (err, prefab) {
                                _this.stagePrefabs.push(prefab);
                                cc.loader.loadRes("stage/stage" + 6, function (err, prefab) {
                                    _this.stagePrefabs.push(prefab);
                                    callbacks && callbacks();
                                })
                            })
                        })
                    })
                })
            })
        }
        catch (e) {
            Util.gameLog(1,"站桩预制加载出错")
        }

    },
    //站桩初始化
    stageInit: function () {
        var nextX,distance,centerDistance; 
        //第一个站桩
        this.currentPlat = cc.instantiate(this.stagePrefabs[Util.randomNum(3)]);
        this.currentPlat.setPosition(cc.v2(-230, -295));
        this.currentPlat.parent = this.node;
        //第二个站桩
        this.nextPlat = cc.instantiate(this.stagePrefabs[Util.randomNum(3)]);
        distance = Util.randomNum(250)+100;//随机距离
        centerDistance = distance + (this.currentPlat.width/2 + this.nextPlat.width/2)
        centerDistance = centerDistance - centerDistance%gameConfig.gameMoveSpeed;//两站装中心距离设置为移动速度的整数倍，防止移动过程中出现的偏差
        nextX = this.currentPlat.x+centerDistance;
        this.nextPlat.setPosition(cc.v2(nextX, -295));
        this.nextPlat.parent = this.node;

        //第三个站桩
        this.nextTwoPlat = cc.instantiate(this.stagePrefabs[Util.randomNum(3)]);
        distance = Util.randomNum(250)+100;//随机距离
        centerDistance = distance + (this.nextPlat.width/2 + this.nextTwoPlat.width/2);
        centerDistance = centerDistance - centerDistance%gameConfig.gameMoveSpeed;//两站装中心距离设置为移动速度的整数倍，防止移动过程中出现的偏差
        nextX = this.nextPlat.x+centerDistance;
        this.nextTwoPlat.setPosition(cc.v2(nextX, -295));
        this.nextTwoPlat.parent = this.node;

        //初始化设置道具
        switch(GameDataManager.toolChoose){
            case 0:
                this.game.stick.node.active = true;
                this.game.stick.setStick(this.currentPlat.x + this.currentPlat.width / 2);
                break;
            case 1:
                this.game.bridge.node.active = true;
                this.game.bridge.setBridge(this.currentPlat.x + this.currentPlat.width / 2);
                break;
            case 2:
                this.game.energy.showCali();
                this.game.energy.setCali();
                break;
        }
    },
    createStage: function () {
        this.doneStage += 1;
        var num1 = Util.randomNum(100);
        var num2 = 100-Math.floor(this.doneStage/2)-gameConfig.minMultiProbability*100;
        if(num2<100*(1-gameConfig.maxMultiProbability)){
            num2 = 100*(1-gameConfig.maxMultiProbability);
        }
        var chooseNum = Util.randomNum(3);
        if (num1 < num2) {   //抽取普通站台
            this.setNextStage(chooseNum);
        }
        else {   //抽取多得分站台
            if(GameDataManager.toolChoose == 1){
                this.setNextStage(chooseNum + 2);
            }
            else{
                this.setNextStage(chooseNum + 3);
            }
        }
    },
    //设置下一个站桩
    setNextStage: function (num) {
        var stage,nextX,distance,centerDistance;
        this.currentPlat = this.nextPlat;
        this.nextPlat = this.nextTwoPlat;
        stage = cc.instantiate(this.stagePrefabs[num]);
        this.nextTwoPlat = stage;
        this.nextTwoPlat.parent = this.node;
        this.nextTwoPlat.opacity = 0;
        distance = Util.randomNum(250)+100;//随机距离
        centerDistance = distance + (this.nextPlat.width/2 + this.nextTwoPlat.width/2);
        centerDistance = centerDistance - centerDistance%gameConfig.gameMoveSpeed;//两站装中心距离设置为移动速度的整数倍，防止移动过程中出现的偏差
        nextX = this.nextPlat.x + centerDistance;
        this.nextTwoPlat.setPosition(cc.v2(nextX, -605));
        //新生成的站台动画
        var moveY = cc.moveTo(1,cc.v2(nextX,-295));
        var fadeIn = cc.fadeIn(1);
        var ani = cc.spawn(moveY,fadeIn);
        this.nextTwoPlat.runAction(ani);

        //选择下个道具
        if(GameDataManager.toolChoose !== 2){
            if(this.doneStage%5 == 0){
                this.game.fog.showFog(this.nextPlat.x,-305)
            }
        }
        if(GameDataManager.toolChoose == 2){
            //设置能量条刻度
            this.game.energy.setCali();
        }
    },
    //游戏一回合结束删除经过的站桩
    recycleStage: function () {
        this.node.removeChild(this.node.children[0]);
    },
    //删除所有站桩
    destroyAll:function(){
        this.node.removeAllChildren(true);
    },
    //获取到下一个站桩的最小距离和最大距离
    getLength(){
        var length = new Object();
        //道具搭桥成功所需的最小长度
        var minLength = Math.floor((this.nextPlat.x - this.currentPlat.x) - (this.nextPlat.width + this.currentPlat.width)/2);
        //道具搭桥成功所需的最大长度
        var maxLength =Math.floor((this.nextPlat.x - this.currentPlat.x) + (this.nextPlat.width - this.currentPlat.width)/2);
        length.min = minLength;
        length.max = maxLength;
        return length;
    },
    hideStage(){
        this.node.opacity = 0;
    },
    showStage(){
        this.node.opacity = 255;
    },
    update(dt) {
        if (GameDataManager.isMove) {
            //所有站桩左移
            var childrens = this.node.children;
            for (var i = 0; i < childrens.length; i++)
            {
                childrens[i].x -= gameConfig.gameMoveSpeed
            }
        }
    },
})

