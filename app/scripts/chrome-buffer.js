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

        user = {
            email: ""
        },

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

            $parent.appendTo($('body'));

            $parent
                .contents()
                .find('body')
                .loadTemplate(chrome.extension.getURL('templates/spinning-icon.html'), {
                        spinningIconSrc: chrome.extension.getURL('images/ajax-loader.gif')
                    }, {
                        prepend: true
                    });
            $parent.contents().find('body').append($shadow);
            $parent.contents().find('body').append($modal);

            $shadow.click(this.closeParent);

            this.appendStyles($parent, MODAL_STYLES);
        },

        showLoginModal: function(postData) {
            var $authContainer = $modal.find('.auth-container');

            if ($authContainer.length) {
                $authContainer.show();
                return;
            }

            $modal.loadTemplate(chrome.extension.getURL('templates/auth.html'), {}, { append: true });

            $modal.on('click', '.buffer-overlay__share-modal__close', this.closeParent);

            $modal.on('click', '#sign-in-account', { postData: postData }, this.signIn.bind(this));
            $modal.on('click', '#create-account', { postData: postData }, this.createAccount.bind(this));

            $modal.on('focus', '#emailField', this.resetLoginWarnings);
            $modal.on('focus', '#passwordField', this.resetLoginWarnings);
        },

        removeLoginModal: function() {
            $modal.find('.auth-container').hide();

            //@todo: remove when auth modal will be stable
            //$modal.off('click', '#sign-in-account', this.signIn.bind(this));
            //$modal.off('click', '#create-account', this.createAccount);
            //
            //$modal.off('focus', '#emailField', this.resetLoginWarnings);
            //$modal.off('focus', '#passwordField', this.resetLoginWarnings);
        },

        showMainWindow: function(postData) {
            var self = this;

            this.removeLoginModal();
            $modal.css('background-color', 'white');

            // if main body is still exists do not render it again
            if ($modal.find('.header-container').length) {
                $modal.find('.header-container').show();
                $modal.find('.buffer-overlay__share-modal__details').show();
                $modal.find('.buffer-overlay__share-modal__close.main-window').show();
                $modal.find('.footer').show();
                self.prepareShare(postData);
                return;
            }

            // give an order to template async loading process
            $.Deferred().resolve().then(function() {
                $modal.loadTemplate(chrome.extension.getURL('templates/header.html'), {
                    userEmail : user.email
                }, {
                    prepend: true,
                    complete: function() {
                        return $.Deferred().resolve();
                    }
                });
            }).then(function() {
                $modal
                    .loadTemplate(chrome.extension.getURL('templates/main-body.html'), {}, {
                        append: true,
                        complete: function() {
                            $titleField = $modal.find('.title');
                            $textField = $modal.find('.text-content');
                            $urlField = $modal.find('.url');
                            $commentField = $modal.find('.comment');
                            $thumbnail = $modal.find('.thumbnail');
                            self.prepareShare(postData);
                            return $.Deferred().resolve();
                        }
                    });
            }).then(function() {
                $modal.loadTemplate(chrome.extension.getURL('templates/footer.html'), {}, { append: true });
            });

            $modal.on('blur', '.title', this._onEditableBlur);
            $modal.on('blur', '.text-content', this._onEditableBlur);

            $modal.on('click', '#addPostButton', this.addPost.bind(this));
            $modal.on('click', '.buffer-overlay__share-modal__close', this.closeParent);

            $modal.on('click', '.logout', { postData: postData }, this.logOut.bind(this));
        },

        hideModalWindow: function() {
            $modal.find('.header-container').hide();
            $modal.find('.buffer-overlay__share-modal__details').hide();
            $modal.find('.buffer-overlay__share-modal__close.main-window').hide();
            $modal.find('.footer').hide();
        },

        resetLoginWarnings: function() {
            $modal.find('#emailField').css('background-color', 'white');
            $modal.find('#passwordField').css('background-color', 'white');
        },

        // testing auth by sending login and password
        signIn: function(event) {
            var $emailField = $modal.find('#emailField'),
                $passwordField = $modal.find('#passwordField'),
                self = this;

            $.post('https://127.0.0.1:8081/auth/login', {
                email: $emailField.val(),
                password: $passwordField.val()
            })
            .success(function(data, textStatus, jqXHR) {
                console.log(arguments);
                user.email = $emailField.val();
                self.showMainWindow(event.data.postData);
                $emailField.val('');
                $passwordField.val('');
            })
            .fail(function(jqXHR, textStatus, errorThrown) {
                console.log(arguments);
                $emailField.css('background-color', 'rgb(255, 210, 204)');
                $passwordField.css('background-color', 'rgb(255, 210, 204)');
            })
        },

        logOut: function(event) {
            var self = this;

            $.post('https://127.0.0.1:8081/auth/logout')
                .success(function(data, textStatus, jqXHR) {
                    console.log(arguments);
                    user.email = "";
                    self.hideModalWindow();
                    self.showLoginModal(event.data.postData);
                })
                .fail(function(jqXHR, textStatus, errorThrown) {
                    console.log(arguments);
                    console.error('Cannot log out!');
                })
        },

        createAccount: function(event) {
            var $emailField = $modal.find('#emailField'),
                $passwordField = $modal.find('#passwordField'),
                self = this;

            $.post('https://127.0.0.1:8081/auth/register', {
                email: $emailField.val(),
                password: $passwordField.val()
            })
            .success(function(data, textStatus, jqXHR) {
                console.log(arguments);
                user.email = $emailField.val();
                self.showMainWindow(event.data.postData);
                $emailField.val('');
                $passwordField.val('');
            })
            .fail(function(jqXHR, textStatus, errorThrown) {
                console.log(arguments);
                console.error('Cannot register new user!');
                $emailField.css('background-color', 'rgb(255, 210, 204)');
                $passwordField.css('background-color', 'rgb(255, 210, 204)');
            })
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

        toggleOverlay: function(postData) {
            var self = this;

            if (!$parent) {
                this.init();
            }

            if ($parent.is(":visible")) {
                $parent.hide();
            } else {
                 //check if extensions is logged in or not
                $.get('https://127.0.0.1:8081/api/email')
                    .success(function(data, textStatus, jqXHR) {
                        user.email = data;
                        self.showMainWindow(postData);
                    })
                    .fail(function(jqXHR, textStatus, errorThrown) {
                        self.showLoginModal(postData);
                    })
                    .always(function(data, textStatus, jqXHR) {
                        $parent.show();
                    });
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
            $parent.hide();
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

