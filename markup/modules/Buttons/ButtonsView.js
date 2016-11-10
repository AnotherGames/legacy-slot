import { model } from 'modules/Model/Model';

export let view = (() => {

    function drawSpinButton({
            x = 0,
            y = model.el('game').world.centerY,
            container = model.group('buttons')
    }) {
        const game = model.el('game');
        const spinButton = game.add.sprite(x, y, 'mobileButtons', 'spin.png', container);
        spinButton.anchor.set(0.5);
        model.el('spinButton', spinButton);
        return spinButton;
    }

    function drawAutoButton({
            x = 0,
            y = 0,
            container = model.group('buttons')
    }) {
        const game = model.el('game');
        const autoButton = game.add.sprite(x, y, 'mobileButtons', 'auto.png', container);
        autoButton.anchor.set(0.5);
        model.el('autoButton', autoButton);
        return autoButton;
    }

    function drawBetButton({
            x = 0,
            y = 0,
            container = model.group('buttons')
    }) {
        const game = model.el('game');
        const betButton = game.add.sprite(x, y, 'mobileButtons', 'setBet.png', container);
        betButton.anchor.set(0.5);
        model.el('betButton', betButton);
        return betButton;
    }

    function drawMenuButton({
            x = 0,
            y = 0,
            container = model.group('buttons')
    }) {
        const game = model.el('game');
        const menuButton = game.add.sprite(x, y, 'mobileButtons', 'menu.png', container);
        menuButton.anchor.set(0.5);
        model.el('menuButton', menuButton);
        return menuButton;
    }

    function drawSoundButton({
            x = 0,
            y = 0,
            container = model.group('buttons')
    }) {
        const game = model.el('game');
        const soundButton = game.add.sprite(x, y, 'mobileButtons', 'sound.png', container);
        soundButton.anchor.set(0.5);
        model.el('soundButton', soundButton);
        return soundButton;
    }

    return {
        drawSpinButton,
        drawBetButton,
        drawAutoButton,
        drawMenuButton,
        drawSoundButton
    }
})();
