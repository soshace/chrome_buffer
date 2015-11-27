PostStorage = (function ($, w) {
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

                savePost(post, function () {
                    syncStorage.set(res, cb);
                });
            });
        },

        get: function (key, cb) {
            syncStorage.get(storageName, function (data) {
                var currentPosts = JSON.parse(data[storageName]);
                cb(currentPosts);
            });
        }
    };

    function savePost(post, successCb) {
        var protocol = location.protocol,
            port = protocol == 'http:' ? 8080 : 8081,
            url = '//127.0.0.1:' + port + '/posts'
            ;
        $.ajax({
            url: url,
            type: 'PUT',
            data: JSON.stringify(post),
            contentType: 'application/json',
            success: successCb
        });
    }

})(jQuery, window);
