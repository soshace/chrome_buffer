PostStorage = (function (w) {
    "use strict";
    var syncStorage = chrome.storage.sync,
        storageName = 'buffer_posts';

    return {
        push: function (post, cb) {
            syncStorage.get(storageName, function (data) {
                var currentPosts = [],
                    res = {}
                    ;
                if (data[storageName]) {
                    currentPosts = JSON.parse(data[storageName])
                }

                if (currentPosts instanceof Array) {
                    currentPosts.push(post)
                }
                res[storageName] = JSON.stringify(currentPosts);
                syncStorage.set(res, cb);
            });
        },

        get: function (key, cb) {
            syncStorage.get(storageName, function (data) {
                var currentPosts = JSON.parse(data[storageName]);
                cb(currentPosts);
            });
        }
    }

})(window);
