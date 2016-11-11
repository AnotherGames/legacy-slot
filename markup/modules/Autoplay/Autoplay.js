// import { utils } from 'modules/utils/utils';
import { model } from 'modules/Model/Model';
import { events } from 'modules/Util/Events';

export let autoplay = (function () {

    let autoCount;
    let autoTimer;
    let autoEnd;
    let autoText;

    function initAutoplay(amount) {
        let game = model.el('game');
        if (model.state('mobile')) {
            let spinButton = model.el('spinButton');
            let buttonsContainer = model.el('buttonsContainer');
            autoText = game.add.text(spinButton.x, spinButton.y, amount, {font: '60px Arial, Helvetica', fill: '#fff'}, buttonsContainer);
            autoText.anchor.set(0.5);
        } else {
            let autoButtonDesk = model.el('autoButtonDesk');
            let panelContainer = model.el('panelContainer');
            if (amount >= 250) {
                autoText = game.add.text(525, autoButtonDesk.y, amount, {font: '40px Arial, Helvetica', fill: '#fff'}, panelContainer);
            } else {
                autoText = game.add.text(525, autoButtonDesk.y, amount, {font: '60px Arial, Helvetica', fill: '#fff'}, panelContainer);
            }
            autoText.anchor.set(0.5);
            autoText.alpha = 0;
            game.add.tween(autoText).to({alpha: 1}, 500, 'Linear', true);
        }
        autoCount = amount;
        autoEnd = false;
        model.state('autoEnd', false);
        startAutoplay();
        if (model.state('mobile')) {
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
                events.trigger('autoplay:startRoll');
            // }
        }
        if (autoCount > 0) {
            autoText.text = autoCount;
            model.data('autoCount', autoCount);
            events.trigger('autoplay:count', autoCount);
        } else {
            model.state('autoplay', null);
            if (model.state('mobile')) {
                events.trigger('autoplay:stop');
            } else {
                events.trigger('autoplay:stop:desktop');
            }
        }
    }

    function stopAutoplay() {
        autoEnd = true;
        model.state('autoEnd', true);
        autoText.destroy();
        // clearTimeout(model.data('autoTimeout'));
    }

    // events.on('autoplay:init', initAutoplay);
    // events.on('autoplay:init:desktop', initAutoplay);
    // events.on('autoplay:next', startAutoplay);
    // events.on('autoplay:stop', stopAutoplay);
    // events.on('autoplay:stop:desktop', stopAutoplay);

    return {
        initAutoplay,
        startAutoplay,
        stopAutoplay
    };

})();
