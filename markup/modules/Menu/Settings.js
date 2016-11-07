import { model } from '../../modules/Model/Model';
import { menu } from '../../modules/Menu/Menu';
import { events } from '../../modules/Events/Events';

export let settings = (function () {
    function drawMobileSettingsMenu(container, game) {
        const settingsContainer = game.add.group();
        container.add(settingsContainer);
        let buttonSound = model.el('buttonSound');

        const settingsTitle = game.add.text(
            container.width / 2,
            game.world.height * 0.07,
            'SETTINGS',
            {font: 'bold 40px Arial', fill: '#fff', align: 'center'},
            settingsContainer);
        settingsTitle.anchor.set(0.5);

        const soundButton = game.add.sprite(
            0,
            game.world.height * 0.2,
            'menuButtons',
            null,
            settingsContainer);
        if (model.state('sound') === false) {
            soundButton.frameName = 'soundOff.png';
        } else {
            soundButton.frameName = 'soundOn.png';
        }
        soundButton.anchor.set(0.5);

        let deltaY = 20;
        let deltaX = (container.width - soundButton.width * 2.5) / 3;
        soundButton.x = deltaX + soundButton.width / 2;

        soundButton.inputEnabled = true;
        soundButton.input.priorityID = 2;
        soundButton.events.onInputDown.add(function () {
            events.trigger('buttons:changeSoundButton');
            // TODO: вынести в controller.sound
            let fonSound = model.el('fonSound');

            if (model.state('sound') === true) {
                model.state('sound', false);
                soundButton.frameName = 'soundOff.png';

                model.state('music', false);
                fonSound.stop();
            } else {
                buttonSound.play();
                model.state('sound', true);
                soundButton.frameName = 'soundOn.png';

                model.state('music', true);
                fonSound.play();
            }
        });

        const soundText = game.add.sprite(
            soundButton.x,
            soundButton.y + soundButton.height / 2 + deltaY,
            'menuButtons',
            'soundText.png',
            settingsContainer);
        soundText.anchor.set(0.5);

        const musicButton = game.add.sprite(
            2 * deltaX + 1.5 * soundButton.width,
            game.world.height * 0.2,
            'menuButtons',
            null,
            settingsContainer);
        if (model.state('music') === false) {
            musicButton.frameName = 'musicOff.png';
        } else {
            musicButton.frameName = 'musicOn.png';
        }
        musicButton.anchor.set(0.5);

        musicButton.inputEnabled = true;
        musicButton.input.priorityID = 2;
        musicButton.events.onInputDown.add(function () {
            buttonSound.play();
            let fonSound = model.el('fonSound');
            if (model.state('music') === true) {
                model.state('music', false);
                fonSound.stop();
                musicButton.frameName = 'musicOff.png';
            } else {
                model.state('music', true);
                fonSound.play();
                musicButton.frameName = 'musicOn.png';
            }
        });

        const musicText = game.add.sprite(
            musicButton.x,
            musicButton.y + musicButton.height / 2 + deltaY,
            'menuButtons',
            'musicText.png',
            settingsContainer);
        musicText.anchor.set(0.5);

        const fastSpinButton = game.add.sprite(
            soundButton.x,
            game.world.height * 0.45,
            'menuButtons',
            null,
            settingsContainer);
        if (model.state('fastRoll') === false) {
            fastSpinButton.frameName = 'fastSpinOff.png';
        } else {
            fastSpinButton.frameName = 'fastSpinOn.png';
        }
        fastSpinButton.anchor.set(0.5);

        fastSpinButton.inputEnabled = true;
        fastSpinButton.input.priorityID = 2;
        fastSpinButton.events.onInputDown.add(function () {
            buttonSound.play();
            if (model.state('fastRoll') === true) {
                model.state('fastRoll', false);
                fastSpinButton.frameName = 'fastSpinOff.png';
            } else {
                model.state('fastRoll', true);
                fastSpinButton.frameName = 'fastSpinOn.png';
            }
        });

        const fastSpinText = game.add.sprite(
            fastSpinButton.x,
            fastSpinButton.y + fastSpinButton.height / 2 + deltaY,
            'menuButtons',
            'fastSpinText.png',
            settingsContainer);
        fastSpinText.anchor.set(0.5);

        const handModeButton = game.add.sprite(
            musicButton.x,
            game.world.height * 0.45,
            'menuButtons',
            null,
            settingsContainer);
        if (model.state('side') === 'left') {
            handModeButton.frameName = 'handModeOff.png';
        } else {
            handModeButton.frameName = 'handModeOn.png';
        }
        handModeButton.anchor.set(0.5);

        handModeButton.inputEnabled = true;
        handModeButton.input.priorityID = 2;
        handModeButton.events.onInputDown.add(function () {
            buttonSound.play();
        _handleChangeSide(handModeButton);
        });

        const handModeText = game.add.sprite(
            handModeButton.x,
            handModeButton.y + handModeButton.height / 2 + deltaY,
            'menuButtons',
            'handModeText.png',
            settingsContainer);
        handModeText.anchor.set(0.5);

        const rulesButton = game.add.sprite(
            soundButton.x,
            game.world.height * 0.7,
            'menuButtons',
            'infoOn.png',
            settingsContainer);
        rulesButton.anchor.set(0.5);

        rulesButton.inputEnabled = true;
        rulesButton.input.priorityID = 2;
        rulesButton.events.onInputDown.add(function () {
            buttonSound.play();
            console.log('i am rulesButton');
            const overlay = game.add.graphics(0, 0).beginFill(0x000000, 0.8).drawRect(0, 0, game.world.width, game.world.height);
            const infoRules = game.add.sprite(game.world.centerX, game.world.centerY, 'infoRules');
            infoRules.anchor.set(0.5);
            infoRules.inputEnabled = true;
            infoRules.events.onInputDown.add(function () {
                infoRules.destroy();
                overlay.destroy();
            });
        });

        const rulesText = game.add.sprite(
            rulesButton.x,
            rulesButton.y + rulesButton.height / 2 + deltaY,
            'menuButtons',
            'infoText.png',
            settingsContainer);
        rulesText.anchor.set(0.5);

        const historyButton = game.add.sprite(
            musicButton.x,
            game.world.height * 0.7,
            'menuButtons',
            'historyOn.png',
            settingsContainer);
        historyButton.anchor.set(0.5);

        historyButton.inputEnabled = true;
        historyButton.input.priorityID = 2;
        historyButton.events.onInputDown.add(function () {
            buttonSound.play();
            console.log('i am historyButton');
            $('.history').toggleClass('closed');
        });

        const historyText = game.add.sprite(
            historyButton.x,
            historyButton.y + historyButton.height / 2 + deltaY,
            'menuButtons',
            'historyText.png',
            settingsContainer);
        historyText.anchor.set(0.5);
    }

    function _handleChangeSide(handModeButton) {
        const overlay = model.el('menuOverlay');
        overlay.destroy();
        menu.hideMenu();
        const mainContainer = model.el('mainContainer');
        const mask = model.el('mask');
        let xSide;
        if (model.state('side') === 'left') {
            model.state('side', 'right');
            handModeButton.frameName = 'handModeOn.png';
            xSide = model.data('buttonsXLeft');
            _changeSideButtons(xSide);
            mainContainer.x = model.data('mainXRight');
            mask.x = model.data('mainXRight') - model.data('mainXLeft');
        } else {
            model.state('side', 'left');
            handModeButton.frameName = 'handModeOff.png';
            xSide = model.data('buttonsXRight');
            _changeSideButtons(xSide);
            mainContainer.x = model.data('mainXLeft');
            mask.x = 0;
        }
    }

    function _changeSideButtons(xSide) {
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
    }

    function initDesktopSettings(game) {
        $('#volume').on('input change', function () {
            game.sound.volume = this.value / 100;
        });
        $('#checkSound').on('change', function () {
            let buttonSound = model.el('buttonSound');
            let barabanSound = model.el('barabanSound');
            model.state('sound', this.checked);

            buttonSound.mute = !this.checked;
            barabanSound.mute = !this.checked;
            // console.log(this.id, this.checked);
        });
        $('#checkMusic').on('change', function () {
            let fonSound = model.el('fonSound');
            model.state('music', this.checked);
            fonSound.mute = !this.checked;
        });
        $('#fastSpin').on('change', function () {
            model.state('fastRoll', this.checked);
            // console.log(this.id, this.checked);
        });
        $('#isAnimations').on('change', function () {
            let isAnim = this.checked;
            model.state('isAnimations', isAnim);

            let animMainBG = model.el('animMainBG');
            let mainBG = model.el('mainBG');

            if (isAnim) {
                animMainBG.visible = true;
                mainBG.visible = false;
            } else {
                mainBG.visible = true;
                animMainBG.visible = false;
            }

            game.spriteAnims.forEach((elem) => {
                elem.sprite.animations.paused = !isAnim;
            });
            // console.log(this.id, this.checked);
        });
        $('#optionAutoplay1').on('change', function () {
            console.log(this.id, this.checked);
        });
        $('#optionAutoplayVal1').on('input change', function () {
            console.log('optionAutoplayVal1', this.value);
        });
        $('#optionAutoplay2').on('change', function () {
            console.log(this.id, this.checked);
        });
        $('#optionAutoplayVal2').on('input change', function () {
            console.log('optionAutoplayVal2', this.value);
        });
        $('#optionAutoplay3').on('change', function () {
            console.log(this.id, this.checked);
        });
        $('#optionAutoplayVal3').on('input change', function () {
            console.log('optionAutoplayVal3', this.value);
        });
        $('#optionAutoplay4').on('change', function () {
            console.log(this.id, this.checked);
        });
        $('#btnHistory').on('click', function () {
            $('.history').removeClass('closed');
            // console.log('btnHistory');
        });
        $('#btnRules').on('click', function () {
            console.log('btnRules');
        });
        $('#settingsSave').on('click', function () {
            $('#settings').addClass('closed');
            $('#darkness').addClass('closed');
            $('.history').addClass('closed');
            $('#darkness').off();
            // TODO: request new settings.
        });
    }

    return {
        drawMobileSettingsMenu,
        initDesktopSettings
    };
})();
