"use strict";
cc._RF.push(module, 'd2830UZLJtPYp+FyYc33J4H', 'rule');
// script/panel/rule.js

'use strict';

var _util = require('../utils/util');

var _util2 = _interopRequireDefault(_util);

var _GameUITools = require('../utils/GameUITools');

var _GameUITools2 = _interopRequireDefault(_GameUITools);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
        _util2.default.btnEvent(this.ruleCloseBtn, this.btnSound, function () {
            _GameUITools2.default.unLoadingLayer(_this.node);
        });
        this.node.on('touchstart', function (e) {
            e.stopPropagation();
        });
    }
});

cc._RF.pop();