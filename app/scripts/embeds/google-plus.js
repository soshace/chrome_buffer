(function ($) {
    var SERVICE_NAME = 'google-plus',
        postSelector = [
            '.Yp.yt.Xa',
            '.V2SCpf.vCjazd',
            'c-fpdnbb'
        ].join(', '),
        jsActionsSelector = [
            '.Qg',
            '.KwDIr .b0H8Oc'
        ].join(', '),
        compareChildSelector = '.buffer-share',
        sharedData = {
            title: '',
            text: '',
            imageSources: [],
            url: ''
        },

        imageSelector =[
            '.Al.pf .A8Hhid img',
            '.Al.pf .Mt img',
            '.Al.pf .Mt img',
            '.Al.pf img.ar.Mc',
            'img.ar.Mc',
            'img.JZUAbb',
            '.D7ivCe img'
        ].join(', '),

        titleSelector = [
            '.Al.pf .VwVwbf .rCauNb',
            '.Al.pf .wI a',
            '.JsEBkb'
        ].join(','),

        textSelector = [
            '.Al.pf .VwVwbf .f34nqb',
            '.bldpQb .W65scc.AAlUBe',
            '.xuZcmb',
            '.ZGIT2d.z53JKe'
        ].join(', '),

        secondlyTextSelector = [
            '.Al.pf .Ct',
            '.wftCae'
        ].join(', '),

        urlSelectorArray =  [
            '.d-s.ot-anchor',
            '.d-s.ob.Ks',
            'a.B5gIxb',
            'a.PeBv8b',
            '.o-U-s'
        ],

        addButtonAfterSelectorOne = '.ffa.Dg.eaGJ0e',
        addButtonAfterSelectorTwo = '.Ut.Dg.gv1ztb',

        // photo links in new design are stored inside jsdata attribute
        newPhotoUrlSplitter = 'LfLzDd;'
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
            isNewUi = !!$('.xdjHt.ex5ZEb').length, // New UI Google+ logo
            $shareBtn;

        $shareContainer.each(function (index, el) {
            var $actions = $(el).find(jsActionsSelector),
                $firstPrioritySelector = $(el).find(addButtonAfterSelectorOne),
                $secondPrioritySelector = $(el).find(addButtonAfterSelectorTwo);


            if (!$actions.has(compareChildSelector).length) {
                $shareBtn = createGoogleActionButton();
                $shareBtn.click(onShareBtnClick.bind($shareBtn));

                if (isNewUi) {
                    $actions.append($shareBtn);
                } else if (!isNewUi && $firstPrioritySelector.length) {
                    // add button after '+1' and 'repost' to prevent
                    $actions.find(addButtonAfterSelectorOne).after($shareBtn);
                } else if (!isNewUi && $secondPrioritySelector.length) {
                    // add button after '+1' and 'repost' to prevent
                    $actions.find(addButtonAfterSelectorTwo).after($shareBtn);
                } else {
                    $actions.find(addButtonAfterSelectorOne).after($shareBtn);
                }
            }
        });
    }

    function createGoogleActionButton() {
        var $action = $('<div></div>'),
            isNewUi = !!$('.xdjHt.ex5ZEb').length; // New UI Google+ logo

        $action.addClass('buffer-share esw eswd qk Gc');
        if (isNewUi) {
            $action.addClass('KRktze');
        }
        return $action;
    }

    function onShareBtnClick() {
        var currentPost = $(this).parents(postSelector).first();
        updateSharedData(currentPost);
        ChromeBuffer.toggleOverlay(sharedData);
    }

    function updateSharedData(currentPost) {
        var $textElem     = currentPost.find(textSelector).first(),
            $titleElem    = currentPost.find(titleSelector).first(),
            jsdata
            ;

        if (!$textElem.length) {
            $textElem = currentPost.find(secondlyTextSelector);
        }

        sharedData['imageSources'] = Utils.getImageSources(imageSelector, currentPost);
        sharedData['title']    = $titleElem.text();
        sharedData['url']      = getUrlBySelectorArray(urlSelectorArray, currentPost);
        sharedData['text']     = $textElem.text();
        sharedData['service']  = SERVICE_NAME;

        if (!sharedData['url']) {
            jsdata = currentPost.attr('jsdata');
            sharedData['url'] = jsdata && jsdata.split(newPhotoUrlSplitter)[1];
        }

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

})(jQuery);

