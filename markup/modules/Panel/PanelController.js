import { model } from 'modules/Model/Model';
import { view } from 'modules/Panel/PanelView';
import { events } from 'modules/Util/Events';
import { sound } from 'modules/Sound/Sound';

export let controller = (() => {

    function init() {
        let game = model.el('game');

        view.draw.PanelBG({});
        view.draw.LinesNumber({});
        view.draw.AutoContainer({});
        view.draw.AutoPanel({}).forEach((panelButton) => {
            panelButton.inputEnabled = true;
            panelButton.events.onInputDown.add(handle.panelButton, panelButton);
        });

        let spinButtonDesk = view.draw.SpinButton({});
            spinButtonDesk.input.priorityID = 1; // проанализировать зачем здесь приоритет
            spinButtonDesk.onInputDown.add(handle.spin);

        model.state('autoClosed', true); // состояние для кнопки авто, закрыта по умолчанию
        let autoButtonDesk = view.draw.AutoButton({});
            autoButtonDesk.onInputDown.add(handle.auto);

        let maxBetButtonDesk = view.draw.MaxBetButton({});
            maxBetButtonDesk.onInputDown.add(handle.maxBet);

        let infoButtonDesk = view.draw.InfoButton({});
            infoButtonDesk.onInputDown.add(handle.info);

        let betLevelPlus = view.draw.PlusButton({});
            model.el('betLevelPlus', betLevelPlus);
            betLevelPlus.onInputDown.add(handle.betPlus);

        let betLevelMinus = view.draw.MinusButton({});
            model.el('betLevelMinus', betLevelMinus);
            betLevelMinus.onInputDown.add(handle.betMinus);

        let coinsLevelPlus = view.draw.PlusButton({x: 1100});
            model.el('coinsLevelPlus', coinsLevelPlus);
            coinsLevelPlus.onInputDown.add(handle.coinsPlus);

        let coinsLevelMinus = view.draw.MinusButton({x: 985});
            model.el('coinsLevelMinus', coinsLevelMinus);
            coinsLevelMinus.onInputDown.add(handle.coinsMinus);

    }

    function initFS() {
        let game = model.el('game');
        view.draw.PanelBG({x: model.group('main').x + 38, frameName: 'uiFS'});
        view.draw.LinesNumber({x: 55, y: 115});

        let infoButtonDesk = view.draw.InfoButton({x: 42, y: 27});
            infoButtonDesk.onInputDown.add(handle.info);

        let candle1 = view.draw.fsCandle({});
        candle1.scale.set(0.7);
        let time = game.rnd.integerInRange(10, 70);
        setTimeout(() => {
            let candle2 = view.draw.fsCandle({x: 878, y: 18});
        }, time);
    }

    const handle = {
        spin: function() {
            if (model.state('lockedButtons')) return;
            sound.sounds.button.play();
            if (!model.state('autoClosed')) {
                model.state('autoClosed', true);
                view.hide.autoButton({});
                view.hide.autoPanel({});
            }
            const spinButtonDesk = model.el('spinButtonDesk');
            if (spinButtonDesk.frameName == 'stop.png') {
                events.trigger('autoplay:stop');
                return;
            }
            events.trigger('roll:request');
            events.trigger('roll:fast');
        },

        auto: function() {
            if (!model.state('autoEnd') || model.state('roll:progress')) return;
            const autoButtonDesk = model.el('autoButtonDesk');
            sound.sounds.button.play();
            if (model.state('autoClosed')) {
                model.state('autoClosed', false);
                view.show.autoButton({});
                view.show.autoPanel({});
            } else {
                model.state('autoClosed', true);
                view.hide.autoButton({});
                view.hide.autoPanel({});
            }
        },

        maxBet: function() {
            if (model.state('autoEnd') == false) return;
            sound.sounds.button.play();
            model.changeBet({toMax: true});
        },

        info: function() {
            sound.sounds.button.play();
            let infoRules = view.show.info({});
            let overlay = model.el('overlay');
            let closed = model.el('closed');
            let arrowRight = model.el('arrowRight');
            let arrowLeft = model.el('arrowLeft');
            let infoMarkers = model.el('infoMarkers');
            let counter = 0;
            overlay.inputEnabled = true;
            overlay.input.priorityID = 2;
            closed.inputEnabled = true;
            closed.input.priorityID = 3;
            arrowRight.inputEnabled = true;
            arrowRight.input.priorityID = 3;
            arrowLeft.inputEnabled = true;
            arrowLeft.input.priorityID = 3;

            overlay.events.onInputDown.add(() => {
                model.group('popup').removeAll();
                counter = 0;
            });
            closed.events.onInputDown.add(() => {
                model.group('popup').removeAll();
                counter = 0;
            });
            arrowRight.events.onInputDown.add(() => {
                if (counter > 5) {
                    return;
                }
                counter++;
                infoRules.frameName = counter + 1 + '_en.png';
                infoMarkers[counter].frameName = 'marker_on.png';
            });
            arrowLeft.events.onInputDown.add(() => {
                if (counter < 1) {
                    return;
                }
                counter--;
                infoRules.frameName = counter + 1 + '_en.png';
                infoMarkers[counter + 1].frameName = 'marker_off.png';
            });
        },

        betPlus: function() {
            sound.sounds.button.play();
            model.changeBet({up: true});
        },

        betMinus: function() {
            sound.sounds.button.play();
            model.changeBet({down: true});
        },

        coinsPlus: function() {
            sound.sounds.button.play();
            model.changeCoin({up: true});
        },

        coinsMinus: function() {
            sound.sounds.button.play();
            model.changeCoin({down: true});
        },

        panelButton: function() {
            if (!model.state('autoEnd') || model.state('roll:progress')) return;
            const amount = this.amount;
            events.trigger('autoplay:init', amount);
        }

    }

    function autoStart(amount) {
        if (model.state('mobile')) return;
        view.autoStartDesktop();
        view.draw.autoCount({amount});
        handle.auto();
    }

    function autoStop() {
        if (model.state('mobile')) return;
        view.autoStopDesktop();
        view.draw.removeCount();
    }

    function autoChangeCount(count) {
        if (model.state('mobile')) return;
        view.draw.updateCount({count});
    }

    events.on('autoplay:init', autoStart);
    events.on('autoplay:stop', autoStop);
    events.on('autoplay:count', autoChangeCount);

    return {
        init,
        autoStart,
        autoStop,
        initFS,
        handle
    };

})();
