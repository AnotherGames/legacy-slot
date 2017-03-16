import { model } from 'modules/Model/Model';
import { config } from 'modules/Util/Config';
import { view } from 'modules/Panel/PanelView';
import { view as mainView } from 'modules/States/Main/MainView';

import Info from '../../../Info/Info';

import { controller as balanceController } from 'modules/Balance/BalanceController';
import { controller as soundController } from 'modules/Sound/SoundController';
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
            desktopCloseButtonMargin: 2,
            desktopBGScale: 1.1,
            desktopTableScale: 1.1
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

        let coinsLevelPlus = view.draw.PlusButton({x: 1112});
        coinsLevelPlus.onInputDown.add(handle.coinsPlus);
        model.el('coinsLevelPlus', coinsLevelPlus);

        let coinsLevelMinus = view.draw.MinusButton({x: 984});
        coinsLevelMinus.onInputDown.add(handle.coinsMinus);
        model.el('coinsLevelMinus', coinsLevelMinus);

        let infoButton = view.draw.InfoButton({x: 1525, y: model.el('game').height - 100});
        infoButton.onInputDown.add(info.open.bind(info));

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
        let container2 = model.group('balanceCash');
        container2.removeAll();
        if (model.desktop) {
            view.hide.dropPaneltoMain({});
            view.show.showPanelMain({});
            drawButtons();
            balanceController.initDesktop();
            model.el('infoButton').visible = true;
        } else {
            let container = model.group('balanceCoin');
            let container3 = model.group('panelFS');
            container.removeAll();
            container3.removeAll();
            balanceController.initMobile();
        }
    }

    function drawFsPanel(index) {
        let game = model.el('game');
        let framePanel;

        switch (+index) {
            case 1:
                framePanel = 'panelGreen.png';
                break;
            case 2:
                framePanel = 'panelRed.png';
                break;
            case 3:
                framePanel = 'panelOrange.png';
                break;
            case 4:
                framePanel = 'panelGreenRed.png';
                break;
            case 5:
                framePanel = 'panelRedOrange.png';
                break;
            case 6:
                framePanel = 'panelGreenOrange.png';
                break;
            case 7:
                framePanel = 'panelGreenRedOrange.png';
                break;
            default:
        }

        let container2 = model.group('balanceCash');
        container2.removeAll();
        if (model.desktop) {
            view.hide.dropPaneltoFS({});

            view.draw.PanelBG({
                frameName: 'panelFS',
                framePanelBG: framePanel,
                container: model.group('panelFS'),
                deltaX: 0
            });

            view.show.showPanelFS({});
            balanceController.initFSDesktop();
            model.el('infoButton').visible = false;
        } else {
            let container = model.group('balanceCoin');
            container.removeAll();
            balanceController.initFSMobile();
        }

        view.draw.FsLevelAndMulti({});
        view.draw.changeLevelAndMulti({});

    }

    return {
        drawButtons,
        drawFsPanel,
        drawMainPanel,
        auto,
        handle
    };

})();
