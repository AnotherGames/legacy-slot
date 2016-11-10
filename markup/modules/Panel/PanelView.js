import { model } from 'modules/Model/Model';

export let view = (() => {

    let game = model.el('game');
    let panelContainer = model.group('panel');

    function drawPanelBG({
        x = model.el('mainContainer').x + 45,
        y = model.el('gameMachine').height - 28,
        container = model.group('panel');
    }) {
        container.x = x;
        container.y = y;

        const panelBG = game.add.sprite(0, 0, 'ui', null, container);
    }

    function drawSpinButton({
        x = model.el('panelContainer').width / 2,
        y = 95,
        container = model.group('panel');
    }) {
        const spinButtonDesk = game.add.button(x, y, 'deskButtons', null, null, 'spinOn.png', 'spin.png', 'spinOn.png', null, container);
        spinButtonDesk.anchor.set(0.5);
        model.el('spinButtonDesk', spinButtonDesk);
        return spinButtonDesk;
    }

    function drawAutoButton({
        x = model.el('spinButtonDesk').x - 137,
        y = 95,
        container = model.group('panel');
    }) {
        const autoButtonDesk = game.add.button(x, y, 'deskButtons', null, null, 'autoOn.png', 'auto.png', 'autoOn.png', null, container);
        autoButtonDesk.anchor.set(0.5);
        model.el('autoButtonDesk', autoButtonDesk);
        return autoButtonDesk;
    }

    function drawMaxBetButton({
        x = model.el('spinButtonDesk').x + 137,
        y = 95,
        container = model.group('panel');
    }) {
        const maxBetButtonDesk = game.add.button(x, y, 'deskButtons', null, null, 'maxBetOn.png', 'maxBet.png', 'maxBetOn.png', null, container);
        maxBetButtonDesk.anchor.set(0.5);
        model.el('maxBetButtonDesk', maxBetButtonDesk);
        return maxBetButtonDesk;
    }

    function drawInfoButton({
        x = model.el('panelContainer').width - 115,
        y = 105,
        container = model.group('panel');
    }) {
        const infoButtonDesk = game.add.button(x, y, 'deskButtons', null, null, 'maxBetOn.png', 'maxBet.png', 'maxBetOn.png', null, container);
        infoButtonDesk.anchor.set(0.5);
        model.el('infoButtonDesk', infoButtonDesk);
        return infoButtonDesk;
    }

    function drawPlusButton({
        x = 267,
        y = 107,
        container = model.group('panel');
    }) {
        const plusButtonDesk = game.add.button(x, y, 'deskButtons', null, null, 'plusOn.png', 'plus.png', 'plusOn.png', null, container);
        model.el('plusButtonDesk', plusButtonDesk);
        return plusButtonDesk;
    }

    function drawMinusButton({
        x = 172,
        y = 107,
        container = model.group('panel');
    }) {
        const minusButtonDesk = game.add.button(x, y, 'deskButtons', null, null, 'minusOn.png', 'minus.png', 'minusOn.png', null, container);
        model.el('minusButtonDesk', minusButtonDesk);
        return minusButtonDesk;
    }

    function drawLinesNumber({
        x = 80,
        y = 112,
        font = 'normal 27px Helvetica, Arial',
        color = '#e8b075',
        container = model.group('panel');
    }) {
        const linesNumber = game.add.text(x, y, '10', {font: font, fill: color, align: 'center'}, container);
        model.el('linesNumber', linesNumber);
        return linesNumber;
    }

    function drawAutoPanel({
        x = 650,
        y = model.el('autoButtonDesk').y,
        container = model.group('panel');
    }) {
        const autoDesktopContainer = game.add.group();
        container.addAt(autoDesktopContainer, 1);

        autoDesktopContainer.x = x;
        autoDesktopContainer.y = y;
        autoDesktopContainer.alpha = 0;
        model.group('autoDesktop', autoDesktopContainer);

        const autoplayBG = game.add.sprite(0, 0, 'autoSelect', null, autoDesktopContainer);
        autoplayBG.anchor.set(0.5);
        model.el('autoplayBG', autoplayBG);
        return autoplayBG, autoDesktopContainer

        _drawAutoPanelItem({})
        _drawAutoPanelItem({text: 25, x: -5, y: -60, width: 75, height: 37})
        _drawAutoPanelItem({text: 50, x: -81, y: -19, width: 70, height: 37})
        _drawAutoPanelItem({text: 100, x: -5, y: -19, width: 75, height: 37})
        _drawAutoPanelItem({text: 250, x: -81, y: 23, width: 70, height: 37})
        _drawAutoPanelItem({text: 500, x: -5, y: 23, width: 75, height: 37})

    }

    function _drawAutoPanelItem({
        text = 10,
        x = -81,
        y = -60,
        width = 70,
        height = 37,
        font = 'normal 24px Arial',
        color = '#e8b075',
        container = model.group('autoDesktop');
        shadowColor = '#e8b075'

    }) {
        const autoBG = game.add.graphics(0, 0, container).beginFill(0xffffff, 0.2).drawRect(0, 0, width, height);
        autoBG10.x = x;
        autoBG10.y = y;
        autoBG10.alpha = 0;

        const autoText = game.add.text(
            autoBG.x + autoBG.width / 2,
            autoBG.y + autoBG.height / 2 + 2,
            text,
            {font: font, fill: color, align: 'center'},
            container);
        autoText.anchor.set(0.5);
        autoText.setShadow(0, 0, shadowColor, 2);

        autoBG.inputEnabled = true;
        autoBG.onInputOver.add(function () {
            autoBG.alpha = 1;
        });
        autoBG.onInputOut.add(function () {
            autoBG.alpha = 0;
        });

    }

    function autoButtonOpen({
        finalX = 365,
        time = 350
    }) {
        const autoButtonDesk = model.el('autoButtonDesk');
        return game.add.tween(autoButtonDesk).to( { x: finalX }, time, 'Linear', true)
    }

    function autoButtonClose({
        finalX = model.el('spinButtonDesk') - 137,
        time = 350
    }) {
        const autoButtonDesk = model.el('autoButtonDesk');
        return game.add.tween(autoButtonDesk).to( { x: finalX }, time, 'Linear', true)
    }

    function autoPanelOpen({
        finalX = 495,
        time = 250
    }) {
        const autoDesktopContainer = model.group('autoDesktop');
        return game.add.tween(autoDesktopContainer).to( { x: finalX, alpha: 1 }, time, 'Linear', true)
    }

    function autoPanelClose({
        finalX = 650,
        time = 250
    }) {
        const autoDesktopContainer = model.group('autoDesktop');
        return game.add.tween(autoDesktopContainer).to( { x: finalX, alpha: 0 }, time, 'Linear', true)
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
        autoPanelClose
    };

});
