"use strict";
cc._RF.push(module, '7ca9bZC/q5IRa855P89qUku', 'moreGame');
// script/panel/moreGame.js

'use strict';

var _gameConfig = require('../gameConfig');

var _gameConfig2 = _interopRequireDefault(_gameConfig);

var _util = require('../utils/util');

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

cc.Class({
    extends: cc.Component,
    properties: {
        app: { default: [],
            type: Array }
    },
    onLoad: function onLoad() {
        this.app = [{ appName: '忍者对对碰', appId: 'wx60dc6bacf553bdfc' }, { appName: '忍者逃亡', appId: 'wx362bde88fb09a159' }, { appName: '智慧冲冲冲', appId: 'wx1e13b29ab6873da6' }];
        var _this = this;
        this.rotate();
        this.node.on('touchstart', function () {
            var num = _util2.default.randomNum(3);
            if (_gameConfig2.default.IS_WX) {
                wx.navigateToMiniProgram({
                    appId: _this.app[num].appId,
                    success: function success(res) {
                        wx.request({
                            url: _gameConfig2.default.INTER_URL + "game/navigate",
                            data: {
                                'appId': _this.app[num].appId,
                                'name': _this.app[num].appName,
                                'path': '',
                                'extraData': '',
                                'env': _gameConfig2.default.env
                            },
                            header: {
                                'content-type': 'application/x-www-form-urlencoded',
                                'Cookie': "SESSION=" + wx.getStorageSync('sessionId')
                            },
                            method: "POST",
                            success: function success(res) {
                                console.log("跳转到其他小程序返回值", res.data);
                                if (res.data.status == 1) {
                                    console.log("提交跳转信息成功");
                                } else {
                                    switch (res.data.code) {
                                        case 1005:
                                            console.log("提交跳转信息参数错误");
                                            break;
                                    }
                                }
                            },
                            error: function error() {
                                console.log("连接错误");
                            }
                        });
                    }
                });
            }
        });
    },
    rotate: function rotate() {
        var delayTime = cc.delayTime(2);
        var shake1 = cc.rotateBy(0.1, -20);
        var shake2 = cc.rotateBy(0.2, 40);
        var shake3 = cc.rotateBy(0.1, -20);
        var shake = cc.repeat(cc.sequence(shake1, shake2, shake3), 3);
        var ani = cc.sequence(delayTime, shake);
        var repeatAni = cc.repeatForever(ani);
        this.node.runAction(repeatAni);
    }
});

cc._RF.pop();