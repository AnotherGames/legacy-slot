import { model } from 'modules/Model/Model';
import { events } from 'modules/Util/Events';
import { view } from 'modules/Balance/View';

export let controller = (() => {

    function initMobile() {
        view.draw.CashBalance({});
        view.draw.CoinBalance({});
    }

    function initDesktop() {
        view.draw.CashBalance({});
        view.draw.DesktopBalance({});
    }

    function initFSMobile() {
        view.draw.CashBalance({});
        view.draw.FSMobileBalance({});
    }

    function initFSDesktop() {
        view.draw.CashBalance({});
        view.draw.FSDesktopBalance({});
    }

    function updateBalance() {
        if (model.state('FSMode')) {
            if (model.mobile) {
                view.update.FSMobileBalance({});
                view.update.CashBalance({});
            }
            if (model.desktop) {
                view.update.FSDesktopBalance({});
                view.update.CashBalance({});
            }
        } else {
            if (model.mobile) {
                view.update.CashBalance({});
                view.update.CoinBalance({});
            }
            if (model.desktop) {
                view.update.CashBalance({});
                view.update.DesktopBalance({});
            }
        }
    }

    events.on('model:balance:update', updateBalance);

    return {
        initMobile,
        initDesktop,
        initFSMobile,
        initFSDesktop,
        updateBalance
    };

})();
