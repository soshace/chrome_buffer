(function ($) {
    var SERVICE_NAME = 'facebook',
        attached = false,
        sharedData = {
            title: '',
            text: '',
            imageSources: [],
            url: ''
        },

        imageSelector =[
            'img._46-i',
            '.uiScaledImageContainer img',
            '.uiPhotoThumb img',
            '.photoUnit img',
            '.fbPhotoImage',
            '.spotlight'
        ].join(', '),

        titleSelector = [
            '.mbs._6m6 a'
        ].join(','),

        textSelector = [
            '._6m7'
        ].join(', '),

        urlSelector =  [
            '.mbs._6m6 a',
            'a.shareMediaLink',
            '.uiAttachmentTitle a',
            'a.externalShareUnit',
            'a.shareLink',
            'a.uiVideoLink',
            '.shareLink a:not([href="#"])',
            '._52c6'
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
                $shareBtn = $('<span class="buffer-share"><a href="#"><span>Share!</span></a></span>');
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
        var $textElem     = currentPost.find(textSelector).first(),
            $urlElem      = currentPost.find(urlSelector).first(),
            $titleElem    = currentPost.find(titleSelector).first()
            ;

        sharedData['imageSources'] = getImageSources(imageSelector, currentPost);
        sharedData['title']    = $titleElem.length && $titleElem.text();
        sharedData['url']      = $urlElem.length && $urlElem.attr('href');
        sharedData['text']     = $textElem.length && $textElem.text();
        sharedData['service']  = SERVICE_NAME;
        return sharedData;
    }

    // TODO: move this function to another file
    function getImageSources(selector, $parent) {
        var $images = $parent.find(selector),
            sources = []
            ;
        $images.each(function (index, $img) {
            sources.push($($img)[0].src)
        });

        return sources;
    }

})(jQuery);