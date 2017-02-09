import { model } from 'modules/Model/Model';
import { config } from 'modules/Util/Config';
import { view } from 'modules/Panel/PanelView';
import { view as mainView } from 'modules/States/Main/MainView';

import { controller as soundController } from 'modules/Sound/SoundController';
import { controller as autoplayController } from 'modules/Autoplay/AutoplayController';
import { controller as rollController } from 'modules/Roll/RollController';

export let controller = (() => {

    function drawButtons() {
        let game = model.el('game');
        view.draw.PanelBG({});
        view.draw.AnimatedSpinButton({});
            view.draw.AutoContainer({});
            view.draw.AutoPanel({}).forEach((panelButton) => {
                panelButton.inputEnabled = true;
                panelButton.events.onInputUp.add(handle.panelButton, panelButton);
                panelButton.events.onInputOver.add(()=>{
                    panelButton.events.onInputUp.active = true;
                }, panelButton);
                panelButton.events.onInputOut.add(()=>{
                    panelButton.events.onInputUp.active = false;
                }, panelButton);
            });

        let spinButtonDesk = view.draw.SpinButton({});
        spinButtonDesk.events.onInputUp.add(handle.spin);
        spinButtonDesk.events.onInputOver.add(()=>{
            spinButtonDesk.events.onInputUp.active = true;
        });
        spinButtonDesk.events.onInputOut.add(()=>{
            spinButtonDesk.events.onInputUp.active = false;
        });

        let stopButtonDesk = view.draw.StopButton({});
            stopButtonDesk.onInputDown.add(handle.stop);

        let autoButtonDesk = view.draw.AutoButton({});
            autoButtonDesk.onInputDown.add(handle.auto);

        let maxBetButtonDesk = view.draw.MaxBetButton({});
            maxBetButtonDesk.onInputDown.add(handle.maxBet);

        // let infoButtonDesk = view.draw.InfoButton({});
        //     infoButtonDesk.onInputDown.add(handle.info);

        let betLevelPlus = view.draw.PlusButton({});
            betLevelPlus.onInputDown.add(handle.betPlus);
            model.el('betLevelPlus', betLevelPlus);

        let betLevelMinus = view.draw.MinusButton({});
            betLevelMinus.onInputDown.add(handle.betMinus);
            model.el('betLevelMinus', betLevelMinus);

        let coinsLevelPlus = view.draw.PlusButton({x: 1215});
            coinsLevelPlus.onInputDown.add(handle.coinsPlus);
            model.el('coinsLevelPlus', coinsLevelPlus);

        let coinsLevelMinus = view.draw.MinusButton({x: 995});
            coinsLevelMinus.onInputDown.add(handle.coinsMinus);
            model.el('coinsLevelMinus', coinsLevelMinus);

    }

    function drawFsPanel() {
        let game = model.el('game');
        let time = game.rnd.integerInRange(10, 70);

        view.draw.PanelBG({
            frameName: 'panelFS'
        });
        // view.draw.LinesNumber({x: 55, y: 85});

    }

    const handle = {
        spin: function() {
            if (!model.checkBalance()) {
                mainView.draw.showPopup({message: 'You have low balance on your account', balance : true});
                return;
            }
            if (model.state('buttons:locked')) return;

            let game = model.el('game');
            game.input.keyboard.enabled = false;
            view.lockButtons();
            rollController.startRoll();
            rollController.fastRoll();
        },

        stop: function() {
            if (model.state('buttons:locked')) return;

            soundController.sound.playSound({sound : 'buttonClick'});
            model.state('autoplay:panelClosed', true);
            let animatedSpinButton = model.el('animatedSpinButton');
            let spinButton = model.el('spinButtonDesk');
            let stopButton = model.el('stopButtonDesk');

            model.state('spinInAnim', true);
                stopButton.visible = false;
                animatedSpinButton.visible = true;
                animatedSpinButton.animations.play('stopToSpin')
                    .onComplete.add(()=>{
                        model.state('spinInAnim', false);
                        animatedSpinButton.visible = false;
                        spinButton.visible = true;
                    });

                autoplayController.stop();
        },

        auto: function() {
            if(model.state('autoplay:start')
            || model.state('roll:progress')
            || model.state('buttons:locked')
            || model.state('spinInAnim')) return;
            soundController.sound.playSound({sound : 'buttonClick'});
            let animatedSpinButton = model.el('animatedSpinButton');
            let spinButton = model.el('spinButtonDesk');
            let autoDesktopContainer = model.el('autoDesktopContainer');

            if (model.state('autoplay:panelClosed') && !model.data('remainAutoCount')) {
                model.state('autoplay:panelClosed', false);
                model.state('spinInAnim', true);
                animatedSpinButton.visible = true;
                spinButton.visible = false;
                animatedSpinButton.animations.play('spinToPanel')
                    .onComplete.add(()=>{
                        model.state('spinInAnim', false);
                        autoDesktopContainer.visible = true;
                        animatedSpinButton.frameName = 'button-2_4.png';
                    });
            } else {
                model.state('autoplay:panelClosed', true);
                model.state('spinInAnim', true);
                autoDesktopContainer.visible = false;
                animatedSpinButton.animations.play('panelToSpin')
                    .onComplete.add(()=>{
                        model.state('spinInAnim', false);
                        spinButton.visible = true;
                        animatedSpinButton.visible = false;
                    });
            }
        },

        maxBet: function() {
            if (model.state('buttons:locked')
            || model.state('roll:progress')
            || model.state('autoplay:start')) return;

            soundController.sound.playSound({sound : 'buttonClick'});
            model.changeBet({toMax: true});
        },

        betPlus: function() {
            if (model.state('buttons:locked')
            || model.state('roll:progress')
            || model.state('autoplay:start')) return;
            soundController.sound.playSound({sound : 'buttonClick'});
            model.changeBet({up: true});
        },

        betMinus: function() {
            if (model.state('buttons:locked')
            || model.state('roll:progress')
            || model.state('autoplay:start')) return;
            soundController.sound.playSound({sound : 'buttonClick'});
            model.changeBet({down: true});
        },

        coinsPlus: function() {
            if (model.state('buttons:locked')
            || model.state('roll:progress')
            || model.state('autoplay:start')) return;
            soundController.sound.playSound({sound : 'buttonClick'});
            model.changeCoin({up: true});
        },

        coinsMinus: function() {
            if (model.state('buttons:locked')
            || model.state('roll:progress')
            || model.state('autoplay:start')) return;
            soundController.sound.playSound({sound : 'buttonClick'});
            model.changeCoin({down: true});
        },

        panelButton: function() {
            if (!model.checkBalance()) {
                mainView.draw.showPopup({
                    message: 'You have low balance on your account',
                    balance: true
                });
                return;
            }
            // Если у нас автоплей или идет крутка, то не должна работать
            // При нажатии должна закрыть панель

            if (model.state('autoplay:start') ||
                model.state('roll:progress')) return;

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
                    animatedSpinButton.visible = false
                    stopButtonDesk.visible = true
                })

            autoplayController.start(amount);
        }

    };

    let auto = {

        start: function(amount) {
                let game = model.el('game');
                view.lockButtons();
                game.input.keyboard.enabled = false;
                view.draw.autoCount({amount});
                handle.auto();
            },

        stop: function() {
            let game = model.el('game');
            let autoButtonDesk = model.el('autoButtonDesk');
                autoButtonDesk.frameName = 'auto.png';
                autoButtonDesk.freezeFrames = true
            let stopButtonDesk = model.el('stopButtonDesk');
                stopButtonDesk.frameName = 'stop.png';
                stopButtonDesk.freezeFrames = true

                if(model.state('ready')){
                    game.input.keyboard.enabled = true;
                    view.unlockButtons();
                }

                view.draw.removeCount();
        },

        change: function(count) {
            view.draw.updateCount({count});
        }

    };

    return {
        drawButtons,
        drawFsPanel,
        auto,
        handle
    };

})();
