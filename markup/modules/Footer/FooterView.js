import { model } from 'modules/Model/Model';

export let view = (() => {

    function drawMobileFooter({
        color = 0x000000,
        heightTop = 40,
        heightBottom = 30,
        alphaTop = 0.25,
        alphaBottom = 0.7
    }) {
        const game = model.el('game');

        let footerContainer = game.add.group();
        model.group('footer', footerContainer);

        let footerTop = game.add.graphics(0, 0, footerContainer)
        .beginFill(color, alphaTop).drawRect(
            0,
            game.height - (heightTop + heightBottom),
            game.width,
            heightTop
        );
        model.el('footerTop', footerTop);

        let footerBottom = game.add.graphics(0, 0, footerContainer)
            .beginFill(color, alphaBottom).drawRect(
                0,
                game.height - heightBottom,
                game.width,
                heightBottom
            );
        model.el('footerBottom', footerBottom);

        model.data('footerTopCenterY', game.height - (heightBottom + heightTop / 2));
        model.data('footerBottomCenterY', game.height - heightBottom / 2);

    }

    function drawDesktopFooter({
        color = 0x000000,
        heightBottom = 30,
        alphaBottom = 0.7
    }) {
        const game = model.el('game');

        let footerContainer = game.add.group();
        model.group('footer', footerContainer);

        let footerBottom = game.add.graphics(0, 0, footerContainer)
            .beginFill(color, alphaBottom).drawRect(
                0,
                game.height - heightBottom,
                game.width,
                heightBottom
            );
        model.el('footerBottom', footerBottom);

        model.data('footerBottomCenterY', game.height - heightBottom / 2);
    }

    return {
        drawMobileFooter,
        drawDesktopFooter
    }

})();
