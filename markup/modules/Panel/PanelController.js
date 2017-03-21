import { model } from 'modules/Model/Model';
import { config } from 'modules/Util/Config';
import { view } from 'modules/Panel/PanelView';
import { view as mainView } from 'modules/States/Main/MainView';

import Info from '../../../Info/Info';

import { controller as soundController } from '../../../Info/SoundController';
import { controller as autoplayController } from 'modules/Autoplay/AutoplayController';
import { controller as rollController } from 'modules/Roll/RollController';

export let controller = (() => {

    function drawButtons() {
        let game = model.el('game');
        view.draw.PanelBG({});
        view.draw.LinesNumber({});
        view.draw.AutoContainer({});

        let info = new Info({ model });

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

        let infoButtonDesk = view.draw.InfoButton({});
            infoButtonDesk.onInputDown.add(info.open.bind(info));

        let betLevelPlus = view.draw.PlusButton({});
            betLevelPlus.onInputDown.add(handle.betPlus);
            model.el('betLevelPlus', betLevelPlus);

        let betLevelMinus = view.draw.MinusButton({});
            betLevelMinus.onInputDown.add(handle.betMinus);
            model.el('betLevelMinus', betLevelMinus);

        let coinsLevelPlus = view.draw.PlusButton({x: 1110});
            coinsLevelPlus.onInputDown.add(handle.coinsPlus);
            model.el('coinsLevelPlus', coinsLevelPlus);

        let coinsLevelMinus = view.draw.MinusButton({x: 985});
            coinsLevelMinus.onInputDown.add(handle.coinsMinus);
            model.el('coinsLevelMinus', coinsLevelMinus);

    }

    function drawFsPanel() {
        let game = model.el('game');
        let time = game.rnd.integerInRange(10, 70);

        view.draw.PanelBG({
            x: model.group('main').x,
            deltaY: -35,
            frameName: 'uiFS'
        });
        view.draw.LinesNumber({x: 55, y: 85});

    }

    const handle = {
        spin: function() {
            if (model.state('buttons:locked')) return;

            soundController.sound.playSound({sound : 'buttonClick'});
            if (!model.state('autoplay:panelClosed')) {
                model.state('autoplay:panelClosed', true);
                view.hide.autoButton({});
                view.hide.autoPanel({});
            }

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
            autoplayController.stop();
        },

        auto: function() {
            if(model.state('autoplay:start')
            || model.state('roll:progress')
            || model.state('buttons:locked')) return;
            soundController.sound.playSound({sound : 'buttonClick'});

            if (model.state('autoplay:panelClosed') && !model.data('remainAutoCount')) {
                model.state('autoplay:panelClosed', false);
                view.show.autoButton({});
                view.show.autoPanel({});
            } else {
                model.state('autoplay:panelClosed', true);
                view.hide.autoButton({});
                view.hide.autoPanel({});
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
            // Если у нас автоплей или идет крутка, то не должна работать
            // При нажатии должна закрыть панель
            //365 конечный икс кнопки автоплея при открытии, 370 взят с запасом
            if (model.state('autoplay:start')
            || model.state('roll:progress')) return;

            let autoButtonDesk = model.el('autoButtonDesk');
            const amount = this.amount;
            if (autoButtonDesk.x > 370) return;
            model.state('autoplay:panelClosed', true);
            view.hide.autoButton({});
            view.hide.autoPanel({});
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
                autoButtonDesk.frameName = 'autoOn.png';
                autoButtonDesk.freezeFrames = true
            let stopButtonDesk = model.el('stopButtonDesk');
                stopButtonDesk.frameName = 'stopOn.png';
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
