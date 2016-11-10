import { model } from 'modules/Model/Model';
import { events } from 'modules/Util/Events';
import { view } from 'modules/Balance/BalanceView';

export let controller = (() => {

    function initMobile() {
        view.drawCashBalance({});
        view.drawCoinBalance({});
    }

    function initDesktop() {
        view.drawCashBalance({});
    }

    function initFS() {
        view.drawCashBalance({});
    }

    function updateBalance() {
        if (model.state('mobile')) {
            view.updateCashBalance({});
            view.updateCoinBalance({});
        } else {
            view.updateCashBalance({});
            // Добавить обновление десктопного баланса
        }
    }

    events.on('model:balance:update', updateBalance);

    return {
        initMobile,
        initDesktop,
        initFS
    };

})();
