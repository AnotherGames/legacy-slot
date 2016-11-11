import { model } from 'modules/Model/Model';
import { view } from 'modules/Buttons/ButtonsView';
import { events } from 'modules/Util/Events';
import { sound } from 'modules/Sound/Sound';
import { controller as mobileSettingsController } from 'modules/MobileSettings/Controller';

export let controller = (() => {
    let game;

    function init() {
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
        const spinButtonWidth = 173; // Add some magic
        model.el('spinButtonWidth', spinButtonWidth);
        let buttonsDelta = (game.width - model.group('main').width - spinButtonWidth) / 4;
        model.el('buttonsDelta', buttonsDelta);

        let xRight = 3 * buttonsDelta + model.group('main').width + (spinButtonWidth / 2);
        let xLeft = buttonsDelta + spinButtonWidth / 2;

        let spinButton = model.el('spinButton');
        let betButton = model.el('betButton');
        let autoButton = model.el('autoButton');
        let soundButton = model.el('soundButton');
        let menuButton = model.el('menuButton');

        if (model.state('side') === 'left') {
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
            if (spinButton.frameName === 'spinEmpty.png') return;
            sound.sounds.button.play();
            events.trigger('roll:request');
        },

        autoButton: function() {
            sound.sounds.button.play();
            let autoButton = model.el('autoButton');
            if (model.state('menu') === 'opened') return;
            if (autoButton.frameName === 'stop.png') {
                events.trigger('autoplay:stop');
            } else {
                events.trigger('menu:showMenu', 'auto');
            }
        },

        betButton: function() {
            let betButton = model.el('betButton');
            if (betButton.frameName === 'setBetOut.png') return;
            sound.sounds.button.play();
            if (model.state('menu') === 'opened') return;
            events.trigger('menu:showMenu', 'bet');
        },

        menuButton: function() {
            if (controller.isEvent) return;
            if (model.state('menu') === 'open') return;

            sound.sounds.button.play();
            mobileSettingsController.handle.openSettings({});
        },

        soundButton: function() {
            let soundButton = model.el('soundButton');
            if (sound.volume > 0) {
                soundButton.frameName = 'soundOut.png';
                sound.volume = 0;
            } else {
                soundButton.frameName = 'sound.png';
                sound.volume = 1;
                sound.sounds.button.play();
            }
        }
    }

    return {
        init
    };

})();
