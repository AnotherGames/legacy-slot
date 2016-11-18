import { model } from 'modules/Model/Model';
import { view } from 'modules/MobileSettings/View';
import { sound } from 'modules/Sound/Sound';
import { view as mainView } from 'modules/States/Main/View';

export let controller = (() => {

    let game;

    let handle = {
        openSettings: function () {
            if (model.state('settings') === 'open') return;
            model.state('settings', 'open');
            view.show.Settings({});
            view.show.Overlay({});
        },
        closeSettings: function () {
            if (model.state('settings') === 'close') return;

            sound.sounds.button.play();
            if (model.state('settings') === 'rules') {
                view.hide.Rules({});
            }
            if (model.state('settings') === 'open') {
                view.hide.Settings({});
            }

            view.hide.Overlay({});
            model.state('settings', 'close');
        },
        handMode: function () {
            if (model.state('settings') === 'close') return;

            model.state('settings', 'close');
            const time = 700;

            view.hide.Settings({});
            view.hide.Overlay({});

            const mainContainer = model.el('mainContainer');
            const mask = model.el('mask');
            let xSide;
            if (model.state('side') === 'left') {
                model.state('side', 'right');
                model.el('settingsHandModeButton').frameName = 'handModeOn.png';

                xSide = model.data('buttonsXLeft');
                game.add.tween(mainContainer).to( { x: model.data('mainXRight') }, time, 'Quart.easeOut', true);
                game.add.tween(mask).to( { x: model.data('mainXRight') - model.data('mainXLeft') }, time, 'Quart.easeOut', true);
            } else {
                model.state('side', 'left');
                model.el('settingsHandModeButton').frameName = 'handModeOff.png';

                xSide = model.data('buttonsXRight');
                game.add.tween(mainContainer).to( { x: model.data('mainXLeft') }, time, 'Quart.easeOut', true);
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
        changeSound: function () {
            let menuButtonSound = model.el('soundButton');
            let soundButton = model.el('settingsSoundButton');

            if (sound.isSound) {
                soundButton.frameName = 'soundOff.png';
                sound.isSound = false;
                if (!sound.isMusic) {
                    menuButtonSound.frameName = 'soundOut.png';
                }
            } else {
                soundButton.frameName = 'soundOn.png';
                sound.isSound = true;
                menuButtonSound.frameName = 'sound.png';
                sound.sounds.button.play();
            }
        },
        changeMusic: function () {
            let menuButtonSound = model.el('soundButton');
            let musicButton = model.el('settingsMusicButton');

            sound.sounds.button.play();
            if (sound.isMusic) {
                musicButton.frameName = 'musicOff.png';
                sound.isMusic = false;
                if (!sound.isMusic) {
                    menuButtonSound.frameName = 'soundOut.png';
                }
            } else {
                musicButton.frameName = 'musicOn.png';
                sound.isMusic = true;
                menuButtonSound.frameName = 'sound.png';
            }
        },
        changeFastSpin: function () {
            let fastSpinButton = model.el('settingsFastSpinButton');
            sound.sounds.button.play();
            if (model.state('fastRoll') === true) {
                model.state('fastRoll', false);
                fastSpinButton.frameName = 'fastSpinOff.png';
            } else {
                model.state('fastRoll', true);
                fastSpinButton.frameName = 'fastSpinOn.png';
            }
        },
        openRules: function () {
            if (model.state('settings') === 'rules') return;

            model.state('settings', 'rules');
            view.hide.Settings({});
            view.show.Rules({});
        },
        closeRules: function () {
            if (model.state('settings') === 'close') return;

            model.state('settings', 'close');
            view.hide.Rules({});
            view.hide.Overlay({});
        },
        showHistory: function () {
            sound.sounds.button.play();
            // $('.history').removeClass('closed');
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
            soundButton.events.onInputDown.add(handle.changeSound);
        view.draw.SoundButtonText({});

        let musicButton = view.draw.MusicButton({});
            musicButton.inputEnabled = true;
            musicButton.input.priorityID = 12;
            musicButton.events.onInputDown.add(handle.changeMusic);
        view.draw.MusicButtonText({});

        let fastSpinButton = view.draw.FastSpinButton({});
            fastSpinButton.inputEnabled = true;
            fastSpinButton.input.priorityID = 12;
            fastSpinButton.events.onInputDown.add(handle.changeFastSpin);
        view.draw.FastSpinButtonText({});

        let handModeButton = view.draw.HandModeButton({});
            handModeButton.inputEnabled = true;
            handModeButton.input.priorityID = 12;
            handModeButton.events.onInputDown.add(handle.handMode);
        view.draw.HandModeButtonText({});

        let rulesButton = view.draw.RulesButton({});
            rulesButton.inputEnabled = true;
            rulesButton.input.priorityID = 12;
            rulesButton.events.onInputDown.add(handle.openRules);
        view.draw.RulesButtonText({});

        let historyButton = view.draw.HistoryButton({});
            historyButton.inputEnabled = true;
            historyButton.input.priorityID = 12;
            historyButton.events.onInputDown.add(handle.showHistory);
        view.draw.HistoryButtonText({});

        let backButton = view.draw.BackButton({});
            backButton.inputEnabled = true;
            backButton.input.priorityID = 12;
            backButton.events.onInputDown.add(handle.closeSettings);

        let infoRules = view.draw.RulesScreen({});
            infoRules.inputEnabled = true;
            infoRules.input.priorityID = 13;
            infoRules.events.onInputDown.add(handle.closeRules);

        model.state('settings', 'close');
    }

    return {
        init,
        handle
    };
})();
