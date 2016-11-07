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
        autoText = game.add.text(0, 0, amount, {font: '40px Arial', fill: '#fff'});
        model.data('autoNextCount', 0);
        autoCount = amount;
        autoEnd = false;
        startAutoplay();
        events.trigger('menu:hideMenu');
        console.log('I am initing autoplay!');
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
            stopAutoplay();
            model.state('autoplay', null);
            events.trigger('autoplay:end');
        }
    }

    function stopAutoplay() {
        autoEnd = true;
        // clearTimeout(model.data('autoTimeout'));
    }

    function autoNext() {
        console.log('I am called!');
    }

    events.on('autoplay:init', initAutoplay);
    events.on('autoplay:next', startAutoplay);
    events.on('autoplay:next', autoNext);

    return {
        initAutoplay,
        startAutoplay,
        stopAutoplay
    };

})();
