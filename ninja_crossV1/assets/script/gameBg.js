import GameConfig from './gameConfig';
import GameDataManager from './gameDataManager';
cc.Class({
    extends: cc.Component,
    properties: {
        far_bg: [cc.Node]
    },
    onLoad () {},
    start () {},
    init:function(game){
        this.game = game;
    },
    bgMove: function (bgList, speed) {
        for (var index = 0; index < bgList.length; index++) {
            var element = bgList[index];
            element.x -= speed;
        }
    },
    //检查是否要重置位置
    checkBgReset: function (bgList) {
        var first_xMax = bgList[0].getBoundingBox().xMax;
        if (first_xMax <= -375) {
            var preFirstBg = bgList.shift();
            bgList.push(preFirstBg);
            var curFirstBg = bgList[0];
            preFirstBg.x = 1625;
        }
    },
    update (dt) {
        if(GameDataManager.isMove){
            this.bgMove(this.far_bg, GameConfig.gameBgMoveSpeed);
            this.checkBgReset(this.far_bg);
        }
    },
});