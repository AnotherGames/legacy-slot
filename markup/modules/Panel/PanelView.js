import { model } from 'modules/Model/Model';

export let view = (() => {

    let draw = {

        PanelBG: function({
            x = model.group('main').x + 45,
            y = model.el('gameMachine').height - 28,
            container = model.group('panel'),
            frameName = 'ui',
        }) {
            const game = model.el('game');
            container.x = x;
            container.y = y;

            const panelBG = game.add.sprite(0, 0, frameName, null, container);
            return panelBG;
        },

        AutoContainer: function({
            x = 650,
            y = 95
        }) {
            const game = model.el('game');
            const autoDesktopContainer = game.add.group();
            model.group('panel').add(autoDesktopContainer);
            autoDesktopContainer.x = x;
            autoDesktopContainer.y = y;
            autoDesktopContainer.alpha = 0;
            model.group('autoDesktop', autoDesktopContainer);
        },

        SpinButton: function({
            x = model.group('panel').width / 2,
            y = 95,
            container = model.group('panel')
        }) {
            const game = model.el('game');
            const spinButtonDesk = game.add.button(x, y, 'deskButtons', null, null, 'spinOn.png', 'spin.png', 'spinOn.png', null, container);
            spinButtonDesk.anchor.set(0.5);
            model.el('spinButtonDesk', spinButtonDesk);
            return spinButtonDesk;
        },

        AutoButton: function({
            x = model.el('spinButtonDesk').x - 137,
            y = 95,
            container = model.group('panel')
        }) {
            const game = model.el('game');
            const autoButtonDesk = game.add.button(x, y, 'deskButtons', null, null, 'autoOn.png', 'auto.png', 'autoOn.png', null, container);
            autoButtonDesk.anchor.set(0.5);
            model.el('autoButtonDesk', autoButtonDesk);
            return autoButtonDesk;
        },

        MaxBetButton: function({
            x = model.el('spinButtonDesk').x + 137,
            y = 95,
            container = model.group('panel')
        }) {
            const game = model.el('game');
            const maxBetButtonDesk = game.add.button(x, y, 'deskButtons', null, null, 'maxBetOn.png', 'maxBet.png', 'maxBetOn.png', null, container);
            maxBetButtonDesk.anchor.set(0.5);
            model.el('maxBetButtonDesk', maxBetButtonDesk);
            return maxBetButtonDesk;
        },

        InfoButton: function({
            x = model.group('panel').width - 115,
            y = 105,
            container = model.group('panel')
        }) {
            const game = model.el('game');
            const infoButtonDesk = game.add.button(x, y, 'deskButtons', null, null, 'infoOn.png', 'info.png', 'infoOn.png', null, container);
            model.el('infoButtonDesk', infoButtonDesk);
            return infoButtonDesk;
        },

        PlusButton: function({
            x = 267,
            y = 107,
            container = model.group('panel')
        }) {
            const game = model.el('game');
            const plusButtonDesk = game.add.button(x, y, 'deskButtons', null, null, 'plusOn.png', 'plus.png', 'plusOn.png', null, container);
            model.el('plusButtonDesk', plusButtonDesk);
            return plusButtonDesk;
        },

        MinusButton: function({
            x = 172,
            y = 107,
            container = model.group('panel')
        }) {
            const game = model.el('game');
            const minusButtonDesk = game.add.button(x, y, 'deskButtons', null, null, 'minusOn.png', 'minus.png', 'minusOn.png', null, container);
            model.el('minusButtonDesk', minusButtonDesk);
            return minusButtonDesk;
        },

        LinesNumber: function({
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
        },

        AutoPanel: function({
            container = model.group('autoDesktop')
        }) {
            const game = model.el('game');

            const autoplayBG = game.add.sprite(0, 0, 'autoSelect', null, container);
            autoplayBG.anchor.set(0.5);
            model.el('autoplayBG', autoplayBG);


            const autoBG10 = this._AutoPanelItem({});
            model.el('autoBG10', autoBG10);
            const autoBG25 = this._AutoPanelItem({text: 25, x: -5, y: -60, width: 75, height: 37});
            model.el('autoBG25', autoBG25);
            const autoBG50 = this._AutoPanelItem({text: 50, x: -81, y: -19, width: 70, height: 37});
            model.el('autoBG50', autoBG50);
            const autoBG100 = this._AutoPanelItem({text: 100, x: -5, y: -19, width: 75, height: 37});
            model.el('autoBG100', autoBG100);
            const autoBG250 = this._AutoPanelItem({text: 250, x: -81, y: 23, width: 70, height: 37});
            model.el('autoBG250', autoBG250);
            const autoBG500 = this._AutoPanelItem({text: 500, x: -5, y: 23, width: 75, height: 37});
            model.el('autoBG500', autoBG500);

            const panelButtonsArr = [];
            panelButtonsArr.push(autoBG10, autoBG25, autoBG50, autoBG100, autoBG250, autoBG500)
            return panelButtonsArr;
        },

        _AutoPanelItem: function({
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
            autoBG.amount = text;
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

            return autoBG;
        },

        autoCount: function({
            amount = 10,
            x = 525,
            y = model.el('autoButtonDesk').y,
            container = model.group('panel'),
            font = '60px Arial, Helvetica',
            color = '#fff'
        }) {
            if (amount >= 250) {
                font = '40px Arial, Helvetica';
            }
            const game = model.el('game');
            const autoCount = game.add.text(x, y, amount, {font: font, fill: color, align: 'center'}, container);
            autoCount.anchor.set(0.5);
            autoCount.alpha = 0;
            game.add.tween(autoCount).to({alpha: 1}, 500, 'Linear', true, 200);
            model.el('autoCount', autoCount);
            return autoCount;
        },

        updateCount: function({
            count = 10
        }) {
            model.el('autoCount').text = count;
        },

        removeCount: function() {
            model.el('autoCount').destroy();
        },

        fsCandle: function({
            x = 513,
            y = 95,
            container = model.group('panel')
        }) {
            const game = model.el('game');
            const candle = game.add.sprite(x, y, 'candle', null, container);
            candle.animations.add('burn');
            candle.animations.play('burn', 12, true);
            return candle;
        }
    }

    let show = {
        autoButton: function({
            finalX = 365,
            time = 350
        }) {
            const game = model.el('game');
            const autoButtonDesk = model.el('autoButtonDesk');
            return game.add.tween(autoButtonDesk).to( { x: finalX }, time, 'Linear', true)
        },

        autoPanel: function({
            finalX = 495,
            time = 250
        }) {
            const game = model.el('game');
            const autoDesktopContainer = model.group('autoDesktop');
            return game.add.tween(autoDesktopContainer).to( { x: finalX, alpha: 1 }, time, 'Linear', true)
        },

        info: function({
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

    }

    let hide = {
        autoButton: function({
            finalX = 519,
            time = 350
        }) {
            const game = model.el('game');
            const autoButtonDesk = model.el('autoButtonDesk');
            return game.add.tween(autoButtonDesk).to( { x: finalX }, time, 'Linear', true)
        },

        autoPanel: function({
            finalX = 650,
            time = 250
        }) {
            const game = model.el('game');
            const autoDesktopContainer = model.group('autoDesktop');
            return game.add.tween(autoDesktopContainer).to( { x: finalX, alpha: 0 }, time, 'Linear', true)
        }
    }

    function autoStartDesktop() {
        const spinButtonDesk = model.el('spinButtonDesk');
        spinButtonDesk.frameName = 'stop.png';
        spinButtonDesk.freezeFrames = true;
        const autoButtonDesk = model.el('autoButtonDesk');
        autoButtonDesk.frameName = 'autoEmpty.png';
        autoButtonDesk.freezeFrames = true;
        const maxBetButtonDesk = model.el('maxBetButtonDesk');
        maxBetButtonDesk.frameName = 'maxBetOn.png';
        maxBetButtonDesk.freezeFrames = true;
        const betLevelPlus = model.el('betLevelPlus');
        betLevelPlus.visible = false;
        const betLevelMinus = model.el('betLevelMinus');
        betLevelMinus.visible = false;
        const coinsLevelPlus = model.el('coinsLevelPlus');
        coinsLevelPlus.visible = false;
        const coinsLevelMinus = model.el('coinsLevelMinus');
        coinsLevelMinus.visible = false;
    }

    function autoStopDesktop() {
        const spinButtonDesk = model.el('spinButtonDesk');
        spinButtonDesk.frameName = 'spin.png';
        spinButtonDesk.freezeFrames = false;
        const autoButtonDesk = model.el('autoButtonDesk');
        autoButtonDesk.frameName = 'auto.png';
        autoButtonDesk.freezeFrames = false;
        const maxBetButtonDesk = model.el('maxBetButtonDesk');
        maxBetButtonDesk.frameName = 'maxBet.png';
        maxBetButtonDesk.freezeFrames = false;
        const betLevelPlus = model.el('betLevelPlus');
        betLevelPlus.visible = true;
        const betLevelMinus = model.el('betLevelMinus');
        betLevelMinus.visible = true;
        const coinsLevelPlus = model.el('coinsLevelPlus');
        coinsLevelPlus.visible = true;
        const coinsLevelMinus = model.el('coinsLevelMinus');
        coinsLevelMinus.visible = true;
    }


    return {
        draw,
        show,
        hide,
        autoStartDesktop,
        autoStopDesktop
    };

})();
