import { model } from 'modules/Model/Model';
import { events } from 'modules/Util/Events';
import { view } from 'modules/Balance/BalanceView';

export let controller = (() => {

    function initMobile() {
        view.draw.CashBalance({});
        view.draw.CoinBalance({});
    }

    function initDesktop() {
        view.draw.CashBalance({});
        view.draw.DesktopBalance({});
    }

    function initFS() {
        view.draw.CashBalance({});
    }

    function updateBalance() {
        if (model.state('mobile')) {
            view.update.CashBalance({});
            view.update.CoinBalance({});
        } else {
            view.update.CashBalance({});
            view.update.DesktopBalance({});
        }
    }

    events.on('model:balance:update', updateBalance);

    return {
        initMobile,
        initDesktop,
        initFS
    };

})();
