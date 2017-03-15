import { model } from 'modules/Model/Model';

export let view = (() => {

    let draw = {

        PanelBG: function ({
            game = model.el('game'),
            container = model.group('panel'),
            x = game.world.centerX,
            y = model.el('gameMachine').height - 10,
            frameName = 'panelBG',
            deltaY = -60
        }) {
            container.x = x;
            container.y = y;
            // container.pivot.set(model.el('gameMachine').width / 2, 0);
            let panelBG = game.add.sprite(0, deltaY, frameName, null, container);
            panelBG.anchor.set(0.5);
            window.panelBG = panelBG;
            console.log(container, panelBG);
            return panelBG;
        },

        AutoContainer: function ({
            game = model.el('game'),
            x = model.el('gameMachine').width / 2,
            y = -189
        }) {
            let autoDesktopContainer = game.add.group();
            autoDesktopContainer.x = x;
            autoDesktopContainer.y = y;
            autoDesktopContainer.alpha = 0;
            model.group('autoDesktop', autoDesktopContainer);
            model.group('panel').add(autoDesktopContainer);
        },

        SpinButton: function ({
            game = model.el('game'),
            x = 0,
            y = -80,
            container = model.group('panel')
        }) {
            let spinButtonDesk = game.add.button(x, y, 'deskButtons', null, null, 'spinOn.png', 'spin.png', 'spinOn.png', null, container);
            spinButtonDesk.anchor.set(0.5);
            model.el('spinButtonDesk', spinButtonDesk);
            return spinButtonDesk;
        },

        StopButton: function ({
            game = model.el('game'),
            x = 0,
            y = -80,
            container = model.group('panel')
        }) {
            let stopButtonDesk = game.add.button(x, y, 'deskButtons', null, null, 'stopOn.png', 'stop.png', 'stopOn.png', null, container);
            stopButtonDesk.anchor.set(0.5);
            stopButtonDesk.visible = false;
            model.el('stopButtonDesk', stopButtonDesk);
            return stopButtonDesk;
        },

        AutoButton: function ({
            game = model.el('game'),
            container = model.group('panel'),
            x = model.el('spinButtonDesk').x - 225,
            y = -100
        }) {
            let autoButtonDesk = game.add.button(x, y, 'deskButtons', null, null, 'autoOn.png', 'auto.png', 'autoOn.png', null, container);
            autoButtonDesk.anchor.set(0.5);
            model.el('autoButtonDesk', autoButtonDesk);
            return autoButtonDesk;
        },

        MaxBetButton: function ({
            game = model.el('game'),
            container = model.group('panel'),
            x = model.el('spinButtonDesk').x + 220,
            y = -100
        }) {
            let maxBetButtonDesk = game.add.button(x, y, 'deskButtons', null, null, 'maxBetOn.png', 'maxBet.png', 'maxBetOn.png', null, container);
            maxBetButtonDesk.anchor.set(0.5);
            model.el('maxBetButtonDesk', maxBetButtonDesk);
            return maxBetButtonDesk;
        },

        PlusButton: function ({
            game = model.el('game'),
            container = model.group('panel'),
            x = -120,
            y = -50,
        }) {
            let plusButtonDesk = game.add.button(x, y, 'deskButtons', null, null, null, 'plus.png', null, null, container);
            return plusButtonDesk;
        },

        MinusButton: function ({
            game = model.el('game'),
            container = model.group('panel'),
            x = -220,
            y = -50
        }) {
            let minusButtonDesk = game.add.button(x, y, 'deskButtons', null, null, null, 'minus.png', null, null, container);
            return minusButtonDesk;
        },

        LinesNumber: function ({
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

        AutoPanel: function ({
            game = model.el('game'),
            container = model.group('autoDesktop')
        }) {
            // let autoplayBG = game.add.sprite(0, 0, 'autoSelect', null, container);
            // autoplayBG.anchor.set(0.5);
            // model.el('autoplayBG', autoplayBG);

            container.visible = false;

            let autoBG10 = this._AutoPanelItem({x: -1275, y: 110});
            let autoBG25 = this._AutoPanelItem({text: 25, x: -1220, y: 75});
            let autoBG50 = this._AutoPanelItem({text: 50, x: -1165, y: 45});
            let autoBG100 = this._AutoPanelItem({text: 100, x: -1110, y: 15});
            let autoBG250 = this._AutoPanelItem({text: 250, x: -1050, y: -5});
            let autoBG500 = this._AutoPanelItem({text: 500, x: -990, y: -18});

            model.el('autoBG10', autoBG10);
            model.el('autoBG25', autoBG25);
            model.el('autoBG50', autoBG50);
            model.el('autoBG100', autoBG100);
            model.el('autoBG250', autoBG250);
            model.el('autoBG500', autoBG500);

            let panelButtonsArr = [];
            panelButtonsArr.push(autoBG10, autoBG25, autoBG50, autoBG100, autoBG250, autoBG500);
            return panelButtonsArr;
        },

        _AutoPanelItem: function ({
            game = model.el('game'),
            container = model.group('autoDesktop'),
            text = 10,
            x = -200,
            y = -7,
            font = 'normal 24px Arial',
            color = '#fff',
            shadowColor = '#fff'
        }) {
            let autoBG = game.add.sprite(x, y, 'deskButtons', 'autoSelect.png', container);
            autoBG.amount = text;
            autoBG.inputEnabled = true;
            model.el('autoBG',autoBG);

            autoBG.events.onInputOver.add(function () {
                autoBG.frameName = 'autoSelectOn.png';
            });
            autoBG.events.onInputOut.add(function () {
                autoBG.frameName = 'autoSelect.png';
            });
            autoBG.events.onInputDown.add(function () {
                autoBG.frameName = 'autoSelectOn.png';
            });

            let autoText = game.add.text(
                autoBG.x + autoBG.width / 2,
                autoBG.y + autoBG.height / 2 + 2,
                text,
                {font: font, fill: color, align: 'center'},
                container);
            autoText.anchor.set(0.5);
            // autoText.setShadow(0, 0, shadowColor, 2);

            return autoBG;
        },

        autoCount: function ({
            game = model.el('game'),
            container = model.group('panel'),
            style = {font: '30px Helvetica, Arial', fill: '#fff', align: 'center'},
            amount = 10,
            x = model.el('autoButtonDesk').x,
            y = model.el('autoButtonDesk').y,
        }) {
            let autoCount = game.add.text(x, y + 2, amount, style, container);
            autoCount.setShadow(2, 2, 'rgba(0, 0, 0, 0.7)', 8);
            autoCount.anchor.set(0.5);
            autoCount.alpha = 0;
            autoCount.angle = -12;
            model.el('autoCount', autoCount);
            game.add.tween(autoCount).to({alpha: 1}, 500, 'Linear', true, 200);
            return autoCount;
        },

        updateCount: function ({
            count = 10
        }) {
            model.el('autoCount').text = count;
        },

        removeCount: function () {
            model.el('autoCount').destroy();
        },

        InfoButton: function ({
            game = model.el('game'),
            container = model.group('footer'),
            x = 50,
            y = model.el('game').height - 100
        }) {
            let infoButton = game.add.button(x, y, 'deskButtons', null, null, null, 'info.png', null, null, container);
            infoButton.anchor.set(0.5);

            infoButton.onInputOver.add(() => {
                infoButton.scale.set(1.2);
            });
            infoButton.onInputOut.add(() => {
                infoButton.scale.set(1);
            });

            model.el('infoButton', infoButton);
            return infoButton;
        },

        info: function ({
            game = model.el('game'),
            container = model.group('infoTable'),
            x = model.el('game').world.centerX,
            y = model.el('game').world.centerY,
        }) {
            container.visible = false;
            container.alpha = 0;
            let overlay = game.add.graphics(0, 0, container).beginFill(0x000000, 0.7).drawRect(0, 0, game.width, game.height);
            model.el('overlay', overlay);

            let infoTableBg = game.add.sprite(x, y, 'infoTableBg', null, container);
            infoTableBg.anchor.set(0.5);
            infoTableBg.scale.set((model.desktop) ? 1.0 : 0.66);
            model.el('infoTableBg', infoTableBg);

            let infoTable = game.add.sprite(x, y, 'infoTable', '1_en.png', container);
            infoTable.anchor.set(0.5);
            infoTable.scale.set((model.desktop) ? 1.2 : 0.9);
            model.el('infoTable', infoTable);

            let closeButton = game.add.sprite(game.width - 170, 120, 'closeButton', null, container);
            closeButton.right = infoTableBg.right + 3;
            closeButton.top = infoTableBg.top + 3;
            model.el('closeButton', closeButton);

            let infoControllers = game.add.group();

            draw._markers(infoControllers);
            draw._arrows(infoControllers);

            infoControllers.y = infoTableBg.bottom - infoControllers.height / 2 - 30;
            infoControllers.x = game.width / 2 - infoControllers.width / 2 + 50;

            container.add(infoControllers);
            model.group('infoControllers', infoControllers);
        },

        _markers: function (container) {
            let game = model.el('game');

            let infoMarkers = [];
            let infoMarker = game.add.sprite(60, 0, 'infoMarker', 'marker_on.png', container);
            let numberOfInfoImages = game.cache._cache.image.infoTable.frameData._frames.length;
            infoMarker.anchor.set(0.5);
            infoMarker.name = 'infoMarker0';
            infoMarkers.push(infoMarker);

            for (let i = 1; i < numberOfInfoImages; i++) {
                let name = 'infoMarker' + i;
                let marker = game.add.sprite(infoMarker.x, 0, 'infoMarker', 'marker_off.png', container);
                marker.name = name;
                marker.anchor.set(0.5);
                marker.x = marker.x + 30 * i;
                infoMarkers.push(marker);
            }

            model.el('infoMarkers', infoMarkers);
        },

        _arrows: function (container) {
            let game = model.el('game');
            let infoMarkers = model.el('infoMarkers');

            let arrowRight = game.add.sprite(infoMarkers[infoMarkers.length - 1].x + 50, 45, 'arrow', null, container);
            arrowRight.anchor.set(0.5);
            model.el('arrowRight', arrowRight);

            let arrowLeft = game.add.sprite(infoMarkers[0].x - 50, 45, 'arrow', null, container);
            arrowLeft.anchor.set(0.5);
            arrowLeft.scale.set(-1, 1);
            model.el('arrowLeft', arrowLeft);
        }
    };

    let show = {
        autoButton: function ({
            game = model.el('game'),
            finalX = 365,
            time = 350
        }) {
            let autoButtonDesk = model.el('autoButtonDesk');
            return game.add.tween(autoButtonDesk).to( { x: finalX }, time, 'Linear', true);
        },

        autoPanel: function ({
            game = model.el('game'),
            time = 350
        }) {
            let autoDesktopContainer = model.group('autoDesktop');
            model.state('panelInAnim', true);
            autoDesktopContainer.visible = true;
            return game.add.tween(autoDesktopContainer).to( { alpha: 1 }, time, 'Linear', true)
                .onComplete.add(() => {
                    model.state('panelInAnim', false);
                });
        }

    };

    let hide = {
        autoButton: function ({
            game = model.el('game'),
            finalX = 523,
            time = 350
        }) {
            let autoButtonDesk = model.el('autoButtonDesk');
            return game.add.tween(autoButtonDesk).to( { x: finalX }, time, 'Linear', true);
        },

        autoPanel: function ({
            game = model.el('game'),
            time = 350
        }) {
            model.state('panelInAnim', true);
            let autoDesktopContainer = model.group('autoDesktop');
            let autoBG = model.el('autoBG');
            autoBG.frameName = 'autoSelect.png';
            return game.add.tween(autoDesktopContainer).to( { alpha: 0 }, time, 'Linear', true)
                .onComplete.add(() => {
                    model.state('panelInAnim', false);
                    autoDesktopContainer.visible = false;
                });
        }
    };

    function lockButtons() {

        let infoButton = model.el('infoButton');
        infoButton.freezeFrames = true;
        infoButton.alpha = 0.5;
        let settingsButton = model.el('settingsButton');
        settingsButton.freezeFrames = true;
        settingsButton.alpha = 0.5;

        let maxBetButtonDesk = model.el('maxBetButtonDesk');
        maxBetButtonDesk.frameName = 'maxBetClose.png';
        maxBetButtonDesk.freezeFrames = true;

        let betLevelPlus = model.el('betLevelPlus');
        betLevelPlus.alpha = 0.5;
        betLevelPlus.freezeFrames = true;

        let betLevelMinus = model.el('betLevelMinus');
        betLevelMinus.alpha = 0.5;
        betLevelMinus.freezeFrames = true;

        let coinsLevelPlus = model.el('coinsLevelPlus');
        coinsLevelPlus.alpha = 0.5;
        coinsLevelPlus.freezeFrames = true;

        let coinsLevelMinus = model.el('coinsLevelMinus');
        coinsLevelMinus.alpha = 0.5;
        coinsLevelMinus.freezeFrames = true;
        if (model.state('autoplay:start')) {
            let spinButtonDesk = model.el('spinButtonDesk');
            spinButtonDesk.visible = false;
            let stopButtonDesk = model.el('stopButtonDesk');
            stopButtonDesk.visible = true;
            let autoButtonDesk = model.el('autoButtonDesk');
            autoButtonDesk.frameName = 'autoClose.png';
            autoButtonDesk.freezeFrames = true;
        } else {
            let autoButtonDesk = model.el('autoButtonDesk');
            autoButtonDesk.frameName = 'autoClose.png';
            autoButtonDesk.freezeFrames = true;
        }

    }

    function unlockButtons() {
        if (model.state('autoplay:start')) return;

        let infoButton = model.el('infoButton');
        infoButton.freezeFrames = false;
        infoButton.alpha = 1;

        let settingsButton = model.el('settingsButton');
        settingsButton.freezeFrames = false;
        settingsButton.alpha = 1;

        let maxBetButtonDesk = model.el('maxBetButtonDesk');
        maxBetButtonDesk.frameName = 'maxBet.png';
        maxBetButtonDesk.freezeFrames = false;

        let betLevelPlus = model.el('betLevelPlus');
        betLevelPlus.alpha = 1;
        betLevelPlus.freezeFrames = false;

        let betLevelMinus = model.el('betLevelMinus');
        betLevelMinus.alpha = 1;
        betLevelMinus.freezeFrames = false;

        let coinsLevelPlus = model.el('coinsLevelPlus');
        coinsLevelPlus.alpha = 1;
        coinsLevelPlus.freezeFrames = false;

        let coinsLevelMinus = model.el('coinsLevelMinus');
        coinsLevelMinus.alpha = 1;
        coinsLevelMinus.freezeFrames = false;

        let autoButtonDesk = model.el('autoButtonDesk');
        autoButtonDesk.frameName = 'auto.png';
        autoButtonDesk.freezeFrames = false;
        if (model.state('autoplay:end')) {
            let spinButtonDesk = model.el('spinButtonDesk');
            spinButtonDesk.visible = true;
            let stopButtonDesk = model.el('stopButtonDesk');
            stopButtonDesk.visible = false;
            stopButtonDesk.frameName = 'stop.png';
            stopButtonDesk.freezeFrames = false;

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
