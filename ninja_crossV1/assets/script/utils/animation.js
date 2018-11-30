import GameDataManager from '../gameDataManager';
var Animation = {
    //道具转动动画
    toolRotateAni(isSuccess,node,callback){
        if(isSuccess){
            var r = cc.rotateBy(0.7, 90).easing(cc.easeIn(1));
            var finish = cc.callFunc(function () {
                GameDataManager.isMove = true
            })
            var ani = cc.sequence(r,finish)
            node.runAction(ani);
        }
        else{
            var time = cc.delayTime(0.7);
            var r = cc.rotateBy(1.4, 180).easing(cc.easeIn(1));
            var down = cc.moveTo(2, cc.v2(node.x,-10000)).easing(cc.easeIn(2.5));
            var finish = cc.callFunc(function () {
                    GameDataManager.canDrop = true
            })
            var down1 = cc.sequence(time,finish,down)
            var ani = cc.spawn(r,down1)
            node.runAction(ani);
        }
    },
    //得分特效
    scoreFx(node,x1,y1,x2,y2,timer){
        node.setPosition(cc.v2(x1,y1));
        node.opacity = 255;
        var fadeOut = cc.fadeOut(timer);
        var moveTop = cc.moveTo(timer,cc.v2(x2,y2));
        var ani = cc.spawn(fadeOut,moveTop);
        node.runAction(ani);
    }
}
export default Animation