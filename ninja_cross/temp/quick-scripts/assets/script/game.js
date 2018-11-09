(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/game.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '1df98/AWT1MP7cbPP0zZBMT', 'game', __filename);
// script/game.js

'use strict';

var _util = require('./utils/util');

var _util2 = _interopRequireDefault(_util);

var _animation = require('./utils/animation');

var _animation2 = _interopRequireDefault(_animation);

var _GameUITools = require('./utils/GameUITools');

var _GameUITools2 = _interopRequireDefault(_GameUITools);

var _GameConfig = require('./GameConfig');

var _GameConfig2 = _interopRequireDefault(_GameConfig);

var _gameDataManager = require('./gameDataManager');

var _gameDataManager2 = _interopRequireDefault(_gameDataManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Player = require('player');
var Stage = require('stage');
var GameBg = require('gameBg');
var Stick = require('stick');
var GameOver = require('GameOver');
var ScoreAni = require('scoreAni');
var Bridge = require('bridge');
var Fog = require('fog');
var Energy = require('energy');
var Shark = require('shark');
cc.Class({
    extends: cc.Component,
    properties: {
        player: Player,
        stage: Stage,
        gameBg: GameBg,
        stick: Stick,
        bridge: Bridge,
        fog: Fog,
        gameOver: GameOver,
        scoreAni: ScoreAni,
        energy: Energy,
        scoreDisplay: cc.Label,
        scoreGroup: cc.Node,
        gameOverSound: cc.AudioClip,
        shark: Shark
    },
    onLoad: function onLoad() {
        this.gameBg.init(this);
        this.stage.init(this);
        this.gameOver.init(this);
        this.energy.init(this);
        this.shark.init(this);
        this.player.init(this);
        this.init();
        this.configInit();
        this.node.opacity = 0;
        this.node.runAction(cc.fadeIn(0.5));
        _util2.default.gameStartDataInit();
    },

    init: function init() {
        var _this = this;
        _GameUITools2.default.loadingLayer("panel/music");
        if (_GameConfig2.default.IS_WX) {
            _GameUITools2.default.loadingLayer("panel/userInfo");
        }
        this.node.on('touchstart', function () {
            if (_GameConfig2.default.isScreemCanTouch && !_gameDataManager2.default.isAnimate) {
                _this.gameTouchStartProcessing();
            }
        });
        this.node.on('touchend', function () {
            if (_GameConfig2.default.isScreemCanTouch) {
                if (_gameDataManager2.default.isStartLengthen) {
                    _this.gameTouchEndProcessing();
                }
            }
        });
        //游戏开始获取id
        if (_GameConfig2.default.IS_WX) {
            var modelChoose = parseInt(_gameDataManager2.default.toolChoose) + 1;
            //游戏开始获取gameId
            wx.request({
                url: _GameConfig2.default.INTER_URL + "game/start",
                data: {
                    'model': modelChoose
                },
                header: {
                    'content-type': 'application/x-www-form-urlencoded',
                    'Cookie': "SESSION=" + wx.getStorageSync('sessionId')
                },
                method: "POST",
                success: function success(res) {
                    console.log('游戏开始获取gameId返回值：', res.data);
                    if (res.data.status == 1) {
                        _gameDataManager2.default.gameId = res.data.data;
                    } else {
                        _util2.default.gameLog(res.data.info);
                    }
                },
                error: function error() {
                    _util2.default.gameLog("game/start接口调用失败");
                }
            });
        }
    },
    configInit: function configInit() {
        this.canShowGameOver = true;
    },
    //游戏复活
    continueGame: function continueGame() {
        this.stage.setStagePosX();
        this.stage.showStage();
        switch (_gameDataManager2.default.toolChoose) {
            case 0:
                this.stick.gameInit();
                break;
            case 1:
                this.bridge.gameInit();
                break;
            case 2:
                break;
        }
        this.stick.node.x = this.stage.currentPlat.x + this.stage.currentPlat.width / 2;
        this.player.gameInit();
        this.shark.gameInit();
        this.setTool();
        _util2.default.gameContinueDataInit();
        this.configInit();
        this.scoreDisplay.string = _gameDataManager2.default.totalScore;
        if (_GameConfig2.default.canResurrectTime == 0) {
            this.gameOver.advBtn.active = false;
        }
        if (_gameDataManager2.default.toolChoose == 2) {
            this.energy.gameInit();
        }
        this.scoreGroup.opacity = 255;
    },
    //重开游戏
    reStartGame: function reStartGame() {
        _GameUITools2.default.loadingScene("game");
    },
    /**
     * 游戏触摸开始数据处理
     */
    gameTouchStartProcessing: function gameTouchStartProcessing() {
        if (!_gameDataManager2.default.isAnimate) {
            _gameDataManager2.default.isLengthen = true;
            _gameDataManager2.default.isStartLengthen = true;
            switch (_gameDataManager2.default.toolChoose) {
                case 1:
                    this.bridge.buildBridge();
                    break;
                case 2:
                    this.player.readyToJump();
                    break;
            }
        }
    },

    /**
     * 游戏触摸结束数据处理
     */
    gameTouchEndProcessing: function gameTouchEndProcessing() {
        _gameDataManager2.default.isLengthen = false;
        if (!_gameDataManager2.default.isAnimate) {
            var length = this.getToolLength();
            if (_gameDataManager2.default.toolChoose <= 1) {
                _gameDataManager2.default.moveDistance = Math.floor(this.stage.currentPlat.x - this.player.node.x + length + this.stage.currentPlat.width / 2);
            } else {
                var distance = Math.floor(this.energy.energy.height / 300 * 600);
                _gameDataManager2.default.moveDistance = Math.floor(this.stage.currentPlat.x - this.player.node.x + distance + this.stage.currentPlat.width / 2);
            }
            this.successOrlose(length);
            if (_gameDataManager2.default.isShowFog) {
                this.fog.hideFog();
            }
            _gameDataManager2.default.isAnimate = true;
        }
    },

    /**
     * 计算道具是否能完成过桥
     */
    successOrlose: function successOrlose(length) {
        var _this = this;
        var lengthObj = this.stage.getLength();
        //判断搭桥是否成功
        if (lengthObj.min <= length && length <= lengthObj.max) {
            _util2.default.culculateScore(this.stage.nextPlat, length, lengthObj.min);
            _gameDataManager2.default.isSuccess = true;
        } else {
            _gameDataManager2.default.isSuccess = false;
        }

        //道具执行动画
        if (!_gameDataManager2.default.isGameOver) {
            switch (_gameDataManager2.default.toolChoose) {
                case 0:
                    //棍子执行动画
                    _animation2.default.toolRotateAni(_gameDataManager2.default.isSuccess, this.stick.node);
                    setTimeout(function () {
                        _this.player.run();
                    }, 700);
                    break;
                case 1:
                    //桥执行动画
                    _animation2.default.toolRotateAni(_gameDataManager2.default.isSuccess, this.bridge.node);
                    setTimeout(function () {
                        _this.player.run();
                    }, 700);
                    break;
                case 2:
                    //跳跃执行动画
                    if (_gameDataManager2.default.isSuccess) {
                        this.player.successJump(_gameDataManager2.default.moveDistance, _this.player.jumpHeight);
                    } else {
                        this.player.failJump(_gameDataManager2.default.moveDistance, _this.player.jumpHeight);
                    }
                    break;
            }
        }
    },
    /**
     * 控制所有节点的移动
     */
    allMove: function allMove(callbacks) {
        _gameDataManager2.default.move += _GameConfig2.default.gameMoveSpeed;
        if (_gameDataManager2.default.move > _gameDataManager2.default.moveDistance) {
            callbacks && callbacks(); //移动完执行
        }
    },
    /**
     * 获取道具长度
     */
    getToolLength: function getToolLength() {
        switch (_gameDataManager2.default.toolChoose) {
            case 0:
                return this.stick.node.height;
                break;
            case 1:
                return this.bridge.bridgeY;
                break;
            case 2:
                return Math.floor(this.energy.energy.height / 300 * 600);
                break;
        }
    },
    /**
     * 设置道具
     */
    setTool: function setTool() {
        switch (_gameDataManager2.default.toolChoose) {
            case 0:
                this.stick.setStick(this.stage.currentPlat.x + this.stage.currentPlat.width / 2);
                break;
            case 1:
                this.bridge.setBridge(this.stage.currentPlat.x + this.stage.currentPlat.width / 2);
                break;
            case 2:
                this.player.stop();
                break;
        }
    },
    //得分
    gainScore: function gainScore() {
        _gameDataManager2.default.totalScore += _gameDataManager2.default.nextScore;
        this.scoreDisplay.string = _gameDataManager2.default.totalScore;
    },
    /**
     * 游戏结束显示
     */
    showGameOver: function showGameOver() {
        var _this = this;
        if (this.canShowGameOver) {
            _gameDataManager2.default.isGameOver = true;
            this.gameOver.showScore();
            if (_gameDataManager2.default.canSoundPlay) {
                cc.audioEngine.playEffect(_this.gameOverSound, false, 1);
            }
            this.scheduleOnce(function () {
                switch (_gameDataManager2.default.toolChoose) {
                    case 0:
                        this.stick.node.opacity = 0;
                        break;
                    case 1:
                        this.bridge.node.opacity = 0;
                        break;
                    case 2:
                        this.energy.node.opacity = 0;
                        break;
                }
                this.scoreGroup.opacity = 0;
                this.gameOver.node.active = true;
                this.stage.hideStage();
            }, 1.5);
            this.fog.hideFog();
            if (_GameConfig2.default.canResurrectTime == 0) {
                this.gameOver.advBtn.active = false;
                this.gameOver.navigateBtn.active = true;
                //this.gameOver.btnGroup.y = -270;
            } else {
                this.gameOver.advBtn.active = true;
                this.gameOver.navigateBtn.active = false;
                //this.gameOver.btnGroup.y = -390;
            }
        }
        this.canShowGameOver = false;
    },
    update: function update(dt) {
        var _this = this;
        if (_gameDataManager2.default.isAnimate) {
            //所有对象移动，以及移动完的回调
            if (_gameDataManager2.default.isMove) {
                if (_gameDataManager2.default.isSuccess) {
                    this.allMove(function () {
                        if (_gameDataManager2.default.isSuccess) {
                            _gameDataManager2.default.isMove = false;
                            _gameDataManager2.default.isAnimate = false;
                            _gameDataManager2.default.move = 0;
                            _this.stage.createStage();
                            _this.stage.recycleStage();
                            if (_gameDataManager2.default.toolChoose !== 2) {
                                _this.gainScore();
                                _this.scoreAni.showScoreFx();
                            }
                            _this.setTool();
                            _this.player.stop();
                            if (_gameDataManager2.default.toolChoose == 2) {
                                _this.energy.configInit();
                            }
                            _gameDataManager2.default.isStartLengthen = false;
                        }
                    });
                }
            }
            //人物掉落动画
            if (!_gameDataManager2.default.isSuccess) {
                if (_gameDataManager2.default.canDrop) {
                    var moveDistance = this.stage.currentPlat.x - this.player.node.x + this.stage.currentPlat.width / 2;
                    this.player.drop(moveDistance);
                    this.showGameOver();
                    _gameDataManager2.default.canDrop = false;
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
        //# sourceMappingURL=game.js.map
        