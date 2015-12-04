(function ($) {
    var SERVICE_NAME = 'twitter',
        postSelector = [
            '.stream-item-footer .js-actions'
        ].join(', '),
        compareChildSelector = '.ProfileTweet-action--buffer-share',
        sharedData = {
            title: '',
            text: '',
            imageSources: [],
            url: ''
        },

        imageSelector = [
            '.OldMedia [data-image-url] img'
        ].join(', '),

        titleSelector = [
            '.tweet-text'
        ].join(','),

        textSelector = [].join(', '),

        urlSelector = [
            '[data-expanded-url]'
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
            if (!$(el).has(compareChildSelector).length) {
                $shareBtn = createTwitterActionButton();
                $shareBtn.click(onShareBtnClick.bind($shareBtn));

                $(el).append($shareBtn);
            }
        });
    }

    function createTwitterActionButton() {
        var $action = $('<div></div>'),
            $button = $('<button></button>'),
            $iconCntr = $('<div></div>'),
            $icon = $('<span></span>'),
            $circle = $('<span></span>'),
            $circleFill = $('<span></span>'),
            $text = $('<span></span>')
            ;

        $action.attr('class', 'ProfileTweet-action ProfileTweet-action--buffer-share js-toggleState');
        $button.attr('class', 'ProfileTweet-actionButton js-actionButton');
        $iconCntr.attr('class', 'IconContainer js-tooltip');
        $icon.attr('class', 'Icon Icon--buffer-share');
        $circle.attr('class', 'Icon Icon--circle');
        $circleFill.attr('class', 'Icon Icon--circleFill');
        $text.attr('class', 'u-hiddenVisually');
        $text.text('Buffer');

        $iconCntr.append($circleFill);
        $iconCntr.append($circle);
        $iconCntr.append($icon);
        $iconCntr.append($text);
        $button.append($iconCntr);
        $action.append($button);

        return $action;
    }

    function onShareBtnClick() {
        var currentPost = $(this).parents('.permalink-tweet-container, .original-tweet-container, li[data-item-type="tweet"]').first();
        updateSharedData(currentPost);
        ChromeBuffer.toggleOverlay(sharedData);
    }

    function updateSharedData(currentPost) {
        var $textElem = currentPost.find(textSelector).first(),
            $urlElem = currentPost.find(urlSelector).first(),
            $titleElem = currentPost.find(titleSelector).first()
            ;

        sharedData['imageSources'] = Utils.getImageSources(imageSelector, currentPost);
        sharedData['title'] = $titleElem.length && $titleElem.text();
        sharedData['url'] = $urlElem.length && $urlElem.attr('href');
        sharedData['text'] = $textElem.length && $textElem.text();
        sharedData['service'] = SERVICE_NAME;
        return sharedData;
    }


})(jQuery);