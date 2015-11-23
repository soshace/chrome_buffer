ChromeBuffer = (function (w) {
    "use strict";
    var $parent,
        $modal,
        $shadow,
        $messageField,
        $submitBtn,
        sharedData = {
            title: '',
            text: '',
            imageSrc: ''
        }
        ;
    return {

        init: function () {
            $parent = $('<div class="buffer-overlay" style="display: none"></div>');
            $modal = $('<div class="modal"></div>');
            $shadow = $('<div class="shadow"></div>');
            $messageField = $('<textarea></textarea>');
            $submitBtn = $('<button type="submit">Share</button>');


            $parent.appendTo($('body'));
            $parent.append($shadow);
            $parent.append($modal);
            $modal.append($messageField);
            $modal.append($submitBtn);

            $submitBtn.click(onSubmit.bind($submitBtn));
            $shadow.click(closeParent);
        },

        toggleOverlay: function () {
            debugger;
            $parent.toggle();
        }
    };

    function closeParent() {
        $parent.hide()
    }

    function onSubmit() {
        data = getPostData();
    }

    function getPostData() {

    }

})(window);

