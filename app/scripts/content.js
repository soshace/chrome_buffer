(function ($) {
    var SERVICE_NAME = 'all',
        MIN_IMAGE_WIDTH = 100,
        MIN_IMAGE_HEIGHT = 100,
        sharedData = {
            title: '',
            text: '',
            imageSources: [],
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

        thumbnailsSelector = [
            'link[itemprop="thumbnailUrl"]'
        ].join(', ')
        ;


    function onShareBtnClick() {
        var currentPost = $(postSelector).first();
        updateSharedData(currentPost);
        ChromeBuffer.toggleOverlay(sharedData);
    }

    function updateSharedData(currentPost) {
        var $bigImages = currentPost.find(thumbnailsSelector).first(),
            $textElem = $(readability.grabArticle(document.body.cloneNode(true))),
            $titleElem = currentPost.find(titleSelector).first(),
            imageSources
            ;

        $textElem.find('script, style').empty();
        sharedData['title'] = $titleElem.length && $titleElem.text();
        sharedData['url'] = location.href;
        sharedData['text'] = $textElem.length && $textElem.text();
        sharedData['service']  = SERVICE_NAME;

        if ($bigImages.length) {
            sharedData['imageSources'].push($bigImages.attr('href'));
        } else {
            imageSources = getBigImagesSources(currentPost, MIN_IMAGE_WIDTH, MIN_IMAGE_HEIGHT);
            sharedData['imageSources'] = imageSources;
        }
        return sharedData;
    }

    /**
     * Returns image with biggest pixels amount
     * @param $parent
     * @param minWidth
     * @param minHeight
     */
    function getBigImagesSources($parent, minWidth, minHeight) {
        var $images = $parent.find('img'),
            sources = [],
            pixelsAmount
            ;
        $images.each(function (index, $img) {
            $img = $($img);
            pixelsAmount = $img.width() * $img.height();

            if ($img.width() > minWidth &&
                $img.height() > minHeight &&
                $img[0].src) {
                sources.push($img[0].src)
            }
        });

        return sources;
    }

    chrome.extension.onMessage.addListener(function (msg, sender, sendResponse) {
        if (msg.action == 'buffer_share') {
            onShareBtnClick();
        }
    });

})(jQuery);

