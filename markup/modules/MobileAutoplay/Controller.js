import { model } from 'modules/Model/Model';
import { view } from 'modules/MobileAutoplay/View';
import { sound } from 'modules/Sound/Sound';

export let controller = (() => {

    let game;

    let handle = {
        openPanel: function () {
            if (model.state('autoplayPanel') === 'open') return;
            model.state('autoplayPanel', 'open');
            view.show.Panel({});
            view.show.Overlay({});
        },
        closePanel: function () {
            if (model.state('autoplayPanel') === 'close') return;

            sound.sounds.button.play();
            if (model.state('autoplayPanel') === 'open') {
                view.hide.Panel({});
            }

            view.hide.Overlay({});
            model.state('autoplayPanel', 'close');
        }
    };

    function init() {
        game = model.el('game');

        let overlay = view.draw.Overlay({});
            overlay.inputEnabled = true;
            overlay.input.priorityID = 10;
            overlay.events.onInputDown.add(handle.closePanel);

        view.draw.Container({});

        let bg = view.draw.BG({});
            bg.inputEnabled = true;
            bg.input.priorityID = 11;

        view.draw.Border({});
        view.draw.Title({});

        let backButton = view.draw.BackButton({});
            backButton.inputEnabled = true;
            backButton.input.priorityID = 12;
            backButton.events.onInputDown.add(handle.closePanel);

        model.state('autoplayPanel', 'close');
    }

    return {
        init,
        handle
    };
})();
