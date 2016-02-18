(function ($) {
    var SERVICE_NAME = 'linkedin',
        attached = false,
        postSelector = [
            '.feed-update.channel-recommend-article',
            '.feed-update.member-share-article',
            '.feed-update.member-reshare-article',
            '.feed-update.company-share-article',
            '.feed-update.school-share-article',
            '.feed-update.member-like-share',
            '.feed-update.member-comment-share',
            '.feed-update.member-follow-company',
            '.feed-update.people-follow-recommend',
            '.feed-update.member-reshare-richmedia',
            '.feed-update.member-like-poncho-post',

            'article'
        ].join(', '),

        compareChildSelector = [
            'li .buffer-share',
            'a.buffer-share'
        ].join(', '),

        sharedData = {
            title: '',
            text: '',
            imageSources: [],
            url: ''
        },

        imageSelector = [
            '.content .side-article a .image-container img',
            '.content .rich-media a .image-container img',
            '.content .shared-image img',
            '.content .video-embedded img.video-thumbnail',

            '.article-cover img',
            '.article-content img'
        ].join(', '),

        titleSelector = [
            '.content .side-article .side .content a h4',
            '.content .rich-media .side .content a h4',
            '.content .video-embedded .embedly-info h4',
            '.content .sub-headline',

            '.article-title'
        ].join(', '),

        textPrioritySelector = '.content .side-article .side .content a .snippet-container',

        textSelector = [
            '.content .rich-media .side .content a .snippet-container',
            '.content .video-embedded .embedly-info p',
            '.content .text-entity p',

            '.article-body p'
        ].join(', '),

        urlSelector = [
            '.content .side-article .side .content a',
            '.content .rich-media .side .content a',
            '.content .text-entity a'
        ].join(', '),

        // For video links that stored in data-href
        videoUrlSelector = [
            '.content .video-thumbnail-container'
        ].join(', ')
        ;

    check();

    function check() {
        if (ChromeBuffer) {
            attachShareButton();
            setTimeout(check, 1500);
        }
    }

    function attachShareButton() {
        var $shareContainer = $(postSelector),
            $shareBtn;

        $shareContainer.each(function (index, el) {
            var linkedInArticles = false,
                $actions;
            if ($(el).is('article')) {
                linkedInArticles = true;
                $actions = $(el).find('.article-comments .actions');
            } else {
                $actions = $(el).find('.actions');
            }

            if (!$actions.has(compareChildSelector).length) {
                $shareBtn = createLinkedinActionButton(linkedInArticles);
                $shareBtn.click(onShareBtnClick.bind($shareBtn));

                $actions.append($shareBtn);
            }
        });
    }

    function createLinkedinActionButton(linkedInArticle) {
        var $action,
            $button,
            $text,
            $link;

        if (linkedInArticle) {
            $link = $('<a class="buffer-share"></a>');
            $text = $('<span></span>');

            $link.append($text);
            $text.text('Add  ');

            return $link;
        } else {
            $action = $('<li></li>');
            $button = $('<button class="buffer-share"></button>');
            $text = $('<span></span>');

            $button.append($text);
            $text.text('Add');
            $action.append($button);

            return $action;
        }
    }

    function onShareBtnClick() {
        var currentPost = $(this).parents(postSelector).first(),
            linkedInArticle = false;

        if ($(currentPost).is('article')) {
            linkedInArticle = true;
        }
        updateSharedData(currentPost, linkedInArticle);
        ChromeBuffer.toggleOverlay(sharedData);
    }

    function updateSharedData(currentPost, linkedInArticle) {
        var $textElem = getTextElementByPriority(currentPost, textPrioritySelector, textSelector),
            $urlElem = currentPost.find(urlSelector).first(),
            $titleElem = currentPost.find(titleSelector).first()
            ;

        sharedData['imageSources'] = Utils.getImageSources(imageSelector, currentPost);
        sharedData['title'] = $titleElem.length && $titleElem.text();
        sharedData['url'] = $urlElem.attr('href') || currentPost.find(videoUrlSelector).data('href');
        sharedData['text'] = $textElem.length && $textElem.text();
        sharedData['service'] = SERVICE_NAME;

        if (linkedInArticle) {
            sharedData['url'] = window.location.href;
        }

        return sharedData;
    }

    /**
     * Gets $textElement using priority and checking if element has a text
     * @param {object} currentPost            jquery current param object
     * @param {string} priorityTextSelector   high priority selector to choose
     * @param {string} textSelector           remaining selector to use
     */
    function getTextElementByPriority(currentPost, priorityTextSelector, textSelector) {
        var $textElem = currentPost.find(priorityTextSelector).first(),
            textElementWasFound = false;

        if ($textElem.length && $textElem.text() !== '') {
            return $textElem;
        } else {
            currentPost.find(textSelector).each(function(index, el) {
                if ($(el).text() !== '' && !textElementWasFound) {
                    $textElem = $(el);
                    textElementWasFound = true;
                }
            });
        }

        return $textElem;
    }


})(jQuery);

