ChromeBuffer = (function (w) {
    "use strict";
    var $parent,
        $modal,
        $shadow,
        $commentField,
        $submitBtn,
        $closeBtn,

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
        },
        TEXT_LENGTH = 150
        ;
    return {

        init: function () {

            /*
             *    <div class="buffer-overlay" style="">
             *      <div class="buffer-overlay__shadow"></div>
             *      <div class="buffer-overlay__share-modal">
             *          <textarea></textarea>
             *          <div class="buffer-overlay__share-modal__details">
             *              <div class="thumbnail"><img src="" style="display: block;"></div>
             *              <h3 class="title" contenteditable="true" data-field="title" style="display: none;"></h3>
             *              <a target="_blank" class="url" href="" style="display: block;"></a>
             *              <div class="text-content" contenteditable="true" data-field="text" style="display: block;"></div>
             *          </div>
             *          <button type="submit">Share</button>
             *       </div>
             *    </div>
             */

            $parent = $('<div class="buffer-overlay" style="display: none"></div>');
            $modal = $('<div class="buffer-overlay__share-modal"></div>');
            $shadow = $('<div class="buffer-overlay__shadow"></div>');

            $commentField = $('<textarea placeholder="What would you like to add?"></textarea>');
            $submitBtn = $('<button type="submit">Add</button>');
            $closeBtn = $('<div class="buffer-overlay__share-modal__close"><span>x</span></div>');

            $detailsField = $('<div class="buffer-overlay__share-modal__details"></div>');
            $thumbnail = $('<div class="thumbnail"></div>');
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
            $modal.append($closeBtn);

            $titleField.blur(this._onEditableBlur);
            $textField.blur(this._onEditableBlur);

            $submitBtn.click(this.addPost.bind(this));
            $shadow.click(this.closeParent);
            $closeBtn.click(this.closeParent);
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
                $textField.text(data.text.slice(0, TEXT_LENGTH));
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

