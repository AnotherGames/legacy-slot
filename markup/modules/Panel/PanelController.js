import { model } from 'modules/Model/Model';
import { config } from 'modules/Util/Config';
import { view } from 'modules/Panel/PanelView';
import { view as mainView } from 'modules/States/Main/MainView';

import Info from '../../../Info/Info';

import { controller as balanceController } from 'modules/Balance/BalanceController';
import { controller as soundController } from '../../../Info/SoundController';
import { controller as autoplayController } from 'modules/Autoplay/AutoplayController';
import { controller as rollController } from 'modules/Roll/RollController';

export let controller = (() => {

    let info;

    const handle = {
        spin: function () {
            if (!model.checkBalance()) {
                mainView.draw.showPopup({message: 'You have low balance on your account', balance: true});
                return;
            }

            if (model.state('buttons:locked')) {
                return;
            }

            let game = model.el('game');
            game.input.keyboard.enabled = false;
            view.lockButtons();
            let lever = model.el('lever');
            lever.setAnimationByName(0, 'win', false);
            lever.addAnimationByName(0, 'idle', true);

            rollController.startRoll();
            rollController.fastRoll();
        },

        stop: function () {

	        if (model.state('buttons:locked')) {
                return;
            }

            soundController.sound.playSound({sound: 'buttonClick'});
            model.state('autoplay:panelClosed', true);
            let animatedSpinButton = model.el('animatedSpinButton');
            let spinButton = model.el('spinButtonDesk');
            let stopButton = model.el('stopButtonDesk');

            model.state('spinInAnim', true);
            stopButton.visible = false;
            animatedSpinButton.visible = true;
            animatedSpinButton.animations.play('stopToSpin')
                .onComplete.add(() => {
                    model.state('spinInAnim', false);
                    animatedSpinButton.visible = false;
                    spinButton.visible = true;
                });

            autoplayController.stop();
        },

        auto: function () {
            if (model.state('autoplay:start')
            || model.state('roll:progress')
            || model.state('buttons:locked')
            || model.state('spinInAnim')) {
                return;
            }
            soundController.sound.playSound({sound: 'buttonClick'});
            let animatedSpinButton = model.el('animatedSpinButton');
            let spinButton = model.el('spinButtonDesk');
            let autoDesktopContainer = model.el('autoDesktopContainer');

            if (model.state('autoplay:panelClosed') && !model.data('remainAutoCount')) {
                model.state('autoplay:panelClosed', false);
                model.state('spinInAnim', true);
                animatedSpinButton.visible = true;
                spinButton.visible = false;
                animatedSpinButton.animations.play('spinToPanel')
                    .onComplete.add(() => {
                        model.state('spinInAnim', false);
                        autoDesktopContainer.visible = true;
                        animatedSpinButton.frameName = 'button-1_30.png';
                    });
            } else {
                model.state('autoplay:panelClosed', true);
                model.state('spinInAnim', true);
                autoDesktopContainer.visible = false;
                animatedSpinButton.animations.play('panelToSpin')
                    .onComplete.add(() => {
                        model.state('spinInAnim', false);
                        spinButton.visible = true;
                        animatedSpinButton.visible = false;
                    });
            }
        },

        maxBet: function () {
            if (model.state('buttons:locked')
            || model.state('roll:progress')
            || model.state('autoplay:start')) {
                return;
            }

            soundController.sound.playSound({sound: 'buttonClick'});
            model.changeBet({toMax: true});
        },

        betPlus: function () {
            if (model.state('buttons:locked')
            || model.state('roll:progress')
            || model.state('autoplay:start')) {
                return;
            }
            soundController.sound.playSound({sound: 'buttonClick'});
            model.changeBet({up: true});
        },

        betMinus: function () {
            if (model.state('buttons:locked')
            || model.state('roll:progress')
            || model.state('autoplay:start')) {
                return;
            }
            soundController.sound.playSound({sound: 'buttonClick'});
            model.changeBet({down: true});
        },

        coinsPlus: function () {
            if (model.state('buttons:locked')
            || model.state('roll:progress')
            || model.state('autoplay:start')) {
                return;
            }
            soundController.sound.playSound({sound: 'buttonClick'});
            model.changeCoin({up: true});
        },

        coinsMinus: function () {
            if (model.state('buttons:locked')
            || model.state('roll:progress')
            || model.state('autoplay:start')) {
                return;
            }
            soundController.sound.playSound({sound: 'buttonClick'});
            model.changeCoin({down: true});
        },

        panelButton: function () {
            if (!model.checkBalance()) {
                mainView.draw.showPopup({
                    message: 'You have low balance on your account',
                    balance: true
                });
                return;
            }
            // Если у нас автоплей или идет крутка, то не должна работать
            // При нажатии должна закрыть панель

            if (model.state('autoplay:start')
            || model.state('roll:progress')) {
                return;
            }

            let stopButtonDesk = model.el('stopButtonDesk');
            let animatedSpinButton = model.el('animatedSpinButton');
            let autoDesktopContainer = model.el('autoDesktopContainer');
            const amount = this.amount;
            this.alpha = 0;

            model.state('spinInAnim', true);
            autoDesktopContainer.visible = false;
            animatedSpinButton.animations.play('panelToStop')
                .onComplete.add(() => {
                    model.state('spinInAnim', false);
                    animatedSpinButton.visible = false;
                    stopButtonDesk.visible = true;
                });

            autoplayController.start(amount);
        }
    };

    let auto = {

        start: function (amount) {
            let game = model.el('game');
            view.lockButtons();
            game.input.keyboard.enabled = false;
            view.draw.autoCount({amount});
            handle.auto();
        },

        stop: function () {
            let game = model.el('game');
            let autoButtonDesk = model.el('autoButtonDesk');
            autoButtonDesk.frameName = 'auto.png';
            autoButtonDesk.freezeFrames = true;

            if (model.state('ready')) {
                game.input.keyboard.enabled = true;
                view.unlockButtons();
            }

            view.draw.removeCount();
        },

        change: function (count) {
            view.draw.updateCount({count});
        }

    };

    function drawButtons() {
        let game = model.el('game');
        view.draw.PanelBG({});
        view.draw.LinesNumber({});

        info = new Info({
            model,
            desktopCloseButtonMargin: 1,
            desktopBGScale: 1.0,
            desktopTableScale: 1.5
            ,
            controlsDeltaY: 10,
            hover: true
        });

        let spinButtonDesk = view.draw.SpinButton({});
        spinButtonDesk.events.onInputUp.add(handle.spin);
        spinButtonDesk.events.onInputOver.add(() => {
            spinButtonDesk.events.onInputUp.active = true;
        });
        spinButtonDesk.events.onInputOut.add(() => {
            spinButtonDesk.events.onInputUp.active = false;
        });

        let stopButtonDesk = view.draw.StopButton({});
        stopButtonDesk.onInputDown.add(handle.stop);

        let autoButtonDesk = view.draw.AutoButton({});
        autoButtonDesk.onInputDown.add(handle.auto);

        let maxBetButtonDesk = view.draw.MaxBetButton({});
        maxBetButtonDesk.onInputDown.add(handle.maxBet);

        let betLevelPlus = view.draw.PlusButton({});
        betLevelPlus.onInputDown.add(handle.betPlus);
        model.el('betLevelPlus', betLevelPlus);

        let betLevelMinus = view.draw.MinusButton({});
        betLevelMinus.onInputDown.add(handle.betMinus);
        model.el('betLevelMinus', betLevelMinus);

        let coinsLevelPlus = view.draw.PlusButton({x: 998, y: 75});
        coinsLevelPlus.onInputDown.add(handle.coinsPlus);
        model.el('coinsLevelPlus', coinsLevelPlus);

        let coinsLevelMinus = view.draw.MinusButton({x: 860, y: 75});
        coinsLevelMinus.onInputDown.add(handle.coinsMinus);
        model.el('coinsLevelMinus', coinsLevelMinus);

        let infoButton = view.draw.InfoButton({x: 1540, y: model.el('game').height - 120});
        infoButton.onInputDown.add(info.open.bind(info));

        view.draw.LinesNumber({});
        view.draw.AnimatedSpinButton({});
        view.draw.AutoContainer({});
        view.draw.AutoPanel({}).forEach((panelButton) => {
            panelButton.inputEnabled = true;
            panelButton.events.onInputUp.add(handle.panelButton, panelButton);
            panelButton.events.onInputOver.add(() => {
                panelButton.events.onInputUp.active = true;
            }, panelButton);
            panelButton.events.onInputOut.add(() => {
                panelButton.events.onInputUp.active = false;
            }, panelButton);
        });
    }

    function drawMainPanel() {
        model.group('balanceCash').removeAll();
        if (model.desktop) {
            view.hide.hidePanel({container: model.group('panelFS')});
            drawButtons();
            view.show.showPanel({container: model.group('panel')});
            balanceController.initDesktop();
            model.el('infoButton').visible = true;
            model.el('convertSign').visible = true;

        } else {
            model.group('balanceCoin').removeAll();
            model.group('panelFS').removeAll();
            balanceController.initMobile();
        }
    }

    function drawFsPanel() {
        let game = model.el('game');

        let container = model.group('panelFS');
        model.group('balanceCash').removeAll();
        if (model.desktop) {
            container.alpha = 0;
            container.scale.set(0.01);
            view.hide.hidePanel({container: model.group('panel')});

            view.draw.PanelBG({
                frameName: 'panelFS',
                container: model.group('panelFS')
            });
            view.show.showPanel({container: model.group('panelFS')});

            balanceController.initFSDesktop();
            model.el('infoButton').visible = false;
            model.el('convertSign').visible = false;
        } else {
            model.group('balanceCoin').removeAll();
            balanceController.initFSMobile();
        }

        view.draw.FsLevelAndMulti({});

    }

    return {
        drawButtons,
        drawFsPanel,
        drawMainPanel,
        auto,
        handle
    };

})();
