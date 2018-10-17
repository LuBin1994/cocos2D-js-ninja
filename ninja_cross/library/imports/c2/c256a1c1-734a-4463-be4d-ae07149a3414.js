"use strict";
cc._RF.push(module, 'c256aHBc0pEY75NrgcUmjQU', 'shark');
// script/shark.js

'use strict';

var _util = require('./utils/util');

var _util2 = _interopRequireDefault(_util);

var _animation = require('./utils/animation');

var _animation2 = _interopRequireDefault(_animation);

var _GameUITools = require('./utils/GameUITools');

var _GameUITools2 = _interopRequireDefault(_GameUITools);

var _gameConfig = require('./gameConfig');

var _gameConfig2 = _interopRequireDefault(_gameConfig);

var _gameDataManager = require('./gameDataManager');

var _gameDataManager2 = _interopRequireDefault(_gameDataManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

cc.Class({
    extends: cc.Component,
    properties: {
        sharkFin: cc.Node,
        sharkAni: cc.Node,
        sharkSwimSpeed: 5,
        ani: null,
        isSharkSwim: true,
        canSharkJump: true
    },
    init: function init(game) {
        this.game = game;
    },
    onLoad: function onLoad() {
        var _this = this;
        this.ani = this.sharkAni.getComponent(cc.Animation);
        this.openCollider();
        this.configInit();
        this.openSharkTimer();
    },
    gameInit: function gameInit() {
        this.openSharkTimer();
    },

    //开启碰撞检测
    openCollider: function openCollider() {
        cc.director.getCollisionManager().enabled = true;
        //cc.director.getCollisionManager().enabledDebugDraw = true;
        cc.director.getCollisionManager().enabledDrawBoundingBox = true;
    },

    //关闭碰撞检测
    closeCollider: function closeCollider() {
        cc.director.getCollisionManager().enabled = false;
        //cc.director.getCollisionManager().enabledDebugDraw = false;
        cc.director.getCollisionManager().enabledDrawBoundingBox = false;
    },
    configInit: function configInit() {
        this.sharkSwimSpeed = 5;
        this.isSharkSwim = true;
        this.sharkFin.width = 200;
        this.sharkFin.active = true;
        this.sharkAni.active = false;
    },

    //开启鲨鱼跳跃定时
    openSharkTimer: function openSharkTimer() {
        this.schedule(this.sharkJump, _gameConfig2.default.sharkJumpDurTime);
    },

    sharkJump: function sharkJump() {
        var _this = this;
        if (!_gameDataManager2.default.isGameOver) {
            this.ani.setCurrentTime(0);
            this.ani.play();
            this.isSharkSwim = false;
            this.sharkFin.active = false;
            this.sharkAni.active = true;
            this.sharkAni.x = this.sharkFin.x;
            var start = cc.callFunc(function () {
                _this.openCollider();
            });
            var jumpUp = cc.moveTo(1, cc.v2(this.sharkAni.x, 200)).easing(cc.easeIn(3));
            var closeCollider = cc.callFunc(function () {
                _this.closeCollider();
            });
            var turnAround = cc.jumpTo(0.8, cc.v2(this.sharkAni.x - 400, 200), 100, 1);
            var jumpDown = cc.moveTo(1, cc.v2(this.sharkAni.x - 400, -500));
            var finish = cc.callFunc(function () {
                _this.configInit();
                _this.sharkFin.x = _this.sharkAni.x;
            });
            var ani = cc.sequence(start, jumpUp, closeCollider, turnAround, jumpDown, finish);
            this.sharkAni.runAction(ani);
        }
        if (_gameDataManager2.default.isGameOver) {
            this.unschedule(this.sharkJump);
        }
    },
    start: function start() {},
    update: function update(dt) {
        if (this.isSharkSwim) {
            this.sharkFin.x -= this.sharkSwimSpeed;
            if (this.sharkFin.x < -500) {
                this.sharkFin.x = 500;
            }
        }
    }
});

cc._RF.pop();