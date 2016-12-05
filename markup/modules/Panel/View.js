import { model } from 'modules/Model/Model';

export let view = (() => {

    let draw = {

        PanelBG: function({
            game = model.el('game'),
            container = model.group('panel'),
            x = game.world.centerX,
            y = model.el('gameMachine').height - 28,
            frameName = 'ui',
            deltaY = 0
        }) {
            container.x = x;
            container.y = y;
            const panelBG = game.add.sprite(0, deltaY, frameName, null, container);

            container.pivot.set(panelBG.width / 2, 0);
            return panelBG;
        },

        AutoContainer: function({
            game = model.el('game'),
            x = 650,
            y = 95
        }) {
            let autoDesktopContainer = game.add.group();
                autoDesktopContainer.x = x;
                autoDesktopContainer.y = y;
                autoDesktopContainer.alpha = 1;
            model.group('autoDesktop', autoDesktopContainer);
            model.group('panel').add(autoDesktopContainer);
        },

        SpinButton: function({
            game = model.el('game'),
            x = model.group('panel').width / 2,
            y = 97,
            container = model.group('panel')
        }) {
            let spinButtonDesk = game.add.button(x, y, 'deskButtons', null, null, 'spinOn.png', 'spin.png', 'spinOn.png', null, container);
                spinButtonDesk.anchor.set(0.5);
            model.el('spinButtonDesk', spinButtonDesk);
            return spinButtonDesk;
        },

        AutoButton: function({
            game = model.el('game'),
            container = model.group('panel'),
            x = model.el('spinButtonDesk').x - 137,
            y = 95
        }) {
            let autoButtonDesk = game.add.button(x, y, 'deskButtons', null, null, 'autoOn.png', 'auto.png', 'autoOn.png', null, container);
                autoButtonDesk.anchor.set(0.5);
            model.el('autoButtonDesk', autoButtonDesk);
            return autoButtonDesk;
        },

        MaxBetButton: function({
            game = model.el('game'),
            container = model.group('panel'),
            x = model.el('spinButtonDesk').x + 137,
            y = 95
        }) {
            let maxBetButtonDesk = game.add.button(x, y, 'deskButtons', null, null, 'maxBetOn.png', 'maxBet.png', 'maxBetOn.png', null, container);
                maxBetButtonDesk.anchor.set(0.5);
            model.el('maxBetButtonDesk', maxBetButtonDesk);
            return maxBetButtonDesk;
        },

        InfoButton: function({
            game = model.el('game'),
            container = model.group('panel'),
            x = model.group('panel').width - 115,
            y = 105,
        }) {
            let infoButtonDesk = game.add.button(x, y, 'deskButtons', null, null, 'infoOn.png', 'info.png', 'infoOn.png', null, container);
            model.el('infoButtonDesk', infoButtonDesk);
            return infoButtonDesk;
        },

        PlusButton: function({
            game = model.el('game'),
            container = model.group('panel'),
            x = 268,
            y = 106,
        }) {
            let plusButtonDesk = game.add.button(x, y, 'deskButtons', null, null, 'plusOn.png', 'plus.png', 'plusOn.png', null, container);
            return plusButtonDesk;
        },

        MinusButton: function({
            game = model.el('game'),
            container = model.group('panel'),
            x = 170,
            y = 106
        }) {
            let minusButtonDesk = game.add.button(x, y, 'deskButtons', null, null, 'minusOn.png', 'minus.png', 'minusOn.png', null, container);
            return minusButtonDesk;
        },

        LinesNumber: function({
            game = model.el('game'),
            container = model.group('panel'),
            style = {font: 'normal 27px Helvetica, Arial', align: 'center', fill: '#e8b075'},
            x = 80,
            y = 112,
        }) {
            let linesNumber = game.add.text(x, y, '10', style, container);
            model.el('linesNumber', linesNumber);
            return linesNumber;
        },

        AutoPanel: function({
            game = model.el('game'),
            container = model.group('autoDesktop')
        }) {
            let autoplayBG = game.add.sprite(0, 0, 'autoSelect', null, container);
                autoplayBG.anchor.set(0.5);
            model.el('autoplayBG', autoplayBG);

            let autoBG10 = this._AutoPanelItem({});
            let autoBG25 = this._AutoPanelItem({text: 25, x: -5, y: -60, width: 75, height: 37});
            let autoBG50 = this._AutoPanelItem({text: 50, x: -81, y: -19, width: 70, height: 37});
            let autoBG100 = this._AutoPanelItem({text: 100, x: -5, y: -19, width: 75, height: 37});
            let autoBG250 = this._AutoPanelItem({text: 250, x: -81, y: 23, width: 70, height: 37});
            let autoBG500 = this._AutoPanelItem({text: 500, x: -5, y: 23, width: 75, height: 37});

            model.el('autoBG10', autoBG10);
            model.el('autoBG25', autoBG25);
            model.el('autoBG50', autoBG50);
            model.el('autoBG100', autoBG100);
            model.el('autoBG250', autoBG250);
            model.el('autoBG500', autoBG500);

            let panelButtonsArr = [];
                panelButtonsArr.push(autoBG10, autoBG25, autoBG50, autoBG100, autoBG250, autoBG500)
            return panelButtonsArr;
        },

        _AutoPanelItem: function({
            game = model.el('game'),
            container = model.group('autoDesktop'),
            text = 10,
            x = -81,
            y = -60,
            width = 70,
            height = 37,
            font = 'normal 24px Arial',
            color = '#e8b075',
            shadowColor = '#e8b075'
        }) {
            let autoBG = game.add.graphics(0, 0, container).beginFill(0xffffff, 0.2).drawRect(0, 0, width, height);
                autoBG.x = x;
                autoBG.y = y;
                autoBG.amount = text;
                autoBG.alpha = 0;
                autoBG.inputEnabled = true;
                autoBG.events.onInputOver.add(function () {
                    autoBG.alpha = 1;
                });
                autoBG.events.onInputOut.add(function () {
                    autoBG.alpha = 0;
                });

            let autoText = game.add.text(
                autoBG.x + autoBG.width / 2,
                autoBG.y + autoBG.height / 2 + 2,
                text,
                {font: font, fill: color, align: 'center'},
                container);
                autoText.anchor.set(0.5);
                autoText.setShadow(0, 0, shadowColor, 2);

            return autoBG;
        },

        autoCount: function({
            game = model.el('game'),
            container = model.group('panel'),
            style = {font: '45px Arial, Helvetica', align: 'center', fill: '#fff'},
            amount = 10,
            x = 525,
            y = model.el('autoButtonDesk').y,
        }) {
            let autoCount = game.add.text(x, y, amount, style, container);
                autoCount.anchor.set(0.5);
                autoCount.alpha = 0;
            model.el('autoCount', autoCount);
            game.add.tween(autoCount).to({alpha: 1}, 500, 'Linear', true, 200);
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
            game = model.el('game'),
            container = model.group('panel'),
            x = 513,
            y = 95,
        }) {
            let candle = game.add.sprite(x, y, 'candle', null, container);
                candle.animations.add('burn');
                candle.animations.play('burn', 12, true);
            return candle;
        }
    }

    let show = {
        autoButton: function({
            game = model.el('game'),
            finalX = 365,
            time = 350
        }) {
            let autoButtonDesk = model.el('autoButtonDesk');
            return game.add.tween(autoButtonDesk).to( { x: finalX }, time, 'Linear', true)
        },

        autoPanel: function({
            game = model.el('game'),
            finalX = 495,
            time = 350
        }) {
            let autoDesktopContainer = model.group('autoDesktop');
            return game.add.tween(autoDesktopContainer).to( { x: finalX }, time, 'Linear', true)
        },

        info: function({
            game = model.el('game'),
            container = model.group('popup'),
            x = model.el('game').world.centerX,
            y = model.el('game').world.centerY,
        }) {
            let overlay = game.add.graphics(0, 0, container).beginFill(0x000000, 0.8).drawRect(0, 0, game.width, game.height);
            model.el('overlay', overlay);

            let infoRules = game.add.sprite(x, y, 'info', '1_en.png', container);
                infoRules.anchor.set(0.5);
                infoRules.scale.set(1.3);
            model.el('infoRules', infoRules);

            let closed = game.add.sprite(infoRules.width + 260, infoRules.height - (infoRules.height - 180), 'closed', null, container);
            model.el('closed', closed);

            let arrowRight = game.add.sprite(game.width / 2 + 60, infoRules.height + 160, 'ar', null, container);
            model.el('arrowRight', arrowRight);

            let arrowLeft = game.add.sprite(game.width / 2 - 100, infoRules.height + 160, 'arLeft', null, container);
            model.el('arrowLeft', arrowLeft);

            let infoMarkers = [];
            let infoMarker = game.add.sprite(game.width / 2 - 80, infoRules.height + 130, 'infoMarker', 'marker_on.png', container);
                infoMarker.name = 'infoMarker0';
                infoMarkers.push(infoMarker);

            for (let i = 1; i < 8; i++) {
                let name = 'infoMarker' + i;
                let counter = i;
                let marker = game.add.sprite(infoMarker.x, infoRules.height + 130, 'infoMarker', 'marker_off.png', container);
                marker.name = name;
                marker.x = marker.x + 30 * i;
                infoMarkers.push(marker);
            }
            model.el('infoMarkers', infoMarkers);
            return infoRules;
        }

    }

    let hide = {
        autoButton: function({
            game = model.el('game'),
            finalX = 519,
            time = 350
        }) {
            let autoButtonDesk = model.el('autoButtonDesk');
            return game.add.tween(autoButtonDesk).to( { x: finalX }, time, 'Linear', true)
        },

        autoPanel: function({
            game = model.el('game'),
            finalX = 650,
            time = 350
        }) {
            let autoDesktopContainer = model.group('autoDesktop');
            return game.add.tween(autoDesktopContainer).to( { x: finalX }, time, 'Linear', true)
        }
    }

    function lockButtons() {

        let infoButtonDesk = model.el('infoButtonDesk');
            infoButtonDesk.frameName = 'infoOn.png';
            infoButtonDesk.freezeFrames = true;
        let maxBetButtonDesk = model.el('maxBetButtonDesk');
            maxBetButtonDesk.frameName = 'maxBetOn.png';
            maxBetButtonDesk.freezeFrames = true;
        let betLevelPlus = model.el('betLevelPlus');
            betLevelPlus.frameName = 'plusOn.png';
            betLevelPlus.freezeFrames = true;
        let betLevelMinus = model.el('betLevelMinus');
            betLevelMinus.frameName = 'minusOn.png';
            betLevelMinus.freezeFrames = true;
        let coinsLevelPlus = model.el('coinsLevelPlus');
            coinsLevelPlus.frameName = 'plusOn.png';
            coinsLevelPlus.freezeFrames = true
        let coinsLevelMinus = model.el('coinsLevelMinus');
            coinsLevelMinus.frameName = 'minusOn.png';
            coinsLevelMinus.freezeFrames = true;
        if(model.state('autoplay:start')){
            let spinButtonDesk = model.el('spinButtonDesk');
                spinButtonDesk.frameName = 'stop.png';
                spinButtonDesk.freezeFrames = true;
            let autoButtonDesk = model.el('autoButtonDesk');
                autoButtonDesk.frameName = 'autoEmpty.png';
                autoButtonDesk.freezeFrames = true;
        } else {
            let autoButtonDesk = model.el('autoButtonDesk');
            autoButtonDesk.frameName = 'autoOn.png';
            autoButtonDesk.freezeFrames = true;
        }

    }

    function unlockButtons() {
        if(model.state('autoplay:start')) return;

        let infoButtonDesk = model.el('infoButtonDesk');
            infoButtonDesk.frameName = 'info.png';
            infoButtonDesk.freezeFrames = false;
        let maxBetButtonDesk = model.el('maxBetButtonDesk');
            maxBetButtonDesk.frameName = 'maxBet.png';
            maxBetButtonDesk.freezeFrames = false;
        let betLevelPlus = model.el('betLevelPlus');
            betLevelPlus.frameName = 'plus.png';
            betLevelPlus.freezeFrames = false;
        let betLevelMinus = model.el('betLevelMinus');
            betLevelMinus.frameName = 'minus.png';
            betLevelMinus.freezeFrames = false;
        let coinsLevelPlus = model.el('coinsLevelPlus');
            coinsLevelPlus.frameName = 'plus.png';
            coinsLevelPlus.freezeFrames = false
        let coinsLevelMinus = model.el('coinsLevelMinus');
            coinsLevelMinus.frameName = 'minus.png';
            coinsLevelMinus.freezeFrames = false;
        let autoButtonDesk = model.el('autoButtonDesk');
            autoButtonDesk.frameName = 'auto.png';
            autoButtonDesk.freezeFrames = false;
        if(model.state('autoplay:end')){
            let spinButtonDesk = model.el('spinButtonDesk');
            spinButtonDesk.frameName = 'spin.png';
            spinButtonDesk.freezeFrames = true;
            let autoButtonDesk = model.el('autoButtonDesk');
            autoButtonDesk.frameName = 'auto.png';
            autoButtonDesk.freezeFrames = true;
        }
    }

    return {
        draw,
        show,
        hide,
        lockButtons,
        unlockButtons
    };

})();
