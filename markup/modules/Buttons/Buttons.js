import { model } from '../../modules/Model/Model';

export let buttons = (function () {

    // let menuButton;
    // let soundButton;
    let autoButton;
    let spinButton;
    let betButton;

    function drawMobileButtons(container, game, mainWidth) {

        spinButton = game.add.sprite(0, game.world.centerY * 0.9, 'mobileButtons', 'spin.png', container);
        spinButton.anchor.set(0.5);
        // spinButton.on('click', handleSpinClick);

        let delta = (game.game.width - mainWidth - spinButton.width) / 4;
        let xRight = 3 * delta + mainWidth + (spinButton.width / 2);
        let xLeft = delta + spinButton.width / 2;

        model.data('buttonsDelta', delta);
        model.data('buttonsXRight', xRight);
        model.data('buttonsXLeft', xLeft);

        spinButton.x = xRight;

        autoButton = game.add.sprite(xRight, 0, 'mobileButtons', 'auto.png', container);
        autoButton.y = spinButton.y - spinButton.width / 2 - delta - autoButton.width / 2;
        autoButton.anchor.set(0.5);
        // autoButton.on('click', handleAutoClick);

        betButton = game.add.sprite(xRight, 0, 'mobileButtons', 'setBet.png', container);
        betButton.y = spinButton.y + spinButton.width / 2 + delta + betButton.width / 2;
        betButton.anchor.set(0.5);
        // betButton.on('click', handleBetClick);

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
