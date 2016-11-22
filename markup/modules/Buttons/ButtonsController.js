import { model } from 'modules/Model/Model';
import { view } from 'modules/Buttons/ButtonsView';
import { events } from 'modules/Util/Events';
import { sound } from 'modules/Sound/Sound';
import { controller as mobileSettingsController } from 'modules/MobileSettings/Controller';
import { controller as mobileAutoplayController } from 'modules/MobileAutoplay/Controller';
import { controller as mobileSetBetController } from 'modules/MobileSetBet/Controller';

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
        model.data('buttonsXRight', xRight);
        model.data('buttonsXLeft', xLeft);

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
            if (model.state('lockedButtons')) return;
            let spinButton = model.el('spinButton');
            if (spinButton.frameName === 'spinEmpty.png') return;
            sound.sounds.button.play();
            events.trigger('roll:request');
            events.trigger('roll:fast');
        },

        autoButton: function() {
            if (model.state('roll:progress')) return;
            sound.sounds.button.play();
            let autoButton = model.el('autoButton');
            if (model.state('menu') === 'opened') return;
            if (autoButton.frameName === 'stop.png') {
                events.trigger('autoplay:stop');
            } else {
                // events.trigger('menu:showMenu', 'auto');
                mobileAutoplayController.handle.openPanel({});
            }
        },

        betButton: function() {
            if (model.state('roll:progress')) return;
            let betButton = model.el('betButton');
            if (betButton.frameName === 'setBetOut.png') return;
            sound.sounds.button.play();
            if (model.state('menu') === 'opened') return;
            // events.trigger('menu:showMenu', 'bet');
            mobileSetBetController.handle.openPanel({});
        },



        menuButton: function() {
            if (model.state('roll:progress')) return;
            if (controller.isEvent) return;
            if (model.state('menu') === 'open') return;

            sound.sounds.button.play();
            mobileSettingsController.handle.openSettings({});
        },

        soundButton: function() {
            let soundButton = model.el('soundButton');
            let settingsSoundButton = model.el('settingsSoundButton');
            let settingsMusicButton = model.el('settingsMusicButton');
            if (sound.isSound || sound.isMusic) {
                sound.isSound = sound.isMusic = false;
                soundButton.frameName = 'soundOut.png';
                settingsSoundButton.frameName = 'soundOff.png';
                settingsMusicButton.frameName = 'musicOff.png';
            } else {
                sound.isSound = sound.isMusic = true;
                soundButton.frameName = 'sound.png';
                settingsSoundButton.frameName = 'soundOn.png';
                settingsMusicButton.frameName = 'musicOn.png';
                sound.sounds.button.play();
            }
        }
    }

    function autoStart(amount) {
        if (model.state('desktop')) return;
        view.auto.Start();
        let text = view.draw.autoCount({amount});
    }

    function autoStop() {
        if (model.state('desktop')) return;
        view.auto.Stop();
        view.draw.removeCount();
    }

    function autoChangeCount(count) {
        if (model.state('desktop')) return;
        view.draw.updateCount({count});
    }

    events.on('autoplay:init', autoStart);
    events.on('autoplay:stop', autoStop);
    events.on('autoplay:count', autoChangeCount);

    return {
        init
    };

})();
