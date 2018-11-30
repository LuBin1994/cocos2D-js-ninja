(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/player.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '92761P8JflM+LTiWgKZjbFt', 'player', __filename);
// script/player.js

'use strict';

var _gameConfig = require('./gameConfig');

var _gameConfig2 = _interopRequireDefault(_gameConfig);

var _GameDataManager = require('./GameDataManager');

var _GameDataManager2 = _interopRequireDefault(_GameDataManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

cc.Class({
    extends: cc.Component,
    properties: {
        anim: null,
        jumpHeight: 300
    },
    onLoad: function onLoad() {
        this.anim = this.node.getComponent(cc.Animation);
        this.stop();
        this.configInit();
    },

    //忍者与鲨鱼碰撞后执行事件
    onCollisionEnter: function onCollisionEnter(other) {
        var currentWidth = this.game.stage.currentPlat.width;
        var currentX = this.game.stage.currentPlat.x;
        var nextWidth = this.game.stage.nextPlat.width;
        var nextX = this.game.stage.nextPlat.x;
        if (currentX - currentWidth / 2 < this.node.x && this.node.x < currentX + currentWidth / 2) {
            console.log('位于当前站桩范围内');
        } else if (nextX - nextWidth / 2 < this.node.x && this.node.x < nextX + nextWidth / 2) {
            console.log('位于下一站桩范围内');
        } else {
            _GameDataManager2.default.isSuccess = false;
            _GameDataManager2.default.isMove = false;
            _GameDataManager2.default.isGameOver = true;
            this.game.showGameOver();
            this.node.stopAllActions();
            switch (_GameDataManager2.default.toolChoose) {
                case 0:
                    this.game.stick.node.stopAllActions();
                    break;
                case 1:
                    this.game.bridge.node.stopAllActions();
                    break;
            }

            this.fall();
        }
    },

    configInit: function configInit() {
        this.node.x = -210;
        this.node.y = -295;
    },
    init: function init(game) {
        this.game = game;
    },
    gameInit: function gameInit() {
        this.configInit();
        this.stop();
    },
    //奔跑
    run: function run() {
        if (!_GameDataManager2.default.isGameOver) {
            var animState = this.anim.play('playerRun');
            animState.repeatCount = Infinity;
        }
    },
    //停下
    stop: function stop() {
        var animState = this.anim.play('playerStand');
        animState.repeatCount = 1;
    },
    //搭桥失败跑动坠落
    drop: function drop(distance) {
        var _this = this;
        var time = (distance / 200).toFixed(1);
        var runOver = cc.moveTo(time, cc.v2(-210 + distance, -295));
        var finishRun = cc.callFunc(function () {
            var animState = _this.anim.play('playerFall');
            animState.repeatCount = 1;
        });
        var fall = cc.moveTo(1, cc.v2(-210 + distance, -1000)).easing(cc.easeIn(2.5));
        var ani = cc.sequence(runOver, finishRun, fall);
        this.node.runAction(ani);
    },
    //
    fall: function fall() {
        var animState = this.anim.play('playerFall');
        animState.repeatCount = 1;
        var fall = cc.moveTo(0.5, cc.v2(this.node.x, -1000)).easing(cc.easeIn(1));
        this.node.runAction(fall);
    },

    //成功跳跃
    successJump: function successJump(distance, jumpHeight) {
        var _this = this;
        this.anim.play('playerJump');
        var jump = cc.jumpTo(1, cc.v2(-210 + distance, -295), jumpHeight, 1);
        var finish = cc.callFunc(function () {
            if (_GameDataManager2.default.isSuccess) {
                _this.stop();
                _GameDataManager2.default.isMove = true;
                _this.game.gainScore();
                _this.game.scoreAni.showScoreFx();
            }
        });
        var ani = cc.sequence(jump, finish);
        this.node.runAction(ani);
    },

    //失败跳跃
    failJump: function failJump(distance, jumpHeight) {
        var _this = this;
        this.anim.play('playerJump');
        var jump = cc.jumpTo(1, cc.v2(-210 + distance, -295), jumpHeight, 1);
        var fninsh1 = cc.callFunc(function () {
            _this.anim.play('playerFall');
            _this.game.showGameOver();
        });
        var fall = cc.moveTo(1, cc.v2(-210 + distance, -1000)).easing(cc.easeIn(2));
        var ani = cc.sequence(jump, fninsh1, fall);
        this.node.runAction(ani);
    },
    readyToJump: function readyToJump() {
        this.anim.play('playerReadyJump');
    },
    update: function update(dt) {
        if (_GameDataManager2.default.toolChoose == 2) {
            if (_GameDataManager2.default.isSuccess) {
                if (_GameDataManager2.default.isMove) {
                    this.node.x -= _gameConfig2.default.gameMoveSpeed;
                }
            }
        }
    }
});

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=player.js.map
        