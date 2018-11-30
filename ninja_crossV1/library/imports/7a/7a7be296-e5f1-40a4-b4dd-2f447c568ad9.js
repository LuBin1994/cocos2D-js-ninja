"use strict";
cc._RF.push(module, '7a7beKW5fFApLTdL0R8VorZ', 'guide');
// script/panel/guide.js

'use strict';

var _gameDataManager = require('../gameDataManager');

var _gameDataManager2 = _interopRequireDefault(_gameDataManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

cc.Class({
    extends: cc.Component,
    properties: {
        guideText: [cc.Node],
        finger: cc.Node,
        circle: cc.Node
    },
    onLoad: function onLoad() {
        this.fingerAni();
        this.init();
    },
    init: function init() {
        for (var i = 0; i < this.guideText.length; i++) {
            this.guideText[i].active = false;
        }
        switch (_gameDataManager2.default.toolChoose) {
            case 0:
                this.guideText[0].active = true;
                break;
            case 1:
                this.guideText[1].active = true;
                break;
            case 2:
                this.guideText[2].active = true;
                break;
        }
    },
    start: function start() {},
    fingerAni: function fingerAni() {
        var hide = cc.fadeOut(1);
        var show = cc.fadeIn(1);
        var ani = cc.sequence(hide, show);
        var ani1 = cc.repeatForever(ani);
        this.finger.runAction(ani1);
    }
});

cc._RF.pop();