import { model } from 'modules/Model/Model';

import { view } from 'modules/Balance/BalanceView';

export let controller = (() => {

    function initMobile() {
        view.draw.MobileCashBalance({});
        view.draw.MobileBalance({});
    }

    function initDesktop() {
        view.draw.CashBalance({
            container: model.group('panel')
        });
        view.draw.FooterCashBalance({});
        view.draw.DesktopBalance({});
    }

    function initFSMobile() {
        view.draw.MobileCashBalance({});
        view.draw.FSMobileBalance({});
    }

    function initFSDesktop() {
        view.draw.CashBalance({
            container: model.group('panelFS')
        });
        view.draw.FooterCashBalance({});
        view.draw.FSDesktopBalance({});
    }

    function changeCoinsToCash() {
        let game = model.el('game');
        let convertSign = model.el('convertSign');
        if (model.state('balance') == 'cash') {
            model.el('coinCash').visible = false;
            model.el('betCash').visible = false;
            model.el('coinCashSymbol').visible = false;
            model.el('betCashSymbol').visible = false;

            model.el('coinSum').visible = true;
            model.el('betSum').visible = true;
            model.state('balance', 'coins');
            convertSign.frameName = 'switch4.png';
            game.time.events.add(500, () => {
                convertSign.frameName = 'switch1.png';
            })
        } else {
            model.el('coinSum').visible = false;
            model.el('betSum').visible = false;

            model.el('coinCash').visible = true;
            model.el('betCash').visible = true;
	        model.el('coinCashSymbol').visible = true;
	        model.el('betCashSymbol').visible = true;
            model.state('balance', 'cash');
            convertSign.frameName = 'switch2.png';
            game.time.events.add(500, () => {
                convertSign.frameName = 'switch3.png';
            })
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
                view.update.FooterBalance({});
            }
        } else {
            if (model.mobile) {
                view.update.MobileBalance({});
                view.update.CashBalance({});
            }
            if (model.desktop) {
                view.update.DesktopBalance({});
                view.update.CashBalance({});
                view.update.FooterBalance({});
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
