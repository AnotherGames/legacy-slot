import { model } from 'modules/Model/Model';
import { events } from 'modules/Events/Events';

export let win = (function() {

    function drawWin() {
        let data = model.data('rollResponse');
        let winTotalData = data.Balance.TotalWinCoins;
        if (winTotalData === 0) return;

        let game = model.el('game');
        let mainContainer = model.el('mainContainer');
        let gameMachine = mainContainer.getAt(2);

        let winTop = game.add.group();
        mainContainer.addAt(winTop, 3);
        model.el('winTop', winTop);

        let winTotal = game.add.sprite(gameMachine.width / 2, gameMachine.height / 2, 'winTotal', null, winTop);
        winTotal.anchor.set(0.5);

        let winTotalText = game.add.text(gameMachine.width / 2, gameMachine.height / 2 + 5, winTotalData, {font: '60px Helvetice, Arial', fill: '#e8b075', align: 'center'}, winTop);
        winTotalText.anchor.set(0.5);
    }

    function drawWinNumbers() {

    }

    function cleanWin() {
        let winTop = model.el('winTop');
        if (winTop) {
            winTop.removeAll(true);
        }
    }

    events.on('roll:end', drawWin);
    events.on('roll:start', cleanWin);

    return {

    };

})();
