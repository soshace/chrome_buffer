ChromeBuffer = (function (w) {
    "use strict";
    var $parent,
        $modal,
        $shadow,
        $commentField,
        $submitBtn,
        $imageBox,
        $titleField,
        $textField,
        sharedData = {}
        ;
    return {

        init: function () {
            $parent = $('<div class="buffer-overlay" style="display: none"></div>');
            $modal = $('<div class="modal"></div>');
            $shadow = $('<div class="shadow"></div>');
            $commentField = $('<textarea></textarea>');
            $submitBtn = $('<button type="submit">Share</button>');

            $imageBox = $('<img class="thumbnail"/>');
            $titleField = $('<h3 class="title"></h3>');
            $textField = $('<div class="text-content"></div>');


            $parent.appendTo($('body'));
            $parent.append($shadow);
            $parent.append($modal);
            $modal.append($commentField);
            $modal.append($submitBtn);

            $modal.append($imageBox);
            $modal.append($titleField);
            $modal.append($textField);

            $submitBtn.click(this.addPost);
            $shadow.click(closeParent);
        },

        toggleOverlay: function (data) {
            if (!$parent) {
                this.init();
            }

            if ($parent.is(":visible")) {
                $parent.hide();
            } else {
                $parent.show();
                this.prepareShare(data);
            }
        },

        prepareShare: function (data) {
            if (data.title) {
                sharedData.title = data.title;
                $titleField.text(data.title);
            }
            if (data.imageSrc) {
                sharedData.imageSrc = data.imageSrc;
                $imageBox.attr('src', data.imageSrc);
            }
            if (data.text) {
                sharedData.text = data.text;
                $textField.text(data.text);
            }
        },

        addPost: function () {
            debugger;
            PostStorage.push(sharedData);
        }

    };

    function closeParent() {
        $parent.hide()
    }


})(window);

