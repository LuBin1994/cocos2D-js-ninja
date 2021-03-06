"use strict";
cc._RF.push(module, 'd8730dAQ/NFJ4QaRBKUkkcH', 'stage');
// script/stage.js

'use strict';

var _gameConfig = require('./gameConfig');

var _gameConfig2 = _interopRequireDefault(_gameConfig);

var _gameDataManager = require('./gameDataManager');

var _gameDataManager2 = _interopRequireDefault(_gameDataManager);

var _util = require('./utils/util');

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

cc.Class({
    extends: cc.Component,
    properties: {
        stagePrefabs: [cc.Prefab],
        stagePools: [],
        doneStage: 0, //已通过的站台数
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
        },
        currentPosX: 0,
        nextPosX: 0,
        nextTwoPosX: 0
    },
    onLoad: function onLoad() {
        this.stagePosX = [100, -295, -400];
        var _this = this;
        this.configInit();
        this.stagePoolInit(function () {
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
    //对象池，预制初始化
    stagePoolInit: function stagePoolInit(callbacks) {
        for (var i = 0; i < this.stagePrefabs.length; i++) {
            var newNodePool = new cc.NodePool();
            this.stagePools.push(newNodePool);
            if (i == 5) {
                callbacks && callbacks();
            }
        }
    },
    //站桩初始化
    stageInit: function stageInit() {
        var nextX, distance, centerDistance;
        //第一个站桩
        this.currentPlat = this.getStage(_util2.default.randomNum(3));
        this.currentPlat.setPosition(cc.v2(-230, -295));
        this.currentPlat.parent = this.node;
        this.currentPosX = -230;
        //第二个站桩
        this.nextPlat = this.getStage(_util2.default.randomNum(3));
        distance = _util2.default.randomNum(250) + 100; //随机距离
        centerDistance = distance + (this.currentPlat.width / 2 + this.nextPlat.width / 2);
        centerDistance = centerDistance - centerDistance % _gameConfig2.default.gameMoveSpeed; //两站装中心距离设置为移动速度的整数倍，防止移动过程中出现的偏差
        nextX = this.currentPlat.x + centerDistance;
        this.nextPlat.setPosition(cc.v2(nextX, -295));
        this.nextPlat.parent = this.node;
        this.nextPosX = nextX;
        //第三个站桩
        this.nextTwoPlat = this.getStage(_util2.default.randomNum(3));
        distance = _util2.default.randomNum(250) + 100; //随机距离
        centerDistance = distance + (this.nextPlat.width / 2 + this.nextTwoPlat.width / 2);
        centerDistance = centerDistance - centerDistance % _gameConfig2.default.gameMoveSpeed; //两站装中心距离设置为移动速度的整数倍，防止移动过程中出现的偏差
        nextX = this.nextPlat.x + centerDistance;
        this.nextTwoPlat.setPosition(cc.v2(nextX, -295));
        this.nextTwoPlat.parent = this.node;
        this.nextTwoPosX = nextX;
        //初始化设置道具
        switch (_gameDataManager2.default.toolChoose) {
            case 0:
                this.game.stick.node.active = 1;
                this.game.stick.setStick(this.currentPlat.x + this.currentPlat.width / 2);
                console.log(this.game.stick.node);
                break;
            case 1:
                this.game.bridge.node.active = true;
                this.game.bridge.setBridge(this.currentPlat.x + this.currentPlat.width / 2);
                break;
            case 2:
                this.game.energy.showCali();
                this.game.energy.setCali();
                break;
        }
    },
    createStage: function createStage() {
        this.doneStage += 1;
        var num1 = _util2.default.randomNum(100);
        var num2 = 100 - Math.floor(this.doneStage / 2) - _gameConfig2.default.minMultiProbability * 100;
        if (num2 < 100 * (1 - _gameConfig2.default.maxMultiProbability)) {
            num2 = 100 * (1 - _gameConfig2.default.maxMultiProbability);
        }
        var chooseNum = _util2.default.randomNum(3);
        if (num1 < num2) {
            //抽取普通站台
            this.setNextStage(chooseNum);
        } else {
            //抽取多得分站台
            if (_gameDataManager2.default.toolChoose == 1) {
                this.setNextStage(chooseNum + 2);
            } else {
                this.setNextStage(chooseNum + 3);
            }
        }
    },
    //设置下一个站桩
    setNextStage: function setNextStage(num) {
        var stage, nextX, distance, centerDistance;
        this.currentPlat = this.nextPlat;
        this.nextPlat = this.nextTwoPlat;
        stage = this.getStage(num);
        this.nextTwoPlat = stage;
        this.nextTwoPlat.parent = this.node;
        this.nextTwoPlat.opacity = 0;
        distance = _util2.default.randomNum(250) + 100; //随机距离
        centerDistance = distance + (this.nextPlat.width / 2 + this.nextTwoPlat.width / 2);
        centerDistance = centerDistance - centerDistance % _gameConfig2.default.gameMoveSpeed; //两站装中心距离设置为移动速度的整数倍，防止移动过程中出现的偏差
        nextX = this.nextPlat.x + centerDistance;
        this.nextTwoPlat.setPosition(cc.v2(nextX, -605));

        //记录站桩位置，游戏继续可用
        this.currentPosX = this.currentPlat.x;
        this.nextPosX = this.nextPlat.x;
        this.nextTwoPosX = this.nextTwoPlat.x;

        //新生成的站台动画
        var moveY = cc.moveTo(1, cc.v2(nextX, -295));
        var fadeIn = cc.fadeIn(1);
        var ani = cc.spawn(moveY, fadeIn);
        this.nextTwoPlat.runAction(ani);

        //选择下个道具
        if (_gameDataManager2.default.toolChoose !== 2) {
            if (this.doneStage % 5 == 0) {
                this.game.fog.showFog(this.nextPlat.x, -305);
            }
        }
        if (_gameDataManager2.default.toolChoose == 2) {
            //设置能量条刻度
            this.game.energy.setCali();
        }
    },
    //游戏一回合结束删除经过的站桩
    recycleStage: function recycleStage() {
        var stage = this.node.children[0];
        var num = parseInt(stage.name.replace(/[^0-9]/ig, ""));
        this.stagePools[num - 1].put(stage);
    },
    //删除所有站桩
    destroyAll: function destroyAll() {
        this.node.removeAllChildren(true);
    },
    //获取到下一个站桩的最小距离和最大距离
    getLength: function getLength() {
        var length = new Object();
        //道具搭桥成功所需的最小长度
        var minLength = Math.floor(this.nextPlat.x - this.currentPlat.x - (this.nextPlat.width + this.currentPlat.width) / 2);
        //道具搭桥成功所需的最大长度
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

    //设置游戏复活站桩位置
    setStagePosX: function setStagePosX() {
        this.currentPlat.setPosition(cc.v2(this.currentPosX, -295));
        this.nextPlat.setPosition(cc.v2(this.nextPosX, -295));
        this.nextTwoPlat.setPosition(cc.v2(this.nextTwoPosX, -295));
    },
    getStage: function getStage(num) {
        var stage = null;
        if (this.stagePools[num].size() > 0) {
            stage = this.stagePools[num].get();
        } else {
            stage = cc.instantiate(this.stagePrefabs[num]);
        }
        return stage;
    },
    update: function update(dt) {
        if (_gameDataManager2.default.isMove) {
            //所有站桩左移
            var childrens = this.node.children;
            for (var i = 0; i < childrens.length; i++) {
                childrens[i].x -= _gameConfig2.default.gameMoveSpeed;
            }
        }
    }
});

cc._RF.pop();