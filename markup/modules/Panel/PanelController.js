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
        view.draw.PanelBG({x: model.group('main').x + 38, frameName: 'uiFS'});
        view.draw.LinesNumber({x: 55, y: 115});

        let infoButtonDesk = view.draw.InfoButton({x: 42, y: 27});
            infoButtonDesk.onInputDown.add(handle.info);

        let candle1 = view.draw.fsCandle({});
        candle1.scale.set(0.7);
        let candle2 = view.draw.fsCandle({x: 878, y: 18});
    }

    const handle = {
        spin: function() {
            sound.sounds.button.play();
            const spinButtonDesk = model.el('spinButtonDesk');
            if (spinButtonDesk.frameName == 'stop.png') {
                events.trigger('autoplay:stop');
                return;
            }
            events.trigger('roll:request');
        },

        auto: function() {
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
                infoRules.inputEnabled = true;
                infoRules.input.priorityID = 2;
                infoRules.events.onInputDown.add(() => {
                    let overlay = model.el('overlay');
                    overlay.destroy();
                    infoRules.destroy();
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
            const amount = this.amount;
            events.trigger('autoplay:init', amount);
        }

    }

    function autoStart(amount) {
        view.autoStartDesktop();
        view.draw.autoCount({amount});
        handle.auto();
    }

    function autoStop() {
        view.autoStopDesktop();
        view.draw.removeCount();
    }

    function autoChangeCount(count) {
        view.draw.updateCount({count});
    }

    events.on('autoplay:init', autoStart);
    events.on('autoplay:stop', autoStop);
    events.on('autoplay:count', autoChangeCount);

    return {
        init,
        autoStart,
        autoStop,
        initFS
    };

})();
