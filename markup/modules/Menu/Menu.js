import { model } from '../../modules/Model/Model';

export let menu = (function () {

    function drawMenu(container, game) {

        const overlay = game.add.graphics(0, 0, model.el('buttonsContainer')).beginFill(0x000000, 0.5).drawRect(0, 0, game.world.width, game.world.height);
        overlay.inputEnabled = true;
        overlay.input.priorityID = 0;

        const menuBG = game.add.graphics(0, 0, container);
        menuBG.beginFill(0x000000).drawRect(0, 0, game.world.width * 0.22, game.world.height);

        menuBG.inputEnabled = true;
        menuBG.input.priorityID = 1;

        const MenuBorder = game.add.graphics(0, 0, container);
        MenuBorder.beginFill(0xffffff, 0.3).drawRect(0, 0, game.world.width * 0.002, game.world.height);

        const menuBack = game.add.sprite(container.width / 2, game.world.height * 0.9, 'mobileButtons', 'return.png', container);
        menuBack.anchor.set(0.5);
        menuBack.inputEnabled = true;
        menuBack.input.priorityID = 2;

        // if (name === 'bet') {
        // showBetMenu(container, game);
        // } else if (name === 'auto') {
        showAutoMenu(container, game);
        // } else if (name === 'settings') {
        // showSettingsMenu(container, game);
        // }

        showMenuRight();

        overlay.events.onInputDown.add(function () {
            hideMenu();
            let tween = game.add.tween(overlay).to( { alpha: 0 }, 2000, 'Quart.easeOut');
            tween.start();
            overlay.destroy();
        });

        menuBack.events.onInputDown.add(function () {
            hideMenu();
            let tween = game.add.tween(overlay).to( { alpha: 0 }, 2000, 'Quart.easeOut');
            tween.start();
            overlay.destroy();
        });

    }

    function showMenuRight() {
        const game = model.el('game');
        const menuContainer = model.el('menuContainer');
        menuContainer.x = game.world.width + menuContainer.width;
        const tween = game.add.tween(menuContainer).to( { x: game.world.width - menuContainer.width }, 2000, 'Quart.easeOut');
        tween.start();
    }

    function showMenuLeft() {
        const game = model.el('game');
        const menuContainer = model.el('menuContainer');
        menuContainer.x = 0 - menuContainer.width;
        const menuBorder = menuContainer.getChildAt(1);
        menuBorder.x = menuContainer.width;
        const tween = game.add.tween(menuContainer).to( { x: 0 }, 2000, 'Quart.easeOut');
        tween.start();
    }

    function hideMenu() {
        const game = model.el('game');
        const menuContainer = model.el('menuContainer');
        // if (model.state('side', left)) {
        //     const tween = game.add.tween(menuContainer).to( { x: 0 - menuContainer.width}, 2000, 'Quart.easeOut');
        //     tween.start();
        // }

        // if (model.state('side', right)) {
        const tween = game.add.tween(menuContainer).to( { x: game.world.width + menuContainer.width}, 2000, 'Quart.easeOut');
        tween.start();
        // }
    }

    function showBetMenu(container, game) {
        let deltaX = container.width * 0.3;

        const betContainer = game.add.group();
        container.add(betContainer);
        const menuBetTitle = game.add.sprite(container.width / 2, game.world.height * 0.07, 'menuButtons', 'setbetText.png', betContainer);
        menuBetTitle.anchor.set(0.5);

        const menuMaxBet = game.add.sprite(container.width / 2, game.world.height * 0.22, 'menuButtons', 'maxBet.png', betContainer);
        menuMaxBet.anchor.set(0.5);

        const betLevelText = game.add.sprite(container.width / 2, game.world.height * 0.36, 'menuButtons', 'betLevelText.png', betContainer);
        betLevelText.anchor.set(0.5);

        const betLevelBG = game.add.sprite(container.width / 2, game.world.height * 0.47, 'menuButtons', 'empty.png', betContainer);
        betLevelBG.anchor.set(0.5);

        const betValue = model.data('currentBalance').betValue;

        const betValueText = game.add.text(betLevelBG.x, betLevelBG.y, betValue, {font: 'bold 60px Arial', fill: '#90fd5a', align: 'center'}, betContainer);
        betValueText.anchor.set(0.5);
        betValueText.setShadow(0, 0, '#90fd5a', 8);

        const betLevelPlus = game.add.sprite(betLevelBG.x + deltaX, game.world.height * 0.47, 'menuButtons', 'plus.png', betContainer);
        betLevelPlus.anchor.set(0.5);

        betLevelPlus.inputEnabled = true;
        betLevelPlus.input.priorityID = 2;
        betLevelPlus.events.onInputDown.add(function () {
            console.log('i am here');
        });

        const betLevelMinus = game.add.sprite(betLevelBG.x - deltaX, game.world.height * 0.47, 'menuButtons', 'minus.png', betContainer);
        betLevelMinus.anchor.set(0.5);

        betLevelMinus.inputEnabled = true;
        betLevelMinus.input.priorityID = 2;
        betLevelMinus.events.onInputDown.add(function () {
            console.log('i am here');
        });

        const coinValueText = game.add.sprite(container.width / 2, game.world.height * 0.59, 'menuButtons', 'coinValueText.png', betContainer);
        coinValueText.anchor.set(0.5);

        const coinValueBG = game.add.sprite(container.width / 2, game.world.height * 0.7, 'menuButtons', 'empty.png', betContainer);
        coinValueBG.anchor.set(0.5);

        const coinsValue = model.data('currentBalance').coinsValue;

        const coinsValueText = game.add.text(coinValueBG.x, coinValueBG.y, coinsValue, {font: 'bold 35px Arial', fill: '#90fd5a', align: 'center'}, betContainer);
        coinsValueText.anchor.set(0.5);
        coinsValueText.setShadow(0, 0, '#90fd5a', 8);


        const coinValuePlus = game.add.sprite(coinValueBG.x + deltaX, game.world.height * 0.7, 'menuButtons', 'plus.png', betContainer);
        coinValuePlus.anchor.set(0.5);

        coinValuePlus.inputEnabled = true;
        coinValuePlus.input.priorityID = 2;
        coinValuePlus.events.onInputDown.add(function () {
            console.log('i am here');
        });

        const coinValueMinus = game.add.sprite(coinValueBG.x - deltaX, game.world.height * 0.7, 'menuButtons', 'minus.png', betContainer);
        coinValueMinus.anchor.set(0.5);

        coinValueMinus.inputEnabled = true;
        coinValueMinus.input.priorityID = 2;
        coinValueMinus.events.onInputDown.add(function () {
            console.log('i am here');
        });
    }

    function showAutoMenu(container, game) {
        const autoContainer = game.add.group();
        container.add(autoContainer);

        const autoTitle = game.add.text(container.width / 2, game.world.height * 0.07, 'AUTOPLAY', {font: 'bold 40px Arial', fill: '#fff', align: 'center'}, autoContainer);
        autoTitle.anchor.set(0.5);
        autoTitle.setShadow(0, 0, '#fff', 4);

        const autoBG10 = game.add.sprite(0, game.world.height * 0.25, 'menuButtons', 'empty.png', autoContainer);
        autoBG10.anchor.set(0.5);

        let deltaX = (container.width - autoBG10.width * 2.5) / 3;
        autoBG10.x = deltaX + autoBG10.width / 2;

        const autoText10 = game.add.text(autoBG10.x, autoBG10.y, '10', {font: 'bold 60px Arial', fill: '#90fd5a', align: 'center'}, autoContainer);
        autoText10.anchor.set(0.5);
        autoText10.setShadow(0, 0, '#90fd5a', 6);

        autoBG10.inputEnabled = true;
        autoBG10.input.priorityID = 2;
        autoBG10.events.onInputDown.add(function () {
            console.log('i am here');
        });

        const autoBG25 = game.add.sprite(2 * deltaX + 1.5 * autoBG10.width, game.world.height * 0.25, 'menuButtons', 'empty.png', autoContainer);
        autoBG25.anchor.set(0.5);

        const autoText25 = game.add.text(autoBG25.x, autoBG25.y, '25', {font: 'bold 60px Arial', fill: '#90fd5a', align: 'center'}, autoContainer);
        autoText25.anchor.set(0.5);
        autoText25.setShadow(0, 0, '#90fd5a', 6);

        autoBG25.inputEnabled = true;
        autoBG25.input.priorityID = 2;
        autoBG25.events.onInputDown.add(function () {
            console.log('i am here');
        });

        const autoBG50 = game.add.sprite(autoBG10.x, game.world.height * 0.47, 'menuButtons', 'empty.png', autoContainer);
        autoBG50.anchor.set(0.5);

        const autoText50 = game.add.text(autoBG50.x, autoBG50.y, '50', {font: 'bold 60px Arial', fill: '#90fd5a', align: 'center'}, autoContainer);
        autoText50.anchor.set(0.5);
        autoText50.setShadow(0, 0, '#90fd5a', 6);

        autoBG50.inputEnabled = true;
        autoBG50.input.priorityID = 2;
        autoBG50.events.onInputDown.add(function () {
            console.log('i am here');
        });

        const autoBG100 = game.add.sprite(autoBG25.x, game.world.height * 0.47, 'menuButtons', 'empty.png', autoContainer);
        autoBG100.anchor.set(0.5);

        const autoText100 = game.add.text(autoBG100.x, autoBG100.y, '100', {font: 'bold 45px Arial', fill: '#90fd5a', align: 'center'}, autoContainer);
        autoText100.anchor.set(0.5);
        autoText100.setShadow(0, 0, '#90fd5a', 6);

        autoBG100.inputEnabled = true;
        autoBG100.input.priorityID = 2;
        autoBG100.events.onInputDown.add(function () {
            console.log('i am here');
        });

        const autoBG250 = game.add.sprite(autoBG10.x, game.world.height * 0.7, 'menuButtons', 'empty.png', autoContainer);
        autoBG250.anchor.set(0.5);

        const autoText250 = game.add.text(autoBG250.x, autoBG250.y, '250', {font: 'bold 45px Arial', fill: '#90fd5a', align: 'center'}, autoContainer);
        autoText250.anchor.set(0.5);
        autoText250.setShadow(0, 0, '#90fd5a', 6);

        autoBG250.inputEnabled = true;
        autoBG250.input.priorityID = 2;
        autoBG250.events.onInputDown.add(function () {
            console.log('i am here');
        });

        const autoBG500 = game.add.sprite(autoBG25.x, game.world.height * 0.7, 'menuButtons', 'empty.png', autoContainer);
        autoBG500.anchor.set(0.5);

        const autoText500 = game.add.text(autoBG500.x, autoBG500.y, '250', {font: 'bold 45px Arial', fill: '#90fd5a', align: 'center'}, autoContainer);
        autoText500.anchor.set(0.5);
        autoText500.setShadow(0, 0, '#90fd5a', 6);

        autoBG500.inputEnabled = true;
        autoBG500.input.priorityID = 2;
        autoBG500.events.onInputDown.add(function () {
            console.log('i am here');
        });

    }

    function showSettingsMenu(container, game) {
        const settingsContainer = game.add.group();
        container.add(settingsContainer);

        const settingsTitle = game.add.text(container.width / 2, game.world.height * 0.07, 'SETTINGS', {font: 'bold 40px Arial', fill: '#fff', align: 'center'}, settingsContainer);
        settingsTitle.anchor.set(0.5);

        const soundButton = game.add.sprite(0, game.world.height * 0.2, 'menuButtons', 'soundOff.png', settingsContainer);
        soundButton.anchor.set(0.5);

        let deltaX = (container.width - soundButton.width * 2.5) / 3;
        soundButton.x = deltaX + soundButton.width / 2;
        let deltaY = 20;

        soundButton.inputEnabled = true;
        soundButton.input.priorityID = 2;
        soundButton.events.onInputDown.add(function () {
            console.log('i am here');
        });

        const soundText = game.add.sprite(soundButton.x, soundButton.y + soundButton.height / 2 + deltaY, 'menuButtons', 'soundText.png', settingsContainer);
        soundText.anchor.set(0.5);

        const musicButton = game.add.sprite(2 * deltaX + 1.5 * soundButton.width, game.world.height * 0.2, 'menuButtons', 'musicOn.png', settingsContainer);
        musicButton.anchor.set(0.5);

        musicButton.inputEnabled = true;
        musicButton.input.priorityID = 2;
        musicButton.events.onInputDown.add(function () {
            console.log('i am here');
        });

        const musicText = game.add.sprite(musicButton.x, musicButton.y + musicButton.height / 2 + deltaY, 'menuButtons', 'musicText.png', settingsContainer);
        musicText.anchor.set(0.5);

        const fastSpinButton = game.add.sprite(soundButton.x, game.world.height * 0.45, 'menuButtons', 'fastSpinOff.png', settingsContainer);
        fastSpinButton.anchor.set(0.5);

        fastSpinButton.inputEnabled = true;
        fastSpinButton.input.priorityID = 2;
        fastSpinButton.events.onInputDown.add(function () {
            console.log('i am here');
        });

        const fastSpinText = game.add.sprite(fastSpinButton.x, fastSpinButton.y + fastSpinButton.height / 2 + deltaY, 'menuButtons', 'fastSpinText.png', settingsContainer);
        fastSpinText.anchor.set(0.5);

        const handModeButton = game.add.sprite(musicButton.x, game.world.height * 0.45, 'menuButtons', 'handModeOff.png', settingsContainer);
        handModeButton.anchor.set(0.5);

        handModeButton.inputEnabled = true;
        handModeButton.input.priorityID = 2;
        handModeButton.events.onInputDown.add(function () {
            console.log('i am here');
        });

        const handModeText = game.add.sprite(handModeButton.x, handModeButton.y + handModeButton.height / 2 + deltaY, 'menuButtons', 'handModeText.png', settingsContainer);
        handModeText.anchor.set(0.5);

        const rulesButton = game.add.sprite(soundButton.x, game.world.height * 0.7, 'menuButtons', 'infoOn.png', settingsContainer);
        rulesButton.anchor.set(0.5);

        rulesButton.inputEnabled = true;
        rulesButton.input.priorityID = 2;
        rulesButton.events.onInputDown.add(function () {
            console.log('i am here');
        });

        const rulesText = game.add.sprite(rulesButton.x, rulesButton.y + rulesButton.height / 2 + deltaY, 'menuButtons', 'infoText.png', settingsContainer);
        rulesText.anchor.set(0.5);

        const historyButton = game.add.sprite(musicButton.x, game.world.height * 0.7, 'menuButtons', 'historyOff.png', settingsContainer);
        historyButton.anchor.set(0.5);

        historyButton.inputEnabled = true;
        historyButton.input.priorityID = 2;
        historyButton.events.onInputDown.add(function () {
            console.log('i am here');
        });

        const historyText = game.add.sprite(historyButton.x, historyButton.y + historyButton.height / 2 + deltaY, 'menuButtons', 'historyText.png', settingsContainer);
        historyText.anchor.set(0.5);

    }

    return {
        drawMenu,
        showBetMenu
    };

})();
