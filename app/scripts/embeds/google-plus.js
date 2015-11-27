(function ($) {
    var SERVICE_NAME = 'google-plus',
        postSelector = '.Yp.yt.Xa',
        compareChildSelector = '.buffer-share',
        sharedData = {
            title: '',
            text: '',
            imageSrc: '',
            url: ''
        },

        imageSelector =[
            '.Al.pf .A8Hhid img',
            '.Al.pf .Mt img',
            '.Al.pf .Mt img',
            '.Al.pf img.ar.Mc'
        ].join(', '),

        titleSelector = [
            '.Al.pf .VwVwbf .rCauNb',
            '.Al.pf .wI a'
        ].join(','),

        textSelector = [
            '.Al.pf .VwVwbf .f34nqb'
        ].join(', '),

        urlSelector =  [
            '.ot-anchor'
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
            var $actions = $(el).find('.Qg');
            if (!$actions.has(compareChildSelector).length) {
                $shareBtn = createGoogleActionButton();
                $shareBtn.click(onShareBtnClick.bind($shareBtn));

                $actions.prepend($shareBtn);
            }
        });
    }

    function createGoogleActionButton() {
        var $action = $('<div></div>');

        $action.addClass('buffer-share esw eswd qk Gc');
        return $action;
    }

    function onShareBtnClick() {
        var currentPost = $(this).parents(postSelector).first();
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
        sharedData['service']  = SERVICE_NAME;
        return sharedData;
    }

})(jQuery);

