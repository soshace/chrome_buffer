ChromeBuffer = (function (w) {
    "use strict";
    var $parent,
        $modal,
        $shadow,
        $commentField,
        $submitBtn,
        $closeBtn,

        $folderDropdown,

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
            comment: '',
            folder: ''
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

            $shadow.click(this.closeParent.bind(this));

            this.appendStyles($parent, MODAL_STYLES);
        },

        showLoginModal: function(postData) {
            var $authContainer = $modal.find('.auth-container'),
                postDataToSend = $.extend(true, {}, postData);

            $modal.off('click', '#sign-in-account', this.signIn.bind(this));
            $modal.off('click', '#create-account', this.createAccount.bind(this));

            $modal.on('click', '#sign-in-account', { postData: postDataToSend }, this.signIn.bind(this));
            $modal.on('click', '#create-account', { postData: postDataToSend }, this.createAccount.bind(this));

            if ($authContainer.length) {
                $authContainer.show();
                return;
            }

            $modal.loadTemplate(chrome.extension.getURL('templates/auth.html'), {}, { append: true });

            $modal.on('click', '.buffer-overlay__share-modal__close', this.closeParent.bind(this));

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
            var self = this,
                postDataToSend = $.extend(true, {}, postData),
                $headerDeferred = $.Deferred(),
                $bodyDeferred = $.Deferred(),
                $footerDeferred = $.Deferred();

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
            $modal.loadTemplate(chrome.extension.getURL('templates/header.html'), {
                userEmail : user.email
            }, {
                prepend: true,
                complete: function() {
                    $headerDeferred.resolve();
                }
            });

            $.when($headerDeferred).done(function() {
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
                            $bodyDeferred.resolve();
                        }
                    });
            });

            $.when($headerDeferred, $bodyDeferred).done(function() {
                $modal.loadTemplate(chrome.extension.getURL('templates/footer.html'), {}, {
                    append: true,
                    complete: function () {
                        $folderDropdown = $modal.find('.folderDropdown');
                        $folderDropdown.on('click', self.addPost.bind(self));
                        $folderDropdown.on('focus', '#createNewFolderInput', self.resetLoginWarnings);
                        $footerDeferred.resolve();
                    }
                });
            });

            $modal.on('blur', '.title', this._onEditableBlur);
            $modal.on('blur', '.text-content', this._onEditableBlur);

            $modal.off('click', '.addPostButton', this.toggleAddButton.bind(this));
            $modal.off('click', '.addPostDropdownArrowWrapper', this.toggleAddButton.bind(this));
            $modal.off('click', '.buffer-overlay__share-modal__close', this.closeParent.bind(this));

            $modal.on('click', '.addPostButton', { postData: postDataToSend }, this.toggleAddButton.bind(this));
            $modal.on('click', '.addPostDropdownArrowWrapper', { postData: postDataToSend }, this.toggleAddButton.bind(this));
            $modal.on('click', '.buffer-overlay__share-modal__close', this.closeParent.bind(this));

            $modal.off('click', '.logout', { postData: postDataToSend }, this.logOut.bind(this));
            $modal.on('click', '.logout', { postData: postDataToSend }, this.logOut.bind(this));
        },

        hideMainWindow: function() {
            $modal.find('.header-container').hide();
            $modal.find('.buffer-overlay__share-modal__details').hide();
            $modal.find('.buffer-overlay__share-modal__close.main-window').hide();
            $modal.find('.footer').hide();
        },

        resetLoginWarnings: function() {
            $modal.find('#emailField').css('background-color', 'white');
            $modal.find('#passwordField').css('background-color', 'white');
            $modal.find('#createNewFolderInput').css('background-color', 'white');
        },

        // testing auth by sending login and password
        signIn: function(event) {
            var $emailField = $modal.find('#emailField'),
                $passwordField = $modal.find('#passwordField'),
                apiUrl = Utils.assembleApiUrl('auth/login'),
                self = this;

            $.post(apiUrl, {
                email: $emailField.val(),
                password: $passwordField.val()
            })
            .success(function(data, textStatus, jqXHR) {
                console.log(arguments);
                user.email = $emailField.val();
                self.showMainWindow($.extend(true, {}, event.data.postData));
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
            var self = this,
                apiUrl = Utils.assembleApiUrl('auth/logout');

            $.post(apiUrl)
                .success(function(data, textStatus, jqXHR) {
                    console.log(arguments);
                    user.email = "";
                    self.hideMainWindow();
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
                apiUrl = Utils.assembleApiUrl('auth/register'),
                self = this;

            $.post(apiUrl, {
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
            var self = this,
                apiUrl = Utils.assembleApiUrl('api/email');

            if (!$parent) {
                this.init();
            }

            if ($parent.is(":visible")) {
                $parent.hide();
            } else {
                 //check if extensions is logged in or not
                $.get(apiUrl)
                    .success(function(data, textStatus, jqXHR) {
                        user.email = data;
                        self.showMainWindow(postData);
                    })
                    .fail(function(jqXHR, textStatus, errorThrown) {
                        self.hideMainWindow();
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
            if (data.comment) {
                sharedData.comment = data.comment;
                $commentField.val(data.comment);
                $commentField.show();
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

        toggleAddButton: function(event) {
            var $el = $(event.target),
                self = this,
                apiUrl = Utils.assembleApiUrl('api/folders');

            // change target class if arrow button was clicked
            if ($el.hasClass('addPostDropdownArrow') || $el.hasClass('addPostDropdownArrowWrapper')) {
                $el = $modal.find('.addPostButton');
            }

            if ($folderDropdown.children().length !== 1) {
                $el.text('Add');
                self.toggleFolderDropdown();
                return;
            }
            $el.text('Fetching folders...');

            $.get(apiUrl)
                .success(function(data, textStatus, jqXHR) {
                    self.toggleFolderDropdown(JSON.parse(data));
                    $el.text('Select folder...');
                })
                .fail(function(jqXHR, textStatus, errorThrown) {
                    if (jqXHR.status === 401) {
                        self.hideMainWindow();
                        event.data.postData.comment = $commentField.val();
                        self.showLoginModal(event.data.postData);
                    } else {
                        console.warn('Failed to fetch folders from the server');
                    }
                    $el.text('Add');
                    self.toggleFolderDropdown();
                })
        },

        toggleFolderDropdown: function(elements) {
            var $folderInput = $modal.find('#createNewFolderInput');
            $folderInput.val('');

            if (!elements) {
                $modal.find('.addPostButton').text('Add');
                if ($folderDropdown) {
                    $folderDropdown.hide();
                    // delete items without input
                    $folderDropdown.find('.folderDropdownItem:not(:has(input))').remove();
                }
                return;
            }
            // selects item with input (create folder item)
            var item = $folderDropdown.find('.folderDropdownItem');
            $.each(elements, function(index, folder) {
                var $clonedItem = item.clone();
                $clonedItem.text(folder);
                $folderDropdown.prepend($clonedItem);
            });
            $folderDropdown.show();

        },

        addPost: function (e) {
            var $addButton = $modal.find('.addPostButton'),
                $addButtonArrow = $modal.find('.addPostDropdownArrowWrapper'),
                $folderInput = $modal.find('#createNewFolderInput'),
                $el = $(e.target),
                self = this;

            if (!$el.hasClass('folderDropdownItem') && $el.attr('id') !== 'createNewFolderButton') {
                return;
            }

            if ($el.attr('id') === 'createNewFolderButton' && $folderInput.val() === '') {
                $folderInput.css('background-color', 'rgb(255, 210, 204)');
                return;
            } else if ($el.attr('id') === 'createNewFolderButton' && $folderInput.val() !== '') {
                sharedData.folder = $folderInput.val();
            } else {
                sharedData.folder = $el.text();
            }

            sharedData.comment = $commentField.val();
            sharedData.date = (new Date()).toString();
            PostStorage.push(sharedData, function () {
                self.toggleFolderDropdown();
                $addButton.addClass('bg-green');
                $addButtonArrow.addClass('bg-green');
                $addButton.text('Added');
                setTimeout(function () {
                    self.closeParent();
                    $addButton.removeClass('bg-green');
                    $addButtonArrow.removeClass('bg-green');
                    $addButton.text('Add');
                }, 1500)
            }, function(err) {
                if (err.status === 401) {
                    self.hideMainWindow();
                    self.showLoginModal($.extend(true, {}, sharedData));
                    self.toggleFolderDropdown();
                } else {
                    console.log('Post cannot be posted to server');
                }
            });
        },

        closeParent: function () {
            $parent.hide();
            this.toggleFolderDropdown();
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

