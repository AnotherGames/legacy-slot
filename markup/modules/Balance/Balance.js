import { model } from '../../modules/Model/Model';
import { events } from 'modules/Events/Events';

export let balance = (function () {

    let d, D;

    function drawBalanceContainer(container, game) {
        let d = 0.01 * model.el('game').width;
        let D = 0.02 * model.el('game').width;
        // console.log(d, D);
        const footerBGDown = game.add.graphics(0, 0, container);
        footerBGDown.beginFill(0x000000).drawRect(0, game.world.height - 30, game.world.width, 30);

        if (model.flag('mobile')) {
            const footerBGTop = game.add.graphics(0, 0, container);
            footerBGTop.beginFill(0x000000, 0.6).drawRect(0, game.world.height - 70, game.world.width, 40);
        }

        let x;
        let y;

        if (model.flag('mobile')) {
            x = [25, 75, game.world.width - 35, game.world.width - 85];
            y = game.world.height - 50;
        }

        if (model.flag('desktop')) {
            x = [25, 75, 125, 175];
            y = game.world.height - 15;
        }

        const homeButton = game.add.button(x[0], y, 'footerButtons', actionOnClick, this, 'homeOn.png', 'home.png', 'homeOn.png', container);
        homeButton.anchor.set(0.5);

        const menuButton = game.add.button(x[1], y, 'footerButtons', actionOnClick, this, 'menuOn.png', 'menu.png', 'menuOn.png', container);
        menuButton.anchor.set(0.5);

        const soundButton = game.add.button(x[2], y, 'footerButtons', actionOnClick, this, 'soundOn.png', 'sound.png', container);
        soundButton.anchor.set(0.5);

        const fastButton = game.add.button(x[3], y, 'footerButtons', actionOnClick, this, 'fastSpinOn.png', 'fastSpin.png', container);
        fastButton.anchor.set(0.5);

        function actionOnClick() {
            console.log('i am clicked!');
        }

        drawTime(container, game);

        drawBalanceText(container, game);

    }


    function drawBalanceText(container, game) {
        let d = 0.01 * model.el('game').width;
        let D = 0.025 * model.el('game').width;

        let balanceData = {};
        let balanceText = {};
        let currencySymbol = checkCurrency(model.data('currentBalance').currency);

        let topBalanceContainer = game.add.group();
        let bottomBalanceContainer = game.add.group();

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
        balanceData.betCash = +(balanceData.betSum * balanceData.coinsValue).toFixed(2);

        balanceData.winCash = (0).toFixed(2);
        balanceData.currency = model.data('initBalance').Currency;

        let mainContainer = model.el('mainContainer');
        let balanceFont;

        if (model.flag('mobile')) {
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
        // console.log(bottomBalanceContainer.x);

        if (model.flag('mobile')) {
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
            balanceText.coinsSum = game.add.text(
                mainContainer.x + 410,
                mainContainer.height + 2,
                balanceData.coinsSum,
                {font: 'normal 32px Helvetica', fill: '#e8b075', align: 'center'},
                container);
            balanceText.coinsValue = game.add.text(
                mainContainer.x + 1330,
                mainContainer.height + 85,
                balanceData.coinsValue,
                {font: 'normal 32px Helvetica', fill: '#e8b075', align: 'center'},
                container);
            balanceText.betSum = game.add.text(
                mainContainer.x + 1460,
                mainContainer.height + 2,
                balanceData.betSum,
                {font: 'normal 32px Helvetica', fill: '#e8b075', align: 'center'},
                container);
            balanceText.betValue = game.add.text(
                mainContainer.x + 530,
                mainContainer.height + 85,
                balanceData.betValue,
                {font: 'normal 32px Helvetica', fill: '#e8b075', align: 'center'},
                container);
        }


        model.data('balanceText', balanceText);
        model.data('balanceData', balanceData);

        setTimeout(updateBalance(currencySymbol), 500);
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

    function updateBalance(currencySymbol) {

        let balanceData = model.data('balanceData');
        let balanceText = model.data('balanceText');
        // console.log(balanceText.coinsValue);

        if (model.flag('desktop')) {
            if (balanceText.coinsValue.text !== balanceData.coinsValue) {
                balanceText.coinsValue.text = balanceData.coinsValue;
            }
            if (balanceText.betValue.text !== balanceData.betValue) {
                balanceText.betValue.text = balanceData.betValue;
            }
        }


        if (balanceText.coinsSum.text !== balanceData.coinsSum) {
            balanceText.coinsSum.text = balanceData.coinsSum;
        }
        if (balanceText.betSum.text !== balanceData.betSum) {
            balanceText.betSum.text = balanceData.betSum;
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

        if (model.flag('desktop')) {
            font = 'bold 24px Helvetica';
            y = game.world.height - 12;
        }

        if (model.flag('mobile')) {
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



    events.on('updateTime', updateTime);

    return {
        drawBalanceContainer
    };

})();
