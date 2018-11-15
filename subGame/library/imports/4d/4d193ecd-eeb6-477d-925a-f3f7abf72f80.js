"use strict";
cc._RF.push(module, '4d1937N7rZHfZJa8/er9y+A', 'rankList');
// rankList.js

"use strict";

cc.Class({
    extends: cc.Component,
    properties: {
        displayNode: cc.Node,
        display: cc.ScrollView,
        content: cc.Node,
        rankItem: cc.Prefab,
        loadingLabel: cc.Node,
        scoreText: cc.Node,
        scoreTextLabel: cc.Label,
        userInfo: cc.Node,
        index: 1
    },
    start: function start() {
        var _self = this;
        //默认排行榜置顶
        this.display.scrollToTop(0);
        wx.onMessage(function (data) {
            var messageType = data.messageType;
            switch (messageType) {
                case 1:
                    // 提交分数
                    _self._submitScore(data.MAIN_MENU_NUM, data.score);
                    break;
                case 2:
                    // 获取排行榜
                    _self._fetchFriendData(data.MAIN_MENU_NUM);
                    break;
                case 3:
                    //结束文字
                    _self._getScoreText(data.MAIN_MENU_NUM);
                    break;
                case 5:
                    //隐藏子域
                    _self._hideSub();
                    break;
            }
        });
    },
    _removeChild: function _removeChild() {
        this.content.removeAllChildren();
        this._showMessage("玩命加载中...");
    },

    // 提交分数
    _submitScore: function _submitScore(MAIN_MENU_NUM, score) {
        wx.getUserCloudStorage({
            // 以key/value形式存储
            keyList: ["x2" + MAIN_MENU_NUM],
            success: function success(getres) {
                if (getres.KVDataList.length > 0) {
                    if (MAIN_MENU_NUM == 1) {
                        // TODO
                        wx.setUserCloudStorage({
                            KVDataList: [{
                                key: "Classic",
                                value: "{\"wxgame\":{\"score\":" + (getres.KVDataList[0].value > score ? getres.KVDataList[0].value : score) + ",\"update_time\": " + new Date().getTime() + "}}"
                            }]
                        });
                    }
                    if (getres.KVDataList[0].value > score) {
                        return;
                    }
                }
                // 对用户托管数据进行写数据操作
                wx.setUserCloudStorage({
                    KVDataList: [{
                        key: "x2" + MAIN_MENU_NUM,
                        value: "" + score
                    }],
                    success: function success(res) {
                        console.log('setUserCloudStorage', 'success', res);
                    },
                    fail: function fail(res) {
                        console.log('setUserCloudStorage', 'fail', res);
                    },
                    complete: function complete(res) {
                        console.log('setUserCloudStorage', 'ok', res);
                    }
                });
            },
            fail: function fail(res) {
                console.log("getUserCloudStorage", "fail");
            },
            complete: function complete(res) {
                console.log("getUserCloudStorage", "ok");
            }
        });
    },

    //结束文字
    _getScoreText: function _getScoreText(MAIN_MENU_NUM) {
        var _this = this;

        this._removeChild();
        this.hideRankList();
        var _self = this;
        var userRank = void 0,
            topperUserRank = void 0,
            lowerUserRank = void 0;
        wx.getUserInfo({
            openIdList: ['selfOpenId'],
            success: function success(userRes) {
                _this.loadingLabel.active = false;
                console.log('success', userRes.data);
                var userData = userRes.data[0]; // 如果需要自己的
                // 取出所有好友数据
                wx.getFriendCloudStorage({
                    keyList: ["x2" + MAIN_MENU_NUM],
                    success: function success(res) {
                        console.log("wx.getFriendCloudStorage success", res);
                        var data = res.data;
                        data.sort(function (a, b) {
                            if (a.KVDataList.length == 0 && b.KVDataList.length == 0) {
                                return 0;
                            }
                            if (a.KVDataList.length == 0) {
                                return 1;
                            }
                            if (b.KVDataList.length == 0) {
                                return -1;
                            }
                            return b.KVDataList[0].value - a.KVDataList[0].value;
                        });
                        for (var i = 0; i < data.length; i++) {
                            var index = i;
                            var isSelf = false;
                            if (data[i].avatarUrl == userData.avatarUrl) {
                                isSelf = true;
                                userRank = index;
                                topperUserRank = index - 1;
                                lowerUserRank = index + 1;
                            }
                        }
                        if (userRank == 0) {
                            _self.scoreTextLabel.string = "你在好友中占据第一!";
                        } else if (userRank == data.length - 1) {
                            _self.scoreTextLabel.string = "你在好友中垫底了，快快奋起直追吧!";
                        } else {
                            var grade1 = data[userRank].KVDataList.length != 0 ? data[userRank].KVDataList[0].value : 0;
                            var grade2 = data[topperUserRank].KVDataList.length != 0 ? data[topperUserRank].KVDataList[0].value : 0;
                            var score = grade2 - grade1; //距排名前一位好友分差
                            var upperName = _self._cutstr(data[topperUserRank].nickname, 4);
                            var lowerName = _self._cutstr(data[lowerUserRank].nickname, 10);
                            _self.scoreTextLabel.string = "你已超过" + lowerName + ",\n距离下一位好友" + upperName + "还差" + score + "分";
                        }
                    },
                    fail: function fail(res) {
                        _self._showMessage("获取数据失败，请检查网络连接");
                        console.log("获取排行榜失败", res);
                    }
                });
            },
            fail: function fail(res) {
                _self._showMessage("获取数据失败，请检查网络连接");
            }
        });
    },

    // 获取排行榜数据
    _fetchFriendData: function _fetchFriendData(MAIN_MENU_NUM) {
        var _this2 = this;

        this._removeChild();
        this.index = 1;
        this.showRankList();
        var _self = this;
        wx.getUserInfo({
            openIdList: ['selfOpenId'],
            success: function success(userRes) {
                _this2.loadingLabel.active = false;
                var userData = userRes.data[0]; // 如果需要自己的
                // 取出所有好友数据
                wx.getFriendCloudStorage({
                    keyList: ["x2" + MAIN_MENU_NUM],
                    success: function success(res) {
                        var data = res.data;
                        data.sort(function (a, b) {
                            if (a.KVDataList.length == 0 && b.KVDataList.length == 0) {
                                return 0;
                            }
                            if (a.KVDataList.length == 0) {
                                return 1;
                            }
                            if (b.KVDataList.length == 0) {
                                return -1;
                            }
                            return b.KVDataList[0].value - a.KVDataList[0].value;
                        });
                        for (var i = 0; i < data.length; i++) {
                            if (data[i].avatarUrl == userData.avatarUrl) {
                                _self._showUserData(i, data[i]);
                            }
                        }
                        for (var _i = 0; _i < 10; _i++) {
                            if (data[_i].avatarUrl == userData.avatarUrl) {
                                _self._showPlayerData(_i, data[_i], true);
                            } else {
                                _self._showPlayerData(_i, data[_i], false);
                            }
                        }
                        _this2.displayNode.on("bounce-bottom", function () {
                            var index = _self.index;
                            var length = data.length - 10 * index;
                            if (length > 10) {
                                for (var _i2 = 10 * index; _i2 < 10 * index + 10; _i2++) {
                                    if (data[_i2].avatarUrl == userData.avatarUrl) {
                                        _self._showPlayerData(_i2, data[_i2], true);
                                    } else {
                                        _self._showPlayerData(_i2, data[_i2], false);
                                    }
                                }
                                _self.index++;
                            } else if (length <= 10 && length > 0) {
                                for (var _i3 = 10 * _self.index; _i3 < data.length; _i3++) {
                                    if (data[_i3].avatarUrl == userData.avatarUrl) {
                                        _self._showPlayerData(_i3, data[_i3], true);
                                    } else {
                                        _self._showPlayerData(_i3, data[_i3], false);
                                    }
                                }
                                _self.index++;
                            }
                        });
                    },
                    fail: function fail(res) {
                        _self._showMessage("获取数据失败，请检查网络连接");
                        console.log("获取排行榜失败", res);
                    }
                });
            },
            fail: function fail(res) {
                _self._showMessage("获取数据失败，请检查网络连接");
            }
        });
    },

    //显示加载信息
    _showMessage: function _showMessage(message) {
        this.loadingLabel.getComponent(cc.Label).string = message;
        this.loadingLabel.active = true;
    },

    /**
     * 显示排行榜，绘制好友信息
     * TODO: 对当前玩家的记录做特殊标识
     */
    _showPlayerData: function _showPlayerData(rank, playerInfo, isUser) {
        var node = cc.instantiate(this.rankItem);
        node.parent = this.content;
        if (isUser) {
            var bg = node.getChildByName("itemBg");
            bg.active = true;
        }
        // 排名
        var num = node.getChildByName('num').getComponent(cc.Label);
        num.string = (rank + 1).toString();
        // 昵称
        var userName = node.getChildByName('nickName').getComponent(cc.Label);
        var nickNameStr = this._cutstr(playerInfo.nickname, 6);
        userName.string = nickNameStr;
        // 得分
        var score = node.getChildByName('score').getComponent(cc.Label);
        var grade = playerInfo.KVDataList.length != 0 ? playerInfo.KVDataList[0].value : 0;
        score.string = grade.toString();

        var userIcon = node.getChildByName('userIcon').getComponent(cc.Sprite);
        if (playerInfo.avatarUrl != '') {
            cc.loader.load({
                url: playerInfo.avatarUrl,
                type: 'png'
            }, function (err, texture) {
                if (err) console.error(err);
                userIcon.spriteFrame = new cc.SpriteFrame(texture);
            });
        }
    },

    //隐藏玩家数据
    hideRankList: function hideRankList() {
        this.display.active = false;
        this.loadingLabel.active = false;
        this.userInfo.active = false;
        this.scoreText.active = true;
    },

    //显示玩家数据
    showRankList: function showRankList() {
        this.display.active = true;
        this.userInfo.active = true;
        this.scoreText.active = false;
    },

    //显示用户数据
    _showUserData: function _showUserData(rank, playerInfo) {
        this.userInfo.removeAllChildren();
        var node = cc.instantiate(this.rankItem);
        node.parent = this.userInfo;

        var bg = node.getChildByName("itemBg");
        bg.active = true;
        // 排名
        var num = node.getChildByName('num').getComponent(cc.Label);
        num.string = (rank + 1).toString();
        // 昵称
        var userName = node.getChildByName('nickName').getComponent(cc.Label);
        var nickNameStr = this._cutstr(playerInfo.nickname, 6);
        userName.string = nickNameStr;
        // 得分
        var score = node.getChildByName('score').getComponent(cc.Label);
        var grade = playerInfo.KVDataList.length != 0 ? playerInfo.KVDataList[0].value : 0;
        score.string = grade.toString();

        var userIcon = node.getChildByName('userIcon').getComponent(cc.Sprite);
        if (playerInfo.avatarUrl != '') {
            cc.loader.load({
                url: playerInfo.avatarUrl,
                type: 'png'
            }, function (err, texture) {
                if (err) console.error(err);
                userIcon.spriteFrame = new cc.SpriteFrame(texture);
            });
        }
    },

    //隐藏子域
    _hideSub: function _hideSub() {
        this.display.active = false;
        this.loadingLabel.active = false;
        this.scoreText.active = false;
    },

    //截取玩家名字
    _cutstr: function _cutstr(str, len) {
        //如果给定字符串小于指定长度，则返回源字符串；
        if (str.length <= len) {
            return str;
        }
        var str_length = 0;
        var str_len = 0;
        var str_cut = new String();
        var str_len = str.length;
        for (var i = 0; i < str_len; i++) {
            var a = str.charAt(i);
            str_length++;
            str_cut = str_cut.concat(a);
            if (str_length >= len) {
                str_cut = str_cut.concat("...");
                return str_cut;
            }
        }
    }
});

cc._RF.pop();