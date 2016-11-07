// import { utils } from 'modules/utils/utils';
import { model } from 'modules/Model/Model';
import { events } from 'modules/Events/Events';

export let autoplay = (function () {

    let autoCount;
    let autoTimer;
    let autoEnd;
    let autoText;

    function initAutoplay(amount) {
        let game = model.el('game');
        let spinButton = model.el('spinButton');
        let buttonsContainer = model.el('buttonsContainer');
        autoText = game.add.text(spinButton.x, spinButton.y, amount, {font: '60px Arial, Helvetica', fill: '#fff'}, buttonsContainer);
        autoText.anchor.set(0.5);
        model.data('autoNextCount', 0);
        autoCount = amount;
        autoEnd = false;
        model.state('autoEnd', false);
        startAutoplay();
        if (model.flag('mobile')) {
            events.trigger('menu:hideMenu');
        }
    }

    function startAutoplay() {
        autoCount--;
        if (!autoEnd) {
            // if (utils.lowBalance()) {
            //     autoEnd = true;
            //     stopAutoplay();
            //     utils.showPopup('Low balance!');
            //     storage.changeState('autoplay', 'ended');
            //     events.trigger('autoplay:ended');
            // } else {
                model.data('autoNextCount', 0);
                events.trigger('autoplay:startRoll');
            // }
        }
        if (autoCount > 0) {
            autoText.text = autoCount;
            model.data('autoCount', autoCount);
            events.trigger('autoplay:count', autoCount);
        } else {
            model.state('autoplay', null);
            events.trigger('autoplay:stop');
        }
    }

    function stopAutoplay() {
        autoEnd = true;
        model.state('autoEnd', true);
        autoText.destroy();
        // clearTimeout(model.data('autoTimeout'));
    }

    events.on('autoplay:init', initAutoplay);
    events.on('autoplay:next', startAutoplay);
    events.on('autoplay:stop', stopAutoplay);

    return {
        initAutoplay,
        startAutoplay,
        stopAutoplay
    };

})();
