import { model } from 'modules/Model/Model';
import { view } from 'modules/Panel/PanelView';
import { events } from 'modules/Util/Events';
import { sound } from 'modules/Sound/Sound';

export let controller = (() => {

    function init() {

        view.drawPanelBG({});

        let game = model.el('game');
        let autoDesktopContainer = game.add.group();
        model.group('panel').add(autoDesktopContainer);
        autoDesktopContainer.x = 650;
        autoDesktopContainer.y = 95;
        autoDesktopContainer.alpha = 0;
        model.group('autoDesktop', autoDesktopContainer);

        view.drawLinesNumber({});
        view.drawAutoPanel({});

        let spinButtonDesk = view.drawSpinButton({});
            spinButtonDesk.input.priorityID = 1; // проанализировать зачем здесь приоритет
            spinButtonDesk.onInputDown.add(handleSpin);

        model.state('autoClosed', true); // состояние для кнопки авто, закрыта по умолчанию
        let autoButtonDesk = view.drawAutoButton({});
            autoButtonDesk.onInputDown.add(handleAuto);

        let maxBetButtonDesk = view.drawMaxBetButton({});
            maxBetButtonDesk.onInputDown.add(handleMaxBet);

        let infoButtonDesk = view.drawInfoButton({});
            infoButtonDesk.onInputDown.add(handleInfo);

        let betLevelPlus = view.drawPlusButton({});
            betLevelPlus.onInputDown.add(handleBetPlus);

        let betLevelMinus = view.drawMinusButton({});
            betLevelMinus.onInputDown.add(handleBetMinus);

        let coinsLevelPlus = view.drawPlusButton({x: 1100});
            coinsLevelPlus.onInputDown.add(handleCoinsPlus);

        let coinsLevelMinus = view.drawMinusButton({x: 985});
            coinsLevelMinus.onInputDown.add(handleCoinsMinus);

    }

    function handleSpin() {
        const spinButtonDesk = model.el('spinButtonDesk');
        sound.sounds.button.play();
        if (spinButtonDesk.frameName == 'stop.png') {
            events.trigger('autoplay:stop:desktop');
            return;
        }
        sound.sounds.button.play();
        events.trigger('roll:request', {
            // TODO: для обычних круток используй параметры конфига.
            // time: 1500,
            // length: 30,
            // ease: 1
        });
    }

    function handleAuto() {
        const autoButtonDesk = model.el('autoButtonDesk');
        sound.sounds.button.play();
        if (model.state('autoClosed')) {
            model.state('autoClosed', false);
            view.autoButtonOpen({});
            view.autoPanelOpen({});
        } else {
            model.state('autoClosed', true);
            view.autoButtonClose({});
            view.autoPanelClose({});
        }
    }

    function handleMaxBet() {
        if (model.state('autoEnd') == false) return;
        sound.sounds.button.play();
        events.trigger('buttons:maxBet');
    }

    function handleInfo() {
        sound.sounds.button.play();
        let infoRules = view.showInfo({});
            infoRules.inputEnabled = true;
            infoRules.input.priorityID = 2;
            infoRules.events.onInputDown.add(() => {
                let overlay = model.el('overlay');
                overlay.destroy();
                infoRules.destroy();
            });
    }

    function handleBetPlus() {
        sound.sounds.button.play();
        events.trigger('buttons:changeBet', true);
    }

    function handleBetMinus() {
        sound.sounds.button.play();
        events.trigger('buttons:changeBet', false);
    }

    function handleCoinsPlus() {
        sound.sounds.button.play();
        events.trigger('buttons:changeCoins', true);
    }

    function handleCoinsMinus() {
        sound.sounds.button.play();
        events.trigger('buttons:changeCoins', false);
    }

    // events.on('autoplay:init:desktop', handleAuto); // ивент для запуска автоплея, автоматически закрывает панель

    return {
        init
    };

})();
