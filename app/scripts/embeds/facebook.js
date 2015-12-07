(function ($) {
    var SERVICE_NAME = 'facebook',
        sharedData = {
            title: '',
            text: '',
            imageSources: [],
            url: ''
        },

        imageSelector = [
            'img._46-i',
            '.uiScaledImageContainer img',
            '.uiPhotoThumb img',
            '.photoUnit img',
            '.fbPhotoImage',
            '.spotlight',
            '._3x-2 img._1445'
        ].join(', '),

        titleSelector = [
            '.mbs._6m6 a'
        ].join(','),

        textSelector = [
            '._6m7'
        ].join(', '),

        urlSelector = [
            '.mbs._6m6 a',
            'a.shareMediaLink',
            '.uiAttachmentTitle a',
            'a.externalShareUnit',
            'a.shareLink',
            'a.uiVideoLink',
            '.shareLink a:not([href="#"])',
            '._52c6'
        ].join(', '),

        videoTextSelector = [
            '.userContent p'
        ].join(', '),

        videoUrlSelector = [
            '._5pcq'
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
        var $shareRoots = $('.share_root'),
            $shareBtn;

        $shareRoots.each(function (index, el) {
            if (!$(el).siblings('.buffer-share').length) {
                $shareBtn = $('<span class="buffer-share"><a href="#"><span>Add</span></a></span>');
                $shareBtn.click(onShareBtnClick.bind($shareBtn));

                $(el).after($shareBtn);
            }
        });
    }

    function onShareBtnClick() {
        var currentPost = $(this).parents('div[role="article"]');
        updateSharedData(currentPost);
        ChromeBuffer.toggleOverlay(sharedData);
    }

    function updateSharedData(currentPost) {
        var $textElem = currentPost.find(textSelector).first(),
            $urlElem = currentPost.find(urlSelector).first(),
            $titleElem = currentPost.find(titleSelector).first(),
            videoExists = !!currentPost.find('._3x-2 video').length
            ;

        if (videoExists) {
            $textElem = currentPost.find(videoTextSelector).first();
            $urlElem = currentPost.find(videoUrlSelector).first();

            if (currentPost.find(imageSelector).length) {
                sharedData['imageSources'] = [currentPost.find(imageSelector).first().css('background-image').slice(4, -1).split('"').join('')];
            } else {
                sharedData['imageSources'] = Utils.getImageSources(imageSelector, currentPost);
            }
        } else {
            sharedData['imageSources'] = Utils.getImageSources(imageSelector, currentPost);
        }

        sharedData['title'] = $titleElem.length && $titleElem.text();
        sharedData['url'] = $urlElem.length && $urlElem[0].href;
        sharedData['text'] = $textElem.length && $textElem.text();
        sharedData['service'] = SERVICE_NAME;
        return sharedData;
    }

})(jQuery);