import { model } from '../../modules/Model/Model';
import { events } from 'modules/Events/Events';

export let balance = (function () {

    function drawBalanceContainer(container, game) {
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
        let balanceData = {};
        let balanceText = {};
        let currencySymbol = checkCurrency(model.data('currentBalance').currency);

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

        let balanceFont;

        if (model.flag('mobile')) {
            balanceFont = '18px Helvetica';
        } else {
            balanceFont = '24px Helvetica';
        }

        balanceText.coinsCashText = game.add.text(game.world.width * 0.3, game.world.height - 25, 'Cash:', {font: balanceFont, fill: '#888888', align: 'center'}, container);
        balanceText.coinsCash = game.add.text(balanceText.coinsCashText.x + balanceText.coinsCashText.width / 2 + 30, game.world.height - 25, currencySymbol + balanceData.coinsCash, {font: balanceFont, fill: '#dddddd', align: 'center'}, container);
        balanceText.betCashText = game.add.text(game.world.width * 0.42, game.world.height - 25, 'Bet:', {font: balanceFont, fill: '#888888', align: 'center'}, container);
        balanceText.betCash = game.add.text(balanceText.betCashText.x + balanceText.betCashText.width / 2 + 30, game.world.height - 25, currencySymbol + balanceData.betCash, {font: balanceFont, fill: '#dddddd', align: 'center'}, container);
        balanceText.winCashText = game.add.text(game.world.width * 0.5, game.world.height - 25, 'Win:', {font: balanceFont, fill: '#888888', align: 'center'}, container);
        balanceText.winCash = game.add.text(balanceText.winCashText.x + balanceText.winCashText.width / 2 + 30, game.world.height - 25, currencySymbol + balanceData.winCash, {font: balanceFont, fill: '#dddddd', align: 'center'}, container);

        if (model.flag('mobile')) {
            balanceText.coinsSumText = game.add.text(game.world.width * 0.33, game.world.height - 65, 'Coins:', {font: '24px Helvetica', fill: '#dddddd', align: 'center'}, container);
            balanceText.coinsSum = game.add.text(balanceText.coinsSumText.x + balanceText.coinsSumText.width / 2 + 40, game.world.height - 65, balanceData.coinsSum, {font: 'normal 25px Helvetica', fill: '#e8b075', align: 'center'}, container);
            balanceText.betSumText = game.add.text(game.world.width * 0.48, game.world.height - 65, 'Bet:', {font: '24px Helvetica', fill: '#dddddd', align: 'center'}, container);
            balanceText.betSum = game.add.text(balanceText.betSumText.x + balanceText.betSumText.width / 2 + 30, game.world.height - 65, balanceData.betSum, {font: 'normal 25px Helvetica', fill: '#e8b075', align: 'center'}, container);
            balanceText.coinsSum.setShadow(0, 0, '#e8b075', 4);
            balanceText.betSum.setShadow(0, 0, '#e8b075', 4);
        } else {
            balanceText.coinsSum = game.add.text(20, game.world.height - 65, balanceData.coinsSum, {font: 'normal 25px Helvetica', fill: '#e8b075', align: 'center'}, container);
            balanceText.coinsValue = game.add.text(40, game.world.height - 65, balanceData.coinsValue, {font: 'normal 25px Helvetica', fill: '#e8b075', align: 'center'}, container);
            balanceText.betSum = game.add.text(60, game.world.height - 65, balanceData.betSum, {font: 'normal 25px Helvetica', fill: '#e8b075', align: 'center'}, container);
            balanceText.betValue = game.add.text(80, game.world.height - 65, balanceData.betValue, {font: 'normal 25px Helvetica', fill: '#e8b075', align: 'center'}, container);
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

        if (balanceText.coinsValue.text !== balanceData.coinsValue) {
            balanceText.coinsValue.text = balanceData.coinsValue;
        }
        if (balanceText.betValue.text !== balanceData.betValue) {
            balanceText.betValue.text = balanceData.betValue;
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
