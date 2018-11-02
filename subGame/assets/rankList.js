cc.Class({
    extends: cc.Component,
    properties: {
        display:cc.ScrollView,
        content: cc.Node,
        rankItem: cc.Prefab,
        loadingLabel: cc.Node,
        scoreText: cc.Node,
        scoreTextLabel:cc.Label,
    },
    start () {
        let _self = this;
        //默认排行榜置顶
        this.display.scrollToTop(0)
        wx.onMessage(data => {
            let messageType = data.messageType;
            switch(messageType) {
                case 1: // 提交分数
                    _self._submitScore(data.MAIN_MENU_NUM, data.score);
                    break;
                case 2: // 获取排行榜
                    _self._fetchFriendData(data.MAIN_MENU_NUM);
                    break;
                case 3://结束文字
                    _self._getScoreText(data.MAIN_MENU_NUM);
                    break;
                case 5://隐藏子域
                    _self._hideSub();
                    break;
            }
        });
    },
    _removeChild() {
        this.content.removeAllChildren();
        this._showMessage("玩命加载中...");
    },
    // 提交分数
    _submitScore(MAIN_MENU_NUM, score) {
        wx.getUserCloudStorage({
            // 以key/value形式存储
            keyList: ["x2" + MAIN_MENU_NUM],
            success: function(getres) {
                if (getres.KVDataList.length > 0){
                    if (MAIN_MENU_NUM == 1) { // TODO
                        wx.setUserCloudStorage({
                            KVDataList: [{
                                key: "Classic",
                                value: "{\"wxgame\":{\"score\":" + (getres.KVDataList[0].value > score ? getres.KVDataList[0].value : score) + ",\"update_time\": " + new Date().getTime() + "}}"
                            }],
                        });
                    }
                    if (getres.KVDataList[0].value > score) {
                        return ;
                    }
                }
                // 对用户托管数据进行写数据操作
                wx.setUserCloudStorage({
                    KVDataList: [{
                        key: "x2" + MAIN_MENU_NUM,
                        value: "" + score,
                    }],
                    success: function(res) {
                        console.log('setUserCloudStorage', 'success', res);
                    },
                    fail: function(res) {
                        console.log('setUserCloudStorage', 'fail', res);
                    },
                    complete: function(res) {
                        console.log('setUserCloudStorage', 'ok', res);
                    }
                });
            },
            fail: function(res) {
                console.log("getUserCloudStorage", "fail");
            },
            complete: function(res) {
                console.log("getUserCloudStorage", "ok");
            },
        });
    },
    //结束文字
    _getScoreText(MAIN_MENU_NUM){
        this._removeChild();
        this.hideRankList();
        let _self = this;
        let userRank,topperUserRank,lowerUserRank;
        wx.getUserInfo({
            openIdList: ['selfOpenId'],
            success: (userRes) => {
                this.loadingLabel.active = false;
                console.log('success', userRes.data);
                let userData = userRes.data[0]; // 如果需要自己的
                // 取出所有好友数据
                wx.getFriendCloudStorage({
                    keyList: ["x2" + MAIN_MENU_NUM],
                    success: res => {
                        console.log("wx.getFriendCloudStorage success", res);
                        let data = res.data;
                        data.sort((a, b) => {
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
                        for(let i = 0; i < data.length; i++) {
                            var index = i;
                            let isSelf = false;
                            if (data[i].avatarUrl == userData.avatarUrl) {
                                isSelf = true;
                                userRank = index;
                                topperUserRank = index-1;
                                lowerUserRank = index+1;
                            }
                        }
                        if(userRank == 0){
                            _self.scoreTextLabel.string = "你在好友中占据第一!";
                        }
                        else if(userRank == data.length-1){
                            _self.scoreTextLabel.string = "你在好友中垫底了，快快奋起直追吧!";
                        }
                        else{
                            let grade1 = data[userRank].KVDataList.length != 0 ? data[userRank].KVDataList[0].value : 0;
                            let grade2 = data[topperUserRank].KVDataList.length != 0 ? data[topperUserRank].KVDataList[0].value : 0;
                            let score = grade2 - grade1//距排名前一位好友分差
                            let upperName = _self._cutstr(data[topperUserRank].nickname,4);
                            let lowerName = _self._cutstr(data[lowerUserRank].nickname,10);
                            _self.scoreTextLabel.string = "你已超过"+lowerName+",\n距离下一位好友"+upperName+"还差"+score+"分";
                        }
                    },
                    fail: res=>{
                        _self._showMessage("获取数据失败，请检查网络连接");
                        console.log("获取排行榜失败", res);
                    },
                });
            },
            fail: (res) => {
                _self._showMessage("获取数据失败，请检查网络连接");
            }
        });
    },
    // 获取排行榜数据
    _fetchFriendData(MAIN_MENU_NUM) {
        this._removeChild();
        this.showRankList();
        let _self = this;
        wx.getUserInfo({
            openIdList: ['selfOpenId'],
            success: (userRes) => {
                this.loadingLabel.active = false;
                console.log('success', userRes.data);
                let userData = userRes.data[0]; // 如果需要自己的
                // 取出所有好友数据
                wx.getFriendCloudStorage({
                    keyList: ["x2" + MAIN_MENU_NUM],
                    success: res => {
                        console.log("wx.getFriendCloudStorage success", res);
                        let data = res.data;
                        data.sort((a, b) => {
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
                        for(let i = 0; i < data.length; i++) {
                            let isSelf = false;
                            if (data[i].avatarUrl == userData.avatarUrl) {
                                isSelf = true;
                            }
                            _self._showPlayerData(i, data[i], isSelf);

                        }
                    },
                    fail: res=>{
                        _self._showMessage("获取数据失败，请检查网络连接");
                        console.log("获取排行榜失败", res);
                    },
                });
            },
            fail: (res) => {
                _self._showMessage("获取数据失败，请检查网络连接");
            }
        });
    },
    //显示加载信息
    _showMessage(message) {
        this.loadingLabel.getComponent(cc.Label).string = message;
        this.loadingLabel.active = true;
    },
    /**
     * 显示排行榜，绘制好友信息
     * TODO: 对当前玩家的记录做特殊标识
     */
    _showPlayerData(rank, playerInfo, isSelf) {
        let node = cc.instantiate(this.rankItem);
        node.parent = this.content;
        // 排名
        let num = node.getChildByName('num').getComponent(cc.Label);
        num.string = (rank + 1).toString();
        // 昵称
        let userName = node.getChildByName('nickName').getComponent(cc.Label);
        let nickNameStr = this._cutstr(playerInfo.nickname,6)
        console.log(nickNameStr)
        userName.string = nickNameStr;
        // 得分
        let score = node.getChildByName('score').getComponent(cc.Label);
        let grade = playerInfo.KVDataList.length != 0 ? playerInfo.KVDataList[0].value : 0;
        score.string = grade.toString();

        let userIcon = node.getChildByName('userIcon').getComponent(cc.Sprite);
        if(playerInfo.avatarUrl!=''){
            cc.loader.load({
                url: playerInfo.avatarUrl,
                type: 'png'
            }, (err, texture) => {
                if (err) console.error(err);
                console.log(texture);
                userIcon.spriteFrame = new cc.SpriteFrame(texture);
            });
        }
    },
    //隐藏玩家数据
    hideRankList(){
        this.display.active = false;
        this.loadingLabel.active = false;
        this.scoreText.active = true;
    },
    //显示玩家数据
    showRankList(){
        this.display.active = true;
        this.scoreText.active = false;
    },
    //显示用户数据
    _showUserData(nickName, avatarUrl) {
        let node = cc.instantiate(this.rankItem);
        node.parent = this.content;
        let userName = node.getChildByName('nickName').getComponent(cc.Label);
        let userIcon = node.getChildByName('mask').children[0].getComponent(cc.Sprite);
        userName.string = nickNameStr;
        console.log(nickName + '\'s info has been getten');
        //用户头像不为空的情况下
        if(avatarUrl!=''){
            cc.loader.load({
                url: avatarUrl,
                type: 'png'
            }, (err, texture) => {
                if (err) console.error(err);
                console.log(texture);
                userIcon.spriteFrame = new cc.SpriteFrame(texture);
            });
        }
    },
    //隐藏子域
    _hideSub(){
        this.display.active = false;
        this.loadingLabel.active = false;
        this.scoreText.active = false;
    },
    //截取玩家名字
    _cutstr(str,len){
        //如果给定字符串小于指定长度，则返回源字符串；
        if(str.length <= len){
            return str
        }
        var str_length = 0;
        var str_len = 0;
        var str_cut = new String();
        var str_len = str.length;
        for(var i = 0;i<str_len;i++)
        {
            var a = str.charAt(i);
            str_length++;
            str_cut = str_cut.concat(a);
            if(str_length >= len){
                str_cut = str_cut.concat("...");
                return str_cut;
            }
        }
    }
});
