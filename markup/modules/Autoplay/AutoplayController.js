import { model } from 'modules/Model/Model';
import { events } from 'modules/Util/Events';

export let controller = (() => {

    function initAutoplay(amount) {

        console.log('I am initing autoPlay: ', amount);

        model.state('autoEnd', false);
        model.data('autoCount', amount);

        startAutoplay();
    }



    function startAutoplay() {
        let autoCount = model.data('autoCount');
        autoCount--;

        if (!model.state('autoEnd')) {

            events.trigger('roll:request');

        }

        if (autoCount > 0) {

            model.data('autoCount', autoCount);
            events.trigger('autoplay:count', autoCount);

        } else {

            events.trigger('autoplay:stop');

        }
    }

    function stopAutoplay() {

        console.log('I am stoping autoplay!');

        model.state('autoEnd', true);

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
