import Util from './utils/util' ;
import Animation from './utils/animation';
import GameUITools from './utils/GameUITools';
import gameConfig from './gameConfig' ;
import GameDataManager from './gameDataManager';
cc.Class({
    extends: cc.Component,
    properties: {
        sharkFin:cc.Node,
        sharkAni:cc.Node,
        sharkSwimSpeed:5,
        ani:null,
        isSharkSwim:true,
        canSharkJump:true,
    },
    init(game){
       this.game = game;
    },
    onLoad () {
        var _this = this;
        this.ani = this.sharkAni.getComponent(cc.Animation);
        this.openCollider();
        this.configInit();
        this.openSharkTimer();
    },
    gameInit(){
        this.openSharkTimer();
    },
    //开启碰撞检测
    openCollider(){
        cc.director.getCollisionManager().enabled = true;
        //cc.director.getCollisionManager().enabledDebugDraw = true;
        cc.director.getCollisionManager().enabledDrawBoundingBox = true;
    },
    //关闭碰撞检测
    closeCollider(){
        cc.director.getCollisionManager().enabled = false;
        //cc.director.getCollisionManager().enabledDebugDraw = false;
        cc.director.getCollisionManager().enabledDrawBoundingBox = false;
    },
    configInit(){
        this.sharkSwimSpeed = 5;
        this.isSharkSwim = true;
        this.sharkFin.width = 200;
        this.sharkFin.active = true;
        this.sharkAni.active = false;
    },
    //开启鲨鱼跳跃定时
    openSharkTimer(){
        this.schedule(this.sharkJump,gameConfig.sharkJumpDurTime);
    },
    sharkJump:function(){
        var _this = this;
        if(!GameDataManager.isGameOver){
            this.ani.setCurrentTime(0)
            this.ani.play();
            this.isSharkSwim = false;
            this.sharkFin.active = false;
            this.sharkAni.active = true;
            this.sharkAni.x = this.sharkFin.x;
            var start = cc.callFunc(function () {
                _this.openCollider();
            });
            var jumpUp = cc.moveTo(1,cc.v2(this.sharkAni.x,200)).easing(cc.easeIn(3));
            var closeCollider = cc.callFunc(function () {
                _this.closeCollider();
            });
            var turnAround = cc.jumpTo(0.8,cc.v2(this.sharkAni.x-400,200),100,1)
            var jumpDown = cc.moveTo(1,cc.v2(this.sharkAni.x-400,-500));
            var finish = cc.callFunc(function () {
                _this.configInit();
                _this.sharkFin.x = _this.sharkAni.x;
            });
            var ani = cc.sequence(start,jumpUp,closeCollider,turnAround,jumpDown,finish);
            this.sharkAni.runAction(ani);
        }
        if(GameDataManager.isGameOver){
            this.unschedule(this.sharkJump);
        }
    },
    start () {},
    update (dt) {
        if(this.isSharkSwim){
            this.sharkFin.x -= this.sharkSwimSpeed;
            if(this.sharkFin.x < -500){
                this.sharkFin.x = 500
            }
        }
    },
});
