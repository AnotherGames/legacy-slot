import { model } from 'modules/Model/Model';

import { controller as rollController } from 'modules/Roll/Controller';
import { controller as panelController } from 'modules/Panel/Controller';
import { controller as buttonsController } from 'modules/Buttons/Controller';

export let controller = (() => {

    function start(amount) {

        model.state('autoplay:start', true);
        model.state('autoplay:end', false);

        model.data('autoplay:count', amount);
        model.data('autoplay:startCash', model.balance('coinCash'));

        // Переводим кнопки в режим автоигры
        if (model.mobile) {
            buttonsController.auto.start();
        } else {
            panelController.auto.start();
        }

        // Начинаем крутку
        next();
    }

    function next() {

        // Проверка тонких настроек автоплея
        checkSettings();

        // Изменить счетчик автоплея
        let autoplayCount = model.data('autoplay:count');
            autoplayCount--;

        // Начать следующую крутку
        if (model.state('autoplay:start')) {
            rollController.startRoll();
        }

        if (autoplayCount > 0) {
            model.data('autoplay:count', autoplayCount);

            // Изменяем счетчик автоплея
            if (model.mobile) {
                buttonsController.auto.change(autoplayCount);
            } else {
                panelController.auto.change(autoplayCount);
            }
        } else {
            // Если счетчик меньше 0 выключаем автоплей
            stop();
        }
    }

    function stop() {

        model.state('autoplay:end', true);
        model.state('autoplay:start', false);

        // Переводим кнопки в нормальный режим
        if (model.mobile) {
            buttonsController.auto.stop();
        } else {
            panelController.auto.stop();
        }
    }

    function checkSettings() {
        // Проверка на увеличение кеша
        if (model.state('autoplay:cashUp')) {
            if (model.balance('coinCash') - model.data('autoplay:startCash') > model.data('autoCashSumDelta')) {
                stop();
                return;
            }
        }

        // Проверка на понижение кеша
        if (model.state('autoplay:cashDown')) {
            if (model.data('autoplay:startCash') - model.balance('coinCash') > model.data('autoCashSumDelta')) {
                stop();
                return;
            }
        }

        // Проверка на максимальный выигрыш за одну крутку
        if (model.state('autoplay:cashRoll')) {
            if (model.balance('winCash') - model.data('autoCashLineDelta') > 0) {
                stop();
                return;
            }
        }
    }

    return {
        start,
        next,
        stop
    };

})();
