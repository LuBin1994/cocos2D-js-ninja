"use strict";
cc._RF.push(module, '4a781FRknlLP6t2uRma8nOy', 'start');
// script/start.js

'use strict';

var _gameConfig = require('./gameConfig');

var _gameConfig2 = _interopRequireDefault(_gameConfig);

var _util = require('./utils/util');

var _util2 = _interopRequireDefault(_util);

var _GameUITools = require('./utils/GameUITools');

var _GameUITools2 = _interopRequireDefault(_GameUITools);

var _gameDataManager = require('./gameDataManager');

var _gameDataManager2 = _interopRequireDefault(_gameDataManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
        cc.director.preloadScene("game", function () {
            console.log("游戏场景已加载");
        });
        this.tex = new cc.Texture2D();
    },

    init: function init() {
        var _this = this;
        _GameUITools2.default.loadingLayer("panel/music");
        if (_gameConfig2.default.IS_WX) {
            _GameUITools2.default.loadingLayer("panel/userInfo");
        }
        //开始游戏
        _util2.default.btnEvent(this.startBtn, this.btnSound, function () {
            _GameUITools2.default.loadingScene("game");
            if (_gameConfig2.default.IS_WX) {
                /*wx.request({
                    url:GameConfig.INTER_URL+"/game/start",
                    method: "post",
                    datatype:'json',
                    success:function (res) {
                        if(res.status == 1){
                            console.log(res)
                            GameDataManager.gameId = res.data.gameId;
                        }
                        else{
                            switch(res.code){
                                case 1006:
                                    console.log("操作失败")
                            }
                        }
                    },
                    error:function () {
                        console.log("连接错误")
                    }
                });*/
            }
        });
        //弹出规则
        _util2.default.btnEvent(this.ruleBtn, this.btnSound, function () {
            _GameUITools2.default.loadingLayer("panel/rule");
        });
        //弹出排名
        _util2.default.btnEvent(this.rankBtn, this.btnSound, function () {
            _GameUITools2.default.loadingLayer("panel/rank");
        });
        //弹出模式选择
        _util2.default.btnEvent(this.modeChooseBtn, this.btnSound, function () {
            _GameUITools2.default.loadingLayer("panel/modeChoose");
        });
    }
});

cc._RF.pop();