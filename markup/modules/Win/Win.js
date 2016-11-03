import { model } from 'modules/Model/Model';
import { events } from 'modules/Events/Events';
import { config } from 'modules/Util/Config';

export let win = (function() {

    function showWin() {
        let data = model.data('rollResponse');
        let winTotalData = data.Balance.TotalWinCoins;
        let winLines = data.WinLines;

        if (winTotalData === 0) return;

        let game = model.el('game');
        let mainContainer = model.el('mainContainer');

        let winTop = game.add.group();
        mainContainer.addAt(winTop, 3);
        model.el('winTop', winTop);

        drawTotalWin(winTotalData);

        winLines.forEach((winLine) => {
            drawWinNumber(winLine.Line);
        })

    }

    function drawTotalWin(winTotalData) {

        let game = model.el('game');
        let mainContainer = model.el('mainContainer');
        let winTop = model.el('winTop');
        let gameMachine = mainContainer.getAt(2);

        let winTotal = game.add.sprite(gameMachine.width / 2, gameMachine.height / 2, 'winTotal', null, winTop);
        winTotal.anchor.set(0.5);

        let winTotalText = game.add.text(gameMachine.width / 2, gameMachine.height / 2 + 5, winTotalData, {font: '60px Helvetice, Arial', fill: '#e8b075', align: 'center'}, winTop);
        winTotalText.anchor.set(0.5);

    }

    function drawWinNumber(number) {
        if (number < 0) return;

        addWinSplash(number, 0);
        addWinSplash(number, 1);

    }

    function addWinSplash(number, indx) {
        let game = model.el('game');
        let winTop = model.el('winTop');

        let winSplash = game.add.sprite(0, 0, 'win', null, winTop);
        winSplash.anchor.set(0.5);
        winSplash.position.x = config[model.state('res')].win[number][indx].x;
        winSplash.position.y = config[model.state('res')].win[number][indx].y;
        winSplash.animations.add('win', Phaser.Animation.generateFrameNames('Splash-Splash', 1, 14, '.png', 1), 15, false);
        winSplash.animations.play('win');
        winSplash.animations.getAnimation('win').killOnComplete = true;
    }

    function cleanWin() {
        let winTop = model.el('winTop');
        if (winTop) {
            winTop.removeAll(true);
        }
    }

    events.on('roll:end', showWin);
    events.on('roll:start', cleanWin);

    return {

    };

})();
