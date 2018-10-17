import gameConfig from './gameConfig';
import GameDataManager from './gameDataManager';
cc.Class({
    extends: cc.Component,
    properties: {

    },
    onLoad () {
    },
    start() {
        this.node.opacity = 0
    },
    /**
     * 显示烟雾
     * @param fogX 烟雾坐标x
     * @param fogY 烟雾坐标y
     */
    showFog(fogX,fogY){
        this.node.opacity = 0;
        this.node.setPosition(cc.v2(fogX,fogY));
        var fadeIn = cc.fadeIn(0.5);
        this.node.runAction(fadeIn);
        GameDataManager.isShowFog = true;
    },
    hideFog(){
        var fadeOut = cc.fadeOut(1);
        this.node.runAction(fadeOut);
        this.node.opacity = 0;
        GameDataManager.isShowFog = false;
    },
    update (dt) {
        if(GameDataManager.isMove){
            this.node.x -= gameConfig.gameMoveSpeed
        }
    },
});
