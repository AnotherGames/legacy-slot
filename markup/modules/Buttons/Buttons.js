import { model } from '../../modules/Model/Model';
import { events } from '../../modules/Events/Events';

export let buttons = (function () {

    let autoButton;
    let spinButton;
    let betButton;
    let menuButton;
    let soundButton;

    function drawMobileButtons(container, game, mainWidth) {

        spinButton = game.add.sprite(0, game.world.centerY, 'mobileButtons', 'spin.png', container);
        spinButton.anchor.set(0.5);
        spinButton.inputEnabled = true;
        spinButton.input.priorityID = 1;
        spinButton.events.onInputDown.add(function () {
            events.trigger('roll:requestRoll', {
                time: 1500,
                length: 30,
                ease: 1
            });
        });

        let delta = (game.game.width - mainWidth - spinButton.width) / 4;
        let xRight = 3 * delta + mainWidth + (spinButton.width / 2);
        let xLeft = delta + spinButton.width / 2;

        model.data('buttonsDelta', delta);
        model.data('buttonsXRight', xRight);
        model.data('buttonsXLeft', xLeft);

        spinButton.x = xRight;

        autoButton = game.add.sprite(xRight, 0, 'mobileButtons', 'auto.png', container);
        autoButton.y = spinButton.y - spinButton.width / 2 - delta - autoButton.width / 2;
        autoButton.anchor.set(0.5);
        autoButton.inputEnabled = true;
        autoButton.input.priorityID = 1;
        autoButton.events.onInputDown.add(function () {
            if (model.state('menu') === 'opened') return;
            console.log('I am button');
            events.trigger('menu:showMenu', 'auto');
        });

        betButton = game.add.sprite(xRight, 0, 'mobileButtons', 'setBet.png', container);
        betButton.y = spinButton.y + spinButton.width / 2 + delta + betButton.width / 2;
        betButton.anchor.set(0.5);
        betButton.inputEnabled = true;
        betButton.input.priorityID = 1;
        betButton.events.onInputDown.add(function () {
            if (model.state('menu') === 'opened') return;
            console.log('I am button');
            events.trigger('menu:showMenu', 'bet');
        });

        menuButton = game.add.sprite(xRight, 0, 'mobileButtons', 'menu.png', container);
        menuButton.y = autoButton.y - autoButton.width / 2 - delta - menuButton.width / 2;
        menuButton.anchor.set(0.5);
        menuButton.inputEnabled = true;
        menuButton.input.priorityID = 1;
        menuButton.events.onInputDown.add(function () {
            if (model.state('menu') === 'opened') return;
            console.log('I am button');
            events.trigger('menu:showMenu', 'settings');
        });

        soundButton = game.add.sprite(xRight, 0, 'mobileButtons', 'sound.png', container);
        soundButton.y = betButton.y + betButton.width / 2 + delta + soundButton.width / 2;
        soundButton.anchor.set(0.5);
        soundButton.inputEnabled = true;
        soundButton.input.priorityID = 1;
        soundButton.events.onInputDown.add(function () {
            soundButton.frameName = soundButton.frameName === 'soundOut.png' ? 'sound.png' : 'soundOut.png';
            if (model.state('sound')) {
                model.state('sound', false);
            } else {
                model.state('sound', true);
            }
        });

    }

    function drawDesktopPanel(container, game, mainContainer) {
        let panelBG = game.add.sprite(game.world.centerX - 10, mainContainer.height + 70, 'ui', null, container);
        panelBG.anchor.set(0.5);

        let lines = game.add.text(container.x + 375, mainContainer.height + 85, '10', {font: 'normal 32px Helvetica, Arial', fill: '#e8b075', align: 'center'}, container);
        let info = game.add.button(container.x + 1490, mainContainer.height + 80, 'deskButtons', actionOnClick, this, 'info.png', 'info.png', 'info.png', container);
        let betLevelPlus = game.add.button(container.x + 565, mainContainer.height + 82, 'deskButtons', actionOnClick, this, 'plus.png', 'plus.png', 'plus.png', container);
        let betLevelMinus = game.add.button(container.x + 465, mainContainer.height + 81, 'deskButtons', actionOnClick, this, 'minus.png', 'minus.png', 'minus.png', container);
        let coinLevelPlus = game.add.button(container.x + 1400, mainContainer.height + 82, 'deskButtons', actionOnClick, this, 'plus.png', 'plus.png', 'plus.png', container);
        let coinLevelMinus = game.add.button(container.x + 1275, mainContainer.height + 81, 'deskButtons', actionOnClick, this, 'minus.png', 'minus.png', 'minus.png', container);

        let spinButtonDesk = game.add.button(0, mainContainer.height + 70, 'deskButtons', actionOnClick, this, 'spinOn.png', 'spin.png', 'spinOn.png', container);
        spinButtonDesk.anchor.set(0.5);
        spinButtonDesk.x = container.x + 950;
        spinButtonDesk.inputEnabled = true;
        spinButtonDesk.input.priorityID = 1;
        spinButtonDesk.events.onInputDown.add(function () {
            console.log('I am big Button');
            events.trigger('roll:requestRoll', {
                time: 1500,
                length: 30,
                ease: 1
            });
        });
        let maxBetButtonDesk = game.add.button(spinButtonDesk.x + 137, mainContainer.height + 69, 'deskButtons', actionOnClick, this, 'maxBetOn.png', 'maxBet.png', 'maxBetOn.png', container);
        let autoButtonDesk = game.add.button(spinButtonDesk.x - 137, mainContainer.height + 70, 'deskButtons', actionOnClick, this, 'autoOn.png', 'auto.png', 'autoOn.png', container);
        maxBetButtonDesk.anchor.set(0.5);
        autoButtonDesk.anchor.set(0.5);

        function actionOnClick() {
            console.log('i am clicked!');
        }
    }

    return {
        drawMobileButtons,
        drawDesktopPanel
    };

})();
