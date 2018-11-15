import GameDataManager from '../gameDataManager';
cc.Class({
    extends: cc.Component,
    properties: {
        guideText:[cc.Node],
        finger:cc.Node,
        circle:cc.Node,
    },
    onLoad(){
        this.fingerAni();
        this.init();
    },
    init(){
        for(var i=0;i<this.guideText.length;i++){
            this.guideText[i].active = false
        }
        switch(GameDataManager.toolChoose){
            case 0:
                this.guideText[0].active = true;
                break;
            case 1:
                this.guideText[1].active = true;
                break;
            case 2:
                this.guideText[2].active = true;
                break;
        }
    },
    start () {},
    fingerAni(){
        var hide = cc.fadeOut(1);
        var show = cc.fadeIn(1);
        var ani = cc.sequence(hide,show);
        var ani1 = cc.repeatForever(ani);
        this.finger.runAction(ani1);
    }
});
