(function ($) {
    var sharedData = {
            title: '',
            text: '',
            imageSrc: '',
            url: ''
        },

        postSelector = [
            'body'
            //'.page-content',
            //'.content',
            //'article'
        ].join(', '),


        titleSelector = [
            'h1',
            'title'
        ].join(','),

        textSelector = [].join(', ')
        ;


    function onShareBtnClick() {
        var currentPost = $(postSelector).first();
        updateSharedData(currentPost);
        ChromeBuffer.toggleOverlay(sharedData);
    }

    function updateSharedData(currentPost) {
        var $biggestImage = getBiggestImage(currentPost),
            $textElem = currentPost.find(textSelector).first(),
            $titleElem = currentPost.find(titleSelector).first()
            ;
        debugger
        sharedData['imageSrc'] = $biggestImage.length && $biggestImage.attr('src');
        sharedData['title'] = $titleElem.length && $titleElem.text();
        sharedData['url'] = location.href;
        sharedData['text'] = $textElem.length && $textElem.text();
        return sharedData;
    }

    /**
     * Returns image with biggest pixels amount
     * @param $parent
     */
    function getBiggestImage($parent, minWidth, minHeight) {
        var $images = $parent.find('img'),
            $biggestImage,
            biggestPixelsAmount = (minWidth && minHeight) ? minWidth * minHeight : 0,
            pixelsAmount
            ;
        $images.each(function (index, $img) {
            $img = $($img);
            pixelsAmount = $img.width() * $img.height();

            if (pixelsAmount > biggestPixelsAmount) {
                biggestPixelsAmount = pixelsAmount;
                $biggestImage = $img;
            }
        });

        return $biggestImage;
    }

    chrome.extension.onMessage.addListener(function (msg, sender, sendResponse) {
        if (msg.action == 'buffer_share') {
            onShareBtnClick();
        }
    });

})(jQuery);

