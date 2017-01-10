import { model } from 'modules/Model/Model';

export let view = (() => {

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

    let draw = {

        CashBalance: function({
            game = model.el('game'),
            container = model.group('balanceCash'),
            currencySymbol = model.balance('currencySymbol'),
            coinCashValue = model.balance('coinCash'),
            betCashValue = model.balance('betCash'),
            winCashValue = model.balance('winCash'),
            greyStyle = {font: '20px Helvetica, Arial', fill: '#888888', align: 'center'},
            cashStyle = {font: '20px Helvetica, Arial', fill: '#ffffff', align: 'center'},
            y = model.data('footerBottomCenterY')
        }) {

            let coinCashText = game.add.text(0, y, 'Cash: ', greyStyle, container);
            let betCashText = game.add.text(0, y, 'Bet: ', greyStyle, container);
            let winCashText = game.add.text(0, y, 'Win: ', greyStyle, container);
            let coinCash = game.add.text(0, y, `${currencySymbol} ${coinCashValue.toFixed(2)}`, cashStyle, container);
            let betCash = game.add.text(0, y, `${currencySymbol} ${betCashValue.toFixed(2)}`, cashStyle, container);
            let winCash = game.add.text(0, y, `${currencySymbol} ${winCashValue.toFixed(2)}`, cashStyle, container);

            model.el('coinCashText', coinCashText);
            model.el('betCashText', betCashText);
            model.el('winCashText', winCashText);
            model.el('coinCash', coinCash);
            model.el('betCash', betCash);
            model.el('winCash', winCash);

            _setAnchorInCenter([coinCashText, coinCash, betCashText, betCash, winCashText, winCash]);
            _calcTextPosition([[coinCashText, coinCash], [betCashText, betCash], [winCashText, winCash]], container);

        },

        MobileBalance: function({
            game = model.el('game'),
            container = model.group('balanceCoin'),
            coinSumValue = model.balance('coinSum'),
            betSumValue = model.balance('betSum'),
            greyStyle = {font: '24px Helvetica, Arial', fill: '#dddddd', align: 'center'},
            cashStyle = {font: '25px Helvetica, Arial', fill: '#e8b075', align: 'center'},
            y = model.data('footerTopCenterY')
        }) {

            let coinSumText = game.add.text(0, y, 'Coins: ', greyStyle, container);
            let betSumText = game.add.text(0, y, 'Bet: ', greyStyle, container);
            let coinSum = game.add.text(0, y, `${coinSumValue.toFixed(0)}`, cashStyle, container);
            let betSum = game.add.text(0, y, `${betSumValue.toFixed(0)}`, cashStyle, container);

            model.el('coinSumText', coinSumText);
            model.el('betSumText', betSumText);
            model.el('coinSum', coinSum);
            model.el('betSum', betSum);

            _setAnchorInCenter([coinSumText, coinSum, betSumText, betSum]);
            _calcTextPosition([[coinSumText, coinSum], [betSumText, betSum]], container);

        },

        DesktopBalance: function({
            game = model.el('game'),
            container = model.group('panel'),
            coinSumValue = model.balance('coinSum'),
            betSumValue = model.balance('betSum'),
            coinValueAmount = model.balance('coinValue'),
            betValueAmount = model.balance('betValue'),
            sumStyle = {font: '24px Helvetica, Arial', fill: '#e8b075', align: 'center'},
            valueStyle = {font: '27px Helvetica, Arial', fill: '#e8b075', align: 'center'},
            y = [32, 112],
            x = [180, 260, 1070, 1180]
        }) {

            let coinSum = game.add.text(x[3], y[0], `${coinSumValue.toFixed(0)}`, sumStyle, container);
            let betSum = game.add.text(x[0], y[0], `${betSumValue.toFixed(0)}`, sumStyle, container);

            let coinValue = game.add.text(x[2], y[1], `${coinValueAmount}`, valueStyle, container);
            let betValue = game.add.text(x[1], y[1], `${betValueAmount}`, valueStyle, container);

            model.el('coinSum', coinSum);
            model.el('betSum', betSum);
            model.el('coinValue', coinValue);
            model.el('betValue', betValue);

            _setAnchorInCenter([coinSum, betSum, coinValue, betValue]);

        },

        FSMobileBalance: function({
            game = model.el('game'),
            container = model.group('balanceCoin'),
            totalWinValue = model.balance('totalWin'),
            winValue = model.balance('fsWin'),
            greyStyle = {font: '24px Helvetica, Arial', fill: '#dddddd', align: 'center'},
            cashStyle = {font: '25px Helvetica, Arial', fill: '#e8b075', align: 'center'},
            y = model.data('footerTopCenterY')
        }) {

            let totalWinText = game.add.text(0, y, 'Total Win: ', greyStyle, container);
            let winText = game.add.text(0, y, 'Win: ', greyStyle, container);
            let totalWinSum = game.add.text(0, y, `${totalWinValue.toFixed(0)}`, cashStyle, container);
            let winSum = game.add.text(0, y, `${winValue.toFixed(0)}`, cashStyle, container);

            model.el('totalWinText', totalWinText);
            model.el('winText', winText);
            model.el('totalWinSum', totalWinSum);
            model.el('winSum', winSum);

            _setAnchorInCenter([totalWinText, totalWinSum, winText, winSum]);
            _calcTextPosition([[totalWinText, totalWinSum], [winText, winSum]], container);
        },

        FSDesktopBalance: function({
            game = model.el('game'),
            container = model.group('panel'),
            coinSumValue = model.balance('coinSum'),
            betSumValue = model.balance('betSum'),
            coinValueAmount = model.balance('coinValue'),
            betValueAmount = model.balance('betValue'),
            sumStyle = {font: '24px Helvetica, Arial', fill: '#e8b075', align: 'center'},
            valueStyle = {font: '27px Helvetica, Arial', fill: '#e8b075', align: 'center'},
            y = [23, 69, 103, 118],
            x = [154, 230, 250, 1212]
        }) {

            let coinSum = game.add.text(x[3], y[3], `${coinSumValue.toFixed(0)}`, sumStyle, container);
            let betSum = game.add.text(x[1], y[0], `${betSumValue.toFixed(0)}`, sumStyle, container);

            let coinValue = game.add.text(x[2], y[2], `${coinValueAmount}`, valueStyle, container);
            let betValue = game.add.text(x[0], y[2], `${betValueAmount}`, valueStyle, container);

            let winSum = game.add.text(x[3], y[0], `0`, sumStyle, container);
            let totalWinSum = game.add.text(x[3], y[1], `0`, sumStyle, container);

            model.el('coinSum', coinSum);
            model.el('betSum', betSum);
            model.el('coinValue', coinValue);
            model.el('betValue', betValue);
            model.el('winSum', winSum);
            model.el('totalWinSum', totalWinSum);

            _setAnchorInCenter([coinSum, betSum, coinValue, betValue, winSum, totalWinSum]);

        }

    };

    let update = {

        CashBalance: function({
            container = model.group('balanceCash'),
            currencySymbol = model.balance('currencySymbol'),
            coinCashValue = model.balance('coinCash'),
            betCashValue = model.balance('betCash'),
            winCashValue = model.balance('winCash')
        }) {
            let game = model.el('game');
            let coinCash = model.el('coinCash');
            let betCash = model.el('betCash');
            let winCash = model.el('winCash');
            let coinCashText = model.el('coinCashText');
            let betCashText = model.el('betCashText');
            let winCashText = model.el('winCashText');

            betCash.text = `${currencySymbol} ${betCashValue.toFixed(2)}`;
            winCash.text = `${currencySymbol} ${winCashValue.toFixed(2)}`;

            let currBalance = +coinCash.text.substr(2);
            let plusBalance = coinCashValue - currBalance;
            let timeLength = 500;
            let _clock = game.time.create(true);
            _clock.add(timeLength, () => {}, this);
            _clock.start();

            let anim = function () {
                let timer = timeLength - _clock.duration;
                let progress = timer / timeLength;
                if (progress > 1) {
                    progress = 1;
                }
                let newBalance = currBalance + plusBalance * progress;
                coinCash.text = `${currencySymbol} ${newBalance.toFixed(2)}`;

                if (progress === 1) {
                    game.frameAnims.splice(game.frameAnims.indexOf(anim), 1);
                    coinCash.text = `${currencySymbol} ${coinCashValue.toFixed(2)}`;
                }

            };
            game.frameAnims.push(anim);

            coinCash.text = `${currencySymbol} ${coinCashValue.toFixed(2)}`;
            _calcTextPosition([[coinCashText, coinCash], [betCashText, betCash], [winCashText, winCash]], container);

        },

        MobileBalance: function({
            container = model.group('balanceCoin'),
            coinSumValue = model.balance('coinSum'),
            betSumValue = model.balance('betSum')
        }) {

            let game = model.el('game');
            let coinSum = model.el('coinSum');
            let betSum = model.el('betSum');
            let coinSumText = model.el('coinSumText');
            let betSumText = model.el('betSumText');

            betSum.text = `${betSumValue.toFixed(0)}`;

            let currBalance = +coinSum.text;
            let plusBalance = coinSumValue - currBalance;
            let timeLength = 500;
            let _clock = game.time.create(true);
            _clock.add(timeLength, () => {}, this);
            _clock.start();

            let anim = function () {
                let timer = timeLength - _clock.duration;
                let progress = timer / timeLength;
                if (progress > 1) {
                    progress = 1;
                }
                let newBalance = currBalance + plusBalance * progress;
                coinSum.text = `${newBalance.toFixed(0)}`;

                if (progress === 1) {
                    game.frameAnims.splice(game.frameAnims.indexOf(anim), 1);
                    coinSum.text = `${coinSumValue.toFixed(0)}`;
                }

            };
            game.frameAnims.push(anim);

            coinSum.text = `${coinSumValue.toFixed(0)}`;
            _calcTextPosition([[coinSumText, coinSum], [betSumText, betSum]], container);

        },

        DesktopBalance: function({
            coinSumValue = model.balance('coinSum'),
            betSumValue = model.balance('betSum'),
            coinValueAmount = model.balance('coinValue'),
            betValueAmount = model.balance('betValue'),
        }) {
            let game = model.el('game');
            let coinSum = model.el('coinSum');
            let betSum = model.el('betSum');
            let coinValue = model.el('coinValue');
            let betValue = model.el('betValue');

            // coinSum.text = `${coinSumValue.toFixed(0)}`;
            betSum.text = `${betSumValue.toFixed(0)}`;
            coinValue.text = `${coinValueAmount.toFixed(2)}`;
            betValue.text = `${betValueAmount}`;

            let currBalance = +coinSum.text;
            let plusBalance = coinSumValue - currBalance;
            let timeLength = 500;
            let _clock = game.time.create(true);
            _clock.add(timeLength, () => {}, this);
            _clock.start();

            let anim = function () {
                let timer = timeLength - _clock.duration;
                let progress = timer / timeLength;
                if (progress > 1) {
                    progress = 1;
                }
                let newBalance = currBalance + plusBalance * progress;
                coinSum.text = `${newBalance.toFixed(0)}`;

                if (progress === 1) {
                    game.frameAnims.splice(game.frameAnims.indexOf(anim), 1);
                    coinSum.text = `${coinSumValue.toFixed(0)}`;
                }

            };
            game.frameAnims.push(anim);

        },

        FSMobileBalance: function({
            winSumValue = model.balance('fsWin'),
            totalWinSumValue = model.balance('totalWin'),
            container = model.group('balanceCoin')
        }) {

            let winSum = model.el('winSum');
            let winText = model.el('winText');
            let totalWinSum = model.el('totalWinSum');
            let totalWinText = model.el('totalWinText');

            winSum.text = `${winSumValue}`;
            totalWinSum.text = `${totalWinSumValue}`;

            _calcTextPosition([[totalWinText, totalWinSum], [winText, winSum]], container);

        },

        FSDesktopBalance: function({
            winSumValue = model.balance('fsWin'),
            totalWinSumValue = model.balance('totalWin')
        }) {

            let winSum = model.el('winSum');
            let totalWinSum = model.el('totalWinSum');

            winSum.text = `${winSumValue}`;
            totalWinSum.text = `${totalWinSumValue}`;

        }

    };

    return {
        draw,
        update
    }

})();
