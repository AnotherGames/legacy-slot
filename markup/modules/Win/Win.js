import { model } from 'modules/Model/Model';
import { events } from 'modules/Events/Events';

export let win = (function() {

    function drawWin() {
        let game = model.el('game');
        let data = model.data('rollResponse');

        let winTop = game.add.group();
        game.add.sprite(0, 0, 'winTotal');
    }

    events.on('roll:end', drawWin);

    return {

    };

})();
