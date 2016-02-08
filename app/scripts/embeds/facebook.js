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
            '._3x-2 img._1445',
            '._9_m._30j'
        ].join(', '),

        titleSelector = [
            '.mbs._6m6 a'
        ].join(','),

        textSelector = [
            '._6m7'
        ].join(', '),

    // Replacing string with array because we need elements to be sorted by selector
        urlSelectorArray = [
            '._52c6',
            '.mbs._6m6 a',
            'a.shareMediaLink',
            '.uiAttachmentTitle a',
            'a.externalShareUnit',
            'a.shareLink',
            'a.uiVideoLink',
            '.shareLink a:not([href="#"])',
            'a.uiLinkSubtle',
            '._5pcq'
        ],

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
        var $shareRoots = $('._42nr > span:last-child'),
            $shareBtn;

        $shareRoots.each(function (index, el) {
            if (!$(el).contents('.buffer-share').length) {
                $shareBtn = $('<span class="buffer-share"><a href="#"><span>Add</span></a></span>');
                $shareBtn.click(onShareBtnClick.bind($shareBtn));

                $(el).append($shareBtn);
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
            $titleElem = currentPost.find(titleSelector).first(),
            videoExists = !!currentPost.find('._3x-2 video').length
            ;

        sharedData['imageSources'] = [];
        if (videoExists) {
            $textElem = currentPost.find(videoTextSelector).first();
            $urlElem = currentPost.find(videoUrlSelector).first();

            if (currentPost.find(imageSelector).length) {
                sharedData['imageSources'] = [currentPost.find(imageSelector).first().css('background-image').slice(4, -1).split('"').join('')];
            }
        }

        if (!sharedData['imageSources'][0]) {
            sharedData['imageSources'] = Utils.getImageSources(imageSelector, currentPost);
        }

        sharedData['title'] = $titleElem.length && $titleElem.text();
        sharedData['url'] = getUrlBySelectorArray(urlSelectorArray, currentPost);
        sharedData['text'] = $textElem.length && $textElem.text();
        sharedData['service'] = SERVICE_NAME;
        return sharedData;
    }

    function getUrlBySelectorArray(urlSelectorArray, $parent) {
        var url = '',
            urlElem,
            redirectUrlRegex = /facebook.com\/l.php/
            ;
        urlSelectorArray.forEach(function (sel) {
            if (!url) {
                urlElem = $parent.find(sel);
                if (urlElem.length) {
                    url = urlElem[0].href;
                }
            }
        });
        if (redirectUrlRegex.test(url)) {
            url = getUrlParameter(url, 'u');
            url = decodeURIComponent(url);
        }
        return url;
    }

    function getUrlParameter(sPageURL, sParam) {
        var splitterRegex = /&|\?/,
            sURLVariables = sPageURL.split(splitterRegex),
            sParameterName,
            i;

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : sParameterName[1];
            }
        }
    }

})(jQuery);