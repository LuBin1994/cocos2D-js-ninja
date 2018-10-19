window.__require = function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var b = o.split("/");
        b = b[b.length - 1];
        if (!t[b]) {
          var a = "function" == typeof __require && __require;
          if (!u && a) return a(b, !0);
          if (i) return i(b, !0);
          throw new Error("Cannot find module '" + o + "'");
        }
      }
      var f = n[o] = {
        exports: {}
      };
      t[o][0].call(f.exports, function(e) {
        var n = t[o][1][e];
        return s(n || e);
      }, f, f.exports, e, t, n, r);
    }
    return n[o].exports;
  }
  var i = "function" == typeof __require && __require;
  for (var o = 0; o < r.length; o++) s(r[o]);
  return s;
}({
  GameOver: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "fd43bXqTxNI1qhSd3lYvTSr", "GameOver");
    "use strict";
    var _util = require("./utils/util");
    var _util2 = _interopRequireDefault(_util);
    var _GameUITools = require("./utils/GameUITools");
    var _GameUITools2 = _interopRequireDefault(_GameUITools);
    var _gameConfig = require("./gameConfig");
    var _gameConfig2 = _interopRequireDefault(_gameConfig);
    var _GameDataManager = require("./GameDataManager");
    var _GameDataManager2 = _interopRequireDefault(_GameDataManager);
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    cc.Class({
      extends: cc.Component,
      properties: {
        playAgainBtn: cc.Node,
        advBtn: cc.Node,
        goBackHomeBtn: cc.Node,
        rankBtn: cc.Node,
        btnSound: cc.AudioClip,
        bestScore: cc.Label,
        nowScore: cc.Label,
        btnGroup: cc.Node,
        showOffbtn: cc.Node
      },
      onLoad: function onLoad() {
        var _this = this;
        cc.loader.loadRes("panel/subCanvas", function(err, prefab) {
          if (!err) {
            var node = cc.instantiate(prefab);
            _this.node.addChild(node);
          }
        });
        _util2.default.btnEvent(this.playAgainBtn, this.btnSound, function() {
          _gameConfig2.default.canResurrectTime = 1;
          _this.advBtn.active = true;
          _this.game.reStartGame();
          _this.node.active = false;
        });
        _util2.default.btnEvent(this.goBackHomeBtn, this.btnSound, function() {
          _GameUITools2.default.loadingScene("start");
          _gameConfig2.default.canResurrectTime = 1;
        });
        _util2.default.btnEvent(this.rankBtn, this.btnSound, function() {
          _GameUITools2.default.loadingLayer("panel/rank");
        });
        _util2.default.btnEvent(this.advBtn, this.btnSound, function() {
          _gameConfig2.default.canResurrectTime -= 1;
          _this.game.continueGame();
          _this.node.active = false;
        });
        _util2.default.btnEvent(this.showOffbtn, this.btnSound, function() {
          if (_gameConfig2.default.IS_WX) switch (_GameDataManager2.default.toolChoose) {
           case 0:
            wx.shareAppMessage({
              title: "@\u4f60,\u5feb\u6765\u8d85\u8d8a\u6211\u5427",
              imageUrl: "https://st.gwold.com/wfclb/ninja/pic/stickmode.png"
            });
            break;

           case 1:
            wx.shareAppMessage({
              title: "@\u4f60,\u5feb\u6765\u8d85\u8d8a\u6211\u5427",
              imageUrl: "https://st.gwold.com/wfclb/ninja/pic/bridgemode.png"
            });
            break;

           case 2:
            wx.shareAppMessage({
              title: "@\u4f60,\u5feb\u6765\u8d85\u8d8a\u6211\u5427",
              imageUrl: "https://st.gwold.com/wfclb/ninja/pic/jumpmode.jpg"
            });
          }
        });
      },
      init: function init(game) {
        this.game = game;
      },
      showScore: function showScore() {
        if (localStorage.getItem("score")) {
          var score = localStorage.getItem("score");
          this.nowScore.string = "\u672c\u6b21\u5206\u503c: " + _GameDataManager2.default.totalScore;
          if (_GameDataManager2.default.totalScore > score) {
            this.bestScore.string = "\u5386\u53f2\u6700\u4f73: " + score;
            localStorage.setItem("score", _GameDataManager2.default.totalScore);
          } else this.bestScore.string = "\u5386\u53f2\u6700\u4f73: " + score;
        } else {
          this.nowScore.string = "\u672c\u6b21\u5206\u503c: " + _GameDataManager2.default.totalScore;
          this.bestScore.string = "\u5386\u53f2\u6700\u4f73: " + _GameDataManager2.default.totalScore;
          localStorage.setItem("score", _GameDataManager2.default.totalScore);
        }
        var gameScore = _GameDataManager2.default.totalScore;
        if (_gameConfig2.default.IS_WX) {
          wx.postMessage({
            messageType: 1,
            score: gameScore,
            MAIN_MENU_NUM: _gameConfig2.default.MAIN_MENU_NUM
          });
          wx.postMessage({
            messageType: 3,
            MAIN_MENU_NUM: _gameConfig2.default.MAIN_MENU_NUM
          });
        }
      }
    });
    cc._RF.pop();
  }, {
    "./GameDataManager": "gameDataManager",
    "./gameConfig": "gameConfig",
    "./utils/GameUITools": "GameUITools",
    "./utils/util": "util"
  } ],
  GameUITools: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "965b9tfL3BFaJsoNPKIlaNl", "GameUITools");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var _gameDatamanager = require("../gameDatamanager");
    var _gameDatamanager2 = _interopRequireDefault(_gameDatamanager);
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    var GameUITools = {
      loadingScene: function loadingScene(sceneName) {
        cc.director.preloadScene(sceneName, function() {
          cc.director.loadScene(sceneName);
        });
      },
      loadingLayer: function loadingLayer(panelName) {
        cc.loader.loadRes(panelName, function(err, prefab) {
          if (!err) {
            var node = cc.instantiate(prefab);
            cc.director.getScene().children[0].addChild(node);
          }
        });
      },
      unLoadingLayer: function unLoadingLayer(node) {
        cc.director.getScene().children[0].removeChild(node);
      }
    };
    exports.default = GameUITools;
    module.exports = exports["default"];
    cc._RF.pop();
  }, {
    "../gameDatamanager": "gameDataManager"
  } ],
  animation: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "34b5eoz/UhOp4hyKtM4ktBT", "animation");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var _gameDataManager = require("../gameDataManager");
    var _gameDataManager2 = _interopRequireDefault(_gameDataManager);
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    var Animation = {
      toolRotateAni: function toolRotateAni(isSuccess, node, callback) {
        if (isSuccess) {
          var r = cc.rotateBy(.7, 90).easing(cc.easeIn(1));
          var finish = cc.callFunc(function() {
            _gameDataManager2.default.isMove = true;
          });
          var ani = cc.sequence(r, finish);
          node.runAction(ani);
        } else {
          var time = cc.delayTime(.7);
          var r = cc.rotateBy(1.4, 180).easing(cc.easeIn(1));
          var down = cc.moveTo(2, cc.v2(node.x, -1e4)).easing(cc.easeIn(2.5));
          var finish = cc.callFunc(function() {
            _gameDataManager2.default.canDrop = true;
          });
          var down1 = cc.sequence(time, finish, down);
          var ani = cc.spawn(r, down1);
          node.runAction(ani);
        }
      },
      scoreFx: function scoreFx(node, x1, y1, x2, y2, timer) {
        node.setPosition(cc.v2(x1, y1));
        node.opacity = 255;
        var fadeOut = cc.fadeOut(timer);
        var moveTop = cc.moveTo(timer, cc.v2(x2, y2));
        var ani = cc.spawn(fadeOut, moveTop);
        node.runAction(ani);
      }
    };
    exports.default = Animation;
    module.exports = exports["default"];
    cc._RF.pop();
  }, {
    "../gameDataManager": "gameDataManager"
  } ],
  bridge: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "ab2925nPNhKQ7LzANX24OIQ", "bridge");
    "use strict";
    var _gameConfig = require("./gameConfig");
    var _gameConfig2 = _interopRequireDefault(_gameConfig);
    var _gameDataManager = require("./gameDataManager");
    var _gameDataManager2 = _interopRequireDefault(_gameDataManager);
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    cc.Class({
      extends: cc.Component,
      properties: {
        bridgeY: 90,
        timer: 0
      },
      onLoad: function onLoad() {
        this.node.active = false;
      },
      start: function start() {},
      configInit: function configInit() {
        this.node.rotation = 0;
      },
      gameInit: function gameInit() {
        this.node.rotation = 0;
        this.node.opacity = 255;
      },
      buildBridge: function buildBridge() {
        var _this = this;
        cc.loader.loadRes("tools/bridgeUnit", function(err, prefab) {
          if (!err) {
            var node = cc.instantiate(prefab);
            node.setPosition(cc.v2(-25, _this.bridgeY));
            _this.node.addChild(node);
            _this.bridgeY += 90;
          }
        });
      },
      reSetBridge: function reSetBridge() {
        var _this = this;
        this.timer = 0;
        this.bridgeY = 90;
        this.node.removeAllChildren(true);
        cc.loader.loadRes("tools/bridgeUnit", function(err, prefab) {
          if (!err) {
            var node = cc.instantiate(prefab);
            node.setPosition(cc.v2(-25, 0));
            _this.node.addChild(node);
          }
        });
      },
      setBridge: function setBridge(x) {
        this.reSetBridge();
        this.node.setPosition(cc.v2(x, -305));
        this.configInit();
      },
      update: function update(dt) {
        if (!_gameDataManager2.default.isGameOver) {
          if (_gameDataManager2.default.isLengthen) {
            this.timer++;
            this.timer % 30 == 0 && this.buildBridge();
          }
          _gameDataManager2.default.isMove && (this.node.x -= _gameConfig2.default.gameMoveSpeed);
        }
      }
    });
    cc._RF.pop();
  }, {
    "./gameConfig": "gameConfig",
    "./gameDataManager": "gameDataManager"
  } ],
  energy: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "c43999w48VE4btSEyWz28vL", "energy");
    "use strict";
    var _gameDataManager = require("./gameDataManager");
    var _gameDataManager2 = _interopRequireDefault(_gameDataManager);
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    cc.Class({
      extends: cc.Component,
      properties: {
        energy: cc.Node,
        caliUp: cc.Node,
        caliDown: cc.Node,
        energySpeed: 5
      },
      onLoad: function onLoad() {
        this.hideCali();
      },
      init: function init(game) {
        this.game = game;
      },
      configInit: function configInit() {
        this.energy.height = 0;
        this.energySpeed = 5;
        this.node.opacity = 255;
      },
      gameInit: function gameInit() {
        this.energy.height = 0;
        this.energySpeed = 5;
        this.node.opacity = 255;
        this.setCali();
      },
      setCali: function setCali() {
        var lengthObj = this.game.stage.getLength();
        var downY = Math.floor(lengthObj.min / 600 * 300);
        var upY = Math.floor(lengthObj.max / 600 * 300);
        this.caliUp.y = -147 + upY;
        this.caliDown.y = -147 + downY;
      },
      showCali: function showCali() {
        this.node.active = true;
      },
      hideCali: function hideCali() {
        this.node.active = false;
      },
      update: function update() {
        if (2 == _gameDataManager2.default.toolChoose && _gameDataManager2.default.isLengthen) {
          this.energy.height += this.energySpeed;
          300 != this.energy.height && 0 != this.energy.height || (this.energySpeed *= -1);
        }
      }
    });
    cc._RF.pop();
  }, {
    "./gameDataManager": "gameDataManager"
  } ],
  fog: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "e7e49tNaqVEI746VGh7yTu0", "fog");
    "use strict";
    var _gameConfig = require("./gameConfig");
    var _gameConfig2 = _interopRequireDefault(_gameConfig);
    var _gameDataManager = require("./gameDataManager");
    var _gameDataManager2 = _interopRequireDefault(_gameDataManager);
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    cc.Class({
      extends: cc.Component,
      properties: {},
      onLoad: function onLoad() {},
      start: function start() {
        this.node.opacity = 0;
      },
      showFog: function showFog(fogX, fogY) {
        this.node.opacity = 0;
        this.node.setPosition(cc.v2(fogX, fogY));
        var fadeIn = cc.fadeIn(.5);
        this.node.runAction(fadeIn);
        _gameDataManager2.default.isShowFog = true;
      },
      hideFog: function hideFog() {
        var fadeOut = cc.fadeOut(1);
        this.node.runAction(fadeOut);
        this.node.opacity = 0;
        _gameDataManager2.default.isShowFog = false;
      },
      update: function update(dt) {
        _gameDataManager2.default.isMove && (this.node.x -= _gameConfig2.default.gameMoveSpeed);
      }
    });
    cc._RF.pop();
  }, {
    "./gameConfig": "gameConfig",
    "./gameDataManager": "gameDataManager"
  } ],
  gameBg: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "3e816A1145CLLmyJsAk6IJD", "gameBg");
    "use strict";
    var _gameConfig = require("./gameConfig");
    var _gameConfig2 = _interopRequireDefault(_gameConfig);
    var _gameDataManager = require("./gameDataManager");
    var _gameDataManager2 = _interopRequireDefault(_gameDataManager);
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    cc.Class({
      extends: cc.Component,
      properties: {
        far_bg: [ cc.Node ]
      },
      onLoad: function onLoad() {},
      start: function start() {},
      init: function init(game) {
        this.game = game;
      },
      bgMove: function bgMove(bgList, speed) {
        for (var index = 0; index < bgList.length; index++) {
          var element = bgList[index];
          element.x -= speed;
        }
      },
      checkBgReset: function checkBgReset(bgList) {
        var first_xMax = bgList[0].getBoundingBox().xMax;
        if (first_xMax <= -375) {
          var preFirstBg = bgList.shift();
          bgList.push(preFirstBg);
          var curFirstBg = bgList[0];
          preFirstBg.x = 1625;
        }
      },
      update: function update(dt) {
        if (_gameDataManager2.default.isMove) {
          this.bgMove(this.far_bg, _gameConfig2.default.gameBgMoveSpeed);
          this.checkBgReset(this.far_bg);
        }
      }
    });
    cc._RF.pop();
  }, {
    "./gameConfig": "gameConfig",
    "./gameDataManager": "gameDataManager"
  } ],
  gameConfig: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "bae414A/XVASpQcak5z2DC3", "gameConfig");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var GameConfig = {
      isBgmPlay: true,
      isScreemCanTouch: true,
      gameBgMoveSpeed: 1,
      gameMoveSpeed: 8,
      stickLength: 0,
      stickLengthSpeed: 5,
      minMultiProbability: .2,
      MaxMultiProbability: .5,
      canResurrectTime: 1,
      sharkJumpDurTime: 30,
      MAIN_MENU_NUM: "ninja_crossing",
      IS_WX: true,
      INTER_URL: "http://192.168.1.156:30000/",
      LOG_URL: "http://log-ninja.iwckj.com/",
      IS_AUTHORIZE: false,
      auths_Btn: null,
      IS_AUTHS_OPE: false,
      nickName: null,
      avatarUrl: null,
      code: null
    };
    exports.default = GameConfig;
    module.exports = exports["default"];
    cc._RF.pop();
  }, {} ],
  gameDataManager: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "4f8f5gTdfJOlIY0uP1DWkdf", "gameDataManager");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var GameDataManager = {
      totalScore: 0,
      nextScore: 0,
      addScoreGrade: 1,
      isMove: false,
      isSuccess: false,
      canDrop: false,
      move: 0,
      moveDistance: 0,
      isAnimate: false,
      isShowFog: false,
      isGameOver: false,
      isLengthen: false,
      isStartLengthen: false,
      toolChoose: 0,
      gameId: 0
    };
    exports.default = GameDataManager;
    module.exports = exports["default"];
    cc._RF.pop();
  }, {} ],
  game: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "1df98/AWT1MP7cbPP0zZBMT", "game");
    "use strict";
    var _util = require("./utils/util");
    var _util2 = _interopRequireDefault(_util);
    var _animation = require("./utils/animation");
    var _animation2 = _interopRequireDefault(_animation);
    var _GameUITools = require("./utils/GameUITools");
    var _GameUITools2 = _interopRequireDefault(_GameUITools);
    var _gameConfig = require("./gameConfig");
    var _gameConfig2 = _interopRequireDefault(_gameConfig);
    var _gameDataManager = require("./gameDataManager");
    var _gameDataManager2 = _interopRequireDefault(_gameDataManager);
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    var Player = require("player");
    var Stage = require("stage");
    var GameBg = require("gameBg");
    var Stick = require("stick");
    var GameOver = require("GameOver");
    var ScoreAni = require("scoreAni");
    var Bridge = require("bridge");
    var Fog = require("fog");
    var Energy = require("energy");
    var Shark = require("shark");
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
        _util2.default.gameStartDataInit();
        this.init();
        this.configInit();
        this.node.opacity = 0;
        this.node.runAction(cc.fadeIn(.5));
      },
      init: function init() {
        var _this = this;
        _GameUITools2.default.loadingLayer("panel/music");
        _gameConfig2.default.IS_WX && _GameUITools2.default.loadingLayer("panel/userInfo");
        this.node.on("touchstart", function() {
          _gameConfig2.default.isScreemCanTouch && !_gameDataManager2.default.isAnimate && _this.gameTouchStartProcessing();
        });
        this.node.on("touchend", function() {
          _gameConfig2.default.isScreemCanTouch && _gameDataManager2.default.isStartLengthen && _this.gameTouchEndProcessing();
        });
      },
      configInit: function configInit() {
        this.canShowGameOver = true;
      },
      continueGame: function continueGame() {
        this.stage.showStage();
        switch (_gameDataManager2.default.toolChoose) {
         case 0:
          this.stick.gameInit();
          break;

         case 1:
          this.bridge.gameInit();
        }
        this.stick.node.x = this.stage.currentPlat.x + this.stage.currentPlat.width / 2;
        this.player.gameInit();
        this.shark.gameInit();
        this.setTool();
        _util2.default.gameContinueDataInit();
        this.configInit();
        this.scoreDisplay.string = _gameDataManager2.default.totalScore;
        0 == _gameConfig2.default.canResurrectTime && (this.gameOver.advBtn.active = false);
        2 == _gameDataManager2.default.toolChoose && this.energy.gameInit();
        this.scoreGroup.opacity = 255;
      },
      reStartGame: function reStartGame() {
        _GameUITools2.default.loadingScene("game");
        GameConfig.IS_WX && wx.request({
          url: GameConfig.INTER_URL + "/game/start",
          method: "post",
          datatype: "json",
          success: function success(res) {
            if (1 == res.status) {
              console.log(res);
              _gameDataManager2.default.gameId = res.data.gameId;
            } else switch (res.code) {
             case 1006:
              console.log("\u64cd\u4f5c\u5931\u8d25");
            }
          },
          error: function error() {
            console.log("\u8fde\u63a5\u9519\u8bef");
          }
        });
      },
      gameTouchStartProcessing: function gameTouchStartProcessing() {
        if (!_gameDataManager2.default.isAnimate) {
          _gameDataManager2.default.isLengthen = true;
          _gameDataManager2.default.isStartLengthen = true;
          1 == _gameDataManager2.default.toolChoose ? this.bridge.buildBridge() : 2 == _gameDataManager2.default.toolChoose && this.player.readyToJump();
        }
      },
      gameTouchEndProcessing: function gameTouchEndProcessing() {
        _gameDataManager2.default.isLengthen = false;
        if (!_gameDataManager2.default.isAnimate) {
          var length = this.getToolLength();
          if (_gameDataManager2.default.toolChoose <= 1) _gameDataManager2.default.moveDistance = Math.floor(this.stage.currentPlat.x - this.player.node.x + length + this.stage.currentPlat.width / 2); else {
            var distance = Math.floor(this.energy.energy.height / 300 * 600);
            _gameDataManager2.default.moveDistance = Math.floor(this.stage.currentPlat.x - this.player.node.x + distance + this.stage.currentPlat.width / 2);
          }
          this.successOrlose(length);
          _gameDataManager2.default.isShowFog && this.fog.hideFog();
          _gameDataManager2.default.isAnimate = true;
        }
      },
      successOrlose: function successOrlose(length) {
        var _this = this;
        var lengthObj = this.stage.getLength();
        if (lengthObj.min <= length && length <= lengthObj.max) {
          this.culculateScore(length, lengthObj.min);
          _gameDataManager2.default.isSuccess = true;
        } else _gameDataManager2.default.isSuccess = false;
        if (!_gameDataManager2.default.isGameOver) switch (_gameDataManager2.default.toolChoose) {
         case 0:
          _animation2.default.toolRotateAni(_gameDataManager2.default.isSuccess, this.stick.node);
          setTimeout(function() {
            _this.player.run();
          }, 700);
          break;

         case 1:
          _animation2.default.toolRotateAni(_gameDataManager2.default.isSuccess, this.bridge.node);
          setTimeout(function() {
            _this.player.run();
          }, 700);
          break;

         case 2:
          _gameDataManager2.default.isSuccess ? this.player.successJump(_gameDataManager2.default.moveDistance, _this.player.jumpHeight) : this.player.failJump(_gameDataManager2.default.moveDistance, _this.player.jumpHeight);
        }
      },
      culculateScore: function culculateScore(toolLength, distance) {
        var scoreInterval;
        var num = parseInt(this.stage.nextPlat.name.replace(/[^0-9]/gi, ""));
        var centerDistance = Math.floor(Math.abs(toolLength - (distance + this.stage.nextPlat.width / 2)));
        if (num <= 3) {
          scoreInterval = Math.floor(this.stage.nextPlat.width / 9);
          if (0 <= centerDistance && centerDistance <= .5 * scoreInterval) {
            _gameDataManager2.default.nextScore = 5;
            _gameDataManager2.default.addScoreGrade = 3;
          } else if (.5 * scoreInterval < centerDistance && centerDistance <= 1.5 * scoreInterval) {
            _gameDataManager2.default.nextScore = 4;
            _gameDataManager2.default.addScoreGrade = 2;
          } else if (1.5 * scoreInterval < centerDistance && centerDistance <= 2.5 * scoreInterval) {
            _gameDataManager2.default.nextScore = 3;
            _gameDataManager2.default.addScoreGrade = 2;
          } else if (2.5 * scoreInterval < centerDistance && centerDistance <= 3.5 * scoreInterval) {
            _gameDataManager2.default.nextScore = 2;
            _gameDataManager2.default.addScoreGrade = 1;
          } else if (3.5 * scoreInterval < centerDistance && centerDistance <= 4.5 * scoreInterval) {
            _gameDataManager2.default.nextScore = 1;
            _gameDataManager2.default.addScoreGrade = 1;
          }
        } else switch (num) {
         case 4:
          scoreInterval = Math.floor(this.stage.nextPlat.width / 7);
          if (0 < centerDistance && centerDistance <= .5 * scoreInterval) {
            _gameDataManager2.default.nextScore = 6;
            _gameDataManager2.default.addScoreGrade = 3;
          } else if (.5 * scoreInterval < centerDistance && centerDistance <= 1.5 * scoreInterval) {
            _gameDataManager2.default.nextScore = 5;
            _gameDataManager2.default.addScoreGrade = 2;
          } else if (1.5 * scoreInterval < centerDistance && centerDistance <= 2.5 * scoreInterval) {
            _gameDataManager2.default.nextScore = 3;
            _gameDataManager2.default.addScoreGrade = 2;
          } else if (2.5 * scoreInterval < centerDistance && centerDistance <= 3.5 * scoreInterval) {
            _gameDataManager2.default.nextScore = 1;
            _gameDataManager2.default.addScoreGrade = 1;
          }
          break;

         case 5:
          scoreInterval = Math.floor(this.stage.nextPlat.width / 5);
          if (0 < centerDistance && centerDistance <= .5 * scoreInterval) {
            _gameDataManager2.default.nextScore = 7;
            _gameDataManager2.default.addScoreGrade = 3;
          } else if (.5 * scoreInterval < centerDistance && centerDistance <= 1.5 * scoreInterval) {
            _gameDataManager2.default.nextScore = 4;
            _gameDataManager2.default.addScoreGrade = 2;
          } else if (1.5 * scoreInterval < centerDistance && centerDistance <= 2.5 * scoreInterval) {
            _gameDataManager2.default.nextScore = 2;
            _gameDataManager2.default.addScoreGrade = 1;
          }
          break;

         case 6:
          scoreInterval = Math.floor(this.stage.nextPlat.width / 3);
          if (0 < centerDistance && centerDistance <= .5 * scoreInterval) {
            _gameDataManager2.default.nextScore = 8;
            _gameDataManager2.default.addScoreGrade = 3;
          } else if (.5 * scoreInterval < centerDistance && centerDistance <= 1.5 * scoreInterval) {
            _gameDataManager2.default.nextScore = 4;
            _gameDataManager2.default.addScoreGrade = 2;
          }
        }
      },
      allMove: function allMove(callbacks) {
        _gameDataManager2.default.move += _gameConfig2.default.gameMoveSpeed;
        _gameDataManager2.default.move > _gameDataManager2.default.moveDistance && callbacks && callbacks();
      },
      getToolLength: function getToolLength() {
        if (0 == _gameDataManager2.default.toolChoose) return this.stick.node.height;
        if (1 == _gameDataManager2.default.toolChoose) return this.bridge.bridgeY;
        if (2 == _gameDataManager2.default.toolChoose) return Math.floor(this.energy.energy.height / 300 * 600);
      },
      setTool: function setTool() {
        0 == _gameDataManager2.default.toolChoose ? this.stick.setStick(this.stage.currentPlat.x + this.stage.currentPlat.width / 2) : 1 == _gameDataManager2.default.toolChoose ? this.bridge.setBridge(this.stage.currentPlat.x + this.stage.currentPlat.width / 2) : 2 == _gameDataManager2.default.toolChoose && this.player.stop();
      },
      gainScore: function gainScore() {
        _gameDataManager2.default.totalScore += _gameDataManager2.default.nextScore;
        this.scoreDisplay.string = _gameDataManager2.default.totalScore;
      },
      showGameOver: function showGameOver() {
        var _this = this;
        if (this.canShowGameOver) {
          _gameDataManager2.default.isGameOver = true;
          this.gameOver.showScore();
          cc.audioEngine.playEffect(_this.gameOverSound, false, 1);
          this.scheduleOnce(function() {
            switch (_gameDataManager2.default.toolChoose) {
             case 0:
              this.stick.node.opacity = 0;
              break;

             case 1:
              this.bridge.node.opacity = 0;
              break;

             case 2:
              this.energy.node.opacity = 0;
            }
            this.scoreGroup.opacity = 0;
            this.gameOver.node.active = true;
            this.stage.hideStage();
          }, 1.5);
          this.fog.hideFog();
          0 == _gameConfig2.default.canResurrectTime ? this.gameOver.btnGroup.y = -270 : this.gameOver.btnGroup.y = -390;
        }
        this.canShowGameOver = false;
      },
      update: function update(dt) {
        var _this = this;
        if (_gameDataManager2.default.isAnimate) {
          _gameDataManager2.default.isMove && _gameDataManager2.default.isSuccess && this.allMove(function() {
            if (_gameDataManager2.default.isSuccess) {
              _gameDataManager2.default.isMove = false;
              _gameDataManager2.default.isAnimate = false;
              _gameDataManager2.default.move = 0;
              _this.stage.createStage();
              _this.stage.recycleStage();
              if (2 !== _gameDataManager2.default.toolChoose) {
                _this.gainScore();
                _this.scoreAni.showScoreFx();
              }
              _this.setTool();
              _this.player.stop();
              2 == _gameDataManager2.default.toolChoose && _this.energy.configInit();
              _gameDataManager2.default.isStartLengthen = false;
            }
          });
          if (!_gameDataManager2.default.isSuccess && _gameDataManager2.default.canDrop) {
            var moveDistance = this.stage.currentPlat.x - this.player.node.x + this.stage.currentPlat.width / 2;
            this.player.drop(moveDistance);
            this.showGameOver();
            _gameDataManager2.default.canDrop = false;
          }
        }
      }
    });
    cc._RF.pop();
  }, {
    "./gameConfig": "gameConfig",
    "./gameDataManager": "gameDataManager",
    "./utils/GameUITools": "GameUITools",
    "./utils/animation": "animation",
    "./utils/util": "util",
    GameOver: "GameOver",
    bridge: "bridge",
    energy: "energy",
    fog: "fog",
    gameBg: "gameBg",
    player: "player",
    scoreAni: "scoreAni",
    shark: "shark",
    stage: "stage",
    stick: "stick"
  } ],
  media: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "2c155jeNwZDDbH6onjL9xfT", "media");
    "use strict";
    var _gameConfig = require("../gameConfig");
    var _gameConfig2 = _interopRequireDefault(_gameConfig);
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    cc.Class({
      extends: cc.Component,
      properties: {
        musicOn: cc.Node,
        musicOff: cc.Node,
        bgm: cc.AudioClip,
        isMusicOn: true
      },
      onLoad: function onLoad() {
        var _this = this;
        cc.loader.load("https://cdn.feilaib.top/img/sounds/bg.mp3", function(err, clip) {
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
        this.musicOn = this.node.getChildByName("musicOn");
        this.musicOff = this.node.getChildByName("musicOff");
        if (_gameConfig2.default.isBgmPlay) {
          this.musicOff.active = false;
          cc.audioEngine.playMusic(this.bgm, true, 1);
        } else this.musicOn.active = false;
        this.musicOn.on("touchstart", function() {
          _this.musicBtnDispaly();
          _gameConfig2.default.isBgmPlay = false;
          cc.audioEngine.pauseMusic(_this.bgm, true, 1);
          _gameConfig2.default.isScreemCanTouch = false;
          setTimeout(function() {
            _gameConfig2.default.isScreemCanTouch = true;
          }, 300);
        });
        this.musicOff.on("touchstart", function() {
          _this.musicBtnDispaly();
          _gameConfig2.default.isBgmPlay = true;
          cc.audioEngine.resumeMusic(_this.bgm, true, 1);
          _gameConfig2.default.isScreemCanTouch = false;
          setTimeout(function() {
            _gameConfig2.default.isScreemCanTouch = true;
          }, 300);
        });
      }
    });
    cc._RF.pop();
  }, {
    "../gameConfig": "gameConfig"
  } ],
  modeChoose: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "381e0h7o6JIt5IKsu6FA8Up", "modeChoose");
    "use strict";
    var _util = require("../utils/util");
    var _util2 = _interopRequireDefault(_util);
    var _GameUITools = require("../utils/GameUITools");
    var _GameUITools2 = _interopRequireDefault(_GameUITools);
    var _gameDataManager = require("../gameDataManager");
    var _gameDataManager2 = _interopRequireDefault(_gameDataManager);
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    cc.Class({
      extends: cc.Component,
      properties: {
        stickMode: cc.Node,
        bridgeMode: cc.Node,
        jumpMode: cc.Node,
        modeChooseShow: [ cc.Node ],
        btnSound: {
          default: null,
          type: cc.AudioClip
        }
      },
      onLoad: function onLoad() {
        this.init();
        this.showChoose();
      },
      init: function init() {
        var _this = this;
        _util2.default.modeBtnEvent(this.stickMode, this.btnSound, function() {
          _gameDataManager2.default.toolChoose = 0;
          _GameUITools2.default.unLoadingLayer(_this.node);
          _this.showChoose();
        });
        _util2.default.modeBtnEvent(this.bridgeMode, this.btnSound, function() {
          _gameDataManager2.default.toolChoose = 1;
          _GameUITools2.default.unLoadingLayer(_this.node);
          _this.showChoose();
        });
        _util2.default.modeBtnEvent(this.jumpMode, this.btnSound, function() {
          _gameDataManager2.default.toolChoose = 2;
          _GameUITools2.default.unLoadingLayer(_this.node);
          _this.showChoose();
        });
      },
      showChoose: function showChoose() {
        for (var i = 0; i < 3; i++) this.modeChooseShow[i].active = false;
        this.modeChooseShow[_gameDataManager2.default.toolChoose].active = true;
      },
      start: function start() {},
      update: function update(dt) {}
    });
    cc._RF.pop();
  }, {
    "../gameDataManager": "gameDataManager",
    "../utils/GameUITools": "GameUITools",
    "../utils/util": "util"
  } ],
  player: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "92761P8JflM+LTiWgKZjbFt", "player");
    "use strict";
    var _gameConfig = require("./gameConfig");
    var _gameConfig2 = _interopRequireDefault(_gameConfig);
    var _GameDataManager = require("./GameDataManager");
    var _GameDataManager2 = _interopRequireDefault(_GameDataManager);
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
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
      onCollisionEnter: function onCollisionEnter(other) {
        _GameDataManager2.default.isSuccess = false;
        _GameDataManager2.default.isMove = false;
        _GameDataManager2.default.isGameOver = true;
        this.game.showGameOver();
        this.node.stopAllActions();
        this.game.stick.node.stopAllActions();
        this.game.bridge.node.stopAllActions();
        this.fall();
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
      run: function run() {
        var animState = this.anim.play("playerRun");
        animState.repeatCount = Infinity;
      },
      stop: function stop() {
        var animState = this.anim.play("playerStand");
        animState.repeatCount = 1;
      },
      drop: function drop(distance) {
        var _this = this;
        var runOver = cc.moveTo(.5, cc.v2(-210 + distance, -295));
        var finishRun = cc.callFunc(function() {
          var animState = _this.anim.play("playerFall");
          animState.repeatCount = 1;
        });
        var fall = cc.moveTo(1, cc.v2(-210 + distance, -1e3)).easing(cc.easeIn(2.5));
        var ani = cc.sequence(runOver, finishRun, fall);
        this.node.runAction(ani);
      },
      fall: function fall() {
        var animState = this.anim.play("playerFall");
        animState.repeatCount = 1;
        var fall = cc.moveTo(1, cc.v2(this.node.x, -1e3)).easing(cc.easeIn(2.5));
        this.node.runAction(fall);
      },
      successJump: function successJump(distance, jumpHeight) {
        var _this = this;
        this.anim.play("playerJump");
        var jump = cc.jumpTo(1, cc.v2(-210 + distance, -295), jumpHeight, 1);
        var finish = cc.callFunc(function() {
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
      failJump: function failJump(distance, jumpHeight) {
        var _this = this;
        this.anim.play("playerJump");
        var jump = cc.jumpTo(1, cc.v2(-210 + distance, -295), jumpHeight, 1);
        var fninsh1 = cc.callFunc(function() {
          _this.anim.play("playerFall");
          _this.game.showGameOver();
        });
        var fall = cc.moveTo(1.5, cc.v2(-210 + distance, -1e3)).easing(cc.easeIn(2));
        var ani = cc.sequence(jump, fninsh1, fall);
        this.node.runAction(ani);
      },
      readyToJump: function readyToJump() {
        this.anim.play("playerReadyJump");
      },
      update: function update(dt) {
        2 == _GameDataManager2.default.toolChoose && _GameDataManager2.default.isSuccess && _GameDataManager2.default.isMove && (this.node.x -= _gameConfig2.default.gameMoveSpeed);
      }
    });
    cc._RF.pop();
  }, {
    "./GameDataManager": "gameDataManager",
    "./gameConfig": "gameConfig"
  } ],
  rank: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "ea993OaclZFSYRp26rCz1XM", "rank");
    "use strict";
    var _util = require("../utils/util");
    var _util2 = _interopRequireDefault(_util);
    var _GameUITools = require("../utils/GameUITools");
    var _GameUITools2 = _interopRequireDefault(_GameUITools);
    var _gameConfig = require("../gameConfig");
    var _gameConfig2 = _interopRequireDefault(_gameConfig);
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    cc.Class({
      extends: cc.Component,
      properties: {
        subCanvas: cc.Node,
        closeBtn: cc.Node,
        btnSound: {
          default: null,
          type: cc.AudioClip
        }
      },
      onLoad: function onLoad() {
        this.init();
      },
      init: function init() {
        var _this = this;
        cc.loader.loadRes("panel/subCanvas", function(err, prefab) {
          if (!err) {
            var node = cc.instantiate(prefab);
            _this.node.addChild(node);
          }
        });
        if (_gameConfig2.default.IS_WX) {
          true;
          this.tex = new cc.Texture2D();
          window.sharedCanvas.width = 750;
          window.sharedCanvas.height = 1206;
          wx.postMessage({
            messageType: 2,
            MAIN_MENU_NUM: _gameConfig2.default.MAIN_MENU_NUM
          });
        }
        this.node.on("touchstart", function(e) {
          e.stopPropagation();
        });
        _util2.default.btnEvent(this.closeBtn, this.btnSound, function() {
          _gameConfig2.default.IS_WX && wx.postMessage({
            messageType: 3,
            MAIN_MENU_NUM: _gameConfig2.default.MAIN_MENU_NUM
          });
          _GameUITools2.default.unLoadingLayer(_this.node);
        });
      },
      start: function start() {
        this.tex = new cc.Texture2D();
      },
      _updateSubDomainCanvas: function _updateSubDomainCanvas() {
        if (!this.tex) return;
        var openDataContext = wx.getOpenDataContext();
        var sharedCanvas = openDataContext.canvas;
        this.tex.initWithElement(sharedCanvas);
        this.tex.handleLoadedTexture();
        this.subCanvas = new cc.SpriteFrame(this.tex);
      },
      update: function update() {
        _gameConfig2.default.IS_WX && this._updateSubDomainCanvas();
      }
    });
    cc._RF.pop();
  }, {
    "../gameConfig": "gameConfig",
    "../utils/GameUITools": "GameUITools",
    "../utils/util": "util"
  } ],
  rule: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "d2830UZLJtPYp+FyYc33J4H", "rule");
    "use strict";
    var _util = require("../utils/util");
    var _util2 = _interopRequireDefault(_util);
    var _GameUITools = require("../utils/GameUITools");
    var _GameUITools2 = _interopRequireDefault(_GameUITools);
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    cc.Class({
      extends: cc.Component,
      properties: {
        rules: cc.Node,
        ruleCloseBtn: cc.Node,
        btnSound: {
          default: null,
          type: cc.AudioClip
        }
      },
      onLoad: function onLoad() {
        this.init();
      },
      init: function init() {
        var _this = this;
        _util2.default.btnEvent(this.ruleCloseBtn, this.btnSound, function() {
          _GameUITools2.default.unLoadingLayer(_this.node);
        });
        this.node.on("touchstart", function(e) {
          e.stopPropagation();
        });
      }
    });
    cc._RF.pop();
  }, {
    "../utils/GameUITools": "GameUITools",
    "../utils/util": "util"
  } ],
  scoreAni: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "8c32ftISiRC+7K7hY8Ua0mA", "scoreAni");
    "use strict";
    var _gameDataManager = require("./gameDataManager");
    var _gameDataManager2 = _interopRequireDefault(_gameDataManager);
    var _animation = require("./utils/animation");
    var _animation2 = _interopRequireDefault(_animation);
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    cc.Class({
      extends: cc.Component,
      properties: {
        greenAdd: cc.Node,
        redAdd: cc.Node,
        yellowAdd: cc.Node,
        good: cc.Node,
        great: cc.Node,
        prefect: cc.Node
      },
      onLoad: function onLoad() {
        this.init();
      },
      init: function init() {
        var childrens = this.node.children;
        for (var i = 0; i < childrens.length; i++) childrens[i].opacity = 0;
      },
      start: function start() {},
      showScoreFx: function showScoreFx() {
        var _this = this;
        switch (_gameDataManager2.default.addScoreGrade) {
         case 1:
          var score = _this.redAdd.getComponent(cc.Label);
          score.string = "+" + _gameDataManager2.default.nextScore;
          _animation2.default.scoreFx(this.good, 0, 0, 0, 300, 1);
          _animation2.default.scoreFx(this.redAdd, -210, -100, -210, 0, 1);
          break;

         case 2:
          var score = this.greenAdd.getComponent(cc.Label);
          score.string = "+" + _gameDataManager2.default.nextScore;
          _animation2.default.scoreFx(this.great, 0, 0, 0, 300, 1);
          _animation2.default.scoreFx(this.greenAdd, -210, -100, -210, 0, 1);
          break;

         case 3:
          var score = this.yellowAdd.getComponent(cc.Label);
          score.string = "+" + _gameDataManager2.default.nextScore;
          _animation2.default.scoreFx(this.prefect, 0, 0, 0, 300, 1);
          _animation2.default.scoreFx(this.yellowAdd, -210, -100, -210, 0, 1);
        }
      }
    });
    cc._RF.pop();
  }, {
    "./gameDataManager": "gameDataManager",
    "./utils/animation": "animation"
  } ],
  shark: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "c256aHBc0pEY75NrgcUmjQU", "shark");
    "use strict";
    var _util = require("./utils/util");
    var _util2 = _interopRequireDefault(_util);
    var _animation = require("./utils/animation");
    var _animation2 = _interopRequireDefault(_animation);
    var _GameUITools = require("./utils/GameUITools");
    var _GameUITools2 = _interopRequireDefault(_GameUITools);
    var _gameConfig = require("./gameConfig");
    var _gameConfig2 = _interopRequireDefault(_gameConfig);
    var _gameDataManager = require("./gameDataManager");
    var _gameDataManager2 = _interopRequireDefault(_gameDataManager);
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
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
      openCollider: function openCollider() {
        cc.director.getCollisionManager().enabled = true;
        cc.director.getCollisionManager().enabledDrawBoundingBox = true;
      },
      closeCollider: function closeCollider() {
        cc.director.getCollisionManager().enabled = false;
        cc.director.getCollisionManager().enabledDrawBoundingBox = false;
      },
      configInit: function configInit() {
        this.sharkSwimSpeed = 5;
        this.isSharkSwim = true;
        this.sharkFin.width = 200;
        this.sharkFin.active = true;
        this.sharkAni.active = false;
      },
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
          var start = cc.callFunc(function() {
            _this.openCollider();
          });
          var jumpUp = cc.moveTo(1, cc.v2(this.sharkAni.x, 200)).easing(cc.easeIn(3));
          var closeCollider = cc.callFunc(function() {
            _this.closeCollider();
          });
          var turnAround = cc.jumpTo(.8, cc.v2(this.sharkAni.x - 400, 200), 100, 1);
          var jumpDown = cc.moveTo(1, cc.v2(this.sharkAni.x - 400, -500));
          var finish = cc.callFunc(function() {
            _this.configInit();
            _this.sharkFin.x = _this.sharkAni.x;
          });
          var ani = cc.sequence(start, jumpUp, closeCollider, turnAround, jumpDown, finish);
          this.sharkAni.runAction(ani);
        }
        _gameDataManager2.default.isGameOver && this.unschedule(this.sharkJump);
      },
      start: function start() {},
      update: function update(dt) {
        if (this.isSharkSwim) {
          this.sharkFin.x -= this.sharkSwimSpeed;
          this.sharkFin.x < -500 && (this.sharkFin.x = 500);
        }
      }
    });
    cc._RF.pop();
  }, {
    "./gameConfig": "gameConfig",
    "./gameDataManager": "gameDataManager",
    "./utils/GameUITools": "GameUITools",
    "./utils/animation": "animation",
    "./utils/util": "util"
  } ],
  stage: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "d8730dAQ/NFJ4QaRBKUkkcH", "stage");
    "use strict";
    var _gameConfig = require("./gameConfig");
    var _gameConfig2 = _interopRequireDefault(_gameConfig);
    var _gameDataManager = require("./gameDataManager");
    var _gameDataManager2 = _interopRequireDefault(_gameDataManager);
    var _util = require("./utils/util");
    var _util2 = _interopRequireDefault(_util);
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    cc.Class({
      extends: cc.Component,
      properties: {
        stagePrefabs: [],
        doneStage: 0,
        canRecycle: false,
        currentPlat: {
          default: null,
          type: cc.node
        },
        nextPlat: {
          default: null,
          type: cc.node
        },
        nextTwoPlat: {
          default: null,
          type: cc.node
        }
      },
      onLoad: function onLoad() {
        var _this = this;
        this.configInit();
        this.stagePrefabInit(function() {
          _this.stageInit();
        });
      },
      init: function init(game) {
        this.game = game;
      },
      configInit: function configInit() {
        this.node.opacity = 255;
        this.canRecycle = false;
        this.doneStage = 0;
      },
      gameInit: function gameInit() {
        this.destroyAll();
        this.configInit();
        this.stageInit();
      },
      stagePrefabInit: function stagePrefabInit(callbacks) {
        var _this = this;
        for (var i = 0; i < 6; i++) cc.loader.loadRes("stage/stage" + (i + 1), function(err, prefab) {
          _this.stagePrefabs.push(prefab);
          6 == _this.stagePrefabs.length && callbacks && callbacks();
        });
      },
      stageInit: function stageInit() {
        var nextX, distance, centerDistance;
        this.currentPlat = cc.instantiate(this.stagePrefabs[_util2.default.randomNum(3)]);
        this.currentPlat.setPosition(cc.v2(-230, -295));
        this.currentPlat.parent = this.node;
        this.nextPlat = cc.instantiate(this.stagePrefabs[_util2.default.randomNum(3)]);
        distance = _util2.default.randomNum(250) + 100;
        centerDistance = distance + (this.currentPlat.width / 2 + this.nextPlat.width / 2);
        centerDistance -= centerDistance % _gameConfig2.default.gameMoveSpeed;
        nextX = this.currentPlat.x + centerDistance;
        this.nextPlat.setPosition(cc.v2(nextX, -295));
        this.nextPlat.parent = this.node;
        switch (_gameDataManager2.default.toolChoose) {
         case 0:
          this.game.stick.node.active = true;
          this.game.stick.setStick(this.currentPlat.x + this.currentPlat.width / 2);
          break;

         case 1:
          this.game.bridge.node.active = true;
          this.game.bridge.setBridge(this.currentPlat.x + this.currentPlat.width / 2);
          break;

         case 2:
          this.game.energy.showCali();
          this.game.energy.setCali();
        }
        this.nextTwoPlat = cc.instantiate(this.stagePrefabs[_util2.default.randomNum(3)]);
        distance = _util2.default.randomNum(250) + 100;
        centerDistance = distance + (this.nextPlat.width / 2 + this.nextTwoPlat.width / 2);
        centerDistance -= centerDistance % _gameConfig2.default.gameMoveSpeed;
        nextX = this.nextPlat.x + centerDistance;
        this.nextTwoPlat.setPosition(cc.v2(nextX, -295));
        this.nextTwoPlat.parent = this.node;
      },
      createStage: function createStage() {
        this.doneStage += 1;
        var num1 = _util2.default.randomNum(100);
        var num2 = 100 - Math.floor(this.doneStage / 2) - 100 * _gameConfig2.default.minMultiProbability;
        num2 < 100 * (1 - _gameConfig2.default.maxMultiProbability) && (num2 = 100 * (1 - _gameConfig2.default.maxMultiProbability));
        var chooseNum = _util2.default.randomNum(3);
        num1 < num2 ? this.setNextStage(chooseNum) : 1 == _gameDataManager2.default.toolChoose ? this.setNextStage(chooseNum + 2) : this.setNextStage(chooseNum + 3);
      },
      setNextStage: function setNextStage(num) {
        var stage, nextX, distance, centerDistance;
        this.currentPlat = this.nextPlat;
        this.nextPlat = this.nextTwoPlat;
        stage = cc.instantiate(this.stagePrefabs[num]);
        this.nextTwoPlat = stage;
        this.nextTwoPlat.parent = this.node;
        this.nextTwoPlat.opacity = 0;
        distance = _util2.default.randomNum(250) + 100;
        centerDistance = distance + (this.nextPlat.width / 2 + this.nextTwoPlat.width / 2);
        centerDistance -= centerDistance % _gameConfig2.default.gameMoveSpeed;
        nextX = this.nextPlat.x + centerDistance;
        this.nextTwoPlat.setPosition(cc.v2(nextX, -605));
        var moveY = cc.moveTo(1, cc.v2(nextX, -295));
        var fadeIn = cc.fadeIn(1);
        var ani = cc.spawn(moveY, fadeIn);
        this.nextTwoPlat.runAction(ani);
        2 !== _gameDataManager2.default.toolChoose && this.doneStage % 5 == 0 && this.game.fog.showFog(this.nextPlat.x, -295);
        2 == _gameDataManager2.default.toolChoose && this.game.energy.setCali();
      },
      recycleStage: function recycleStage() {
        this.node.removeChild(this.node.children[0]);
      },
      destroyAll: function destroyAll() {
        this.node.removeAllChildren(true);
      },
      getLength: function getLength() {
        var length = new Object();
        var minLength = Math.floor(this.nextPlat.x - this.currentPlat.x - (this.nextPlat.width + this.currentPlat.width) / 2);
        var maxLength = Math.floor(this.nextPlat.x - this.currentPlat.x + (this.nextPlat.width - this.currentPlat.width) / 2);
        length.min = minLength;
        length.max = maxLength;
        return length;
      },
      hideStage: function hideStage() {
        this.node.opacity = 0;
      },
      showStage: function showStage() {
        this.node.opacity = 255;
      },
      update: function update(dt) {
        if (_gameDataManager2.default.isMove) {
          var childrens = this.node.children;
          for (var i = 0; i < childrens.length; i++) childrens[i].x -= _gameConfig2.default.gameMoveSpeed;
        }
      }
    });
    cc._RF.pop();
  }, {
    "./gameConfig": "gameConfig",
    "./gameDataManager": "gameDataManager",
    "./utils/util": "util"
  } ],
  start: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "4a781FRknlLP6t2uRma8nOy", "start");
    "use strict";
    var _gameConfig = require("./gameConfig");
    var _gameConfig2 = _interopRequireDefault(_gameConfig);
    var _util = require("./utils/util");
    var _util2 = _interopRequireDefault(_util);
    var _GameUITools = require("./utils/GameUITools");
    var _GameUITools2 = _interopRequireDefault(_GameUITools);
    var _gameDataManager = require("./gameDataManager");
    var _gameDataManager2 = _interopRequireDefault(_gameDataManager);
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    cc.Class({
      extends: cc.Component,
      properties: {
        startBtn: cc.Node,
        ruleBtn: cc.Node,
        rankBtn: cc.Node,
        modeChooseBtn: cc.Node,
        btnSound: {
          default: null,
          type: cc.AudioClip
        }
      },
      onLoad: function onLoad() {
        this.init();
      },
      start: function start() {
        cc.director.preloadScene("game", function() {
          console.log("\u6e38\u620f\u573a\u666f\u5df2\u52a0\u8f7d");
        });
        this.tex = new cc.Texture2D();
      },
      init: function init() {
        var _this = this;
        _GameUITools2.default.loadingLayer("panel/music");
        _gameConfig2.default.IS_WX && _GameUITools2.default.loadingLayer("panel/userInfo");
        _util2.default.btnEvent(this.startBtn, this.btnSound, function() {
          _GameUITools2.default.loadingScene("game");
          _gameConfig2.default.IS_WX;
        });
        _util2.default.btnEvent(this.ruleBtn, this.btnSound, function() {
          _GameUITools2.default.loadingLayer("panel/rule");
        });
        _util2.default.btnEvent(this.rankBtn, this.btnSound, function() {
          _GameUITools2.default.loadingLayer("panel/rank");
        });
        _util2.default.btnEvent(this.modeChooseBtn, this.btnSound, function() {
          _GameUITools2.default.loadingLayer("panel/modeChoose");
        });
      }
    });
    cc._RF.pop();
  }, {
    "./gameConfig": "gameConfig",
    "./gameDataManager": "gameDataManager",
    "./utils/GameUITools": "GameUITools",
    "./utils/util": "util"
  } ],
  stick: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "fb940PcZihLlKcGU29ECPir", "stick");
    "use strict";
    var _gameConfig = require("./gameConfig");
    var _gameConfig2 = _interopRequireDefault(_gameConfig);
    var _gameDataManager = require("./gameDataManager");
    var _gameDataManager2 = _interopRequireDefault(_gameDataManager);
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    cc.Class({
      extends: cc.Component,
      properties: {
        stickLength: 70,
        canLengthen: false,
        startLengthen: false
      },
      onLoad: function onLoad() {
        this.configInit();
        this.node.active = false;
      },
      configInit: function configInit() {
        this.node.height = _gameConfig2.default.stickLength;
        this.node.rotation = 0;
      },
      gameInit: function gameInit() {
        this.node.opacity = 255;
        this.node.height = _gameConfig2.default.stickLength;
        this.node.rotation = 0;
      },
      lengthen: function lengthen(canLengthen) {
        canLengthen && (this.node.height += _gameConfig2.default.stickLengthSpeed);
      },
      setStick: function setStick(x) {
        this.node.active = true;
        this.node.setPosition(cc.v2(x, -305));
        this.configInit();
      },
      update: function update(dt) {
        this.lengthen(_gameDataManager2.default.isLengthen);
        _gameDataManager2.default.isMove && (this.node.x -= _gameConfig2.default.gameMoveSpeed);
      }
    });
    cc._RF.pop();
  }, {
    "./gameConfig": "gameConfig",
    "./gameDataManager": "gameDataManager"
  } ],
  subCanvas: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "9ea6cviF05Jj5GuSllDVB1D", "subCanvas");
    "use strict";
    var _gameConfig = require("../gameConfig");
    var _gameConfig2 = _interopRequireDefault(_gameConfig);
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    cc.Class({
      extends: cc.Component,
      properties: {},
      onload: function onload() {
        this.init();
      },
      init: function init() {
        var _this = this;
        if (_gameConfig2.default.IS_WX) {
          true;
          this.tex = new cc.Texture2D();
          window.sharedCanvas.width = 750;
          window.sharedCanvas.height = 1206;
        }
      },
      start: function start() {
        this.tex = new cc.Texture2D();
      },
      _updateSubDomainCanvas: function _updateSubDomainCanvas() {
        if (!this.tex) return;
        var openDataContext = wx.getOpenDataContext();
        var sharedCanvas = openDataContext.canvas;
        this.tex.initWithElement(sharedCanvas);
        this.tex.handleLoadedTexture();
        this.node = new cc.SpriteFrame(this.tex);
      },
      update: function update() {
        _gameConfig2.default.IS_WX && this._updateSubDomainCanvas();
      }
    });
    cc._RF.pop();
  }, {
    "../gameConfig": "gameConfig"
  } ],
  userInfo: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "cbf0bCBr4ZKN7+pR1Gx5PMo", "userInfo");
    "use strict";
    var _gameConfig = require("../gameConfig");
    var _gameConfig2 = _interopRequireDefault(_gameConfig);
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    cc.Class({
      extends: cc.Component,
      properties: {
        nickName: cc.Label,
        avatar: cc.Sprite
      },
      onLoad: function onLoad() {
        this.node.active = false;
        this.getUserInfoNew();
      },
      start: function start() {},
      getUserInfoNew: function getUserInfoNew() {
        var _this = this;
        if (false == _gameConfig2.default.IS_AUTHORIZE) wx.getSetting({
          success: function success(res) {
            if (res.authSetting["scope.userInfo"]) {
              _this.node.active = true;
              _gameConfig2.default.IS_AUTHORIZE = true;
              wx.login({
                success: function success(res) {
                  _gameConfig2.default.code = res.code;
                },
                fail: function fail() {
                  console.log("\u8c03\u7528\u63a5\u53e3\u5931\u8d25");
                }
              });
              wx.getUserInfo({
                success: function success(res) {
                  _gameConfig2.default.nickName = res.userInfo.nickName;
                  _gameConfig2.default.avatarUrl = res.userInfo.avatarUrl + "?aaa=aa.jpg";
                  _this.nickName.string = res.userInfo.nickName;
                  cc.loader.load(_gameConfig2.default.avatarUrl, function(err, texture) {
                    var sprite = new cc.SpriteFrame(texture);
                    _this.avatar.spriteFrame = sprite;
                  });
                }
              });
            } else _gameConfig2.default.IS_AUTHS_OPE || wx.getSystemInfo({
              success: function success(res) {
                var width = res.screenWidth;
                var height = res.screenHeight;
                _gameConfig2.default.auths_Btn = wx.createUserInfoButton({
                  type: "text",
                  text: "\u5fae\u4fe1\u6388\u6743",
                  style: {
                    left: (width - 200) / 2,
                    top: (height - 100) / 2 - 40,
                    width: 200,
                    height: 100,
                    lineHeight: 100,
                    backgroundColor: "#05920a",
                    color: "#ffffff",
                    textAlign: "center",
                    fontSize: 30,
                    borderRadius: 20
                  }
                });
                _gameConfig2.default.auths_Btn.onTap(function(res1) {
                  wx.getSetting({
                    success: function success(auths) {
                      _gameConfig2.default.IS_AUTHS_OPE = !_gameConfig2.default.IS_AUTHS_OPE;
                      if (auths.authSetting["scope.userInfo"]) {
                        console.log("==\u5df2\u7ecf\u6388\u6743===");
                        _gameConfig2.default.IS_AUTHORIZE = true;
                        _gameConfig2.default.auths_Btn.hide();
                        wx.login({
                          success: function success(res2) {
                            _gameConfig2.default.code = res2.code;
                            wx.getUserInfo({
                              withCredentials: true,
                              lang: "zh_CN",
                              success: function success(res3) {
                                _gameConfig2.default.nickName = res3.userInfo.nickName;
                                _gameConfig2.default.avatarUrl = res3.userInfo.avatarUrl + "?aaa=aa.jpg";
                                _this.nickName.string = res3.userInfo.nickName;
                                cc.loader.load(_gameConfig2.default.avatarUrl, function(err, texture) {
                                  var sprite = new cc.SpriteFrame(texture);
                                  _this.avatar.spriteFrame = sprite;
                                });
                              },
                              fail: function fail() {
                                console.log("login:\u83b7\u53d6\u81ea\u5df1\u7684\u4fe1\u606f\u5931\u8d25");
                              }
                            });
                            _this.node.active = true;
                          }
                        });
                      } else {
                        console.log("==\u62d2\u7edd\u6388\u6743===");
                        _gameConfig2.default.auths_Btn.hide();
                        _this.node.active = false;
                      }
                    }
                  });
                });
                _gameConfig2.default.auths_Btn.show();
              }
            });
          },
          fail: function fail() {
            console.log("\u8c03\u7528\u63a5\u53e3\u5931\u8d25");
          }
        }); else {
          this.node.active = true;
          _gameConfig2.default.auths_Btn && _gameConfig2.default.auths_Btn.hide();
          this.nickName.string = _gameConfig2.default.nickName;
          cc.loader.load(_gameConfig2.default.avatarUrl, function(err, texture) {
            var sprite = new cc.SpriteFrame(texture);
            _this.avatar.spriteFrame = sprite;
          });
        }
      }
    });
    cc._RF.pop();
  }, {
    "../gameConfig": "gameConfig"
  } ],
  util: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "21692qGB49Md4FD07gHVTu1", "util");
    "use strict";
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var _gameDataManager = require("../gameDataManager");
    var _gameDataManager2 = _interopRequireDefault(_gameDataManager);
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : {
        default: obj
      };
    }
    var Util = {
      btnEvent: function btnEvent(NODE, btnSound, CALLBACKS) {
        NODE.on("touchstart", function() {
          NODE.setScale(.8);
          cc.audioEngine.playEffect(btnSound, false, 1);
        });
        NODE.on("touchend", function() {
          NODE.setScale(1);
          CALLBACKS && CALLBACKS();
        });
        NODE.on("touchcancel", function() {
          NODE.setScale(1);
          CALLBACKS && CALLBACKS();
        });
      },
      modeBtnEvent: function modeBtnEvent(NODE, btnSound, CALLBACKS) {
        NODE.on("touchstart", function() {
          cc.audioEngine.playEffect(btnSound, false, 1);
        });
        NODE.on("touchend", function() {
          CALLBACKS && CALLBACKS();
        });
      },
      gameStartDataInit: function gameStartDataInit() {
        _gameDataManager2.default.totalScore = 0;
        _gameDataManager2.default.isMove = false;
        _gameDataManager2.default.isSuccess = false;
        _gameDataManager2.default.canDrop = false;
        _gameDataManager2.default.move = 0;
        _gameDataManager2.default.isAnimate = false;
        _gameDataManager2.default.isLengthen = false;
        _gameDataManager2.default.isStartLengthen = false;
        _gameDataManager2.default.isGameOver = false;
      },
      gameContinueDataInit: function gameContinueDataInit() {
        _gameDataManager2.default.isMove = false;
        _gameDataManager2.default.isSuccess = false;
        _gameDataManager2.default.canDrop = false;
        _gameDataManager2.default.move = 0;
        _gameDataManager2.default.isAnimate = false;
        _gameDataManager2.default.isLengthen = false;
        _gameDataManager2.default.isStartLengthen = false;
        _gameDataManager2.default.isGameOver = false;
      },
      randomNum: function randomNum(multiple) {
        return Math.floor(Math.random() * multiple);
      },
      getAngle: function getAngle(start, end) {
        var diff_x = end.x - start.x, diff_y = end.y - start.y;
        return 90 - 360 * Math.atan(diff_y / diff_x) / (2 * Math.PI);
      }
    };
    exports.default = Util;
    module.exports = exports["default"];
    cc._RF.pop();
  }, {
    "../gameDataManager": "gameDataManager"
  } ]
}, {}, [ "GameOver", "bridge", "energy", "fog", "game", "gameBg", "gameConfig", "gameDataManager", "media", "modeChoose", "rank", "rule", "subCanvas", "userInfo", "player", "scoreAni", "shark", "stage", "start", "stick", "GameUITools", "animation", "util" ]);