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
            imageSources: [],
            text: '',
            url: '',
            comment: ''
        },
        TEXT_LENGTH = 150,

        IMAGE_CONTAINER_WIDTH = 240,
        IMAGE_CONTAINER_HEIGHT = 120,

        MODAL_STYLES = [
            '/styles/overlay.css',
            '/bower_components/slick-carousel/slick/slick-theme.css',
            '/bower_components/slick-carousel/slick/slick.css'
        ]
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

            $parent = $('<iframe class="buffer-overlay" style="display: none"></iframe>');
            $modal = $('<div class="buffer-overlay__share-modal"></div>');
            $shadow = $('<div class="buffer-overlay__shadow"></div>');

            $commentField = $('<textarea class="comment" placeholder="What would you like to add?"></textarea>');
            $submitBtn = $('<button type="submit">Add</button>');
            $closeBtn = $('<div class="buffer-overlay__share-modal__close"><span>x</span></div>');

            $detailsField = $('<div class="buffer-overlay__share-modal__details"></div>');
            $thumbnail = $('<div class="thumbnail"></div>');
            $titleField = $('<h3 class="title" contenteditable="true" data-field="title"></h3>');
            $textField = $('<div class="text-content" contenteditable="true" data-field="text"></div>');
            $urlField = $('<a target="_blank" class="url"></a>');

            $detailsField.append($commentField);
            $detailsField.append($thumbnail);
            $detailsField.append($titleField);
            $detailsField.append($urlField);
            $detailsField.append($textField);

            // Useless part of modal window
            $modal.append($("<div/>").loadTemplate("chrome-extension://" + chrome.runtime.id + "/templates/header.html"));

            $parent.appendTo($('body'));

            $modal.append($detailsField);
            $modal.append($submitBtn);
            $modal.append($closeBtn);

            // Useless part of modal window
            $modal.append($("<div/>").loadTemplate("chrome-extension://" + chrome.runtime.id + "/templates/footer.html"));

            $titleField.blur(this._onEditableBlur);
            $textField.blur(this._onEditableBlur);

            $submitBtn.click(this.addPost.bind(this));
            $shadow.click(this.closeParent);
            $closeBtn.click(this.closeParent);

            $parent.contents().find('body').append($shadow);
            $parent.contents().find('body').append($modal);

            this.appendStyles($parent, MODAL_STYLES);
        },

        appendStyles: function ($window, stylesArray) {
            var $link;
            stylesArray.forEach(function (styleHref) {
                $link = $('<link />');
                $link.attr('rel', 'stylesheet');
                $link.attr('type', 'text/css');
                $link.attr('href', 'chrome-extension://' + chrome.runtime.id + styleHref);
                $window.contents().find('head').append($link);
            });
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
            sharedData['imageSources'] = [];

            $titleField.hide();
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
            $thumbnail.empty();
            if (data.imageSources.length) {
                sharedData.imageSources = data.imageSources;
                this.appendThumbnailImages(data.imageSources, $thumbnail);
            }
            if (data.text) {
                sharedData.text = data.text;
                $textField.text(data.text.slice(0, TEXT_LENGTH));
                $textField.show();
            }

            sharedData.service = data.service;

        },

        appendThumbnailImages: function (sources, $parent) {
            var $img,
                $imageContainer,
                $div = $('<div></div>'),
                self = this
                ;

            if (!(sources instanceof Array)) {
                sources = [sources];
            }
            sources.forEach(function (src) {
                $imageContainer = $('<div class="image-container"></div>');
                $img = $('<img />');
                $img.attr('src', src);
                $img.load((function () {
                    self.styleThumbImage(this);
                }).bind($img));
                $img.show();
                $imageContainer.append($img);
                $div.append($imageContainer);
            });

            $parent.append($div);
            setTimeout(function () {
                $div.slick({
                    infinite: true,
                    speed: 500,
                    fade: true,
                    cssEase: 'linear'
                });
            }, 0)
        },

        addPost: function (e) {
            var $el = $(e.target),
                self = this;
            sharedData.comment = $commentField.val();
            sharedData.date = (new Date()).toString();
            PostStorage.push(sharedData, function () {
                $el.addClass('bg-green');
                $el.text('Added');
                setTimeout(function () {
                    self.closeParent();
                    $el.removeClass('bg-green');
                    $el.text('Add');
                }, 1500)
            });
        },

        closeParent: function () {
            $parent.hide()
        },

        styleThumbImage: function ($img) {
            var styles = {},
                imgWidth = $img.width(),
                imgHeight = $img.height(),
                containerRatio = IMAGE_CONTAINER_WIDTH / IMAGE_CONTAINER_HEIGHT,
                imgRatio = imgWidth / imgHeight
                ;
            if (imgRatio > containerRatio) {
                $img.width('100%');
                styles = {
                    'margin-top': -$img.height() / 2 + 'px',
                    'top': '50%',
                    'left': 0
                };
            } else {
                $img.height('100%');
                styles = {
                    'margin-left': -$img.width() / 2 + 'px',
                    'left': '50%',
                    'top': 0
                };
            }
            $img.css(styles);
        },

        _onEditableBlur: function () {
            var field = $(this).data('field');
            sharedData[field] = this.innerText;
        }
    };
})(window);

