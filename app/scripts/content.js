(function ($) {
    var SERVICE_NAME = 'all',
        MIN_IMAGE_WIDTH = 50,
        MIN_IMAGE_HEIGHT = 50,
        sharedData = {
            title: '',
            text: '',
            imageSrc: '',
            url: ''
        },

        postSelector = [
            'html'
            //'.page-content',
            //'.content',
            //'article'
        ].join(', '),


        titleSelector = [
            'h1',
            'title'
        ].join(', '),

        imageHrefSelector = [
            'link[itemprop="thumbnailUrl"]'
        ].join(', ')
        ;


    function onShareBtnClick() {
        var currentPost = $(postSelector).first();
        updateSharedData(currentPost);
        ChromeBuffer.toggleOverlay(sharedData);
    }

    function updateSharedData(currentPost) {
        var $biggestImage = currentPost.find(imageHrefSelector).first(),
            $textElem = $(readability.grabArticle(document.body.cloneNode(true))),
            $titleElem = currentPost.find(titleSelector).first()
            ;

        $textElem.find('script, style').empty();
        sharedData['title'] = $titleElem.length && $titleElem.text();
        sharedData['url'] = location.href;
        sharedData['text'] = $textElem.length && $textElem.text();
        sharedData['service']  = SERVICE_NAME;

        if ($biggestImage.length) {
            sharedData['imageSrc'] = $biggestImage.attr('href')
        } else {
            $biggestImage = getBiggestImage(currentPost, MIN_IMAGE_WIDTH, MIN_IMAGE_HEIGHT);
            sharedData['imageSrc'] = $biggestImage && $biggestImage[0].src;
        }
        return sharedData;
    }

    /**
     * Returns image with biggest pixels amount
     * @param $parent
     * @param minWidth
     * @param minHeight
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

