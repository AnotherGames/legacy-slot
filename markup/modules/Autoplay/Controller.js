import { model } from 'modules/Model/Model';
import { events } from 'modules/Util/Events';

import { controller as rollController } from 'modules/Roll/Controller';
import { controller as panelController } from 'modules/Panel/Controller';
import { controller as buttonsController } from 'modules/Buttons/Controller';

export let controller = (() => {

    function init(amount) {
        model.state('autoEnd', false);
        model.data('autoCount', amount);
        model.data('autoCashSumStart', model.balance('coinCash'));

        if (model.state('mobile')) {
            buttonsController.auto.start();
        } else {
            panelController.auto.start();
        }

        start();
    }



    function start() {

        if (model.state('autoCashUp')) {
            if (model.balance('coinCash') - model.data('autoCashSumStart') > model.data('autoCashSumDelta')) {
                stop();
                return;
            }
        }

        if (model.state('autoCashDown')) {
            if (model.data('autoCashSumStart') - model.balance('coinCash') > model.data('autoCashSumDelta')) {
                stop();
                return;
            }
        }

        if (model.state('autoCashLine')) {
            if (model.balance('winCash') - model.data('autoCashLineDelta') > 0) {
                stop();
                return;
            }
        }

        let autoCount = model.data('autoCount');
            autoCount--;

        if (!model.state('autoEnd')) {
            rollController.startRoll();
        }

        if (autoCount > 0) {
            model.data('autoCount', autoCount); // Проверить нужность

            if (model.state('mobile')) {
                buttonsController.auto.change(autoCount);
            } else {
                panelController.auto.change(autoCount);
            }
        } else {
            stop();
        }
    }

    function stop() {
        console.log('I am stoping autoplay!');
        model.state('autoEnd', true);

        if (model.state('mobile')) {
            buttonsController.auto.stop();
        } else {
            panelController.auto.stop();
        }
    }

    return {
        init,
        start,
        stop
    };

})();
