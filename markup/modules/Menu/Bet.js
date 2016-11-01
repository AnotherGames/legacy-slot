import { model } from '../../modules/Model/Model';
import { events } from '../../modules/Events/Events';

export function drawBetMenu(container, game) {
    let deltaX = container.width * 0.3;

    const betContainer = game.add.group();
    container.add(betContainer);

    const setBet = game.add.text(
        container.width / 2,
        game.world.height * 0.07,
        'SET BET',
        {font: 'bold 40px Arial', fill: '#fff', align: 'center'},
        betContainer);
    setBet.anchor.set(0.5);

    const maxBetButton = game.add.sprite(
        container.width / 2,
        game.world.height * 0.22,
        'menuButtons',
        'maxBet.png',
        betContainer);
    maxBetButton.anchor.set(0.5);
    maxBetButton.inputEnabled = true;
    maxBetButton.input.priorityID = 1;
    maxBetButton.events.onInputDown.add(function () {
        events.trigger('buttons:maxBet');
        betText.text = model.data('currentBalance').betValue;
    });

    const betLevel = game.add.sprite(
        container.width / 2,
        game.world.height * 0.36,
        'menuButtons',
        'betLevelText.png',
        betContainer);
    betLevel.anchor.set(0.5);

    const betBG = game.add.sprite(
        container.width / 2,
        game.world.height * 0.47,
        'menuButtons',
        'empty.png',
        betContainer);
    betBG.anchor.set(0.5);

    const betText = game.add.text(
        betBG.x,
        betBG.y,
        model.data('currentBalance').betValue,
        {font: 'bold 60px Arial', fill: '#90fd5a', align: 'center'},
        betContainer);
    betText.setShadow(0, 0, '#90fd5a', 8)
    betText.anchor.set(0.5);

    const betPlus = game.add.sprite(
        betBG.x + deltaX,
        game.world.height * 0.47,
        'menuButtons',
        'plus.png',
        betContainer);
    betPlus.anchor.set(0.5);

    betPlus.inputEnabled = true;
    betPlus.input.priorityID = 2;
    betPlus.events.onInputDown.add(function () {
        events.trigger('buttons:changeBet', true);
        betText.text = model.data('currentBalance').betValue;
    });

    const betMinus = game.add.sprite(
        betBG.x - deltaX,
        game.world.height * 0.47,
        'menuButtons',
        'minus.png',
        betContainer);
    betMinus.anchor.set(0.5);

    betMinus.inputEnabled = true;
    betMinus.input.priorityID = 2;
    betMinus.events.onInputDown.add(function () {
        events.trigger('buttons:changeBet', false);
        betText.text = model.data('currentBalance').betValue;
    });

    const coinValue = game.add.sprite(
        container.width / 2,
        game.world.height * 0.59,
        'menuButtons',
        'coinValueText.png',
        betContainer)
    coinValue.anchor.set(0.5);

    const coinBG = game.add.sprite(
        container.width / 2,
        game.world.height * 0.7,
        'menuButtons',
        'empty.png',
        betContainer);
    coinBG.anchor.set(0.5);

    const coinText = game.add.text(
        coinBG.x,
        coinBG.y,
        model.data('currentBalance').coinsValue,
        {font: 'bold 35px Arial', fill: '#90fd5a', align: 'center'},
        betContainer);
    coinText.anchor.set(0.5);
    coinText.setShadow(0, 0, '#90fd5a', 8);

    const coinPlus = game.add.sprite(
        coinBG.x + deltaX,
        game.world.height * 0.7,
        'menuButtons',
        'plus.png',
        betContainer);
    coinPlus.anchor.set(0.5);

    coinPlus.inputEnabled = true;
    coinPlus.input.priorityID = 2;
    coinPlus.events.onInputDown.add(function () {
        events.trigger('buttons:changeCoins', true);
        coinText.text = model.data('currentBalance').coinsValue;
    });

    const coinMinus = game.add.sprite(
        coinBG.x - deltaX,
        game.world.height * 0.7,
        'menuButtons',
        'minus.png',
        betContainer);
    coinMinus.anchor.set(0.5);

    coinMinus.inputEnabled = true;
    coinMinus.input.priorityID = 2;
    coinMinus.events.onInputDown.add(function () {
        events.trigger('buttons:changeCoins', false);
        coinText.text = model.data('currentBalance').coinsValue;
    });
}
