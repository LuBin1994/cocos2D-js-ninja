(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/script/scoreAni.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '8c32ftISiRC+7K7hY8Ua0mA', 'scoreAni', __filename);
// script/scoreAni.js

'use strict';

var _gameDataManager = require('./gameDataManager');

var _gameDataManager2 = _interopRequireDefault(_gameDataManager);

var _animation = require('./utils/animation');

var _animation2 = _interopRequireDefault(_animation);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
        for (var i = 0; i < childrens.length; i++) {
            childrens[i].opacity = 0;
        }
    },
    start: function start() {},
    showScoreFx: function showScoreFx() {
        var _this = this;
        switch (_gameDataManager2.default.addScoreGrade) {
            case 1:
                var score = _this.redAdd.getComponent(cc.Label);
                score.string = '+' + _gameDataManager2.default.nextScore;
                _animation2.default.scoreFx(this.good, 0, 0, 0, 300, 1);
                _animation2.default.scoreFx(this.redAdd, -210, -100, -210, 0, 1);
                break;
            case 2:
                var score = this.greenAdd.getComponent(cc.Label);
                score.string = '+' + _gameDataManager2.default.nextScore;
                _animation2.default.scoreFx(this.great, 0, 0, 0, 300, 1);
                _animation2.default.scoreFx(this.greenAdd, -210, -100, -210, 0, 1);
                break;
            case 3:
                var score = this.yellowAdd.getComponent(cc.Label);
                score.string = '+' + _gameDataManager2.default.nextScore;
                _animation2.default.scoreFx(this.prefect, 0, 0, 0, 300, 1);
                _animation2.default.scoreFx(this.yellowAdd, -210, -100, -210, 0, 1);
                break;
        }
    }
});

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
        //# sourceMappingURL=scoreAni.js.map
        