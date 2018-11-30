import gameConfig from './gameConfig';
import GameDataManager from './gameDataManager';
cc.Class({
    extends: cc.Component,
    properties: {
        bridgePrefab:cc.Prefab,
        bridgeY:90,
        timer:0,
        bridgePool:null
    },
    onLoad (){
        this.bridgePool = new cc.NodePool();
        for(var i=0;i<5;i++){
            var bridgeUnit = cc.instantiate(this.bridgePrefab);
            this.bridgePool.put(bridgeUnit)
        }  
    },
    init(){
        this.node.active = false;
    },
    configInit:function(){
        this.node.rotation = 0;
    },
    gameInit(){
        this.node.rotation = 0;
        this.node.opacity = 255;
    },
    buildBridge:function () {
        var bridgeUnit;
        if(this.bridgePool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
            bridgeUnit = this.bridgePool.get();
        }
        else{ // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
            bridgeUnit = cc.instantiate(this.bridgePrefab);
        }
        bridgeUnit.parent = this.node
        bridgeUnit.setPosition(cc.v2(-25, this.bridgeY));
        this.bridgeY += 90;
    },
    reSetBridge:function(){
        var _this = this;
        this.timer = 0;
        this.bridgeY  = 0;
        if(this.node.children.length > 0){
            for(var i=0;i<this.node.children.length;i++){
                this.bridgePool.put(this.node.children[i--])
            }
        }
        this.buildBridge();
    },
    setBridge(x){
        this.reSetBridge();
        this.node.setPosition(cc.v2(x,-305));
        this.configInit();
    },
    update(dt){
        if(!GameDataManager.isGameOver){
            if(GameDataManager.isLengthen){
                this.timer ++
                if(this.timer%30 == 0){
                    this.buildBridge();
                }
            }
            if(GameDataManager.isMove){
                this.timer = 0;
                this.node.x -= gameConfig.gameMoveSpeed
            }
        }
    }
});
