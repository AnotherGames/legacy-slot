import { model } from 'modules/Model/Model';

export let view = (() => {

    function drawCashBalance({
        currencySymbol = model.balance('currencySymbol'),
        coinCashValue = model.balance('coinCash'),
        betCashValue = model.balance('betCash'),
        winCashValue = model.balance('winCash'),
        greyStyle = {font: '18px Helvetica, Arial', fill: '#888888', align: 'center'},
        cashStyle = {font: '18px Helvetica, Arial', fill: '#ffffff', align: 'center'},
        y = model.data('footerBottomCenterY')
    }) {
        const game = model.el('game');

        let balanceCashContainer = game.add.group();
        model.group('balanceCash', balanceCashContainer);

        let coinCashText = game.add.text(0, y, 'Cash: ', greyStyle, balanceCashContainer);
        let betCashText = game.add.text(0, y, 'Bet: ', greyStyle, balanceCashContainer);
        let winCashText = game.add.text(0, y, 'Win: ', greyStyle, balanceCashContainer);
        let coinCash = game.add.text(0, y, `${currencySymbol} ${coinCashValue.toFixed(2)}`, cashStyle, balanceCashContainer);
        let betCash = game.add.text(0, y, `${currencySymbol} ${betCashValue.toFixed(2)}`, cashStyle, balanceCashContainer);
        let winCash = game.add.text(0, y, `${currencySymbol} ${winCashValue.toFixed(2)}`, cashStyle, balanceCashContainer);

        model.el('coinCashText', coinCashText);
        model.el('betCashText', betCashText);
        model.el('winCashText', winCashText);
        model.el('coinCash', coinCash);
        model.el('betCash', betCash);
        model.el('winCash', winCash);

        _setAnchorInCenter([coinCashText, coinCash, betCashText, betCash, winCashText, winCash]);
        _calcTextPosition([[coinCashText, coinCash], [betCashText, betCash], [winCashText, winCash]], balanceCashContainer);

    }

    function drawCoinBalance({
        coinSumValue = model.balance('coinSum'),
        betSumValue = model.balance('betSum'),
        greyStyle = {font: '24px Helvetica, Arial', fill: '#dddddd', align: 'center'},
        cashStyle = {font: '25px Helvetica, Arial', fill: '#e8b075', align: 'center'},
        y = model.data('footerTopCenterY')
    }) {
        const game = model.el('game');

        let balanceCoinContainer = game.add.group();
        model.group('balanceCoin', balanceCoinContainer);

        let coinSumText = game.add.text(0, y, 'Coins: ', greyStyle, balanceCoinContainer);
        let betSumText = game.add.text(0, y, 'Bet: ', greyStyle, balanceCoinContainer);
        let coinSum = game.add.text(0, y, `${coinSumValue.toFixed(0)}`, cashStyle, balanceCoinContainer);
        let betSum = game.add.text(0, y, `${betSumValue.toFixed(0)}`, cashStyle, balanceCoinContainer);

        model.el('coinSumText', coinSumText);
        model.el('betSumText', betSumText);
        model.el('coinSum', coinSum);
        model.el('betSum', betSum);

        _setAnchorInCenter([coinSumText, coinSum, betSumText, betSum]);
        _calcTextPosition([[coinSumText, coinSum], [betSumText, betSum]], balanceCoinContainer);

    }

    function updateCashBalance({
        currencySymbol = model.balance('currencySymbol'),
        coinCashValue = model.balance('coinCash'),
        betCashValue = model.balance('betCash'),
        winCashValue = model.balance('winCash')
    }) {

        let coinCash = model.el('coinCash'),
            betCash = model.el('betCash'),
            winCash = model.el('winCash');
        coinCash.text = `${currencySymbol} ${coinCashValue.toFixed(2)}`;
        betCash.text = `${currencySymbol} ${betCashValue.toFixed(2)}`;
        winCash.text = `${currencySymbol} ${winCashValue.toFixed(2)}`;

        let coinCashText = model.el('coinCashText'),
            betCashText = model.el('betCashText'),
            winCashText = model.el('winCashText'),
            balanceCashContainer = model.group('balanceCash');

        _calcTextPosition([[coinCashText, coinCash], [betCashText, betCash], [winCashText, winCash]], balanceCashContainer);

    }

    function updateCoinBalance({
        coinSumValue = model.balance('coinSum'),
        betSumValue = model.balance('betSum')
    }) {

        let coinSum = model.el('coinSum'),
            betSum = model.el('betSum');
        coinSum.text = `${coinSumValue.toFixed(0)}`;
        betSum.text = `${betSumValue.toFixed(0)}`;

        let coinSumText = model.el('coinSumText'),
            betSumText = model.el('betSumText'),
            balanceCoinContainer = model.group('balanceCoin');

        _calcTextPosition([[coinSumText, coinSum], [betSumText, betSum]], balanceCoinContainer);

    }

    function _setAnchorInCenter(els) {
        els.forEach((el) => {
            el.anchor.set(0.5);
        });
    }

    function _calcTextPosition(els, group, d = model.el('game').width * 0.01, D = model.el('game').width * 0.02) {
        const game = model.el('game');
        let numberOfD = els.length - 1,
            numberOfd = els.length,
            totalWidth = numberOfd * d + numberOfD * D;

        els.forEach((frase, fraseInd) => {
            frase.forEach((word, wordInd) => {
                totalWidth += word.width;
                if (fraseInd == 0) {
                    frase[0].x = frase[0].width / 2;
                    frase[1].x = frase[0].x + frase[0].width / 2 + d + frase[1].width / 2;
                } else {
                    let prevWord = els[fraseInd - 1][1];
                    frase[0].x = prevWord.x + prevWord.width / 2 + D + frase[0].width / 2;
                    frase[1].x = frase[0].x + frase[0].width / 2 + d + frase[1].width / 2;
                }
            });
        });

        group.x = game.width / 2 - totalWidth / 2;

    }

    function removeCashBalance({ hide = true }) {
        let balanceCashContainer = model.group('balanceCash');

        if (hide) {
            balanceCashContainer.visible = false;
        } else {
            balanceCashContainer.destroy(true);
            model.group('balanceCash', null);
        }
    }

    function removeCoinBalance({ hide = true }) {
        let balanceCoinContainer = model.group('balanceCoin');

        if (hide) {
            balanceCoinContainer.visible = false;
        } else {
            balanceCoinContainer.destroy(true);
            model.group('balanceCoin', null);
        }
    }

    function showCashBalance() {
        let balanceCashContainer = model.group('balanceCash');

        if (balanceCashContainer) {
            balanceCashContainer.visible = true;
        }
    }

    function showCoinBalance() {
        let balanceCoinContainer = model.group('balanceCoin');

        if (balanceCoinContainer) {
            balanceCoinContainer.visible = true;
        }
    }

    return {
        drawCashBalance,
        drawCoinBalance,
        updateCashBalance,
        updateCoinBalance,
        removeCashBalance,
        removeCoinBalance,
        showCashBalance,
        showCoinBalance
    }

})();
