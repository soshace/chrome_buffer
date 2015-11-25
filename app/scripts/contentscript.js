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
        $urlField,
        sharedData = {
            title: '',
            imageSrc: '',
            text: '',
            url: '',
            comment: ''
        }
        ;
    return {

        init: function () {
            $parent = $('<div class="buffer-overlay" style="display: none"></div>');
            $modal = $('<div class="share-modal"></div>');
            $shadow = $('<div class="shadow"></div>');
            $commentField = $('<textarea></textarea>');
            $submitBtn = $('<button type="submit">Share</button>');

            $imageBox = $('<img class="thumbnail"/>');
            $titleField = $('<h3 class="title"></h3>');
            $textField = $('<div class="text-content"></div>');
            $urlField = $('<a target="_blank" class="url"></a>');

            $parent.appendTo($('body'));
            $parent.append($shadow);
            $parent.append($modal);
            $modal.append($commentField);
            $modal.append($submitBtn);

            $modal.append($imageBox);
            $modal.append($titleField);
            $modal.append($urlField);
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
                this.prepareShare(data);
                $parent.show();
            }
        },

        clearShare: function () {
            for (var key in sharedData) {
                sharedData[key] = '';
            }
            $titleField.hide();
            $imageBox.hide();
            $textField.hide();
            $urlField.hide();
        },

        prepareShare: function (data) {
            this.clearShare();

            if (data.title) {
                sharedData.title = data.title;
                $titleField.text(data.title);
                $titleField.show();

                if (data.url) {
                    sharedData.url = data.url;
                    $urlField.attr('href', data.url);
                    $urlField.text(data.url);

                    $textField.show();
                    $urlField.show();
                }
            }
            if (data.imageSrc) {
                sharedData.imageSrc = data.imageSrc;
                $imageBox.attr('src', data.imageSrc);
                $imageBox.show();
            }
            if (data.text) {
                sharedData.text = data.text;
                $textField.text(data.text);
                $textField.show();
            }

        },

        addPost: function () {
            sharedData.comment = $commentField.val();
            PostStorage.push(sharedData);
        }

    };

    function closeParent() {
        $parent.hide()
    }


})(window);

