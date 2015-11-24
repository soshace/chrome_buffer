(function ($) {
    var attached = false,
        sharedData = {
            title: '',
            text: '',
            imageSrc: '',
            url: ''
        }
        ;
    check();

    function check() {
        if (ChromeBuffer) {
            init();
            setTimeout(check, 1500);
        }
    }

    function init() {
        attachShareButton();
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
        var currentPost = $(this).parents('div[data-dedupekey]');
        updateSharedData(currentPost);
        ChromeBuffer.toggleOverlay(sharedData);
    }

    function updateSharedData(currentPost) {
        var closestImage = currentPost.find('img._46-i'),
            textElem = currentPost.find('.userContent')
            ;
        sharedData['imageSrc'] = closestImage.length && closestImage.attr('src');
        sharedData['text'] = textElem.text();
        return sharedData;
    }

})($);