import { model } from 'modules/Model/Model';
import { events } from 'modules/Util/Events';

export let controller = (() => {

    function initAutoplay(amount) {

        console.log('I am initing autoPlay: ', amount);

        model.state('autoEnd', false);
        model.data('autoCount', amount);
        model.data('autoCashSumStart', model.balance('coinCash'));

        startAutoplay();
    }



    function startAutoplay() {

        if (model.state('autoCashUp')) {
            console.log('I am in cashUP');
            if (model.balance('coinCash') - model.data('autoCashSumStart') > model.data('autoCashSumDelta')) {
                console.warn('cashUP is stoping!');
                events.trigger('autoplay:stop');
                // model.data('autoCashSumDelta', null);
                // model.state('autoCashUp', null);
                return;
            }
        }

        if (model.state('autoCashDown')) {
            console.log('I am in cashDOWN');
            console.log('CashStart: ', model.data('autoCashSumStart'));
            console.log('CashSum: ', model.balance('coinCash'));
            console.log('CashDelta: ', model.data('autoCashSumDelta'));
            if (model.data('autoCashSumStart') - model.balance('coinCash') > model.data('autoCashSumDelta')) {
                console.warn('cashDOWN is stoping!');
                events.trigger('autoplay:stop');
                // model.data('autoCashSumDelta', null);
                // model.state('autoCashDown', null);
                return;
            }
        }

        if (model.state('autoCashLine')) {
            if (model.balance('winCash') - model.data('autoCashLineDelta') > 0) {
                events.trigger('autoplay:stop');
                // model.data('autoCashLineDelta', null);
                // model.state('autoCashLine', null);
                return;
            }
        }

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
