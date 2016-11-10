import { model } from 'modules/Model/Model';
import { events } from 'modules/Util/Events';

export let balance = (function () {

    let d, D;
    let balanceData = {};
    let balanceText = {};
    let currencySymbol;

    function drawBalanceContainer(container, game) {
        let d = 0.01 * model.el('game').width;
        let D = 0.02 * model.el('game').width;
        // console.log(d, D);
        const footerBGDown = game.add.graphics(0, 0, container);
        footerBGDown.beginFill(0x000000).drawRect(0, game.world.height - 30, game.world.width, 30);

        if (model.state('mobile')) {
            const footerBGTop = game.add.graphics(0, 0, container);
            footerBGTop.beginFill(0x000000, 0.6).drawRect(0, game.world.height - 70, game.world.width, 40);
        }

        drawTime(container, game);

        drawBalanceText(container, game);

    }

    function drawBalanceText(container, game) {
        let d = 0.01 * model.el('game').width;
        let D = 0.025 * model.el('game').width;

        currencySymbol = checkCurrency(model.data('currentBalance').currency);

        let topBalanceContainer = game.add.group();
        let bottomBalanceContainer = game.add.group();
        container.add(topBalanceContainer);
        container.add(bottomBalanceContainer);

        if (model.state('balance:init')) {
            balanceData.linesLength = model.data('lines').length;
            balanceData.coinsSteps = model.data('initBalance').CoinValue.map((value) => {
                return (value / 100).toFixed(2);
            });
            balanceData.betSteps = model.data('initBalance').BetLevel;

            balanceData.coinsValue = balanceData.coinsSteps[0];
            balanceData.coinsSum = model.data('initBalance').ScoreCoins;
            balanceData.coinsCash = +(model.data('initBalance').ScoreCents / 100).toFixed(2);

            balanceData.betValue = balanceData.betSteps[0];
            balanceData.betSum = +(balanceData.betValue * balanceData.linesLength).toFixed(0);
            balanceData.betCash = +(balanceData.betSum * balanceData.coinsValue).toFixed(2) + '';

            balanceData.winCash = (0).toFixed(2);
            balanceData.currency = model.data('initBalance').Currency;
            model.state('balance:init', false);
        }

        let mainContainer = model.el('mainContainer');
        let balanceFont;

        if (model.state('mobile')) {
            balanceFont = '18px Helvetica, Arial';
        } else {
            balanceFont = '24px Helvetica, Arial';
        }

        balanceText.coinsCashText = game.add.text(
            0,
            game.world.height - 25,
            'Cash:',
            {font: balanceFont, fill: '#888888', align: 'center'},
            bottomBalanceContainer);
        balanceText.coinsCash = game.add.text(
            balanceText.coinsCashText.x + balanceText.coinsCashText.width + d,
            game.world.height - 25,
            currencySymbol + balanceData.coinsCash,
            {font: balanceFont, fill: '#dddddd', align: 'center'},
            bottomBalanceContainer);
        balanceText.betCashText = game.add.text(
            balanceText.coinsCash.x + balanceText.coinsCash.width + D,
            game.world.height - 25,
            'Bet:',
            {font: balanceFont, fill: '#888888', align: 'center'},
            bottomBalanceContainer);
        balanceText.betCash = game.add.text(
            balanceText.betCashText.x + balanceText.betCashText.width + d,
            game.world.height - 25,
            currencySymbol + balanceData.betCash,
            {font: balanceFont, fill: '#dddddd', align: 'center'},
            bottomBalanceContainer);
        balanceText.winCashText = game.add.text(
            balanceText.betCash.x + balanceText.betCash.width + D,
            game.world.height - 25,
            'Win:',
            {font: balanceFont, fill: '#888888', align: 'center'},
            bottomBalanceContainer);
        balanceText.winCash = game.add.text(
            balanceText.winCashText.x + balanceText.winCashText.width + d,
            game.world.height - 25,
            currencySymbol + balanceData.winCash,
            {font: balanceFont, fill: '#dddddd', align: 'center'},
            bottomBalanceContainer);

        let bottomLineWidth = balanceText.coinsCashText.width + d + balanceText.coinsCash.width + D + balanceText.betCashText.width + d + balanceText.betCash.width + D + balanceText.winCashText.width + d + balanceText.winCash.width;

        bottomBalanceContainer.x = game.world.centerX - bottomLineWidth / 2;

        if (model.state('mobile')) {
            if (model.state('FSMode') === false ) {
                balanceText.coinsSumText = game.add.text(
                    0,
                    game.world.height - 65,
                    'Coins:',
                    {font: '24px Helvetica, Arial', fill: '#dddddd', align: 'center'},
                    topBalanceContainer);

                balanceText.coinsSum = game.add.text(
                    balanceText.coinsSumText.x + balanceText.coinsSumText.width + d,
                    game.world.height - 65,
                    balanceData.coinsSum,
                    {font: '25px Helvetica, Arial', fill: '#e8b075', align: 'center'},
                    topBalanceContainer);

                balanceText.betSumText = game.add.text(
                    balanceText.coinsSum.x + balanceText.coinsSum.width + D,
                    game.world.height - 65,
                    'Bet:',
                    {font: '24px Helvetica, Arial', fill: '#dddddd', align: 'center'},
                    topBalanceContainer);

                balanceText.betSum = game.add.text(
                    balanceText.betSumText.x + balanceText.betSumText.width + d,
                    game.world.height - 65,
                    balanceData.betSum,
                    {font: '25px Helvetica, Arial', fill: '#e8b075', align: 'center'},
                    topBalanceContainer);

                balanceText.coinsSum.setShadow(0, 0, '#e8b075', 2);
                balanceText.betSum.setShadow(0, 0, '#e8b075', 2);

                let topLineWidth = balanceText.coinsSumText.width + d + balanceText.coinsSum.width + D + balanceText.betSumText.width + d + balanceText.betSum.width;

                topBalanceContainer.x = game.world.centerX - topLineWidth / 2;
            } else {
                balanceText.winText = game.add.text(
                    0,
                    game.world.height - 65,
                    'Win:',
                    {font: '24px Helvetica, Arial', fill: '#dddddd', align: 'center'},
                    topBalanceContainer);

                balanceText.winSum = game.add.text(
                    balanceText.winText.x + balanceText.winText.width + d,
                    game.world.height - 65,
                    '0',
                    {font: '25px Helvetica, Arial', fill: '#e8b075', align: 'center'},
                    topBalanceContainer);
                model.el('winSum', balanceText.winSum);

                balanceText.totalWinText = game.add.text(
                    balanceText.winSum.x + balanceText.winSum.width + D,
                    game.world.height - 65,
                    'Total Win:',
                    {font: '24px Helvetica, Arial', fill: '#dddddd', align: 'center'},
                    topBalanceContainer);

                balanceText.totalWinSum = game.add.text(
                    balanceText.totalWinText.x + balanceText.totalWinText.width + d,
                    game.world.height - 65,
                    '0',
                    {font: '25px Helvetica, Arial', fill: '#e8b075', align: 'center'},
                    topBalanceContainer);
                model.el('totalWinSum', balanceText.totalWinSum);

                balanceText.winSum.setShadow(0, 0, '#e8b075', 2);
                balanceText.totalWinSum.setShadow(0, 0, '#e8b075', 2);

                let topLineWidth = balanceText.winText.width + d + balanceText.winSum.width + D + balanceText.totalWinText.width + d + balanceText.totalWinSum.width;

                topBalanceContainer.x = game.world.centerX - topLineWidth / 2;
            }
        } else if (model.state('desktop') && model.state('FSMode')) {
            balanceText.coinsSum = game.add.text(
                mainContainer.x + 1745,
                mainContainer.height + 116,
                balanceData.coinsSum,
                {font: 'normal 27px Helvetica, Arial', fill: '#e8b075', align: 'center'},
                container);
            balanceText.coinsSum.anchor.set(0.5);

            balanceText.coinsValue = game.add.text(
                mainContainer.x + 785,
                mainContainer.height + 102,
                balanceData.coinsValue,
                {font: 'normal 27px Helvetica, Arial', fill: '#e8b075', align: 'center'},
                container);
            balanceText.coinsValue.anchor.set(0.5);

            balanceText.betSum = game.add.text(
                mainContainer.x + 765,
                mainContainer.height + 19,
                balanceData.betSum,
                {font: 'normal 27px Helvetica, Arial', fill: '#e8b075', align: 'center'},
                container);
            balanceText.betSum.anchor.set(0.5);

            balanceText.betValue = game.add.text(
                mainContainer.x + 690,
                mainContainer.height + 102,
                balanceData.betValue,
                {font: 'normal 27px Helvetica, Arial', fill: '#e8b075', align: 'center'},
                container);
            balanceText.betValue.anchor.set(0.5);

            balanceText.winSum = game.add.text(
                mainContainer.x + 1745,
                mainContainer.height + 22,
                '0',
                {font: 'normal 27px Helvetica, Arial', fill: '#e8b075', align: 'center'},
                container);
            balanceText.winSum.anchor.set(0.5);
            model.el('winSum', balanceText.winSum);

            balanceText.totalWinSum = game.add.text(
                mainContainer.x + 1745,
                mainContainer.height + 68,
                '0',
                {font: 'normal 27px Helvetica, Arial', fill: '#e8b075', align: 'center'},
                container);
            balanceText.totalWinSum.anchor.set(0.5);
            model.el('totalWinSum', balanceText.totalWinSum);
        } else {
            balanceText.coinsSum = game.add.text(
                mainContainer.x + 1470,
                mainContainer.height + 19,
                balanceData.coinsSum,
                {font: 'normal 27px Helvetica, Arial', fill: '#e8b075', align: 'center'},
                container);
            balanceText.coinsSum.anchor.set(0.5);

            balanceText.coinsValue = game.add.text(
                mainContainer.x + 1360,
                mainContainer.height + 102,
                balanceData.coinsValue,
                {font: 'normal 27px Helvetica, Arial', fill: '#e8b075', align: 'center'},
                container);
            balanceText.coinsValue.anchor.set(0.5);

            balanceText.betSum = game.add.text(
                mainContainer.x + 480,
                mainContainer.height + 19,
                balanceData.betSum,
                {font: 'normal 27px Helvetica, Arial', fill: '#e8b075', align: 'center'},
                container);
            balanceText.betSum.anchor.set(0.5);

            balanceText.betValue = game.add.text(
                mainContainer.x + 535,
                mainContainer.height + 102,
                balanceData.betValue,
                {font: 'normal 27px Helvetica, Arial', fill: '#e8b075', align: 'center'},
                container);
            balanceText.betValue.anchor.set(0.5);
        }


        model.data('balanceText', balanceText);
        model.data('balanceData', balanceData);
        model.el('topBalanceContainer', topBalanceContainer);
        model.el('bottomBalanceContainer', bottomBalanceContainer);

        setTimeout(updateBalance(), 500);
    }

    function checkCurrency(currency) {
        if (currency === 'USD') {
            return '$ ';
        } else if (currency === 'EUR') {
            return '€ ';
        } else if (currency === 'UAH') {
            return '₴ ';
        } else if (currency === 'RUB') {
            return '₽ ';
        }
    }

    function updateBalance() {

        if (model.state('desktop')) {
            if (balanceText.coinsValue.text !== balanceData.coinsValue) {
                balanceText.coinsValue.text = balanceData.coinsValue;
            }
            if (balanceText.betValue.text !== balanceData.betValue) {
                balanceText.betValue.text = balanceData.betValue;
            }
        }

        if (model.state('FSMode') == false) {
            if (balanceText.coinsSum.text !== balanceData.coinsSum) {
                balanceText.coinsSum.text = balanceData.coinsSum;
            }
            if (balanceText.betSum.text !== balanceData.betSum) {
                balanceText.betSum.text = balanceData.betSum;
            }
        }

        if (balanceText.coinsCash.text.toString().slice(1) !== balanceData.coinsCash) {
            balanceText.coinsCash.text = currencySymbol + balanceData.coinsCash;
        }
        if (balanceText.betCash.text.toString().slice(1) !== balanceData.betCash) {
            balanceText.betCash.text = currencySymbol + balanceData.betCash;
        }
        if (balanceText.winCash.text.toString().slice(1) !== balanceData.winCash) {
            balanceText.winCash.text = currencySymbol + balanceData.winCash;
        }

        model.data('currentBalance', balanceData);

    }

    function changeBet(moreOrLess, maxBetFlag) {

        if (maxBetFlag) {
            balanceData.betValue = balanceData.betSteps[balanceData.betSteps.length - 1];
        } else if (moreOrLess === true && balanceData.betValue !== balanceData.betSteps[balanceData.betSteps.length - 1]) {
            let i = balanceData.betSteps.length;
            while (i >= 0) {
                if (balanceData.betSteps[i] === balanceData.betValue) {
                    balanceData.betValue = balanceData.betSteps[i + 1];
                    i = -1;
                }
                i--;
            }
        } else if (moreOrLess === false && balanceData.betValue !== balanceData.betSteps[0]) {
            let i = balanceData.betSteps.length;
            while (i >= 0) {
                if (balanceData.betSteps[i] === balanceData.betValue) {
                    balanceData.betValue = balanceData.betSteps[i - 1];
                    i = -1;
                }
                i--;
            }
        } else {
            console.warn('Bet change is failed!');
        }
        balanceData.betSum = +(balanceData.betValue * balanceData.linesLength).toFixed(0);
        balanceData.betCash = +(balanceData.betSum * balanceData.coinsValue).toFixed(2);
        updateBalance();
        console.log('Bet is changed:', balanceData.betValue);
        if (balanceData.betValue === balanceData.betSteps[balanceData.betSteps.length - 1]) {
            console.warn('This bet value is maximum!');
        } else if (balanceData.betValue === balanceData.betSteps[0]) {
            console.warn('This bet value is minimum!');
        }
    }

    function changeCoins(moreOrLess, maxBetFlag) {
        if (maxBetFlag) {
            balanceData.coinsValue = balanceData.coinsSteps[balanceData.coinsSteps.length - 1];
        } else if (moreOrLess === true && balanceData.coinsValue !== balanceData.coinsSteps[balanceData.coinsSteps.length - 1]) {
            let i = balanceData.coinsSteps.length;
            while (i >= 0) {
                if (balanceData.coinsSteps[i] === balanceData.coinsValue) {
                    balanceData.coinsValue = balanceData.coinsSteps[i + 1];
                    i = -1;
                }
                i--;
            }
        } else if (moreOrLess === false && balanceData.coinsValue !== balanceData.coinsSteps[0]) {
            let i = balanceData.coinsSteps.length;
            while (i >= 0) {
                if (balanceData.coinsSteps[i] === balanceData.coinsValue) {
                    balanceData.coinsValue = balanceData.coinsSteps[i - 1];
                    i = -1;
                }
                i--;
            }
        } else {
            console.warn('Coins change is failed!');
        }
        balanceData.coinsSum = +Math.floor(balanceData.coinsCash / balanceData.coinsValue).toFixed(0);
        balanceData.betCash = +(balanceData.coinsValue * balanceData.betSum).toFixed(2);
        updateBalance();
        console.log('Coins value is changed:', balanceData.coinsValue);
        if (balanceData.coinsValue === balanceData.coinsSteps[balanceData.coinsSteps.length - 1]) {
            console.warn('This coins value is maximum!');
        } else if (balanceData.coinsValue === balanceData.coinsSteps[0]) {
            console.warn('This coins value is minimum!');
        }
    }

    function maxBet() {
        changeBet(true, true);
    }

    function drawTime(container, game) {

        let currentHour = new Date().getHours();
        let currentMinutes = new Date().getMinutes();

        if (currentHour < 10) {
            currentHour = '0' + currentHour;
            model.data('currentHour', currentHour);
        }
        if (currentMinutes < 10) {
            currentMinutes = '0' + currentMinutes;
            model.data('currentMinutes', currentMinutes);
        }

        let font;
        let y;

        if (model.state('desktop')) {
            font = 'bold 24px Helvetica';
            y = game.world.height - 12;
        }

        if (model.state('mobile')) {
            font = '18px Helvetica';
            y = game.world.height - 12;
        }

        let balanceTime = game.add.text(0, y,
            `${currentHour} : ${currentMinutes}`,
            {font: font, fill: '#e8b075', align: 'center'},
            container);
        balanceTime.x = game.world.width - balanceTime.width;
        balanceTime.anchor.set(0.5);

        model.el('balanceTime', balanceTime);

    }

    function updateTime() {
        let balanceTime = model.el('balanceTime');
        let currentHour = model.el('currentHour');
        let currentMinutes = model.el('currentMinutes');

        let hours = new Date().getHours();
        let minutes = new Date().getMinutes();

        if (hours < 10) {
            hours = '0' + hours;
        }
        if (minutes < 10) {
            minutes = '0' + minutes;
        }

        if (currentHour !== hours) {
            currentHour = hours;
            balanceTime.text = `${currentHour} : ${currentMinutes}`;
        }

        if (currentMinutes !== minutes) {
            currentMinutes = minutes;
            balanceTime.text = `${currentHour} : ${currentMinutes}`;
        }

    }

    function rollStart() {
        if (model.state('roll:progress')) return;

        if (balanceData.coinsSum >= balanceData.betSum) {
            balanceData.coinsSum = (balanceData.coinsSum - balanceData.betSum).toFixed(0);
            balanceData.coinsCash = ((balanceData.coinsCash * 100 - balanceData.betCash * 100) / 100).toFixed(2);
            balanceData.winCash = (0).toFixed(2);
            updateBalance();
        } else {
            model.state('lowBalance', true);
            console.warn('Too low cash for spin!');
        }
    }

    function rollEnd() {
        const data = model.data('rollResponse');
        balanceData.winCash = (+data.Balance.TotalWinCents / 100).toFixed(2);
        balanceData.coinsCash = (+data.Balance.ScoreCents / 100).toFixed(2);
        balanceData.coinsSum = (+data.Balance.ScoreCoins).toFixed(0);
        updateBalance();
    }

    events.on('buttons:changeBet', changeBet);
    events.on('buttons:changeCoins', changeCoins);
    events.on('buttons:maxBet', maxBet);

    events.on('updateTime', updateTime);

    events.on('roll:start', rollStart);
    // events.on('roll:end', rollEnd);

    return {
        drawBalanceContainer
    };

})();
