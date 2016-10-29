import { model } from '../../modules/Model/Model';
import { events } from '../../modules/Events/Events';

export let buttons = (function () {

    let autoButton;
    let spinButton;
    let betButton;

    function drawMobileButtons(container, game, mainWidth) {

        spinButton = game.add.sprite(0, game.world.centerY, 'mobileButtons', 'spin.png', container);
        spinButton.anchor.set(0.5);
        spinButton.inputEnabled = true;
        spinButton.input.priorityID = 1;
        spinButton.events.onInputDown.add(function () {
            // events.trigger('menu:showMenu', 'auto');
            console.log('I am spin Button!');
        });

        let delta = (game.game.width - mainWidth - spinButton.width) / 4;
        let xRight = 3 * delta + mainWidth + (spinButton.width / 2);
        let xLeft = delta + spinButton.width / 2;

        model.data('buttonsDelta', delta);
        model.data('buttonsXRight', xRight);
        model.data('buttonsXLeft', xLeft);

        spinButton.x = xRight;

        autoButton = game.add.sprite(xRight, 0, 'mobileButtons', 'auto.png', container);
        autoButton.y = spinButton.y - spinButton.width / 2 - 2 * delta - autoButton.width / 2;
        autoButton.anchor.set(0.5);
        autoButton.inputEnabled = true;
        autoButton.input.priorityID = 1;
        autoButton.events.onInputDown.add(function () {
            if (model.state('menu') === 'opened') return;
            events.trigger('menu:showMenu', 'auto');
        });

        betButton = game.add.sprite(xRight, 0, 'mobileButtons', 'setBet.png', container);
        betButton.y = spinButton.y + spinButton.width / 2 + 2 * delta + betButton.width / 2;
        betButton.anchor.set(0.5);
        betButton.inputEnabled = true;
        betButton.input.priorityID = 1;
        betButton.events.onInputDown.add(function () {
            if (model.state('menu') === 'opened') return;
            events.trigger('menu:showMenu', 'bet');
        });

        // menuButton = game.add.sprite(xRight, 0, 'mobileButtons', 'menu.png', container);
        // menuButton.anchor.set(0.5);
        // menuButton.on('click', handleMenuClick);

        // soundButton = game.add.sprite(xRight, 0, 'mobileButtons', 'sound.png', container);
        // soundButton.anchor.set(0.5);
        // soundButton.on('click', handleSoundClick);

    }

    return {
        drawMobileButtons
    };

})();
