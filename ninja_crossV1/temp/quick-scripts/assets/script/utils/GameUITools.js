(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/utils/GameUITools.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '965b9tfL3BFaJsoNPKIlaNl', 'GameUITools', __filename);
// script/utils/GameUITools.js

'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _gameDatamanager = require('../gameDatamanager');

var _gameDatamanager2 = _interopRequireDefault(_gameDatamanager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var GameUITools = {
    /**
     * 加载场景
     * @param {*} sceneName : 场景名称
     */
    loadingScene: function loadingScene(sceneName) {
        cc.director.preloadScene(sceneName, function () {
            cc.director.loadScene(sceneName);
        });
    },

    /**
     * 场景动态加载图层
     * @param {*} panelName ：图层路径
     */
    loadingLayer: function loadingLayer(panelName) {
        cc.loader.loadRes(panelName, function (err, prefab) {
            if (!err) {
                var node = cc.instantiate(prefab);
                cc.director.getScene().children[0].addChild(node);
            }
        });
    },

    /**
     * 初始化预制
     * @param {*} prefab ：预制件
     */
    initPrefab: function initPrefab(prefab) {
        var node = cc.instantiate(prefab);
        cc.director.getScene().children[0].addChild(node);
    },

    /**
     * 移除图层
     */
    unLoadingLayer: function unLoadingLayer(node) {
        cc.director.getScene().children[0].removeChild(node);
    }
};

exports.default = GameUITools;
module.exports = exports['default'];

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
        //# sourceMappingURL=GameUITools.js.map
        