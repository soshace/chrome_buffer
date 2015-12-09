(function ($) {
    var SERVICE_NAME = 'linkedin',
        attached = false,
        postSelector = [
            '.feed-update.channel-recommend-article',
            '.feed-update.member-share-article',
            '.feed-update.company-share-article'
        ].join(', '),
        compareChildSelector = 'li .buffer-share',
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
            '.content .video-embedded img.video-thumbnail'
        ].join(', '),

        titleSelector = [
            '.content .side-article .side .content a h4',
            '.content .rich-media .side .content a h4',
            '.content .video-embedded .embedly-info h4'
        ].join(', '),

        textSelector = [
            '.content .side-article .side .content a .snippet-container',
            '.content .rich-media .side .content a .snippet-container',
            '.content .video-embedded .embedly-info p'
        ].join(', '),

        urlSelector = [
            '.content .side-article .side .content a',
            '.content .rich-media .side .content a'
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
            var $actions = $(el).find('.actions');
            if (!$actions.has(compareChildSelector).length) {
                $shareBtn = createLinkedinActionButton();
                $shareBtn.click(onShareBtnClick.bind($shareBtn));

                $actions.append($shareBtn);
            }
        });
    }

    function createLinkedinActionButton() {
        var $action = $('<li></li>'),
            $button = $('<button class="buffer-share"></button>'),
            $text = $('<span></span>')
            ;

        $button.append($text);
        $text.text('Add');
        $action.append($button);

        return $action;
    }

    function onShareBtnClick() {
        var currentPost = $(this).parents(postSelector).first();
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
        sharedData['url'] = $urlElem.attr('href') || currentPost.find(videoUrlSelector).data('href');
        sharedData['text'] = $textElem.length && $textElem.text();
        sharedData['service'] = SERVICE_NAME;

        return sharedData;
    }


})(jQuery);

