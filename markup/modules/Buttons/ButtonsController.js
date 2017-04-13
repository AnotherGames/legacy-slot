import { model } from 'modules/Model/Model';
import { config } from 'modules/Util/Config';
import { view } from 'modules/Buttons/ButtonsView';

import { controller as rollController } from 'modules/Roll/RollController';
import { controller as soundController } from '../../../Info/SoundController';
import { controller as autoplayController } from 'modules/Autoplay/AutoplayController';
import { controller as mobileSettingsController } from 'modules/Menu/Settings/MenuSettingsController';
import { controller as mobileAutoplayController } from 'modules/Menu/Autoplay/MenuAutoplayController';
import { controller as mobileSetBetController } from 'modules/Menu/SetBet/MenuSetBetController';

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
        let spinButton = model.el('spinButton');
        let betButton = model.el('betButton');
        let autoButton = model.el('autoButton');
        let soundButton = model.el('soundButton');
        let menuButton = model.el('menuButton');

        let spinButtonWidth = config[model.res].spinButtonWidth;
        let buttonsDelta = (game.width - model.group('main').width - spinButtonWidth) / 4;
        let xRight = 3 * buttonsDelta + model.group('main').width + (spinButtonWidth / 2);
        let xLeft = buttonsDelta + spinButtonWidth / 2;

        model.data('spinButtonWidth', spinButtonWidth);
        model.data('buttonsDelta', buttonsDelta);
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
        let spinButton = model.el('spinButton');
        let betButton = model.el('betButton');
        let autoButton = model.el('autoButton');
        let soundButton = model.el('soundButton');
        let menuButton = model.el('menuButton');

        let buttonsDelta = model.data('buttonsDelta');
        let spinButtonWidth = model.data('spinButtonWidth');

        betButton.y = spinButton.y + spinButtonWidth / 2 + buttonsDelta + betButton.width / 2;
        autoButton.y = spinButton.y - spinButtonWidth / 2 - buttonsDelta - autoButton.width / 2;
        menuButton.y= autoButton.y - autoButton.width / 2 - buttonsDelta - menuButton.width / 2;
        soundButton.y = betButton.y + betButton.width / 2 + buttonsDelta + soundButton.width / 2;

    }

    let handle = {
        spinButton: function () {
            let spinButton = model.el('spinButton');

            if (model.state('buttons:locked')
            || spinButton.frameName === 'spinEmpty.png') return;

            soundController.sound.playSound({sound : 'buttonClick'});
            lockButtons();

            rollController.startRoll();
            rollController.fastRoll();
        },

        autoButton: function() {
            if (model.state('buttons:locked')) return;
            let autoButton = model.el('autoButton');

            soundController.sound.playSound({sound : 'buttonClick'});

            if (autoButton.frameName === 'stop.png') {
                autoplayController.stop();
                if (model.state('ready')) unlockButtons();
            } else {
                mobileAutoplayController.handle.openPanel({});
            }
        },

        betButton: function() {
            let betButton = model.el('betButton');

            if (model.state('buttons:locked')
            || betButton.frameName === 'setBetOut.png') return;

            soundController.sound.playSound({sound : 'buttonClick'});
            mobileSetBetController.handle.openPanel({});
        },

        menuButton: function() {
            if (model.state('buttons:locked')
            || model.state('roll:progress')) return;

            soundController.sound.playSound({sound : 'buttonClick'});
            mobileSettingsController.handle.openSettings({});
        },

        soundButton: function() {
            let soundButton = model.el('soundButton');
            if (model.state('globalSound')) {
                soundController.volume.switchVolume();
                soundButton.frameName = 'soundOut.png';
            } else {
                soundController.volume.switchVolume();
                soundButton.frameName = 'sound.png';
            }
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

    function lockButtons() {
        if(model.desktop
        || model.state('autoplay:start')) return;

        view.draw.lockButtons();
    }

    function unlockButtons() {
        if(model.desktop
        || model.state('autoplay:start')) return;

        view.draw.unlockButtons();
    }

    return {
        drawButtons,
        auto,
        lockButtons,
        unlockButtons
    };

})();
