import gameConfig from '../gameConfig';
cc.Class({
    extends: cc.Component,
    properties: {
        musicOn:cc.Node,
        musicOff:cc.Node,
        bgm: cc.AudioClip,
        isMusicOn:true
    },
    // 生命周期
    onLoad() {
        var _this = this;
        cc.loader.load('https://cdn.feilaib.top/img/sounds/bg.mp3', function(err, clip) {
            _this.bgm = clip;
            _this.musicInit();
        });
    },
    start() {

    },
    //音乐播放按钮切换
    musicBtnDispaly: function () {
        this.musicOff.active = !this.musicOff.active;
        this.musicOn.active = !this.musicOn.active;
    },
    musicInit: function () {
        var _this = this;
        this.musicOn = this.node.getChildByName('musicOn');
        this.musicOff = this.node.getChildByName('musicOff');
        if (gameConfig.isBgmPlay) {
            this.musicOff.active = false;
            cc.audioEngine.playMusic(this.bgm, true, 1);
        }
        else {
            this.musicOn.active = false;
        }
        this.musicOn.on('touchstart', function () {
            _this.musicBtnDispaly();
            gameConfig.isBgmPlay = false;
            cc.audioEngine.pauseMusic(_this.bgm, true, 1);
            gameConfig.isScreemCanTouch = false;
            setTimeout(function () {
                gameConfig.isScreemCanTouch = true;
            },300)
        });
        this.musicOff.on('touchstart', function () {
            _this.musicBtnDispaly();
            gameConfig.isBgmPlay = true;
            cc.audioEngine.resumeMusic(_this.bgm, true, 1);
            gameConfig.isScreemCanTouch = false;
            setTimeout(function () {
                gameConfig.isScreemCanTouch = true;
            },300)
        });
    }
});
