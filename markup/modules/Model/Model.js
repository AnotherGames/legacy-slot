import { events } from 'modules/Util/Events';

export let model = (() => {

    let _data = {},
        _balance = {},
        _state = {},
        _group = {},
        _el = {},
        _sound = {};

    function _getData(key, value, obj) {
        if (typeof value != 'undefined') {
            obj[key] = value;
        } else {
            return obj[key];
        }
    }
    function data(key, value) {
        return _getData(key, value, _data);
    }
    function state(key, value) {
        return _getData(key, value, _state);
    }
    function balance(key, value) {
        return _getData(key, value, _balance);
    }
    function group(key, value) {
        return _getData(key, value, _group);
    }
    function el(key, value) {
        return _getData(key, value, _el);
    }
    function sound(key, value) {
        return _getData(key, value, _sound);
    }
    function log() {
        console.log(_data, _balance, _state, _el, _group, _sound);
    }

    function _checkCurrencySymbol(currency) {
        switch (currency) {
            case 'USD':
                return '$ ';
                break;
            case 'EUR':
                return '€ ';
                break;
            case 'UAH':
                return '₴ ';
                break;
            case 'RUB':
                return '₽ ';
                break;
            default:
                return Error('We have no such currency!');
                break;
        }
    }

    function initStates(initData) {

        model.data('sessionID', initData.SessionID);
        model.data('numberOfLines', initData.Lines.length);
        model.data('firstScreen', initData.FirstScreen);
        model.state('initScreen', true);

        events.trigger('model:states:init');

    }

    function initSettings(settings) {

    }

    function initSaved(saved) {

    }

    function initBalance(initData) {

        model.balance('betSteps', initData.BetLevel);
        model.balance('currentBetStep', 0);
        model.balance('betValue', initData.BetLevel[0]);
        model.balance('betCash', model.data('numberOfLines') * initData.BetLevel[0] * initData.CoinValue[0] / 100);
        model.balance('betSum', model.data('numberOfLines') * initData.BetLevel[0]);

        model.balance('coinSteps', initData.CoinValue.map((value) => value / 100));
        model.balance('currentCoinStep', 0);
        model.balance('coinValue', initData.CoinValue[0] / 100);
        model.balance('coinCash', initData.ScoreCents / 100);
        model.balance('coinSum', initData.ScoreCoins);

        model.balance('winCash', 0);
        model.balance('currency', initData.Currency);
        model.balance('currencySymbol', _checkCurrencySymbol(initData.Currency));

        events.trigger('model:balance:init');

    }

    function changeBet({up, down, toMax, toMin}) {

        let betValue = model.balance('betValue');
        let betSteps = model.balance('betSteps');
        let currentBetStep = model.balance('currentBetStep');

        if (toMax) {
            if (currentBetStep == betSteps.length - 1) return false;
            currentBetStep = betSteps.length - 1;
        }
        if (toMin) {
            if (currentBetStep == 0) return false;
            currentBetStep = 0;
        }
        if (up) {
            if (currentBetStep == betSteps.length - 1) return false;
            currentBetStep++;
        }
        if (down) {
            if (currentBetStep == 0) return false;
            currentBetStep--;
        }

        betValue = betSteps[currentBetStep];
        model.balance('currentBetStep', currentBetStep);
        model.balance('betValue', betValue);
        updateBalance({bet: true});
        return betValue;

    }

    function changeCoin({up, down, toMax, toMin}) {

        let coinValue = model.balance('coinValue');
        let coinSteps = model.balance('coinSteps');
        let currentCoinStep = model.balance('currentCoinStep');

        if (toMax) {
            if (currentCoinStep == coinSteps.length - 1) return false;
            currentCoinStep = coinSteps.length - 1;
        }
        if (toMin) {
            if (currentCoinStep == 0) return false;
            currentCoinStep = 0;
        }
        if (up) {
            if (currentCoinStep == coinSteps.length - 1) return false;
            currentCoinStep++;
        }
        if (down) {
            if (currentCoinStep == 0) return false;
            currentCoinStep--;
        }

        coinValue = coinSteps[currentCoinStep];
        model.balance('currentCoinStep', currentCoinStep);
        model.balance('coinValue', coinValue);
        updateBalance({coin: true});
        return coinValue;

    }

    function updateBalance({bet, coin, startRoll, endRoll, startFSRoll, endFSRoll}) {

        // Добавить начало конец бонусного раунда

        if (bet) {
            let betValue = model.balance('betValue');
            let coinValue = model.balance('coinValue');

            let betSum = betValue * model.data('numberOfLines');
            let betCash = betValue * model.data('numberOfLines') * coinValue;

            model.balance('betSum', betSum);
            model.balance('betCash', betCash);
        }
        if (coin) {
            let coinValue = model.balance('coinValue');
            let coinCash = model.balance('coinCash');

            let coinSum = Math.floor(coinCash / coinValue);

            model.balance('coinSum', coinSum);
        }
        if (startRoll) {
            let coinSum = model.balance('coinSum');
            let betSum = model.balance('betSum');
            let coinCash = model.balance('coinCash');
            let betCash = model.balance('betCash');

            coinSum -= betSum;
            coinCash = (coinCash * 100 - betCash * 100) / 100;

            model.balance('winCash', 0);
            model.balance('coinSum', coinSum);
            model.balance('coinCash', coinCash);
        }
        if (endRoll) {
            let endData = model.data('rollResponse').Balance;

            model.balance('winCash', endData.TotalWinCents / 100);
            model.balance('coinSum', endData.ScoreCoins);
            model.balance('coinCash', endData.ScoreCents / 100);
        }
        if (startFSRoll) {

        }
        if (endFSRoll) {

        }

        events.trigger('model:balance:update');

    }

    function checkBalance() {
        return model.balance('coinSum') > model.balance('betSum');
    }

    return {
        data,
        state,
        balance,
        group,
        el,
        sound,
        log,

        initStates,
        initSettings,
        initBalance,
        initSaved,
        changeBet,
        changeCoin,
        updateBalance,
        checkBalance
    };

})();
