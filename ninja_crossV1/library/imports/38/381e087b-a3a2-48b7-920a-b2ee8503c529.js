"use strict";
cc._RF.push(module, '381e0h7o6JIt5IKsu6FA8Up', 'modeChoose');
// script/panel/modeChoose.js

'use strict';

var _util = require('../utils/util');

var _util2 = _interopRequireDefault(_util);

var _GameUITools = require('../utils/GameUITools');

var _GameUITools2 = _interopRequireDefault(_GameUITools);

var _gameDataManager = require('../gameDataManager');

var _gameDataManager2 = _interopRequireDefault(_gameDataManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

cc.Class({
    extends: cc.Component,
    properties: {
        stickMode: cc.Node,
        bridgeMode: cc.Node,
        jumpMode: cc.Node,
        modeChooseShow: [cc.Node],
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
        this.modeEvent(this.stickMode, this.btnSound, function () {
            _gameDataManager2.default.toolChoose = 0;
        });
        this.modeEvent(this.bridgeMode, this.btnSound, function () {
            _gameDataManager2.default.toolChoose = 1;
        });
        this.modeEvent(this.jumpMode, this.btnSound, function () {
            _gameDataManager2.default.toolChoose = 2;
        });
    },
    showChoose: function showChoose() {
        for (var i = 0; i < 3; i++) {
            this.modeChooseShow[i].active = false;
        }
        this.modeChooseShow[_gameDataManager2.default.toolChoose].active = true;
    },
    modeEvent: function modeEvent(node, btnSound, callbacks) {
        var _this = this;
        _util2.default.modeBtnEvent(node, btnSound, function () {
            _this.showChoose();
            if (localStorage.getItem('modeGuide')) {
                _GameUITools2.default.loadingScene("game");
            } else {
                _GameUITools2.default.unLoadingLayer(_this.node);
                localStorage.setItem('modeGuide', true);
            }
            callbacks && callbacks();
        });
    }
});

cc._RF.pop();