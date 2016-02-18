Utils = (function ($, w) {
    "use strict";

    return {
        getImageSources: function (selector, $parent) {
            var $images = $parent.find(selector),
                sources = []
                ;
            $images.each(function (index, $img) {
                sources.push($($img)[0].src)
            });

            return sources;
        },

        assembleApiUrl: function(apiUrl) {
            var protocol  = 'https',
                host      = '127.0.0.1',
                port      = '8081';

            return protocol + '://' + host + ':' + port + '/' + apiUrl + '/';
        }
    }
})(jQuery, window);