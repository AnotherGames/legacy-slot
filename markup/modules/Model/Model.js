import { controller as balanceController } from 'modules/Balance/BalanceController';
import { controller as setBetController } from 'modules/Menu/SetBet/MenuSetBetController';
import { controller as soundController } from '../../../Info/SoundController';

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

    function _getCookie(cookieName, value, exdays) {
        if (typeof value != 'undefined') {
            let exdate = new Date();
            exdate.setDate(exdate.getDate() + exdays);

            let cookieValue = escape(value) + ((exdays == null) ? '' : `; expires=${exdate.toUTCString()}`);
            document.cookie = `${cookieName}=${cookieValue}`;
        } else {
            let i, x, y, ARRcookies = document.cookie.split(';');

            for (i = 0; i < ARRcookies.length; i++) {
                x = ARRcookies[i].substr(0, ARRcookies[i].indexOf('='));
                y = ARRcookies[i].substr(ARRcookies[i].indexOf('=') + 1);
                x = x.replace(/^\s+|\s+$/g, '');

                if (x == cookieName) {
                    return unescape(y);
                }
            }
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
    function cookie(cookieName, cookieValue, exdays) {
        return _getCookie(cookieName, cookieValue, exdays);
    }

    function _checkCurrencySymbol(currency) {
        switch (currency) {
            case 'USD':
                return '$ ';
            case 'cns':
                return '$ ';
            case 'EUR':
                return '€ ';
            case 'UAH':
                return '₴ ';
            case 'RUB':
                return '₽ ';
            default:
                return `${currency} `;
        }
    }

    function initStates(initData) {

        model.data('sessionID', initData.SessionID);
        model.data('lines', initData.Lines);
        model.data('numberOfLines', initData.Lines.length);
        model.data('firstScreen', initData.FirstScreen);

        // Autoplay States
        model.state('autoplay:end', true);
        model.state('autoplay:start', false);
        model.state('autoplay:cashUp', false);
        model.state('autoplay:cashDown', false);
        model.state('autoplay:cashRoll', false);
        model.state('autoplay:panelClosed', true);
        model.data('autoplay:count', 0);
        model.data('autoplay:startCash', 0);

        // С правой стороны проверки значения, которые должны быть по умолчанию
        let autoTransititon = (model.cookie('autoTransititon') == 'true') ? true : false;
        model.state('autoTransititon', autoTransititon);

        let fastRoll = (model.cookie('fastRoll') == 'true') ? true : false;
        model.state('fastRoll', fastRoll);

        let soundValue = (model.cookie('sound') == 'false') ? false : true;
        model.state('sound', soundValue);

        let music = (model.cookie('music') == 'false') ? false : true;
        model.state('music', music);

        let isAnimBG = (model.cookie('isAnimBG') == 'false') ? false : true;
        model.state('isAnimBG', isAnimBG);

        let gameSideLeft = (model.cookie('gameSideLeft') == 'false') ? false : true;
        model.state('gameSideLeft', gameSideLeft);

        let volume = (isFinite(+model.cookie('volume'))) ? Math.abs(model.cookie('volume')) : 100;
        soundController.volume.setVolume(volume);

        let globalSound = (model.cookie('globalSound') == 'false') ? false : true;
        model.state('globalSound', globalSound);
        if (globalSound) {
            soundController.volume.changeVolume(volume);
        } else {
            soundController.volume.changeVolume(0);
        }

        model.state('initScreen', true);
        model.state('ready', true);
        model.state('firstFS', false);
        model.state('isAnimations', true);
        model.state('fs:end', true);
        model.state('transitionScreen', false);
        model.state('fs', false);
        model.state('bonus', false);
        model.state('infoPanelOpen', false);
        model.state('menuOpened', false);
        model.state('isFirstAutoChangeAnimBG', true);
        model.state('maxFsMultiplier', false);
        model.state('doorFinish', false);
        model.state('fontNotLoaded', true);
        model.state('oneAfterAnother', false);
        model.state('changeLevel', false);
    }

    function initSettings() {

    }

    function initSaved(saved) {
        if (!saved) return;

        if (saved.ResultType == 'Doors') {
            let doorsValue = saved.OldValues;
            let winCash = 0;
            let totalWin = 0;
            let bet = 10 //пока не приходит от сервера
            let state = saved.ResultType;

            doorsValue.forEach((value) => {
                winCash += bet * +value.substring(1)
            })
            model.balance('winCash', winCash / 100);
            model.balance('totalWin', winCash);
            model.data('rollResponse', {NextDoorNumber: saved.NextDoorNumber});
            model.data('savedFS', {
                doorsValue,
                state
            });
        } else {
            let fsCount = +saved.RemainSpins + 1;
            let fsLevel = saved.Multiplier.MultiplierStep;
            let fsMulti = saved.Multiplier.MultiplierValue;
            let totalWin = saved.CurrentTotalWinCoins;
            let winCash = saved.CurrentTotalWinCents;
            let state = saved.ResultType;

            model.balance('winCash', winCash / 100);
            model.balance('totalWin', totalWin);
            model.data('rollResponse', {NextMode: 'fsBonus'});
            model.data('savedFS', {
                fsCount,
                fsLevel,
                fsMulti,
                state
            });
        }
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

        model.balance('fsWin', 0);
        model.balance('totalWin', 0);

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
        let betCash = model.balance('betCash');
        let betSum = model.balance('betSum');
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
        betCash = betSum * coinValue;
        model.balance('currentCoinStep', currentCoinStep);
        model.balance('coinValue', coinValue);
        model.balance('betCash', betCash);
        updateBalance({coin: true});
        return coinValue;

    }

    function updateBalance({bet, coin, startRoll, endRoll, startFSRoll, endFSRoll, startFS, endFS, startBonus, endBonus, startBonusRoll}) {

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
        if (startFS) {
            model.balance('winCash', 0);
        }
        if (endFS) {
            let endData = model.data('rollResponse').Balance;
            model.balance('coinSum', endData.ScoreCoins);
            model.balance('coinCash', endData.ScoreCents / 100);
            model.balance('fsWin', 0);
            model.balance('totalWin', 0);
        }
        if (startFSRoll) {
            let newTotalWin = +model.balance('fsWin') + +model.balance('totalWin');
            let newWinCash = newTotalWin * model.balance('coinValue');
            model.balance('fsWin', 0);
            model.balance('totalWin', newTotalWin);
            model.balance('winCash', newWinCash);
        }
        if (endFSRoll) {
            let endData = model.data('rollResponse');
            model.balance('fsWin', endData.Balance.TotalWinCoins);
            if (endData.FsBonus) {
                model.balance('winCash', endData.FsBonus.TotalFSWinCents / 100);
                model.balance('totalWin', endData.FsBonus.TotalFSWinCoins);
            }
            if (endData.NextMode == 'root') {
                model.balance('winCash', (endData.FsBonus.TotalFSWinCents + endData.Balance.TotalWinCents) / 100);
            }
        }

        if (startBonus) {
            model.balance('winCash', 0);
        }

        if (endBonus) {
            let newCoinSum = model.balance('coinSum') + model.balance('totalWin');
            model.balance('coinSum', newCoinSum);

            let newCoinCash = (model.balance('coinCash') * 100 + model.balance('winCash') * 100) / 100;
            model.balance('coinCash', newCoinCash);

            model.balance('fsWin', 0);
            model.balance('totalWin', 0);
        }

        if (startBonusRoll) {
            let response = model.data('bonusRollResponse');
            let newTotalWin = model.balance('totalWin') || 0;
            let newWinCash = model.balance('winCash');
            let newWin = response.Balance.TotalWinCoins;
            newTotalWin += newWin;
            newWinCash = (newWinCash * 100 + response.Balance.TotalWinCents) / 100;
            model.balance('fsWin', newWin);
            model.balance('totalWin', newTotalWin);
            model.balance('winCash', newWinCash);
        }

        if (model.mobile) {
            setBetController.update.CoinValue({});
            setBetController.update.BetValue({});
        }
        balanceController.updateBalance({});

    }

    function checkBalance() {
        return model.balance('coinSum') >= model.balance('betSum');
    }

    return {
        data,
        state,
        balance,
        group,
        el,
        sound,
        log,
        cookie,

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
