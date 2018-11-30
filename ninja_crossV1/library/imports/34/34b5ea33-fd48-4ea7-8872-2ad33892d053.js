"use strict";
cc._RF.push(module, '34b5eoz/UhOp4hyKtM4ktBT', 'animation');
// script/utils/animation.js

'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _gameDataManager = require('../gameDataManager');

var _gameDataManager2 = _interopRequireDefault(_gameDataManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Animation = {
    //道具转动动画
    toolRotateAni: function toolRotateAni(isSuccess, node, callback) {
        if (isSuccess) {
            var r = cc.rotateBy(0.7, 90).easing(cc.easeIn(1));
            var finish = cc.callFunc(function () {
                _gameDataManager2.default.isMove = true;
            });
            var ani = cc.sequence(r, finish);
            node.runAction(ani);
        } else {
            var time = cc.delayTime(0.7);
            var r = cc.rotateBy(1.4, 180).easing(cc.easeIn(1));
            var down = cc.moveTo(2, cc.v2(node.x, -10000)).easing(cc.easeIn(2.5));
            var finish = cc.callFunc(function () {
                _gameDataManager2.default.canDrop = true;
            });
            var down1 = cc.sequence(time, finish, down);
            var ani = cc.spawn(r, down1);
            node.runAction(ani);
        }
    },

    //得分特效
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
module.exports = exports['default'];

cc._RF.pop();