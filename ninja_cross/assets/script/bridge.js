import gameConfig from './gameConfig';
import GameDataManager from './gameDataManager';
cc.Class({
    extends: cc.Component,
    properties: {
        bridgeY:90,
        timer:0,
    },
    onLoad () {
        this.node.active = false;
    },
    start () {

    },
    configInit:function(){
        this.node.rotation = 0;
    },
    gameInit(){
        this.node.rotation = 0;
        this.node.opacity = 255;
    },
    buildBridge:function () {
        var _this = this;
        cc.loader.loadRes('tools/bridgeUnit', (err, prefab) => {
            if (!err) {
                let node = cc.instantiate(prefab);
                node.setPosition(cc.v2(-25, _this.bridgeY));
                _this.node.addChild(node);
                _this.bridgeY += 90;
            }
        });
    },
    reSetBridge:function(){
        var _this = this;
        this.timer = 0;
        this.bridgeY  = 90;
        this.node.removeAllChildren(true);
        cc.loader.loadRes('tools/bridgeUnit', (err, prefab) => {
            if (!err) {
                let node = cc.instantiate(prefab);
                node.setPosition(cc.v2(-25, 0));
                _this.node.addChild(node);
            }
        });
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
                this.node.x -= gameConfig.gameMoveSpeed
            }
        }
    }
});
