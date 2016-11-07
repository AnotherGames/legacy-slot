// import { utils } from 'modules/utils/utils';
import { model } from 'modules/Model/Model';
import { events } from 'modules/Events/Events';

export let autoplay = (function () {

    let autoCount;
    let autoTimer;
    let autoEnd;

    function initAutoplay(amount) {
        autoCount = amount;
        autoEnd = false;
        startAutoplay();
        events.trigger('autoplay:init', autoCount);
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
                events.trigger('autoplay:startRoll');
            // }
        }
        if (autoCount > 0) {
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

    return {
        initAutoplay,
        startAutoplay,
        stopAutoplay
    };

})();
