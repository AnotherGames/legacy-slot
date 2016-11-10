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

    return {
        initMobile,
        initDesktop,
        initFS
    }

})();
