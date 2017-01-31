import { model } from 'modules/Model/Model';
import { config } from 'modules/Util/Config';

export let view = (() => {

    let draw = {

        PanelBG: function({
            game = model.el('game'),
            container = model.group('panel'),
            x = game.world.centerX,
            y = model.el('gameMachine').height,
            frameName = 'ui',
            deltaY = 0
        }) {
            container.x = x;
            container.y = y;
            container.pivot.set(model.el('gameMachine').width / 2, 0);
            // const panelBG = game.add.sprite(0, deltaY, frameName, null, container);
            // return panelBG;
        },

        AutoContainer: function({
            game = model.el('game'),
            x = model.el('gameMachine').width / 2,
            y = -185
        }) {
            let autoDesktopContainer = game.add.group();
                autoDesktopContainer.x = x;
                autoDesktopContainer.y = y;
                autoDesktopContainer.alpha = 0;
            model.group('autoDesktop', autoDesktopContainer);
            model.group('panel').add(autoDesktopContainer);
        },

        SpinButton: function({
            game = model.el('game'),
            x = model.el('gameMachine').width / 2 + 3,
            y = -75,
            container = model.group('panel')
        }) {
            let spinButtonDesk = game.add.button(x, y, 'deskButtons', null, null, 'spinOn.png', 'spin.png', 'spinOn.png', null, container);
                spinButtonDesk.anchor.set(0.5);
            model.el('spinButtonDesk', spinButtonDesk);
            return spinButtonDesk;
        },

        StopButton: function({
            game = model.el('game'),
            x = model.el('spinButtonDesk').x - 170,
            y = -90,
            container = model.group('panel')
        }) {
            let stopButtonDesk = game.add.button(x, y, 'deskButtons', null, null, 'stopOn.png', 'stop.png', 'stopOn.png', null, container);
                stopButtonDesk.anchor.set(0.5);
                stopButtonDesk.visible = false;
            model.el('stopButtonDesk', stopButtonDesk);
            return stopButtonDesk;
        },

        AutoButton: function({
            game = model.el('game'),
            container = model.group('panel'),
            x = model.el('spinButtonDesk').x - 170,
            y = -90
        }) {
            let autoButtonDesk = game.add.button(x, y, 'deskButtons', null, null, 'autoOn.png', 'auto.png', 'autoOn.png', null, container);
                autoButtonDesk.anchor.set(0.5);
            model.el('autoButtonDesk', autoButtonDesk);
            return autoButtonDesk;
        },

        MaxBetButton: function({
            game = model.el('game'),
            container = model.group('panel'),
            x = model.el('spinButtonDesk').x + 170,
            y = -90
        }) {
            let maxBetButtonDesk = game.add.button(x, y, 'deskButtons', null, null, 'maxBetOn.png', 'maxBet.png', 'maxBetOn.png', null, container);
                maxBetButtonDesk.anchor.set(0.5);
            model.el('maxBetButtonDesk', maxBetButtonDesk);
            return maxBetButtonDesk;
        },

        InfoButton: function({
            game = model.el('game'),
            container = model.group('panel'),
            x = -170,
            y = -70,
        }) {
            let infoButtonDesk = game.add.button(x, y, 'deskButtons', null, null, null, 'info.png', null, null, container);
            model.el('infoButtonDesk', infoButtonDesk);
            return infoButtonDesk;
        },

        PlusButton: function({
            game = model.el('game'),
            container = model.group('panel'),
            x = 500,
            y = -55,
        }) {
            let plusButtonDesk = game.add.button(x, y, 'deskButtons', null, null, 'plusOn.png', 'plus.png', 'plusOn.png', null, container);
            return plusButtonDesk;
        },

        MinusButton: function({
            game = model.el('game'),
            container = model.group('panel'),
            x = 375,
            y = -55
        }) {
            let minusButtonDesk = game.add.button(x, y, 'deskButtons', null, null, 'minusOn.png', 'minus.png', 'minusOn.png', null, container);
            return minusButtonDesk;
        },

        LinesNumber: function({
            game = model.el('game'),
            container = model.group('panel'),
            style = {font: 'normal 27px Helvetica, Arial', align: 'center', fill: '#e8b075'},
            x = 85,
            y = 116,
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
            let autoBG25 = this._AutoPanelItem({text: 25, x: -140, y: -7, width: 63, height: 40});
            let autoBG50 = this._AutoPanelItem({text: 50, x: -80, y: -7, width: 68, height: 40});
            let autoBG100 = this._AutoPanelItem({text: 100, x: -15, y: -7, width: 75, height: 40});
            let autoBG250 = this._AutoPanelItem({text: 250, x: 60, y: -7, width: 70, height: 40});
            let autoBG500 = this._AutoPanelItem({text: 500, x: 125, y: -7, width: 68, height: 40});

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
            x = -200,
            y = -7,
            width = 65,
            height = 40,
            font = 'normal 24px Arial',
            color = '#fff',
            shadowColor = '#fff'
        }) {
            let autoBG = game.add.graphics(0, 0, container).beginFill(0xffffff, 0.2).drawRect(0, 0, width, height);
                autoBG.x = x;
                autoBG.y = y - 8;
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
            style = {font: '60px Titania, Helvetica', fill: '#fff', align: 'center', stroke: '#000000', strokeThickness: 2},
            amount = 10,
            x = model.el('spinButtonDesk').x,
            y = model.el('spinButtonDesk').y,
        }) {
            let autoCount = game.add.text(x, y + 2, amount, style, container);
                autoCount.setShadow(5, 5, 'rgba(0, 0, 0, 0.7)', 8);
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

        _markers: function(container){
            let game = model.el('game');

            let infoMarkers = [];
            let infoMarker = game.add.sprite(60, 0, 'infoMarker', 'marker_on.png', container);
                infoMarker.anchor.set(0.5);
                infoMarker.name = 'infoMarker0';
                infoMarkers.push(infoMarker);

            for (let i = 1; i < config.numOfInfoDots; i++) {
                let name = 'infoMarker' + i;
                let counter = i;
                let marker = game.add.sprite(infoMarker.x, 0, 'infoMarker', 'marker_off.png', container);
                marker.name = name;
                marker.anchor.set(0.5);
                marker.x = marker.x + 30 * i;
                infoMarkers.push(marker);
            }

            model.el('infoMarkers', infoMarkers);
        },

        _arrows: function(container){
            let game = model.el('game');
            let infoMarkers = model.el('infoMarkers');

            let arrowRight = game.add.sprite(infoMarkers[infoMarkers.length-1].x, 85, 'ar', null, container);
                arrowRight.anchor.set(0.5);
            model.el('arrowRight', arrowRight);

            let arrowLeft = game.add.sprite(infoMarkers[0].x, 85, 'arLeft', null, container);
                arrowLeft.anchor.set(0.5);
            model.el('arrowLeft', arrowLeft);
        }
    }

    let show = {
        autoButton: function({
            game = model.el('game'),
            finalX = 365,
            time = 350
        }) {
            let autoButtonDesk = model.el('autoButtonDesk');
            return game.add.tween(autoButtonDesk).to( { x: finalX }, time, 'Linear', true);
        },

        autoPanel: function({
            game = model.el('game'),
            finalX = 495,
            finalY = -185,
            time = 350
        }) {
            let autoDesktopContainer = model.group('autoDesktop');
            return game.add.tween(autoDesktopContainer).to( { alpha: 1 }, time, 'Linear', true);
        },

        info: function({
            game = model.el('game'),
            container = model.group('popup'),
            x = model.el('game').world.centerX,
            y = model.el('game').world.centerY,
        }) {
            let overlay = game.add.graphics(0, 0, container).beginFill(0x000000, 0.7).drawRect(0, 0, game.width, game.height);
            model.el('overlay', overlay);

            let infoRules = game.add.sprite(x, y, 'info', '1_en.png', container);
                infoRules.anchor.set(0.5);
                infoRules.scale.set(1.3);
            model.el('infoRules', infoRules);

            let closed = game.add.sprite(game.width - 410, 210, 'closed', null, container);
            model.el('closed', closed);

            let infoControllers = game.add.group();

            draw._markers(infoControllers)
            draw._arrows(infoControllers)

            infoControllers.y = infoRules.bottom - infoControllers.height / 2;
            infoControllers.x = game.width / 2 - infoControllers.width / 2;

            container.add(infoControllers);
            model.group('infoControllers', infoControllers);
            return infoRules;
        }

    }

    let hide = {
        autoButton: function({
            game = model.el('game'),
            finalX = 523,
            time = 350
        }) {
            let autoButtonDesk = model.el('autoButtonDesk');
            return game.add.tween(autoButtonDesk).to( { x: finalX }, time, 'Linear', true)
        },

        autoPanel: function({
            game = model.el('game'),
            finalX = 650,
            finalY = -100,
            time = 350
        }) {
            let autoDesktopContainer = model.group('autoDesktop');
            return game.add.tween(autoDesktopContainer).to( { alpha: 0 }, time, 'Linear', true)
        }
    }

    function lockButtons() {

        let infoButtonDesk = model.el('infoButtonDesk');
            infoButtonDesk.frameName = 'info.png';
            infoButtonDesk.freezeFrames = true;
            infoButtonDesk.alpha = 0.5;
        let maxBetButtonDesk = model.el('maxBetButtonDesk');
            maxBetButtonDesk.frameName = 'maxBet.png';
            maxBetButtonDesk.freezeFrames = true;
            maxBetButtonDesk.alpha = 0.5;
        let betLevelPlus = model.el('betLevelPlus');
            betLevelPlus.frameName = 'plus.png';
            betLevelPlus.freezeFrames = true;
            betLevelPlus.alpha = 0.5;
        let betLevelMinus = model.el('betLevelMinus');
            betLevelMinus.frameName = 'minus.png';
            betLevelMinus.freezeFrames = true;
            betLevelMinus.alpha = 0.5;
        let coinsLevelPlus = model.el('coinsLevelPlus');
            coinsLevelPlus.frameName = 'plus.png';
            coinsLevelPlus.freezeFrames = true
            coinsLevelPlus.alpha = 0.5;
        let coinsLevelMinus = model.el('coinsLevelMinus');
            coinsLevelMinus.frameName = 'minus.png';
            coinsLevelMinus.freezeFrames = true;
            coinsLevelMinus.alpha = 0.5;
        if(model.state('autoplay:start')){
            let spinButtonDesk = model.el('spinButtonDesk');
                spinButtonDesk.visible = false;
            let stopButtonDesk = model.el('stopButtonDesk');
                stopButtonDesk.visible = true;
            let autoButtonDesk = model.el('autoButtonDesk');
                // autoButtonDesk.frameName = 'autoEmpty.png';
                // autoButtonDesk.alpha = 0.5;
                autoButtonDesk.visible = false;
                autoButtonDesk.freezeFrames = true;
        } else {
            let autoButtonDesk = model.el('autoButtonDesk');
            autoButtonDesk.frameName = 'auto.png';
            autoButtonDesk.alpha = 0.5;
            autoButtonDesk.freezeFrames = true;
        }

    }

    function unlockButtons() {
        if(model.state('autoplay:start')) return;

        let infoButtonDesk = model.el('infoButtonDesk');
            infoButtonDesk.frameName = 'info.png';
            infoButtonDesk.freezeFrames = false;
            infoButtonDesk.alpha = 1;
        let maxBetButtonDesk = model.el('maxBetButtonDesk');
            maxBetButtonDesk.frameName = 'maxBet.png';
            maxBetButtonDesk.freezeFrames = false;
            maxBetButtonDesk.alpha = 1;
        let betLevelPlus = model.el('betLevelPlus');
            betLevelPlus.frameName = 'plus.png';
            betLevelPlus.freezeFrames = false;
            betLevelPlus.alpha = 1;
        let betLevelMinus = model.el('betLevelMinus');
            betLevelMinus.frameName = 'minus.png';
            betLevelMinus.freezeFrames = false;
            betLevelMinus.alpha = 1;
        let coinsLevelPlus = model.el('coinsLevelPlus');
            coinsLevelPlus.frameName = 'plus.png';
            coinsLevelPlus.freezeFrames = false
            coinsLevelPlus.alpha = 1;
        let coinsLevelMinus = model.el('coinsLevelMinus');
            coinsLevelMinus.frameName = 'minus.png';
            coinsLevelMinus.freezeFrames = false;
            coinsLevelMinus.alpha = 1;
        let autoButtonDesk = model.el('autoButtonDesk');
            autoButtonDesk.frameName = 'auto.png';
            autoButtonDesk.freezeFrames = false;
            autoButtonDesk.alpha = 1;
        if(model.state('autoplay:end')){
            let spinButtonDesk = model.el('spinButtonDesk');
                spinButtonDesk.visible = true;
            let stopButtonDesk = model.el('stopButtonDesk');
                stopButtonDesk.visible = false;
                stopButtonDesk.frameName = 'stop.png';
                stopButtonDesk.freezeFrames = false
            let autoButtonDesk = model.el('autoButtonDesk');
                // autoButtonDesk.frameName = 'auto.png';
                // autoButtonDesk.alpha = 1;
                autoButtonDesk.visible = true;
                autoButtonDesk.freezeFrames = false;
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
