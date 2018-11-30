import GameDataManager from './gameDataManager';
import Animation from './utils/animation';
cc.Class({
    extends: cc.Component,
    properties: {
        greenAdd:cc.Node,
        redAdd:cc.Node,
        yellowAdd:cc.Node,
        good:cc.Node,
        great:cc.Node,
        prefect:cc.Node
    },
    onLoad () {
        this.init();
    },
    init(){
        var childrens = this.node.children
        for(var i = 0;i<childrens.length;i++){
            childrens[i].opacity = 0;
        }
    },
    start () {},
    showScoreFx(){
        var _this = this
        switch(GameDataManager.addScoreGrade){
            case 1:
                var score = _this.redAdd.getComponent(cc.Label);
                score.string = '+'+GameDataManager.nextScore;
                Animation.scoreFx( this.good,0,0,0,300,1);
                Animation.scoreFx( this.redAdd,-210,-100,-210,0,1);
                break
            case 2:
                var score = this.greenAdd.getComponent(cc.Label);
                score.string = '+'+GameDataManager.nextScore;
                Animation.scoreFx( this.great,0,0,0,300,1);
                Animation.scoreFx( this.greenAdd,-210,-100,-210,0,1);
                break
            case 3:
                var score = this.yellowAdd.getComponent(cc.Label);
                score.string = '+'+GameDataManager.nextScore;
                Animation.scoreFx( this.prefect,0,0,0,300,1);
                Animation.scoreFx( this.yellowAdd,-210,-100,-210,0,1);
                break
        }
    }
});
