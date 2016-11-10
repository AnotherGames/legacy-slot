import { model } from 'modules/Model/Model';
import { view } from 'modules/Buttons/ButtonsView';
import { events } from 'modules/Util/Events';
import { sound } from 'modules/Sound/Sound';

export let controller = (() => {
    let game;

    function init() {
        game = model.el('game');

        view.draw.SpinButton({});
        view.draw.AutoButton({});
        view.draw.BetButton({});
        view.draw.MenuButton({});
        view.draw.SoundButton({});

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

    return {
        init
    };

})();
