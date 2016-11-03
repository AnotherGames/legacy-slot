import { model } from '../../modules/Model/Model';
import { menu } from '../../modules/Menu/Menu';
import { events } from '../../modules/Events/Events';

export function drawSettingsMenu(container, game) {
    const settingsContainer = game.add.group();
    container.add(settingsContainer);

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
        if (model.state('sound') === true) {
            model.state('sound', false);
            soundButton.frameName = 'soundOff.png';
        } else {
            model.state('sound', true);
            soundButton.frameName = 'soundOn.png';
        }
        events.trigger('buttons:changeSoundButton');
        console.log(model.state('sound'));
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
        if (model.state('music') === true) {
            model.state('music', false);
            musicButton.frameName = 'musicOff.png';
        } else {
            model.state('music', true);
            musicButton.frameName = 'musicOn.png';
        }
        console.log(model.state('music'));
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
        if (model.state('fastRoll') === true) {
            model.state('fastRoll', false);
            fastSpinButton.frameName = 'fastSpinOff.png';
        } else {
            model.state('fastRoll', true);
            fastSpinButton.frameName = 'fastSpinOn.png';
        }
        console.log(model.state('fastRoll'));
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
        handleChangeSide(handModeButton);
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
        console.log('i am historyButton');
        $('.history').toggleClass('closed');
    });

    $('.history__button').click((event) => {
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

function handleChangeSide(handModeButton) {
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
        changeSideButtons(xSide);
        mainContainer.x = model.data('mainXRight');
        mask.x = model.data('mainXRight') - model.data('mainXLeft');
    } else {
        model.state('side', 'left');
        handModeButton.frameName = 'handModeOff.png';
        xSide = model.data('buttonsXRight');
        changeSideButtons(xSide);
        mainContainer.x = model.data('mainXLeft');
        mask.x = 0;
    }
}

function changeSideButtons(xSide) {
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
