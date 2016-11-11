import { model } from 'modules/Model/Model';

export let view = (() => {

    let draw = {

        SpinButton: function({
                x = 0,
                y = model.el('game').world.centerY,
                container = model.group('buttons')
        }) {
            const game = model.el('game');
            const spinButton = game.add.sprite(x, y, 'mobileButtons', 'spin.png', container);
            spinButton.anchor.set(0.5);
            model.el('spinButton', spinButton);
            return spinButton;
        },

        AutoButton: function({
                x = 0,
                y = 0,
                container = model.group('buttons')
        }) {
            const game = model.el('game');
            const autoButton = game.add.sprite(x, y, 'mobileButtons', 'auto.png', container);
            autoButton.anchor.set(0.5);
            model.el('autoButton', autoButton);
            return autoButton;
        },

        BetButton: function({
                x = 0,
                y = 0,
                container = model.group('buttons')
        }) {
            const game = model.el('game');
            const betButton = game.add.sprite(x, y, 'mobileButtons', 'setBet.png', container);
            betButton.anchor.set(0.5);
            model.el('betButton', betButton);
            return betButton;
        },

        MenuButton: function({
                x = 0,
                y = 0,
                container = model.group('buttons')
        }) {
            const game = model.el('game');
            const menuButton = game.add.sprite(x, y, 'mobileButtons', 'menu.png', container);
            menuButton.anchor.set(0.5);
            model.el('menuButton', menuButton);
            return menuButton;
        },

        SoundButton: function({
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

    };

    return {
        draw
    };
})();
