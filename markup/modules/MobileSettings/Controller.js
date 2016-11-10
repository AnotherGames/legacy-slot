import { model } from 'modules/Model/Model';
import { view } from 'modules/MobileSettings/View';
import { sound } from 'modules/Sound/Sound';

export let controller = (() => {

    let game;

    let handle = {
        openSettings: function () {
            model.state('settings', 'open');
            view.show.Settings({});
            view.show.Overlay({});
        },
        closeSettings: function () {
            model.state('settings', 'close');

            sound.sounds.button.play();

            view.hide.Settings({});
            view.hide.Overlay({})
                .onComplete.add(() => {
                    model.el('settingsOverlay').visible = false;
                });
        },
        handMode: function () {
            const time = 700;

            view.hide.Settings({});
            view.hide.Overlay({})
                .onComplete.add(() => {
                    model.el('settingsOverlay').visible = false;
                });

            const mainContainer = model.el('mainContainer');
            const mask = model.el('mask');
            let xSide;
            if (model.state('side') === 'left') {
                model.state('side', 'right');
                model.el('settingsHandModeButton').frameName = 'handModeOn.png';
                xSide = model.data('buttonsXLeft');

                // mainContainer.x = model.data('mainXRight');
                game.add.tween(mainContainer).to( { x: model.data('mainXRight') }, time, 'Quart.easeOut', true);

                // mask.x = model.data('mainXRight') - model.data('mainXLeft');
                game.add.tween(mask).to( { x: model.data('mainXRight') - model.data('mainXLeft') }, time, 'Quart.easeOut', true);
            } else {
                model.state('side', 'left');
                model.el('settingsHandModeButton').frameName = 'handModeOff.png';
                xSide = model.data('buttonsXRight');

                // mainContainer.x = model.data('mainXLeft');
                game.add.tween(mainContainer).to( { x: model.data('mainXLeft') }, time, 'Quart.easeOut', true);

                // mask.x = 0;
                game.add.tween(mask).to( { x: 0 }, time, 'Quart.easeOut', true);
            }
            // Change Side Buttons
            let spinButton = model.el('spinButton');
            let autoButton = model.el('autoButton');
            let betButton = model.el('betButton');
            let menuButton = model.el('menuButton');
            let soundButton = model.el('soundButton');
            spinButton.x = xSide;
            autoButton.x = xSide;
            betButton.x = xSide;
            menuButton.x = xSide;
            soundButton.x = xSide;
        },
        openRules: function () {

        },
        closeRules: function () {

        }
    };

    function init() {
        game = model.el('game');

        let overlay = view.draw.Overlay({});
            overlay.inputEnabled = true;
            overlay.input.priorityID = 10;
            overlay.events.onInputDown.add(handle.closeSettings);

        view.draw.Container({});

        let bg = view.draw.BG({});
            bg.inputEnabled = true;
            bg.input.priorityID = 11;

        view.draw.Border({});
        view.draw.Title({});

        let soundButton = view.draw.SoundButton({});
            soundButton.inputEnabled = true;
            soundButton.input.priorityID = 12;
            // soundButton.events.onInputDown.add(handle.);
        view.draw.SoundButtonText({});

        let musicButton = view.draw.MusicButton({});
            musicButton.inputEnabled = true;
            musicButton.input.priorityID = 12;
            // musicButton.events.onInputDown.add(handle.);
        view.draw.MusicButtonText({});

        let fastSpinButton = view.draw.FastSpinButton({});
            fastSpinButton.inputEnabled = true;
            fastSpinButton.input.priorityID = 12;
            // fastSpinButton.events.onInputDown.add(handle.);
        view.draw.FastSpinButtonText({});

        let handModeButton = view.draw.HandModeButton({});
            handModeButton.inputEnabled = true;
            handModeButton.input.priorityID = 12;
            handModeButton.events.onInputDown.add(handle.handMode);
        view.draw.HandModeButtonText({});

        let rulesButton = view.draw.RulesButton({});
            rulesButton.inputEnabled = true;
            rulesButton.input.priorityID = 12;
            // rulesButton.events.onInputDown.add(handle.);
        view.draw.RulesButtonText({});

        let historyButton = view.draw.HistoryButton({});
            historyButton.inputEnabled = true;
            historyButton.input.priorityID = 12;
            // historyButton.events.onInputDown.add(handle.);
        view.draw.HistoryButtonText({});

        let backButton = view.draw.BackButton({});
            backButton.inputEnabled = true;
            backButton.input.priorityID = 12;
            backButton.events.onInputDown.add(handle.closeSettings);

        model.state('settings', 'close');
    }

    return {
        init,
        handle
    };
})();
