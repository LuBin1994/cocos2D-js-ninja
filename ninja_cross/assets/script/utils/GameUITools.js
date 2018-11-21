import GameDatamanager from '../gameDatamanager'
var GameUITools = {
    /**
     * 加载场景
     * @param {*} sceneName : 场景名称
     */
    loadingScene(sceneName) {
        cc.director.preloadScene(sceneName, () => {
            cc.director.loadScene(sceneName);
        });
    },
    /**
     * 场景动态加载图层
     * @param {*} panelName ：图层路径
     */
    loadingLayer(panelName) {
        cc.loader.loadRes(panelName, (err, prefab) => {
            if (!err) {
                let node = cc.instantiate(prefab);
                cc.director.getScene().children[0].addChild(node);
            }
        });
    },
    /**
     * 初始化预制
     * @param {*} prefab ：预制件
     */
    initPrefab(prefab) {
        let node = cc.instantiate(prefab);
        cc.director.getScene().children[0].addChild(node); 
    },
    /**
     * 移除图层
     */
    unLoadingLayer(node) {
        cc.director.getScene().children[0].removeChild(node);
    },
};

export default GameUITools;