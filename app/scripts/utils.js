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
        }
    }
})(jQuery, window);