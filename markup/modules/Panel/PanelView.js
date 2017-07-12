import { model } from 'modules/Model/Model';

export let view = (() => {

    let draw = {

        PanelBG: function ({
            game = model.el('game'),
            container = model.group('panel'),
            x = game.world.centerX + 200,
            y = model.el('gameMachine').height - ((model.state('fs')) ? 20 : 10)
        }) {
            container.x = x;
            container.y = y;
            container.pivot.set(model.el('gameMachine').width / 2, 0);
            // const panelBG = game.add.sprite(0, deltaY, frameName, null, container);
            // return panelBG;
        },

        AutoContainer: function ({
            game = model.el('game'),
            x = model.el('gameMachine').width / 2,
            y = -255
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
            x = model.el('gameMachine').width / 2 - 7,
            y = -150,
            container = model.group('panel')
        }) {
            let spinButtonDesk = game.add.button(x, y, 'deskButtons', null, null, 'spinHover.png', 'spin.png', 'spinOn.png', null, container);
            spinButtonDesk.anchor.set(0.5);
            model.el('spinButtonDesk', spinButtonDesk);
            return spinButtonDesk;
        },

        StopButton: function ({
            game = model.el('game'),
            x = model.el('spinButtonDesk').x - 185,
            y = -132,
            container = model.group('panel')
        }) {
            let stopButtonDesk = game.add.button(x, y, 'deskButtons', null, null, 'stopHover.png', 'stop.png', 'stopOn.png', null, container);
            stopButtonDesk.anchor.set(0.5);
            stopButtonDesk.visible = false;
            model.el('stopButtonDesk', stopButtonDesk);
            return stopButtonDesk;
        },

        AutoButton: function ({
            game = model.el('game'),
            container = model.group('panel'),
            x = model.el('spinButtonDesk').x - 185,
            y = -132
        }) {
            let autoButtonDesk = game.add.button(x, y, 'deskButtons', null, null, 'autoHover.png', 'auto.png', 'autoOn.png', null, container);
            autoButtonDesk.anchor.set(0.5);
            model.el('autoButtonDesk', autoButtonDesk);
            return autoButtonDesk;
        },

        MaxBetButton: function ({
            game = model.el('game'),
            container = model.group('panel'),
            x = model.el('spinButtonDesk').x + 185,
            y = -132
        }) {
            let maxBetButtonDesk = game.add.button(x, y, 'deskButtons', null, null, 'maxBetHover.png', 'maxBet.png', 'maxBetOn.png', null, container);
            maxBetButtonDesk.anchor.set(0.5);
            model.el('maxBetButtonDesk', maxBetButtonDesk);
            return maxBetButtonDesk;
        },

        PlusButton: function ({
            game = model.el('game'),
            container = model.group('panel'),
            x = 360,
            y = -143,
        }) {
            let plusButtonDesk = game.add.button(x, y, 'deskButtons', null, null, 'plusHover.png', 'plus.png', 'plusOn.png', null, container);
            return plusButtonDesk;
        },

        MinusButton: function ({
            game = model.el('game'),
            container = model.group('panel'),
            x = 230,
            y = -143
        }) {
            let minusButtonDesk = game.add.button(x, y, 'deskButtons', null, null, 'minusHover.png', 'minus.png', 'minusOn.png', null, container);
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
            let autoplayDownBG = game.add.sprite(0, 0, 'deskButtons', 'autoPanelBG.png', container);
            autoplayDownBG.anchor.set(0.5);

            let autoplayBG = game.add.sprite(0, 0, 'deskButtons', 'autoPanel.png', container);
            autoplayBG.anchor.set(0.5);
            model.el('autoplayBG', autoplayBG);

            container.visible = false;

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
            panelButtonsArr.push(autoBG10, autoBG25, autoBG50, autoBG100, autoBG250, autoBG500);
            return panelButtonsArr;
        },

        _AutoPanelItem: function ({
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

        autoCount: function ({
            game = model.el('game'),
            container = model.group('panel'),
            style = {font: '55px Arial', fill: '#fff', align: 'center', stroke: '#000000', strokeThickness: 2},
            amount = 10,
            x = model.el('spinButtonDesk').x,
            y = model.el('spinButtonDesk').y,
        }) {
            let autoCount = game.add.text(x, y + 2, amount, style, container);
            // autoCount.setShadow(5, 5, 'rgba(0, 0, 0, 0.7)', 8);
            autoCount.anchor.set(0.5);
            autoCount.alpha = 0;
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
        maxBetButtonDesk.frameName = 'maxBetOff.png';
        maxBetButtonDesk.freezeFrames = true;
        let betLevelPlus = model.el('betLevelPlus');
        betLevelPlus.frameName = 'plusOff.png';
        betLevelPlus.freezeFrames = true;
        let betLevelMinus = model.el('betLevelMinus');
        betLevelMinus.frameName = 'minusOff.png';
        betLevelMinus.freezeFrames = true;
        let coinsLevelPlus = model.el('coinsLevelPlus');
        coinsLevelPlus.frameName = 'plusOff.png';
        coinsLevelPlus.freezeFrames = true;
        let coinsLevelMinus = model.el('coinsLevelMinus');
        coinsLevelMinus.frameName = 'minusOff.png';
        coinsLevelMinus.freezeFrames = true;
        if (model.state('autoplay:start')) {
            let spinButtonDesk = model.el('spinButtonDesk');
            spinButtonDesk.frameName = 'autoEmpty.png';
            spinButtonDesk.freezeFrames = true;
            let stopButtonDesk = model.el('stopButtonDesk');
            stopButtonDesk.visible = true;
            let autoButtonDesk = model.el('autoButtonDesk');
            autoButtonDesk.visible = false;
            autoButtonDesk.freezeFrames = true;
        } else {
            let autoButtonDesk = model.el('autoButtonDesk');
            autoButtonDesk.frameName = 'autoOff.png';
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
        if (model.state('autoplay:end')) {
            let spinButtonDesk = model.el('spinButtonDesk');
            spinButtonDesk.frameName = 'spin.png';
            spinButtonDesk.freezeFrames = false;
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
