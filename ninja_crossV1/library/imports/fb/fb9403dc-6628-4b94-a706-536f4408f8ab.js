"use strict";
cc._RF.push(module, 'fb940PcZihLlKcGU29ECPir', 'stick');
// script/stick.js

'use strict';

var _gameConfig = require('./gameConfig');

var _gameConfig2 = _interopRequireDefault(_gameConfig);

var _gameDataManager = require('./gameDataManager');

var _gameDataManager2 = _interopRequireDefault(_gameDataManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

cc.Class({
    extends: cc.Component,
    properties: {
        stickLength: 70, //棍子初始长度
        canLengthen: false, //棍子是否变长
        startLengthen: false //棍子是否开始变长
    },
    onLoad: function onLoad() {
        this.configInit();
    },
    init: function init() {
        this.node.active = false;
    },

    //初始化
    configInit: function configInit() {
        this.node.height = _gameConfig2.default.stickLength;
        this.node.rotation = 0;
    },
    gameInit: function gameInit() {
        this.node.opacity = 255;
        this.node.height = _gameConfig2.default.stickLength;
        this.node.rotation = 0;
    },

    //棍子变长
    lengthen: function lengthen(canLengthen) {
        //参数:是否变长
        if (canLengthen) {
            this.node.height += _gameConfig2.default.stickLengthSpeed;
        }
    },
    setStick: function setStick(x) {
        this.node.active = true;
        this.node.setPosition(cc.v2(x, -305));
        this.configInit();
    },
    update: function update(dt) {
        this.lengthen(_gameDataManager2.default.isLengthen);
        if (_gameDataManager2.default.isMove) {
            this.node.x -= _gameConfig2.default.gameMoveSpeed;
        }
    }
});

cc._RF.pop();