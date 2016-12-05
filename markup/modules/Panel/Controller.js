import { model } from 'modules/Model/Model';
import { view } from 'modules/Panel/View';

import { controller as soundController } from 'modules/Sound/Controller';
import { controller as autoplayController } from 'modules/Autoplay/Controller';
import { controller as rollController } from 'modules/Roll/Controller';

export let controller = (() => {

    function drawButtons() {
        let game = model.el('game');

        view.draw.PanelBG({});
        view.draw.LinesNumber({});
        view.draw.AutoContainer({});
        view.draw.AutoPanel({}).forEach((panelButton) => {
            panelButton.inputEnabled = true;
            panelButton.events.onInputDown.add(handle.panelButton, panelButton);
        });

        let spinButtonDesk = view.draw.SpinButton({});
            spinButtonDesk.onInputDown.add(handle.spin);

        let autoButtonDesk = view.draw.AutoButton({});
            autoButtonDesk.onInputDown.add(handle.auto);

        let maxBetButtonDesk = view.draw.MaxBetButton({});
            maxBetButtonDesk.onInputDown.add(handle.maxBet);

        let infoButtonDesk = view.draw.InfoButton({});
            infoButtonDesk.onInputDown.add(handle.info);

        let betLevelPlus = view.draw.PlusButton({});
            betLevelPlus.onInputDown.add(handle.betPlus);
            model.el('betLevelPlus', betLevelPlus);

        let betLevelMinus = view.draw.MinusButton({});
            betLevelMinus.onInputDown.add(handle.betMinus);
            model.el('betLevelMinus', betLevelMinus);

        let coinsLevelPlus = view.draw.PlusButton({x: 1102});
            coinsLevelPlus.onInputDown.add(handle.coinsPlus);
            model.el('coinsLevelPlus', coinsLevelPlus);

        let coinsLevelMinus = view.draw.MinusButton({x: 981});
            coinsLevelMinus.onInputDown.add(handle.coinsMinus);
            model.el('coinsLevelMinus', coinsLevelMinus);

    }

    function drawFsPanel() {
        let game = model.el('game');
        let time = game.rnd.integerInRange(10, 70);

        view.draw.PanelBG({
            x: model.group('main').x,
            deltaY: -20,
            frameName: 'uiFS'
        });
        view.draw.LinesNumber({x: 55, y: 115});
        view.draw.fsCandle({})
            .scale.set(0.7);
        game.time.events.add(time, () => {
            view.draw.fsCandle({x: 878, y: 18});
        });
    }

    const handle = {
        spin: function() {
            if (model.state('buttons:locked')) return;

            soundController.sounds.playSound('buttonClick');
            if (!model.state('autoplay:panelClosed')) {
                model.state('autoplay:panelClosed', true);
                view.hide.autoButton({});
                view.hide.autoPanel({});
            }

            const spinButtonDesk = model.el('spinButtonDesk');
            if (spinButtonDesk.frameName == 'stop.png') {

                autoplayController.stop();
                return;
            }

            rollController.startRoll();
            rollController.fastRoll();
        },

        auto: function() {
            if(model.state('autoplay:start')
            || model.state('roll:progress')
            || model.state('buttons:locked')) return;

            soundController.sounds.playSound('buttonClick');

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

            soundController.sounds.playSound('buttonClick');
            model.changeBet({toMax: true});
        },

        info: function() {
            if(model.state('buttons:locked')
            || model.state('roll:progress')
            || model.state('autoplay:start')) return;

            soundController.sounds.playSound('buttonClick');

            let game = model.el('game');
            let infoRules = view.show.info({});
            let overlay = model.el('overlay');
            let closed = model.el('closed');
            let infoMarkers = model.el('infoMarkers');
            let arrowRight = model.el('arrowRight');
            let arrowLeft = model.el('arrowLeft');
            let counter = 0;

            model.el('infoCounter', counter);
            model.state('infoPanelOpen', true);

            game.input.keyboard.enabled = false;
            overlay.inputEnabled = true;
            overlay.input.priorityID = 2;
            infoRules.inputEnabled = true;
            infoRules.input.priorityID = 3;
            closed.inputEnabled = true;
            closed.input.priorityID = 4;
            arrowRight.inputEnabled = true;
            arrowRight.input.priorityID = 4;
            arrowLeft.inputEnabled = true;
            arrowLeft.input.priorityID = 4;

            overlay.events.onInputDown.add(handle.closeInfo);
            closed.events.onInputDown.add(handle.closeInfo);
            arrowRight.events.onInputDown.add(handle.switchInfoRight);
            arrowLeft.events.onInputDown.add(handle.switchInfoLeft);
        },

        closeInfo: function () {
            let game = model.el('game');
            let counter = 0;

            game.input.keyboard.enabled = true;
            model.group('popup').removeAll();
            model.el('infoCounter', counter);
            model.state('infoPanelOpen', false);
        },

        switchInfoRight: function () {
            let infoRules = model.el('infoRules');
            let counter = model.el('infoCounter');
            let infoMarkers = model.el('infoMarkers');

            infoMarkers.forEach((elem) => {
                elem.frameName = 'marker_off.png';
            });
            if (counter > 6) {
                counter = 0;
            } else {
                counter++;
            }
            model.el('infoCounter', counter);
            infoMarkers[counter].frameName = 'marker_on.png';
            infoRules.frameName = `${counter + 1}_en.png`;
        },

        switchInfoLeft: function () {
            let infoRules = model.el('infoRules');
            let counter = model.el('infoCounter');
            let infoMarkers = model.el('infoMarkers');

            infoMarkers.forEach((elem) => {
                elem.frameName = 'marker_off.png';
            });
            if (counter < 1) {
                counter = 7;
            } else {
                counter--;
                infoMarkers[counter + 1].frameName = 'marker_off.png';
            }
            model.el('infoCounter', counter);
            infoMarkers[counter].frameName = 'marker_on.png';
            infoRules.frameName = `${counter + 1}_en.png`;
        },

        betPlus: function() {
            if (model.state('buttons:locked')
            || model.state('roll:progress')
            || model.state('autoplay:start')) return;
            soundController.sounds.playSound('buttonClick');
            model.changeBet({up: true});
        },

        betMinus: function() {
            if (model.state('buttons:locked')
            || model.state('roll:progress')
            || model.state('autoplay:start')) return;
            soundController.sounds.playSound('buttonClick');
            model.changeBet({down: true});
        },

        coinsPlus: function() {
            if (model.state('buttons:locked')
            || model.state('roll:progress')
            || model.state('autoplay:start')) return;
            soundController.sounds.playSound('buttonClick');
            model.changeCoin({up: true});
        },

        coinsMinus: function() {
            if (model.state('buttons:locked')
            || model.state('roll:progress')
            || model.state('autoplay:start')) return;
            soundController.sounds.playSound('buttonClick');
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
            view.hide.autoButton({});
            view.hide.autoPanel({});
            autoplayController.start(amount);
        }

    };

    let auto = {

        start: function(amount) {
            view.autoStartDesktop();
            freezeButtons();
            view.draw.autoCount({amount});
            handle.auto();
        },

        stop: function() {
            view.autoStopDesktop();
            unfreezeButtons();
            view.draw.removeCount();
        },

        change: function(count) {
            view.draw.updateCount({count});
        }

    };

    function freezeButtons() {

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

    }

    function unfreezeButtons() {
        if(model.state('autoplay:start')) return;

        let infoButtonDesk = model.el('infoButtonDesk');
            infoButtonDesk.frameName = 'info.png';
            infoButtonDesk.freezeFrames = false;
        let maxBetButtonDesk = model.el('maxBetButtonDesk');
            maxBetButtonDesk.frameName = 'maxBetOn.png';
            maxBetButtonDesk.freezeFrames = true;
        let betLevelPlus = model.el('betLevelPlus');
            betLevelPlus.frameName = 'plus.png';
            betLevelPlus.freezeFrames = true;
        let betLevelMinus = model.el('betLevelMinus');
            betLevelMinus.frameName = 'minus.png';
            betLevelMinus.freezeFrames = true;
        let coinsLevelPlus = model.el('coinsLevelPlus');
            coinsLevelPlus.frameName = 'plus.png';
            coinsLevelPlus.freezeFrames = true
        let coinsLevelMinus = model.el('coinsLevelMinus');
            coinsLevelMinus.frameName = 'minus.png';
            coinsLevelMinus.freezeFrames = true;
    }

    return {
        drawButtons,
        drawFsPanel,
        auto,
        handle,
        freezeButtons,
        unfreezeButtons
    };

})();
