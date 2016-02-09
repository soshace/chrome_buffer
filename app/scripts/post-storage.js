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
        // currently https is set as default
        var protocol = 'https:',
            port = protocol === 'https:' ? 8081 : 8080,
            url = protocol + '//127.0.0.1:' + port + '/api/posts/'
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
