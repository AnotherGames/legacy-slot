import { model } from 'modules/Model/Model';

export let view = (() => {

    function drawPanelBG({
        x = model.group('main').x + 45,
        y = model.el('gameMachine').height - 28,
        container = model.group('panel')
    }) {
        const game = model.el('game');
        container.x = x;
        container.y = y;

        const panelBG = game.add.sprite(0, 0, 'ui', null, container);
        return panelBG;
    }

    function drawSpinButton({
        x = model.el('panelContainer').width / 2,
        y = 95,
        container = model.group('panel')
    }) {
        const game = model.el('game');
        const spinButtonDesk = game.add.button(x, y, 'deskButtons', null, null, 'spinOn.png', 'spin.png', 'spinOn.png', null, container);
        spinButtonDesk.anchor.set(0.5);
        model.el('spinButtonDesk', spinButtonDesk);
        return spinButtonDesk;
    }

    function drawAutoButton({
        x = model.el('spinButtonDesk').x - 137,
        y = 95,
        container = model.group('panel')
    }) {
        const game = model.el('game');
        const autoButtonDesk = game.add.button(x, y, 'deskButtons', null, null, 'autoOn.png', 'auto.png', 'autoOn.png', null, container);
        autoButtonDesk.anchor.set(0.5);
        model.el('autoButtonDesk', autoButtonDesk);
        return autoButtonDesk;
    }

    function drawMaxBetButton({
        x = model.el('spinButtonDesk').x + 137,
        y = 95,
        container = model.group('panel')
    }) {
        const game = model.el('game');
        const maxBetButtonDesk = game.add.button(x, y, 'deskButtons', null, null, 'maxBetOn.png', 'maxBet.png', 'maxBetOn.png', null, container);
        maxBetButtonDesk.anchor.set(0.5);
        model.el('maxBetButtonDesk', maxBetButtonDesk);
        return maxBetButtonDesk;
    }

    function drawInfoButton({
        x = model.el('panelContainer').width - 115,
        y = 105,
        container = model.group('panel')
    }) {
        const game = model.el('game');
        const infoButtonDesk = game.add.button(x, y, 'deskButtons', null, null, 'infoOn.png', 'info.png', 'infoOn.png', null, container);
        model.el('infoButtonDesk', infoButtonDesk);
        return infoButtonDesk;
    }

    function drawPlusButton({
        x = 267,
        y = 107,
        container = model.group('panel')
    }) {
        const game = model.el('game');
        const plusButtonDesk = game.add.button(x, y, 'deskButtons', null, null, 'plusOn.png', 'plus.png', 'plusOn.png', null, container);
        model.el('plusButtonDesk', plusButtonDesk);
        return plusButtonDesk;
    }

    function drawMinusButton({
        x = 172,
        y = 107,
        container = model.group('panel')
    }) {
        const game = model.el('game');
        const minusButtonDesk = game.add.button(x, y, 'deskButtons', null, null, 'minusOn.png', 'minus.png', 'minusOn.png', null, container);
        model.el('minusButtonDesk', minusButtonDesk);
        return minusButtonDesk;
    }

    function drawLinesNumber({
        x = 80,
        y = 112,
        font = 'normal 27px Helvetica, Arial',
        color = '#e8b075',
        container = model.group('panel')
    }) {
        const game = model.el('game');
        const linesNumber = game.add.text(x, y, '10', {font: font, fill: color, align: 'center'}, container);
        model.el('linesNumber', linesNumber);
        return linesNumber;
    }

    function drawAutoPanel({
        container = model.group('autoDesktop')
    }) {
        const game = model.el('game');

        const autoplayBG = game.add.sprite(0, 0, 'autoSelect', null, container);
        autoplayBG.anchor.set(0.5);
        model.el('autoplayBG', autoplayBG);

        _drawAutoPanelItem({})
        _drawAutoPanelItem({text: 25, x: -5, y: -60, width: 75, height: 37})
        _drawAutoPanelItem({text: 50, x: -81, y: -19, width: 70, height: 37})
        _drawAutoPanelItem({text: 100, x: -5, y: -19, width: 75, height: 37})
        _drawAutoPanelItem({text: 250, x: -81, y: 23, width: 70, height: 37})
        _drawAutoPanelItem({text: 500, x: -5, y: 23, width: 75, height: 37})

        return container;

    }

    function _drawAutoPanelItem({
        text = 10,
        x = -81,
        y = -60,
        width = 70,
        height = 37,
        font = 'normal 24px Arial',
        color = '#e8b075',
        container = model.group('autoDesktop'),
        shadowColor = '#e8b075'

    }) {
        const game = model.el('game');
        const autoBG = game.add.graphics(0, 0, container).beginFill(0xffffff, 0.2).drawRect(0, 0, width, height);
        autoBG.x = x;
        autoBG.y = y;
        autoBG.alpha = 0;

        const autoText = game.add.text(
            autoBG.x + autoBG.width / 2,
            autoBG.y + autoBG.height / 2 + 2,
            text,
            {font: font, fill: color, align: 'center'},
            container);
        autoText.anchor.set(0.5);
        autoText.setShadow(0, 0, shadowColor, 2);

        autoBG.inputEnabled = true;
        autoBG.events.onInputOver.add(function () {
            autoBG.alpha = 1;
        });
        autoBG.events.onInputOut.add(function () {
            autoBG.alpha = 0;
        });

    }

    function autoButtonOpen({
        finalX = 365,
        time = 350
    }) {
        const game = model.el('game');
        const autoButtonDesk = model.el('autoButtonDesk');
        return game.add.tween(autoButtonDesk).to( { x: finalX }, time, 'Linear', true)
    }

    function autoButtonClose({
        finalX = 519,
        time = 350
    }) {
        const game = model.el('game');
        const autoButtonDesk = model.el('autoButtonDesk');
        return game.add.tween(autoButtonDesk).to( { x: finalX }, time, 'Linear', true)
    }

    function autoPanelOpen({
        finalX = 495,
        time = 250
    }) {
        const game = model.el('game');
        console.log(model.group('autoDesktop'));
        const autoDesktopContainer = model.group('autoDesktop');
        return game.add.tween(autoDesktopContainer).to( { x: finalX, alpha: 1 }, time, 'Linear', true)
    }

    function autoPanelClose({
        finalX = 650,
        time = 250
    }) {
        const game = model.el('game');
        console.log('autopanel closed');
        const autoDesktopContainer = model.group('autoDesktop');
        return game.add.tween(autoDesktopContainer).to( { x: finalX, alpha: 0 }, time, 'Linear', true)
    }

    function showInfo({
        x = model.el('game').world.centerX,
        y = model.el('game').world.centerY
    }) {
        const game = model.el('game');
        const overlay = game.add.graphics(0, 0).beginFill(0x000000, 0.8).drawRect(0, 0, game.width, game.height);
        model.el('overlay', overlay);
        const infoRules = game.add.sprite(x, y, 'infoRules');
        infoRules.anchor.set(0.5);
        model.el('infoRules', infoRules);
        return infoRules;
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


    return {
        drawPanelBG,
        drawSpinButton,
        drawAutoButton,
        drawMaxBetButton,
        drawInfoButton,
        drawPlusButton,
        drawMinusButton,
        drawLinesNumber,
        autoButtonOpen,
        autoButtonClose,
        drawAutoPanel,
        autoPanelOpen,
        autoPanelClose,
        showInfo,
        autoStartDesktop,
        autoStopDesktop
    };

})();
