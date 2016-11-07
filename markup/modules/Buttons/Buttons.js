import { model } from '../../modules/Model/Model';
import { events } from '../../modules/Events/Events';
import { drawAutoDesktop } from '../../modules/Buttons/Autoplay';
import { util } from 'modules/Util/Util';
import { sound } from '../../modules/Sound/Sound';

export let buttons = (function () {

    let autoButton;
    let spinButton;
    let betButton;
    let menuButton;
    let soundButton;

    let autoButtonDesk;
    let spinButtonDesk;
    let maxBetButtonDesk;
    let betLevelPlus;
    let betLevelMinus;
    let coinLevelPlus;
    let coinLevelMinus;

    function drawHomeButton(container, game) {
        let x = 25;
        let y = (model.flag('mobile')) ? game.world.height - 50 : game.world.height - 15;

        function homeOnClick() {
            sound.sounds.button.play();
            util.request('_Logout')
                .then((response) => {
                    console.log('Logout response:', response);
                });
            window.history.back();
        }

        const homeButton = game.add.button(x, y, 'footerButtons', homeOnClick, this, 'homeOn.png', 'home.png', 'homeOn.png', null, container);
        homeButton.anchor.set(0.5);
        homeButton.inputEnabled = true;
        homeButton.input.priorityID = 1;
    }

    function drawMobileButtons(container, game, mainWidth) {
        spinButton = game.add.sprite(0, game.world.centerY, 'mobileButtons', 'spin.png', container);
        spinButton.anchor.set(0.5);
        spinButton.inputEnabled = true;
        spinButton.input.priorityID = 1;
        spinButton.events.onInputDown.add(function () {
            if (spinButton.frameName == 'spinEmpty.png') return;
            sound.sounds.button.play();
            events.trigger('roll:request');
        });
        model.el('spinButton', spinButton);

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
            sound.sounds.button.play();
            if (model.state('menu') === 'opened') return;
            if (autoButton.frameName == 'stop.png') {
                events.trigger('autoplay:stop');
            } else {
                events.trigger('menu:showMenu', 'auto');
            }
        });

        betButton = game.add.sprite(xSide, 0, 'mobileButtons', 'setBet.png', container);
        betButton.y = spinButton.y + spinButton.width / 2 + delta + betButton.width / 2;
        betButton.anchor.set(0.5);
        betButton.inputEnabled = true;
        betButton.input.priorityID = 1;
        betButton.events.onInputDown.add(function () {
            if (betButton.frameName == 'setBetOut.png') return;
            sound.sounds.button.play();
            if (model.state('menu') === 'opened') return;
            events.trigger('menu:showMenu', 'bet');
        });

        menuButton = game.add.sprite(xSide, 0, 'mobileButtons', 'menu.png', container);
        menuButton.y = autoButton.y - autoButton.width / 2 - delta - menuButton.width / 2;
        menuButton.anchor.set(0.5);
        menuButton.inputEnabled = true;
        menuButton.input.priorityID = 1;
        menuButton.events.onInputDown.add(function () {
            if (menuButton.frameName == 'menuOut.png') return;
            sound.sounds.button.play();
            if (model.state('menu') === 'opened') return;
            events.trigger('menu:showMenu', 'settings');
        });

        soundButton = game.add.sprite(xSide, 0, 'mobileButtons', 'sound.png', container);
        soundButton.y = betButton.y + betButton.width / 2 + delta + soundButton.width / 2;
        soundButton.anchor.set(0.5);
        soundButton.inputEnabled = true;
        soundButton.input.priorityID = 1;
        soundButton.events.onInputDown.add(function () {
            // soundButton.frameName = (soundButton.frameName === 'soundOut.png') ? 'sound.png' : 'soundOut.png';
            if (sound.volume > 0) {
                soundButton.frameName = 'soundOut.png';
                sound.volume = 0;
            } else {
                soundButton.frameName = 'sound.png';
                sound.volume = 1;
                sound.sounds.button.play();
            }
            console.log(model.state('sound'));
        });

        model.el('spinButton', spinButton);
        model.el('autoButton', autoButton);
        model.el('betButton', betButton);
        model.el('menuButton', menuButton);
        model.el('soundButton', soundButton);

    }

    function changeSoundButton() {
        console.log(' i am changing sound');
        if (model.state('sound') === false) {
            soundButton.frameName = 'soundOut.png';
        } else {
            soundButton.frameName = 'sound.png';
        }
    }

    function drawDesktopPanel(container, game, mainContainer) {
        let gameMachine = model.el('gameMachine');
        container.x = mainContainer.x + 45;
        container.y = gameMachine.height - 28;

        let panelBG = game.add.sprite(0, 0, 'ui', null, container);

        let lines = game.add.text(80, 112, '10', {font: 'normal 27px Helvetica, Arial, Arial', fill: '#e8b075', align: 'center'}, container);
        let info = game.add.button(container.width - 115, 105, 'deskButtons', showInfo, this, 'infoOn.png', 'info.png', 'infoOn.png', null, container);
        betLevelPlus = game.add.button(267, 107, 'deskButtons', betPlus, this, 'plusOn.png', 'plus.png', 'plusOn.png', null, container);
        betLevelMinus = game.add.button(172, 107, 'deskButtons', betMinus, this, 'minusOn.png', 'minus.png', 'minusOn.png', null, container);
        coinLevelPlus = game.add.button(1100, 107, 'deskButtons', coinsPlus, this, 'plusOn.png', 'plus.png', 'plusOn.png', null, container);
        coinLevelMinus = game.add.button(985, 106, 'deskButtons', coinsMinus, this, 'minusOn.png', 'minus.png', 'minusOn.png', null, container);


        spinButtonDesk = game.add.button(container.width / 2, 95, 'deskButtons', actionOnClick, this, 'spinOn.png', 'spin.png', 'spinOn.png', null, container);
        spinButtonDesk.anchor.set(0.5);
        spinButtonDesk.inputEnabled = true;
        spinButtonDesk.input.priorityID = 1;
        spinButtonDesk.events.onInputDown.add(function () {
            if (spinButtonDesk.frameName == 'stop.png') {
                events.trigger('autoplay:stop:desktop');
                return;
            }
            sound.sounds.button.play();
            events.trigger('roll:request', {
                // TODO: для обычних круток используй параметры конфига.
                // time: 1500,
                // length: 30,
                // ease: 1
            });
        });
        maxBetButtonDesk = game.add.button(spinButtonDesk.x + 137, 94, 'deskButtons', maxBet, this, 'maxBetOn.png', 'maxBet.png', 'maxBetOn.png', null, container);
        autoButtonDesk = game.add.button(spinButtonDesk.x - 137, 94, 'deskButtons', autoOn, this, 'autoOn.png', 'auto.png', 'autoOn.png', null, container);
        model.el('autoButtonDesk', autoButtonDesk);
        maxBetButtonDesk.anchor.set(0.5);
        autoButtonDesk.anchor.set(0.5);
        drawAutoDesktop(container, game, mainContainer, autoButtonDesk);
        let autoDesktopContainer = model.el('autoDesktopContainer');

        function coinsPlus() {
            sound.sounds.button.play();
            events.trigger('buttons:changeCoins', true);
        }

        function coinsMinus() {
            sound.sounds.button.play();
            events.trigger('buttons:changeCoins', false);
        }

        function betPlus() {
            sound.sounds.button.play();
            events.trigger('buttons:changeBet', true);
        }

        function betMinus() {
            sound.sounds.button.play();
            events.trigger('buttons:changeBet', false);
        }

        function maxBet() {
            if (maxBetButtonDesk.frameName == 'maxBetOn.png') return;
            sound.sounds.button.play();
            events.trigger('buttons:maxBet');
        }

        events.on('autoplay:init:desktop', autoOn);

        function autoOn() {
            if (autoButtonDesk.frameName == 'autoEmpty.png' && model.state('autoPanel') === false) return;
            sound.sounds.button.play();
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
            sound.sounds.button.play();
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

    function drawDesktopBottomButtons(container, game) {
        let x = [25, 75, 125, 175];
        let y = game.world.height - 15;

        function menuOnClick() {
            $('#checkSound').prop('checked', model.state('sound'));
            $('#checkMusic').prop('checked', model.state('music'));
            $('#fastSpin').prop('checked', model.state('fastRoll'));
            $('#isAnimations').prop('checked', model.state('isAnimations'));

            $('#settings').removeClass('closed');
            $('#darkness').removeClass('closed');

            $('#darkness').on('click', function () {
                $('#settings').addClass('closed');
                $('#darkness').addClass('closed');
                $('.history').addClass('closed');
                $('#darkness').off();
            });

            sound.sounds.button.play();
        }

        const menuButton = game.add.button(x[1], y, 'footerButtons', menuOnClick, this, 'menuOn.png', 'menu.png', 'menuOn.png', null, container);
        menuButton.anchor.set(0.5);

        let soundButton;
        function soundOnClick() {
            if (game.sound.volume > 0) {
                soundButton.frameName = 'soundOff.png';
                game.sound.volume = 0;
            } else {
                soundButton.frameName = 'soundOn.png';
                game.sound.volume = 1;
            }
        }

        soundButton = game.add.button(x[2], y, 'footerButtons', soundOnClick, this, 'soundOn.png', 'sound.png', null, container);
        soundButton.anchor.set(0.5);
        soundButton.inputEnabled = true;
        soundButton.input.priorityID = 1;

        function fastOnClick() {
            if (model.state('fastRoll')) {
                model.state('fastRoll', false);
            } else {
                model.state('fastRoll', true);
            }

            sound.sounds.button.play();
        }

        const fastButton = game.add.button(x[3], y, 'footerButtons', fastOnClick, this, 'fastSpinOn.png', 'fastSpin.png', null, container);
        fastButton.anchor.set(0.5);
        fastButton.inputEnabled = true;
        fastButton.input.priorityID = 1;
    }

    function autoStart() {
        spinButton.frameName = 'spinEmpty.png';
        betButton.frameName = 'setBetOut.png';
        menuButton.frameName = 'menuOut.png';
        autoButton.frameName = 'stop.png';
    }

    function autoStop() {
        spinButton.frameName = 'spin.png';
        betButton.frameName = 'setBet.png';
        menuButton.frameName = 'menu.png';
        autoButton.frameName = 'auto.png';
    }

    function autoStartDesktop() {
        spinButtonDesk.frameName = 'stop.png';
        spinButtonDesk.freezeFrames = true;
        autoButtonDesk.frameName = 'autoEmpty.png';
        autoButtonDesk.freezeFrames = true;
        maxBetButtonDesk.frameName = 'maxBetOn.png';
        maxBetButtonDesk.freezeFrames = true;
        betLevelPlus.visible = false;
        betLevelMinus.visible = false;
        coinLevelPlus.visible = false;
        coinLevelMinus.visible = false;
    }

    function autoStopDesktop() {
        spinButtonDesk.frameName = 'spin.png';
        spinButtonDesk.freezeFrames = false;
        autoButtonDesk.frameName = 'auto.png';
        autoButtonDesk.freezeFrames = false;
        maxBetButtonDesk.frameName = 'maxBet.png';
        maxBetButtonDesk.freezeFrames = false;
        betLevelPlus.visible = true;
        betLevelMinus.visible = true;
        coinLevelPlus.visible = true;
        coinLevelMinus.visible = true;
    }


    events.on('buttons:changeSoundButton', changeSoundButton);
    events.on('autoplay:init', autoStart);
    events.on('autoplay:stop', autoStop);
    events.on('autoplay:init:desktop', autoStartDesktop);
    events.on('autoplay:stop:desktop', autoStopDesktop);

    return {
        drawHomeButton,
        drawMobileButtons,
        drawDesktopPanel,
        drawDesktopBottomButtons
    };

})();
