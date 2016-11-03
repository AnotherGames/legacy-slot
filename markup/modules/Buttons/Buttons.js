import { model } from '../../modules/Model/Model';
import { events } from '../../modules/Events/Events';
import { drawAutoDesktop } from '../../modules/Buttons/Autoplay';

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
            events.trigger('roll:request');
        });

        let delta = (game.game.width - mainWidth - spinButton.width) / 4;
        let xRight = 3 * delta + mainWidth + (spinButton.width / 2);
        let xLeft = delta + spinButton.width / 2;

        model.data('buttonsDelta', delta);
        model.data('buttonsXRight', xRight);
        model.data('buttonsXLeft', xLeft);
        let xSide;

        if (model.state('side') === 'right') {
            xSide = model.data('buttonsXLeft');
        } else {
            xSide = model.data('buttonsXRight');
        }

        spinButton.x = xSide;

        autoButton = game.add.sprite(xSide, 0, 'mobileButtons', 'auto.png', container);
        autoButton.y = spinButton.y - spinButton.width / 2 - delta - autoButton.width / 2;
        autoButton.anchor.set(0.5);
        autoButton.inputEnabled = true;
        autoButton.input.priorityID = 1;
        autoButton.events.onInputDown.add(function () {
            if (model.state('menu') === 'opened') return;
            events.trigger('menu:showMenu', 'auto');
        });

        betButton = game.add.sprite(xSide, 0, 'mobileButtons', 'setBet.png', container);
        betButton.y = spinButton.y + spinButton.width / 2 + delta + betButton.width / 2;
        betButton.anchor.set(0.5);
        betButton.inputEnabled = true;
        betButton.input.priorityID = 1;
        betButton.events.onInputDown.add(function () {
            if (model.state('menu') === 'opened') return;
            events.trigger('menu:showMenu', 'bet');
        });

        menuButton = game.add.sprite(xSide, 0, 'mobileButtons', 'menu.png', container);
        menuButton.y = autoButton.y - autoButton.width / 2 - delta - menuButton.width / 2;
        menuButton.anchor.set(0.5);
        menuButton.inputEnabled = true;
        menuButton.input.priorityID = 1;
        menuButton.events.onInputDown.add(function () {
            if (model.state('menu') === 'opened') return;
            events.trigger('menu:showMenu', 'settings');
        });

        soundButton = game.add.sprite(xSide, 0, 'mobileButtons', 'sound.png', container);
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


        model.el('spinButton', spinButton);
        model.el('autoButton', autoButton);
        model.el('betButton', betButton);
        model.el('menuButton', menuButton);
        model.el('soundButton', soundButton);
    }

    function drawDesktopPanel(container, game, mainContainer) {
        let gameMachine = model.el('gameMachine');
        container.x = mainContainer.x + 45;
        container.y = gameMachine.height - 28;

        let panelBG = game.add.sprite(0, 0, 'ui', null, container);

        let lines = game.add.text(80, 112, '10', {font: 'normal 27px Helvetica, Arial, Arial', fill: '#e8b075', align: 'center'}, container);
        let info = game.add.button(container.width - 115, 105, 'deskButtons', showInfo, this, 'infoOn.png', 'info.png', 'infoOn.png', null, container);
        let betLevelPlus = game.add.button(267, 107, 'deskButtons', betPlus, this, 'plusOn.png', 'plus.png', 'plusOn.png', null, container);
        let betLevelMinus = game.add.button(172, 107, 'deskButtons', betMinus, this, 'minusOn.png', 'minus.png', 'minusOn.png', null, container);
        let coinLevelPlus = game.add.button(1100, 107, 'deskButtons', coinsPlus, this, 'plusOn.png', 'plus.png', 'plusOn.png', null, container);
        let coinLevelMinus = game.add.button(985, 106, 'deskButtons', coinsMinus, this, 'minusOn.png', 'minus.png', 'minusOn.png', null, container);


        let spinButtonDesk = game.add.button(container.width / 2, 95, 'deskButtons', actionOnClick, this, 'spinOn.png', 'spin.png', 'spinOn.png', null, container);
        spinButtonDesk.anchor.set(0.5);
        spinButtonDesk.inputEnabled = true;
        spinButtonDesk.input.priorityID = 1;
        spinButtonDesk.events.onInputDown.add(function () {
            events.trigger('roll:request', {
                time: 1500,
                length: 30,
                ease: 1
            });
        });
        let maxBetButtonDesk = game.add.button(spinButtonDesk.x + 137, 94, 'deskButtons', maxBet, this, 'maxBetOn.png', 'maxBet.png', 'maxBetOn.png', null, container);
        let autoButtonDesk = game.add.button(spinButtonDesk.x - 137, 94, 'deskButtons', autoOn, this, 'autoOn.png', 'auto.png', 'autoOn.png', null, container);
        maxBetButtonDesk.anchor.set(0.5);
        autoButtonDesk.anchor.set(0.5);
        drawAutoDesktop(container, game, mainContainer, autoButtonDesk);
        let autoDesktopContainer = model.el('autoDesktopContainer');

        function coinsPlus() {
            events.trigger('buttons:changeCoins', true);
        }

        function coinsMinus() {
            events.trigger('buttons:changeCoins', false);
        }

        function betPlus() {
            events.trigger('buttons:changeBet', true);
        }

        function betMinus() {
            events.trigger('buttons:changeBet', false);
        }

        function maxBet() {
            events.trigger('buttons:maxBet');
        }

        function autoOn() {

            let autoTween = game.add.tween(autoButtonDesk).to( { x: 365 }, 350, 'Linear');
            let autoSelectTween = game.add.tween(autoDesktopContainer).to( { x: 495, alpha: 1 }, 250, 'Linear');
            autoSelectTween.start();
            autoTween.start();
            if (model.state('autoPanel') === true) {
                let autoTweenBack = game.add.tween(autoButtonDesk).to( { x: spinButtonDesk.x - 137}, 350, 'Linear');
                let autoSelectTweenBack = game.add.tween(autoDesktopContainer).to( { x: 650, alpha: 0 }, 250, 'Linear');
                autoSelectTweenBack.start();
                autoTweenBack.start();
            }
            if (model.state('autoPanel')) {
                model.state('autoPanel', false);
            } else {
                model.state('autoPanel', true);
            }
        }

        function actionOnClick() {

        }

        function showInfo() {
            const overlay = game.add.graphics(0, 0).beginFill(0x000000, 0.8).drawRect(0, 0, game.world.width, game.world.height);
            const infoRules = game.add.sprite(game.world.centerX, game.world.centerY, 'infoRules');
            infoRules.anchor.set(0.5);
            infoRules.inputEnabled = true;
            infoRules.events.onInputDown.add(function () {
                infoRules.destroy();
                overlay.destroy();
            });
        }
    }

    return {
        drawMobileButtons,
        drawDesktopPanel
    };

})();
