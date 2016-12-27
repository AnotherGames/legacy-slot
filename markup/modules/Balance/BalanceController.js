import { model } from 'modules/Model/Model';

import { view } from 'modules/Balance/BalanceView';

export let controller = (() => {

    function initMobile() {
        view.draw.CashBalance({});
        view.draw.MobileBalance({});
    }

    function initDesktop() {
        model.state('balance', 'coins');
        view.draw.CashBalance({
            container: model.group('panel')
        });
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

    function changeCoinsToCash() {
        if (model.state('balance') == 'cash') {
            model.el('coinCash').visible = false;
            model.el('betCash').visible = false;
            model.el('coinSum').visible = true;
            model.el('betSum').visible = true;
            model.state('balance', 'coins');
        } else {
            model.el('coinSum').visible = false;
            model.el('betSum').visible = false;
            model.el('coinCash').visible = true;
            model.el('betCash').visible = true;
            model.state('balance', 'cash');
        }
    }

    function updateBalance() {
        if (model.state('fs')) {
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
                view.update.MobileBalance({});
                view.update.CashBalance({});
            }
            if (model.desktop) {
                view.update.DesktopBalance({});
                view.update.CashBalance({});
            }
        }
    }

    return {
        initMobile,
        initDesktop,
        initFSMobile,
        initFSDesktop,
        updateBalance,
        changeCoinsToCash
    };

})();
