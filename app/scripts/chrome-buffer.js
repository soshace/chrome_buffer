ChromeBuffer = (function (w) {
    "use strict";
    var $parent,
        $modal,
        $shadow,
        $commentField,
        $submitBtn,

        $detailsField,
        $thumbnail,
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
            $modal = $('<div class="buffer-overlay__share-modal"></div>');
            $shadow = $('<div class="buffer-overlay__shadow"></div>');
            $commentField = $('<textarea></textarea>');
            $submitBtn = $('<button type="submit">Share</button>');

            $detailsField = $('<div class="buffer-overlay__share-modal__details"></div>');
            $thumbnail = $('<div class="thumbnail"></div>')
            $imageBox = $('<img />');
            $titleField = $('<h3 class="title" contenteditable="true" data-field="title"></h3>');
            $textField = $('<div class="text-content" contenteditable="true" data-field="text"></div>');
            $urlField = $('<a target="_blank" class="url"></a>');

            $detailsField.append($thumbnail);
            $thumbnail.append($imageBox);
            $detailsField.append($titleField);
            $detailsField.append($urlField);
            $detailsField.append($textField);

            $parent.appendTo($('body'));
            $parent.append($shadow);
            $parent.append($modal);
            $modal.append($commentField);
            $modal.append($detailsField);
            $modal.append($submitBtn);

            $titleField.blur(this._onEditableBlur);
            $textField.blur(this._onEditableBlur);

            $submitBtn.click(this.addPost.bind(this));
            $shadow.click(this.closeParent);
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

            $commentField.val('');
        },

        prepareShare: function (data) {
            this.clearShare();

            if (data.title) {
                sharedData.title = data.title;
                $titleField.text(data.title);
                $titleField.show();

            }
            if (data.url) {
                sharedData.url = data.url;
                $urlField.attr('href', data.url);
                $urlField.text(data.url);

                $urlField.show();
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

            sharedData.service = data.service;

        },

        addPost: function () {
            sharedData.comment = $commentField.val();
            sharedData.date = (new Date()).toString();
            PostStorage.push(sharedData, this.closeParent);
        },

        closeParent: function () {
            $parent.hide()
        },

        _onEditableBlur: function () {
            var field = $(this).data('field');
            sharedData[field] = this.innerText;
        }
    };
})(window);

