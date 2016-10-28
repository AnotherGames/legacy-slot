import { model } from '../../modules/Model/Model';

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
        'soundOff.png',
        settingsContainer);
    soundButton.anchor.set(0.5);

    let deltaY = 20;
    let deltaX = (container.width - soundButton.width * 2.5) / 3;
    soundButton.x = deltaX + soundButton.width / 2;

    soundButton.inputEnabled = true;
    soundButton.input.priorityID = 2;
    soundButton.events.onInputDown.add(function () {
        console.log('i am soundButton');
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
        'musicOn.png',
        settingsContainer);
    musicButton.anchor.set(0.5);

    musicButton.inputEnabled = true;
    musicButton.input.priorityID = 2;
    musicButton.events.onInputDown.add(function () {
        console.log('i am musicButton');
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
        'fastSpinOff.png',
        settingsContainer);
    fastSpinButton.anchor.set(0.5);

    fastSpinButton.inputEnabled = true;
    fastSpinButton.input.priorityID = 2;
    fastSpinButton.events.onInputDown.add(function () {
        console.log('i am fastSpinButton');
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
        'handModeOff.png',
        settingsContainer);
    handModeButton.anchor.set(0.5);

    handModeButton.inputEnabled = true;
    handModeButton.input.priorityID = 2;
    handModeButton.events.onInputDown.add(function () {
        console.log('i am handModeButton');
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
        'historyOff.png',
        settingsContainer);
    historyButton.anchor.set(0.5);

    historyButton.inputEnabled = true;
    historyButton.input.priorityID = 2;
    historyButton.events.onInputDown.add(function () {
        console.log('i am historyButton');
    });

    const historyText = game.add.sprite(
        historyButton.x,
        historyButton.y + historyButton.height / 2 + deltaY,
        'menuButtons',
        'historyText.png',
        settingsContainer);
    historyText.anchor.set(0.5);

}
