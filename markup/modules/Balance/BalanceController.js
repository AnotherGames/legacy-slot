import { model } from 'modules/Model/Model';

import { view } from 'modules/Balance/BalanceView';

export let controller = (() => {

    function initMobile() {
        view.draw.CashBalance({});
        view.draw.MobileBalance({});
    }

    function initDesktop() {
        // view.draw.CashBalance({});
        view.draw.DesktopBalance({});
    }

    function initFSMobile() {
        view.draw.CashBalance({});
        view.draw.FSMobileBalance({});
    }

    function initFSDesktop() {
        // view.draw.CashBalance({});
        view.draw.FSDesktopBalance({});
    }

    function updateBalance() {
        if (model.state('fs')) {
            if (model.mobile) {
                view.update.FSMobileBalance({});
                view.update.CashBalance({});
            }
            if (model.desktop) {
                view.update.FSDesktopBalance({});
                // view.update.CashBalance({});
            }
        } else {
            if (model.mobile) {
                view.update.MobileBalance({});
                // /view.update.CashBalance({});
            }
            if (model.desktop) {
                view.update.DesktopBalance({});
                // view.update.CashBalance({});
            }
        }
    }

    return {
        initMobile,
        initDesktop,
        initFSMobile,
        initFSDesktop,
        updateBalance
    };

})();
