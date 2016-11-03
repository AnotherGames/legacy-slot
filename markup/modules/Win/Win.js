import { model } from 'modules/Model/Model';
import { events } from 'modules/Events/Events';

export let win = (function() {

    function drawWin() {
        let game = model.el('game');
        let data = model.data('rollResponse');

        let winTop = game.add.group();
        let winTotal = game.add.sprite(game.world.centerX, game.world.centerY, 'winTotal', null, winTop);
        winTotal.anchor.set(0.5);
    }

    events.on('roll:end', drawWin);

    return {

    };

})();
