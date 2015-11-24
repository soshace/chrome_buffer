PostStorage = (function (w) {
    "use strict";
    var syncStorage = chrome.storage.local,
        storageName = 'buffer_posts';

    return {
        push: function (post, cb) {
            syncStorage.get(storageName, function (data) {
                var currentPosts = JSON.parse(data[storageName]),
                    res = {}
                    ;
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
