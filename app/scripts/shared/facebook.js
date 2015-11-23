(function () {
    if (ChromeBuffer) {
        init();
    }

    function init() {
        attachShareButton();

    }

    function attachShareButton() {
        var $shareRoots = $('.share_root'),
            $shareBtn = $('<a href="#">SHAAAREEE!!!</a>');

        $shareRoots.each(function (index, el) {
            debugger;
            $(el).append($shareBtn);
        });

        $shareBtn.click(onShareBtnClick);
    }

    function onShareBtnClick() {
        ChromeBuffer.toggleOverlay();
    }

})();