(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/gameConfig.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'ff368k+WbtKmZJ4qdSWj2SL', 'gameConfig', __filename);
// gameConfig.js

"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var GameConfig = {
    INTER_URL: "http://192.168.1.156:30000/", //接口
    shareKind: 1, //分享类型  1:超越  2:普通
    passNickName: null, //超越好友的名字
    //分享配置
    config: {},
    shareTitle: null, //本次分享标题
    shareImg: null //本次分享图片

};
exports.default = GameConfig;
module.exports = exports["default"];

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
        //# sourceMappingURL=gameConfig.js.map
        