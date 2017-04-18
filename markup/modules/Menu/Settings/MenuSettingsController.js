import { model } from 'modules/Model/Model';
import { config } from 'modules/Util/Config';

import Info from '../../../../Info/Info';

import { view } from 'modules/Menu/Settings/MenuSettingsView';

import { controller as soundController } from '../../../../Info/SoundController';


export let controller = (() => {

    let game;
    let info;
    let touchX = 0;

    let handle = {
        openSettings: function () {
            if(model.state('buttons:locked')
            || model.state('roll:progress')
            || model.state('autoplay:start')
            || model.state('settings') === 'open') return;

            model.state('settings', 'open');
            view.show.Settings({});
            view.show.Overlay({});
        },
        closeSettings: function () {
            if (model.state('settings') === 'close') return;

            soundController.sound.playSound({sound : 'buttonClick'});
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

            const mainContainer = model.group('main');
            let xSide;
            if (model.state('gameSideLeft')) {
                model.state('gameSideLeft', false);
                model.cookie('gameSideLeft', false);
                model.el('settingsHandModeButton').frameName = 'handModeOn.png';

                xSide = model.data('buttonsXLeft');
                game.add.tween(mainContainer).to( { x: model.data('mainXRight') }, time, 'Quart.easeOut', true);
            } else {
                model.state('gameSideLeft', true);
                model.cookie('gameSideLeft', true);
                model.el('settingsHandModeButton').frameName = 'handModeOff.png';

                xSide = model.data('buttonsXRight');
                game.add.tween(mainContainer).to( { x: model.data('mainXLeft') }, time, 'Quart.easeOut', true);
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
            let soundButton = model.el('settingsSoundButton');

            if (model.state('sound')) {
                soundButton.frameName = 'soundOff.png';
                model.state('sound', false)
                model.cookie('sound', false);
            } else {
                soundButton.frameName = 'soundOn.png';
                model.state('sound', true)
                model.cookie('sound', true);
            }

        },
        changeMusic: function () {
            let musicButton = model.el('settingsMusicButton');

            soundController.sound.playSound({sound : 'buttonClick'});
            if (model.state('music')) {
                musicButton.frameName = 'musicOff.png';
                model.state('music', false);
                model.cookie('music', false);
                soundController.music.pauseMusic('fon')
            } else {
                musicButton.frameName = 'musicOn.png';
                model.state('music', true);
                model.cookie('music', true);
                soundController.music.playMusic('fon')
            }
        },
        changeFastSpin: function () {
            let fastSpinButton = model.el('settingsFastSpinButton');
            soundController.sound.playSound({sound : 'buttonClick'});
            if (model.state('fastRoll') === true) {
                model.state('fastRoll', false);
                model.cookie('fastRoll', false);
                fastSpinButton.frameName = 'fastSpinOff.png';
            } else {
                model.state('fastRoll', true);
                model.cookie('fastRoll', true);
                fastSpinButton.frameName = 'fastSpinOn.png';
            }
        },
        openRules: function () {
            if (model.state('settings') === 'rules') return;

            model.state('settings', 'rules');
            view.hide.Settings({});
            view.hide.Overlay({});

            info.open();
            // footerController.handle.openInfo();
        },
        closeRules: function () {
            if (model.state('settings') === 'close') return;

            model.state('settings', 'close');

            info.handleClose();
            // footerController.handle.closeInfo();
        },
        showHistory: function () {
            soundController.sound.playSound({sound : 'buttonClick'});
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

        info = new Info({
            model,
            mobileBGScale: 0.75,
            mobileTableScale: 1,
            mobileCloseButtonMargin: 5
        });

        model.state('settings', 'close');
    }

    return {
        init,
        handle
    };
})();
