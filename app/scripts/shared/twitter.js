(function ($) {
    var attached = false,
        sharedData = {
            title: '',
            text: '',
            imageSrc: '',
            url: ''
        },

        imageSelector =[
            '.OldMedia [data-image-url] img'
        ].join(', '),

        titleSelector = [
            '.content .tweet-text'
        ].join(','),

        textSelector = [

        ].join(', '),

        urlSelector =  [
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
        var $shareContainer = $('.stream-item-footer .buffer-inserted'),
            $shareBtn;

        $shareContainer.each(function (index, el) {
            if (!$(el).has('.ProfileTweet-action--buffer-share').length) {
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
        //iconCntr.setAttribute('data-original-title', btnConfig.text); // tooltip text
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
        var currentPost = $(this).parents('.original-tweet-container, li[data-item-type="tweet"]').first();
        updateSharedData(currentPost);
        ChromeBuffer.toggleOverlay(sharedData);
    }

    function updateSharedData(currentPost) {
        var $closestImage = currentPost.find(imageSelector).first(),
            $textElem     = currentPost.find(textSelector).first(),
            $urlElem      = currentPost.find(urlSelector).first(),
            $titleElem    = currentPost.find(titleSelector).first()
            ;

        sharedData['imageSrc'] = $closestImage.length && $closestImage.attr('src');
        sharedData['title']    = $titleElem.length && $titleElem.text();
        sharedData['url']      = $urlElem.length && $urlElem.attr('href');
        sharedData['text']     = $textElem.length && $textElem.text();
        return sharedData;
    }

})($);