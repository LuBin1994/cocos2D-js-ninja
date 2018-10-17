import gameConfig from './gameConfig';
import GameDataManager from './gameDataManager';
cc.Class({
    extends: cc.Component,
    properties: {
        stickLength: 70,//棍子初始长度
        canLengthen: false,//棍子是否变长
        startLengthen:false,//棍子是否开始变长
    },
    onLoad(){
        this.configInit();
        this.node.active = false;
    },
    //初始化
    configInit(){
        this.node.height = gameConfig.stickLength;
        this.node.rotation = 0;
    },
    gameInit(){
        this.node.opacity = 255;
        this.node.height = gameConfig.stickLength;
        this.node.rotation = 0;
    },
    //棍子变长
    lengthen(canLengthen) {//参数:是否变长
        if(canLengthen){
            this.node.height += gameConfig.stickLengthSpeed;
        }
    },
    setStick(x){
        this.node.active = true;
        this.node.setPosition(cc.v2(x,-305));
        this.configInit();
    },
    update(dt){
        this.lengthen(GameDataManager.isLengthen);
        if(GameDataManager.isMove){
               this.node.x -= gameConfig.gameMoveSpeed
        }
    },
});

