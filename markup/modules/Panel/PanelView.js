import { model } from 'modules/Model/Model';

export let view = (() => {

    let draw = {

        PanelBG: function ({
            game = model.el('game'),
            container = model.group('panel'),
            x = game.world.centerX,
            y = model.el('gameMachine').bottom + model.el('gameMachine').height / 2,
            framePanelBG = 'panelBGgreen.png',
            deltaY = 70
        }) {
            container.x = x;
            container.top = y;
            let panelBG = game.add.sprite(1, deltaY, 'panelBG', framePanelBG, container);

            if (model.state('fs')) {
                container.alpha = 0;
                container.y = -500;
            }

            container.pivot.set(panelBG.width / 2, 0);
            return panelBG;
        },

        FsLevelAndMulti: function ({
            game = model.el('game'),
            container = model.group('panelFS'),
            startLevel = 8,
            startMulti = 'x1',
            fontDesktop = (game.device.iOS) ? 'bold 80px Arial' : '80px Cooper, Arial',
            fontMobile = (game.device.iOS) ? 'bold 40px Arial' : '40px Cooper, Arial',
            x = container.width / 2 + 10,
            y = 160
        }) {
            if (model.mobile) {
                y = game.height * 0.85;
                if (model.state('gameSideLeft')) {
                    x = game.world.centerX - 80;
                } else {
                    x = game.world.centerX + 90;
                }
            }
            let fsCountBG = game.add.sprite(x, y, 'fsCountBG', null, container);
            fsCountBG.anchor.set(0.5);
            fsCountBG.animations.add('start');
            fsCountBG.animations.play('start', 15, true);

            let font = (model.desktop) ? fontDesktop : fontMobile;
            let deltaX = (model.desktop) ? 97 : 60;
            let deltaY1 = (model.desktop) ? 40 : 20;
            let deltaY2 = (model.desktop) ? 10 : 5;

            let fsCount = game.add.text(fsCountBG.x - deltaX, fsCountBG.y - deltaY1, startLevel, {font: font, align: 'center'}, container);
            fsCount.anchor.set(0.5);
            model.el('fs:count', fsCount);

            let grd = fsCount.context.createLinearGradient(0, 0, 0, fsCount.canvas.height);
            grd.addColorStop(0, '#ffffff');
            grd.addColorStop(1, '#eeeeee');
            fsCount.fill = grd;

            let fsMulti = game.add.text(fsCountBG.x + deltaX, fsCountBG.y + deltaY2, startMulti, {font: font, align: 'center', fill: '#ffffff'}, container);
            fsMulti.anchor.set(0.5);
            model.el('fs:multi', fsMulti);
        },

        changeLevelAndMulti: function ({
            fsCount = model.el('fs:count'),
            fsMulti = model.el('fs:multi'),
            multi,
            count
        }) {
            setTimeout(() => {
                fsCount.text = count;
                fsMulti.text = multi;
            }, 500);
        },

        AutoContainer: function ({
            game = model.el('game'),
            x = model.group('panel').width / 2,
            y = 168
        }) {
            let autoDesktopContainer = game.add.group();
            autoDesktopContainer.x = x;
            autoDesktopContainer.y = y;
            autoDesktopContainer.visible = false;

            model.el('autoDesktopContainer', autoDesktopContainer);
            model.group('autoDesktop', autoDesktopContainer);
            model.group('panel').add(autoDesktopContainer);
        },

        AnimatedSpinButton: function ({
            game = model.el('game'),
            x = model.group('panel').width / 2,
            y = 168,
            container = model.group('panel')
        }) {
            let animatedSpinButton = game.add.sprite(x, y, 'deskButtonsAnim', null, container);
            animatedSpinButton.anchor.set(0.5);
            animatedSpinButton.visible = false;
            animatedSpinButton.animations.add('spinToPanel', Phaser.Animation.generateFrameNames('button-1_', 0, 30, '.png', 1), 120, false);
            animatedSpinButton.animations.add('panelToStop', Phaser.Animation.generateFrameNames('button-2_', 0, 30, '.png', 1), 120, false);
            animatedSpinButton.animations.add('stopToSpin', Phaser.Animation.generateFrameNames('button-3_', 0, 30, '.png', 1), 120, false);
            animatedSpinButton.animations.add('panelToSpin', Phaser.Animation.generateFrameNames('button-4_', 0, 30, '.png', 1), 120, false);
            model.el('animatedSpinButton', animatedSpinButton);
        },

        SpinButton: function ({
            game = model.el('game'),
            x = model.group('panel').width / 2,
            y = 168,
            container = model.group('panel')
        }) {
            let spinButtonDesk = game.add.button(x, y, 'deskButtons', null, null, 'spinOn.png', 'spin.png', 'spinOn.png', null, container);
            spinButtonDesk.anchor.set(0.5);
            model.el('spinButtonDesk', spinButtonDesk);

            return spinButtonDesk;
        },

        AutoButton: function ({
            game = model.el('game'),
            container = model.group('panel'),
            x = model.el('spinButtonDesk').x - 136,
            y = 168
        }) {
            let autoButtonDesk = game.add.button(x, y, 'deskButtons', null, null, 'autoOn.png', 'auto.png', 'autoOn.png', null, container);
            autoButtonDesk.anchor.set(0.5);
            model.el('autoButtonDesk', autoButtonDesk);
            return autoButtonDesk;
        },

        MaxBetButton: function ({
            game = model.el('game'),
            container = model.group('panel'),
            x = model.el('spinButtonDesk').x + 136,
            y = 168
        }) {
            let maxBetButtonDesk = game.add.button(x, y, 'deskButtons', null, null, 'maxBetOn.png', 'maxBet.png', 'maxBetOn.png', null, container);
            maxBetButtonDesk.anchor.set(0.5);
            model.el('maxBetButtonDesk', maxBetButtonDesk);
            return maxBetButtonDesk;
        },

        StopButton: function ({
            game = model.el('game'),
            x = model.group('panel').width / 2,
            y = 168,
            container = model.group('panel')
        }) {
            let stopButtonDesk = game.add.button(x, y, 'deskButtons', null, null, 'stopOn.png', 'stop.png', 'stopOn.png', null, container);
            stopButtonDesk.anchor.set(0.5);
            stopButtonDesk.visible = false;
            model.el('stopButtonDesk', stopButtonDesk);
            return stopButtonDesk;
        },

        LinesNumber: function ({
            game = model.el('game'),
            container = model.group('panel'),
            style = {font: 'normal 27px Helvetica, Arial', align: 'center', fill: '#ffffff'},
            x = 103,
            y = 195,
        }) {
            let linesNumber = game.add.text(x, y, '10', style, container);
            model.el('linesNumber', linesNumber);
            return linesNumber;
        },

        PlusButton: function ({
            game = model.el('game'),
            container = model.group('panel'),
            x = 277,
            y = 183,
        }) {
            let plusButtonDesk = game.add.button(x, y, 'deskButtons', null, null, 'plusOn.png', 'plus.png', 'plusOn.png', null, container);
            return plusButtonDesk;
        },

        MinusButton: function ({
            game = model.el('game'),
            container = model.group('panel'),
            x = 173,
            y = 183
        }) {
            let minusButtonDesk = game.add.button(x, y, 'deskButtons', null, null, 'minusOn.png', 'minus.png', 'minusOn.png', null, container);
            return minusButtonDesk;
        },

        InfoButton: function ({
            game = model.el('game'),
            container = model.group('footerMenu'),
            x = 230,
            y = model.el('game').height - 20
        }) {
            let infoButton = game.add.button(x, y, 'deskButtons', null, null, null, 'info.png', null, null, container);
            infoButton.anchor.set(0.5);

            infoButton.onInputOver.add(() => {
                infoButton.scale.set(1.4);
            });
            infoButton.onInputOut.add(() => {
                infoButton.scale.set(1);
            });

            model.el('infoButton', infoButton);
            return infoButton;
        },

        AutoPanel: function ({
              game = model.el('game'),
              container = model.group('autoDesktop')
          }) {
            let autoBG10 = this._AutoPanelItem({text: 10, x: -87, y: -65, width: 83, height: 40});
            let autoBG25 = this._AutoPanelItem({text: 25, x: -3, y: -65, width: 90, height: 40});
            let autoBG50 = this._AutoPanelItem({text: 50, x: -87, y: -18, width: 83, height: 38});
            let autoBG100 = this._AutoPanelItem({text: 100, x: -3, y: -18, width: 90, height: 38});
            let autoBG250 = this._AutoPanelItem({text: 250, x: -87, y: 26, width: 83, height: 40});
            let autoBG500 = this._AutoPanelItem({text: 500, x: -3, y: 26, width: 90, height: 40});

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
                x = -80,
                y = -62,
                width = 70,
                height = 37,
                font = 'normal 27px Arial',
                color = '#ffffff'
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

            return autoBG;
        },

        autoCount: function ({
            game = model.el('game'),
            container = model.group('panel'),
            style = {
                font: '42px Arial, Helvetica',
                align: 'center'
            },
            amount = 10,
            x = model.el('autoButtonDesk').x + 5,
            y = model.el('autoButtonDesk').y + 5,
        }) {
            let autoCount = game.add.text(x, y, amount, style, container);
            autoCount.anchor.set(0.5);
            autoCount.alpha = 0;
            model.el('autoCount', autoCount);

            let grd = autoCount.context.createLinearGradient(0, 0, 0, autoCount.canvas.height);
            grd.addColorStop(0, '#ffffff');
            grd.addColorStop(1, '#eeeeee');
            autoCount.fill = grd;

            game.add.tween(autoCount).to({
                alpha: 1
            }, 500, 'Linear', true, 200);
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

            let arrowRight = game.add.sprite(infoMarkers[infoMarkers.length - 1].x + 50, 85, 'arrow', null, container);
            arrowRight.anchor.set(0.5);
            model.el('arrowRight', arrowRight);

            let arrowLeft = game.add.sprite(infoMarkers[0].x - 50, 85, 'arrow', null, container);
            arrowLeft.anchor.set(0.5);
            arrowLeft.scale.set(-1, 1);
            model.el('arrowLeft', arrowLeft);
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
            model.el('infoTableBg', infoTableBg);

            let infoTable = game.add.sprite(x, y, 'infoTable', '1_en.png', container);
            infoTable.anchor.set(0.5);
            infoTable.scale.set((model.desktop) ? 1.3 : 1);
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
        }

    };

    let show = {
        autoButton: function ({
            game = model.el('game'),
            finalX = 365,
            time = 350
        }) {
            let autoButtonDesk = model.el('autoButtonDesk');
            return game.add.tween(autoButtonDesk).to({
                x: finalX
            }, time, 'Linear', true);
        },

        autoPanel: function ({
            game = model.el('game'),
            finalX = 495,
            time = 350
        }) {
            let autoDesktopContainer = model.group('autoDesktop');
            return game.add.tween(autoDesktopContainer).to({
                x: finalX
            }, time, 'Linear', true);
        },
        showPanelFS: function ({
            game = model.el('game'),
        }) {
            let panelGroup = model.group('panelFS');
            panelGroup.y = -500;
            game.add.tween(panelGroup).to({y: model.el('gameMachine').bottom + model.el('gameMachine').height / 2, alpha: 1}, 1000, 'Linear', true);
        },

        showPanelMain: function ({
            game = model.el('game'),
        }) {
            let panelGroup = model.group('panel');
            panelGroup.y = -500;
            game.add.tween(panelGroup).to({y: model.el('gameMachine').bottom + model.el('gameMachine').height / 2, alpha: 1}, 1000, 'Linear', true);
        }

    };

    let hide = {
        autoButton: function ({
            game = model.el('game'),
            finalX = 523,
            time = 350
        }) {
            let autoButtonDesk = model.el('autoButtonDesk');
            return game.add.tween(autoButtonDesk).to({
                x: finalX
            }, time, 'Linear', true);
        },

        autoPanel: function ({
            game = model.el('game'),
            finalX = 650,
            time = 350
        }) {
            let autoDesktopContainer = model.group('autoDesktop');
            return game.add.tween(autoDesktopContainer).to({
                x: finalX + 5
            }, time, 'Linear', true);
        },
        dropPaneltoFS: function ({
            game = model.el('game'),
        }) {
            let panelGroup = model.group('panel');
            game.add.tween(panelGroup).to({y: game.height + 500, alpha: 0}, 1000, 'Linear', true)
                .onComplete.add(() => {
                    panelGroup.removeAll();
                }, this);
        },

        dropPaneltoMain: function ({
            game = model.el('game'),
        }) {
            let panelGroup = model.group('panelFS');
            game.add.tween(panelGroup).to({y: game.height + 500, alpha: 0}, 1000, 'Linear', true)
            .onComplete.add(() => {
                panelGroup.removeAll();
            }, this);
        }
    };

    function lockButtons() {

        let maxBetButtonDesk = model.el('maxBetButtonDesk');
        maxBetButtonDesk.frameName = 'maxBetFreeze.png';
        maxBetButtonDesk.freezeFrames = true;
        let betLevelPlus = model.el('betLevelPlus');
        betLevelPlus.frameName = 'plusFreeze.png';
        betLevelPlus.freezeFrames = true;
        let betLevelMinus = model.el('betLevelMinus');
        betLevelMinus.frameName = 'minusFreeze.png';
        betLevelMinus.freezeFrames = true;
        let coinsLevelPlus = model.el('coinsLevelPlus');
        coinsLevelPlus.frameName = 'plusFreeze.png';
        coinsLevelPlus.freezeFrames = true;
        let coinsLevelMinus = model.el('coinsLevelMinus');
        coinsLevelMinus.frameName = 'minusFreeze.png';
        coinsLevelMinus.freezeFrames = true;
        let autoButtonDesk = model.el('autoButtonDesk');
        if (model.state('autoplay:start')) {
            autoButtonDesk.frameName = 'autoCount.png';
        } else {
            autoButtonDesk.frameName = 'autoFreeze.png';
        }
        autoButtonDesk.freezeFrames = true;

	    let infoButton = model.el('infoButton');
	    infoButton.alpha = 0.5;
	    let settingsButton = model.el('settingsButton');
	    settingsButton.alpha = 0.5;
    }

    function unlockButtons() {
        if (model.state('autoplay:start')) {
            return;
        }

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
        coinsLevelPlus.freezeFrames = false;
        let coinsLevelMinus = model.el('coinsLevelMinus');
        coinsLevelMinus.frameName = 'minus.png';
        coinsLevelMinus.freezeFrames = false;
        let autoButtonDesk = model.el('autoButtonDesk');
        autoButtonDesk.frameName = 'auto.png';
        autoButtonDesk.freezeFrames = false;

	    let infoButton = model.el('infoButton');
	    infoButton.alpha = 1;
	    let settingsButton = model.el('settingsButton');
	    settingsButton.alpha = 1;
    }

    return {
        draw,
        show,
        hide,
        lockButtons,
        unlockButtons
    };

})();
