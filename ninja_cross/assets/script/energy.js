import GameDataManager from './gameDataManager';
cc.Class({
    extends: cc.Component,
    properties: {
        energy:cc.Node,
        caliUp:cc.Node,
        caliDown:cc.Node,
        energySpeed:5,
    },
    onLoad(){},
    init(game){
        this.game = game;
        this.hideCali();
    },
    configInit(){
        this.energy.height = 0;
        this.energySpeed = 5;
        this.node.opacity = 255;
    },
    gameInit(){
        this.energy.height = 0;
        this.energySpeed = 5;
        this.node.opacity = 255;
        this.setCali();
    },
    //设置能量条刻度
    setCali(){
        var lengthObj = this.game.stage.getLength();
        var downY = Math.floor(lengthObj.min/600*300);
        var upY = Math.floor(lengthObj.max/600*300);
        this.caliUp.y = -147+upY;
        this.caliDown.y = -147+downY;
    },
    showCali(){
        this.node.active = true;
    },
    hideCali(){
        this.node.active = false;
    },
    update(){
        if(GameDataManager.toolChoose == 2){
            if(GameDataManager.isLengthen){
                this.energy.height += this.energySpeed;
                if(this.energy.height == 300 || this.energy.height == 0){
                    this.energySpeed *= -1
                }
            }
        }
    }
});
