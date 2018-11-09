"use strict";
cc._RF.push(module, '2c155jeNwZDDbH6onjL9xfT', 'media');
// script/panel/media.js

'use strict';

var _gameConfig = require('../gameConfig');

var _gameConfig2 = _interopRequireDefault(_gameConfig);

var _gameDataManager = require('../gameDataManager');

var _gameDataManager2 = _interopRequireDefault(_gameDataManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

cc.Class({
    extends: cc.Component,
    properties: {
        musicOn: cc.Node,
        musicOff: cc.Node,
        bgm: cc.AudioClip,
        isMusicOn: true
    },
    // 生命周期
    onLoad: function onLoad() {
        var _this = this;
        cc.loader.load('https://cdn.feilaib.top/img/sounds/bg.mp3', function (err, clip) {
            _this.bgm = clip;
            _this.musicInit();
        });
    },
    start: function start() {},

    musicBtnDispaly: function musicBtnDispaly() {
        this.musicOff.active = !this.musicOff.active;
        this.musicOn.active = !this.musicOn.active;
    },
    musicInit: function musicInit() {
        var _this = this;
        if (_gameDataManager2.default.canSoundPlay) {
            this.musicOff.active = false;
            cc.audioEngine.playMusic(this.bgm, true, 1);
        } else {
            this.musicOn.active = false;
        }
        this.musicOn.on('touchstart', function () {
            _this.musicBtnDispaly();
            _gameDataManager2.default.canSoundPlay = !_gameDataManager2.default.canSoundPlay;
            cc.audioEngine.pauseMusic(_this.bgm, true, 1);
            _gameConfig2.default.isScreemCanTouch = false;
            setTimeout(function () {
                _gameConfig2.default.isScreemCanTouch = true;
            }, 300);
        });
        this.musicOff.on('touchstart', function () {
            _this.musicBtnDispaly();
            _gameDataManager2.default.canSoundPlay = !_gameDataManager2.default.canSoundPlay;
            cc.audioEngine.resumeMusic(_this.bgm, true, 1);
            _gameConfig2.default.isScreemCanTouch = false;
            setTimeout(function () {
                _gameConfig2.default.isScreemCanTouch = true;
            }, 300);
        });
    }
});

cc._RF.pop();