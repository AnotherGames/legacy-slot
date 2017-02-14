import { model } from 'modules/Model/Model';
import { config } from 'modules/Util/Config';
import { controller as balanceController } from 'modules/Balance/BalanceController';

export let view = (() => {

    let draw = {

        PanelBG: function({
            game = model.el('game'),
            container = model.group('panel'),
            x = game.world.centerX,
            y = model.el('gameMachine').bottom + model.el('gameMachine').height / 2,
            frameName = 'panel',
            deltaY = 70
        }) {
            container.x = x;
            container.top = y;
            const panelBG = game.add.sprite(1, deltaY, 'panelBG', 'panelBGgreen.png', container);
            const panel = game.add.sprite(40, deltaY, frameName, null, container);

            let convert =game.add.button(80, 150, 'deskButtons', null, null, 'switcher.png', 'switcher.png', null, null, container);
            convert.anchor.set(0.5);
            convert.events.onInputDown.add(() => {
                console.log('i am here');
                balanceController.changeCoinsToCash();
            });

            container.pivot.set(panelBG.width / 2, 0);
            return panelBG;
        },

        AutoContainer: function({
            game = model.el('game'),
            x = model.group('panel').width / 2,
            y = 143
        }) {
            let autoDesktopContainer = game.add.group();
            autoDesktopContainer.x = x;
            autoDesktopContainer.y = y;
            autoDesktopContainer.visible = false;

            model.el('autoDesktopContainer', autoDesktopContainer)
            model.group('autoDesktop', autoDesktopContainer);
            model.group('panel').add(autoDesktopContainer);
        },

        AnimatedSpinButton: function({
            game = model.el('game'),
            x = model.group('panel').width / 2,
            y = 143,
            container = model.group('panel')
        }) {
            let animatedSpinButton = game.add.sprite(x, y, 'deskButtonsAnim', null, container);
            animatedSpinButton.anchor.set(0.5);
            animatedSpinButton.visible = false;
            animatedSpinButton.animations.add(`spinToPanel`, Phaser.Animation.generateFrameNames(`button-1_`, 0, 30, '.png', 1), 120, false);
            animatedSpinButton.animations.add(`panelToStop`, Phaser.Animation.generateFrameNames(`button-2_`, 0, 30, '.png', 1), 120, false);
            animatedSpinButton.animations.add(`stopToSpin`, Phaser.Animation.generateFrameNames(`button-3_`, 0, 30, '.png', 1), 120, false);
            animatedSpinButton.animations.add(`panelToSpin`, Phaser.Animation.generateFrameNames(`button-4_`, 0, 30, '.png', 1), 120, false);
            model.el('animatedSpinButton', animatedSpinButton);
        },

        SpinButton: function({
            game = model.el('game'),
            x = model.group('panel').width / 2,
            y = 143,
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
            x = model.el('spinButtonDesk').x + 120,
            y = 141
        }) {
            let autoButtonDesk = game.add.button(x, y, 'deskButtons', null, null, 'autoOn.png', 'auto.png', 'autoOn.png', null, container);
            autoButtonDesk.anchor.set(0.5);
            model.el('autoButtonDesk', autoButtonDesk);
            return autoButtonDesk;
        },

        MaxBetButton: function({
            game = model.el('game'),
            container = model.group('panel'),
            x = model.el('spinButtonDesk').x - 120,
            y = 141
        }) {
            let maxBetButtonDesk = game.add.button(x, y, 'deskButtons', null, null, 'maxBetOn.png', 'maxBet.png', 'maxBetOn.png', null, container);
            maxBetButtonDesk.anchor.set(0.5);
            model.el('maxBetButtonDesk', maxBetButtonDesk);
            return maxBetButtonDesk;
        },

        StopButton: function({
            game = model.el('game'),
            x = model.group('panel').width / 2,
            y = 143,
            container = model.group('panel')
        }) {
            let stopButtonDesk = game.add.button(x, y, 'deskButtons', null, null, 'stopOn.png', 'stop.png', 'stopOn.png', null, container);
            stopButtonDesk.anchor.set(0.5);
            stopButtonDesk.visible = false;
            model.el('stopButtonDesk', stopButtonDesk);
            return stopButtonDesk;
        },

        PlusButton: function({
            game = model.el('game'),
            container = model.group('panel'),
            x = 423,
            y = 126,
        }) {
            let plusButtonDesk = game.add.button(x, y, 'deskButtons', null, null, 'plusOn.png', 'plus.png', 'plusOn.png', null, container);
            return plusButtonDesk;
        },

        MinusButton: function({
            game = model.el('game'),
            container = model.group('panel'),
            x = 300,
            y = 126
        }) {
            let minusButtonDesk = game.add.button(x, y, 'deskButtons', null, null, 'minusOn.png', 'minus.png', 'minusOn.png', null, container);
            return minusButtonDesk;
        },

        AutoPanel: function({
              game = model.el('game'),
              container = model.group('autoDesktop')
          }) {
                let autoBG10 = this._AutoPanelItem({text: 10, x: -79, y: -47, width: 75, height: 30});
                let autoBG25 = this._AutoPanelItem({text: 25, x: -3, y: -47, width: 80, height: 30});
                let autoBG50 = this._AutoPanelItem({text: 50, x: -79, y: -14, width: 75, height: 30});
                let autoBG100 = this._AutoPanelItem({text: 100, x: -3, y: -14, width: 80, height: 30});
                let autoBG250 = this._AutoPanelItem({text: 250, x: -79, y: 18, width: 75, height: 30});
                let autoBG500 = this._AutoPanelItem({text: 500, x: -3, y: 18, width: 83, height: 30});

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
                x = -80,
                y = -62,
                width = 70,
                height = 37,
                font = 'normal 24px Arial',
                color = '#ffffff',
                shadowColor = '#ffffff'
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
            style = {
                font: '45px Arial, Helvetica',
                align: 'center',
                stroke: '#000000',
                strokeThickness: 2
            },
            amount = 10,
            x = model.el('autoButtonDesk').x - 2,
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

        updateCount: function({
            count = 10
        }) {
            model.el('autoCount').text = count;
        },

        removeCount: function() {
            model.el('autoCount').destroy();
        },

    }

    let show = {
        autoButton: function({
            game = model.el('game'),
            finalX = 365,
            time = 350
        }) {
            let autoButtonDesk = model.el('autoButtonDesk');
            return game.add.tween(autoButtonDesk).to({
                x: finalX
            }, time, 'Linear', true)
        },

        autoPanel: function({
            game = model.el('game'),
            finalX = 495,
            time = 350
        }) {
            let autoDesktopContainer = model.group('autoDesktop');
            return game.add.tween(autoDesktopContainer).to({
                x: finalX
            }, time, 'Linear', true)
        }

    }

    let hide = {
        autoButton: function({
            game = model.el('game'),
            finalX = 523,
            time = 350
        }) {
            let autoButtonDesk = model.el('autoButtonDesk');
            return game.add.tween(autoButtonDesk).to({
                x: finalX
            }, time, 'Linear', true)
        },

        autoPanel: function({
            game = model.el('game'),
            finalX = 650,
            time = 350
        }) {
            let autoDesktopContainer = model.group('autoDesktop');
            return game.add.tween(autoDesktopContainer).to({
                x: finalX + 5
            }, time, 'Linear', true)
        }
    }

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
            coinsLevelPlus.freezeFrames = true
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

    }

    function unlockButtons() {
        if(model.state('autoplay:start')) return;

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
    }

    return {
        draw,
        show,
        hide,
        lockButtons,
        unlockButtons
    };

})();
