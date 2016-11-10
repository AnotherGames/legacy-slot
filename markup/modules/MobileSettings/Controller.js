import { model } from 'modules/Model/Model';
import { view } from 'modules/MobileSettings/View';
import { sound } from 'modules/Sound/Sound';
import { controller as globalController } from 'modules/Controller/Controller';

export let controller = (() => {

    let game;

    let handle = {
        close: function () {
            model.state('settings', 'close');

            sound.sounds.button.play();

            view.hide.Settings({});
            view.hide.Overlay({})
                .onComplete.add(() => {
                    model.el('settingsOverlay').visible = false;
                });
        },
        open: function () {
            model.state('settings', 'open');
            view.show.Settings({});
            view.show.Overlay({});
        }
    };

    function init() {
        game = model.el('game');

        let overlay = view.draw.Overlay({});
            overlay.inputEnabled = true;
            overlay.input.priorityID = 10;
            overlay.events.onInputDown.add(handle.close);

        view.draw.Container({});
        view.draw.BG({});
        view.draw.Border({});
        view.draw.Title({});

        let backButton = view.draw.BackButton({});
            backButton.inputEnabled = true;
            backButton.input.priorityID = 12;
            backButton.events.onInputDown.add(handle.close);

        model.state('settings', 'close');
    }

    return {
        init,
        handle
    };
})();
