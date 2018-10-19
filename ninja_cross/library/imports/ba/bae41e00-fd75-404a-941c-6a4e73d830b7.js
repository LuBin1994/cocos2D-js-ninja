"use strict";
cc._RF.push(module, 'bae414A/XVASpQcak5z2DC3', 'gameConfig');
// script/gameConfig.js

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var GameConfig = {
  /**
   * 游戏配置参数
   */
  isBgmPlay: true, //背景音乐是否播放
  isScreemCanTouch: true, //游戏屏幕是否能触摸
  gameBgMoveSpeed: 1, //背景移动速度
  gameMoveSpeed: 8, //游戏移动速度
  stickLength: 0, //棍子初始长度
  stickLengthSpeed: 5, //棍子变长速度
  minMultiProbability: 0.2, //多分值站桩最小抽取概率
  MaxMultiProbability: 0.5, //多分值站桩最大抽取概
  canResurrectTime: 1, //能复活次数
  sharkJumpDurTime: 30, //鲨鱼跳跃间隔时间(秒)
  MAIN_MENU_NUM: "ninja_crossing", // 主选择菜单
  IS_WX: true, //当前是否是微信环境(游戏发布时改为true)
  INTER_URL: "http://192.168.1.156:30000/", //接口
  LOG_URL: "http://log-ninja.iwckj.com/", //日志接口

  /**
   * 数据存储
   */
  IS_AUTHORIZE: false, //是否授权
  auths_Btn: null, //授权按钮
  IS_AUTHS_OPE: false, //是否做过授权操作
  nickName: null, //用户昵称
  avatarUrl: null, //用户头像
  code: null //用户登录凭证
};
exports.default = GameConfig;
module.exports = exports["default"];

cc._RF.pop();