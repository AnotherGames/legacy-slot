import { model } from 'modules/Model/Model';
import { config } from 'modules/Util/Config';
import { view } from 'modules/Buttons/View';

import { controller as rollController } from 'modules/Roll/Controller';
import { controller as soundController } from 'modules/Sound/Controller';
import { controller as autoplayController } from 'modules/Autoplay/Controller';
import { controller as mobileSettingsController } from 'modules/Menu/Settings/Controller';
import { controller as mobileAutoplayController } from 'modules/Menu/Autoplay/Controller';
import { controller as mobileSetBetController } from 'modules/Menu/SetBet/Controller';

export let controller = (() => {
    let game;

    function drawButtons() {
        game = model.el('game');

        let spinButton = view.draw.SpinButton({});
            spinButton.inputEnabled = true;
            spinButton.events.onInputDown.add(handle.spinButton);

        let autoButton = view.draw.AutoButton({});
            autoButton.inputEnabled = true;
            autoButton.events.onInputDown.add(handle.autoButton);

        let betButton = view.draw.BetButton({});
            betButton.inputEnabled = true;
            betButton.events.onInputDown.add(handle.betButton);

        let menuButton = view.draw.MenuButton({});
            menuButton.inputEnabled = true;
            menuButton.events.onInputDown.add(handle.menuButton);

        let soundButton = view.draw.SoundButton({});
            soundButton.inputEnabled = true;
            soundButton.events.onInputDown.add(handle.soundButton);

        setButtonsX();
        setButtonsY();
    }

    function setButtonsX() {
        const spinButtonWidth = config[model.state('res')].spinButtonWidth;
        let spinButton = model.el('spinButton');
        let betButton = model.el('betButton');
        let autoButton = model.el('autoButton');
        let soundButton = model.el('soundButton');
        let menuButton = model.el('menuButton');
        let buttonsDelta = (game.width - model.group('main').width - spinButtonWidth) / 4;
        let xRight = 3 * buttonsDelta + model.group('main').width + (spinButtonWidth / 2);
        let xLeft = buttonsDelta + spinButtonWidth / 2;

        model.el('spinButtonWidth', spinButtonWidth);
        model.el('buttonsDelta', buttonsDelta);
        model.data('buttonsXRight', xRight);
        model.data('buttonsXLeft', xLeft);


        if (model.state('gameSideLeft')) {
            spinButton.x = xRight;
            betButton.x = xRight;
            autoButton.x = xRight;
            soundButton.x = xRight;
            menuButton.x = xRight;
        } else {
            spinButton.x = xLeft;
            betButton.x = xLeft;
            autoButton.x = xLeft;
            soundButton.x = xLeft;
            menuButton.x = xLeft;
        }
    }

    function setButtonsY() {
        let buttonsDelta = model.el('buttonsDelta');
        let spinButtonWidth = model.el('spinButtonWidth');
        let spinButton = model.el('spinButton');
        let betButton = model.el('betButton');
        let autoButton = model.el('autoButton');
        let soundButton = model.el('soundButton');
        let menuButton = model.el('menuButton');

        betButton.y = spinButton.y + spinButtonWidth / 2 + buttonsDelta + betButton.width / 2;
        autoButton.y = spinButton.y - spinButtonWidth / 2 - buttonsDelta - autoButton.width / 2;
        menuButton.y= autoButton.y - autoButton.width / 2 - buttonsDelta - menuButton.width / 2;
        soundButton.y = betButton.y + betButton.width / 2 + buttonsDelta + soundButton.width / 2;

    }

    const handle = {
        spinButton: function () {
            let spinButton = model.el('spinButton');

            if (model.state('buttons:locked')
            || spinButton.frameName === 'spinEmpty.png') return;

            soundController.sounds.button.play();

            rollController.startRoll();
            rollController.fastRoll();
        },

        autoButton: function() {
            let autoButton = model.el('autoButton');

            if (model.state('buttons:locked')
            || model.state('menu') === 'opened') return;
            // if (model.state('roll:progress')) return;
            soundController.sounds.button.play();

            if (autoButton.frameName === 'stop.png') {
                autoplayController.stop();
            } else {
                mobileAutoplayController.handle.openPanel({});
            }
        },

        betButton: function() {
            let betButton = model.el('betButton');

            if (model.state('buttons:locked')
            || betButton.frameName === 'setBetOut.png'
            || model.state('menu') === 'opened') return;
            // if (model.state('roll:progress')) return;
            soundController.sounds.button.play();
            mobileSetBetController.handle.openPanel({});
        },

        menuButton: function() {
            if (model.state('buttons:locked')
            || model.state('roll:progress')
            || controller.isEvent
            || model.state('menu') === 'open') return;
            soundController.sounds.button.play();
            mobileSettingsController.handle.openSettings({});
        },

        soundButton: function() {
            if (soundController.isSound || soundController.isMusic) {
                handle.turnOffSound();
            } else {
                handle.turnOnSound();
            }
        },

        turnOffSound: function() {
            let soundButton = model.el('soundButton');
            let settingsSoundButton = model.el('settingsSoundButton');
            let settingsMusicButton = model.el('settingsMusicButton');

            soundController.isSound = soundController.isMusic = false;
            soundButton.frameName = 'soundOut.png';
            settingsSoundButton.frameName = 'soundOff.png';
            settingsMusicButton.frameName = 'musicOff.png';
        },

        turnOnSound: function() {
            let soundButton = model.el('soundButton');
            let settingsSoundButton = model.el('settingsSoundButton');
            let settingsMusicButton = model.el('settingsMusicButton');

            soundController.isSound = soundController.isMusic = true;
            soundButton.frameName = 'sound.png';
            settingsSoundButton.frameName = 'soundOn.png';
            settingsMusicButton.frameName = 'musicOn.png';
            // soundController.sounds.button.play();
        }
    };

    let auto = {

        start: function(amount) {
            view.auto.Start();
            view.draw.autoCount({amount});
        },

        stop: function() {
            view.auto.Stop();
            view.draw.removeCount();
        },

        change: function(count) {
            view.draw.updateCount({count});
        }

    };

    //TODO do smth with this shit
    function freezeInfo() {
        if(!model.mobile) return;
        if(model.state('autoplay:start')) return;

        view.draw.lockButtons();
    }

    function unfreezeInfo() {
        if(!model.mobile) return;
        if(model.state('autoplay:start')) return;

        view.draw.unlockButtons();
    }

    return {
        drawButtons,
        auto,
        freezeInfo,
        unfreezeInfo
    };

})();
