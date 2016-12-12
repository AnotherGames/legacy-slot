import { model } from 'modules/Model/Model';

export let view = (() => {

    let draw = {

        SpinButton: function({
            game = model.el('game'),
            container = model.group('buttons'),
            x = 0,
            y = model.el('game').world.centerY - 5
        }) {
            let spinButton = game.add.sprite(x, y, 'mobileButtons', 'spin.png', container);
                spinButton.anchor.set(0.5);
            model.el('spinButton', spinButton);
            return spinButton;
        },

        AutoButton: function({
            game = model.el('game'),
            container = model.group('buttons'),
            x = 0,
            y = 0
        }) {
            let autoButton = game.add.sprite(x, y, 'mobileButtons', 'auto.png', container);
                autoButton.anchor.set(0.5);
            model.el('autoButton', autoButton);
            return autoButton;
        },

        BetButton: function({
            game = model.el('game'),
            container = model.group('buttons'),
            x = 0,
            y = 0
        }) {
            let betButton = game.add.sprite(x, y, 'mobileButtons', 'setBet.png', container);
                betButton.anchor.set(0.5);
            model.el('betButton', betButton);
            return betButton;
        },

        MenuButton: function({
            game = model.el('game'),
            container = model.group('buttons'),
            x = 0,
            y = 0
        }) {
            let menuButton = game.add.sprite(x, y, 'mobileButtons', 'menu.png', container);
                menuButton.anchor.set(0.5);
            model.el('menuButton', menuButton);
            return menuButton;
        },

        SoundButton: function({
            game = model.el('game'),
            container = model.group('buttons'),
            x = 0,
            y = 0
        }) {
            let soundButton = game.add.sprite(x, y, 'mobileButtons', 'sound.png', container);
                soundButton.anchor.set(0.5);
            if (!model.state('globalSound')) {
                soundButton.frameName = 'soundOut.png';
            }
            model.el('soundButton', soundButton);
            return soundButton;
        },

        autoCount: function({
            game = model.el('game'),
            container = model.group('buttons'),
            amount = 10,
            style = {font: '60px Arial, Helvetica', align: 'center', fill: '#ffffff'},
            x = model.el('spinButton').x,
            y = model.el('spinButton').y,
        }) {
            let autoCount = game.add.text(x, y, amount, style, container);
                autoCount.anchor.set(0.5);
            model.el('autoCount', autoCount);
            return autoCount;
        },

        updateCount: function({
            count = 10
        }) {
            model.el('autoCount').text = count;
        },

        removeCount: function() {
            model.el('autoCount').destroy();
        },

        lockButtons: function() {
            if(model.desktop
            || model.state('autoplay:start')) return;

            model.el('betButton').frameName = 'setBetOut.png';
            model.el('menuButton').frameName = 'menuOut.png';
            model.el('autoButton').frameName = 'autoOut.png';
        },

        unlockButtons: function() {
            if(model.desktop
            || model.state('autoplay:start')) return;

            model.el('betButton').frameName = 'setBet.png';
            model.el('menuButton').frameName = 'menu.png';
            model.el('autoButton').frameName = 'auto.png';
        }

    };

    let auto = {

        Start: function() {
            model.el('spinButton').frameName = 'spinEmpty.png';
            model.el('betButton').frameName = 'setBetOut.png';
            model.el('menuButton').frameName = 'menuOut.png';
            model.el('autoButton').frameName = 'stop.png';
        },

        Stop: function() {
            model.el('spinButton').frameName = 'spin.png';
            model.el('betButton').frameName = 'setBet.png';
            model.el('menuButton').frameName = 'menu.png';
            model.el('autoButton').frameName = 'auto.png';
        }

    };

    return {
        draw,
        auto
    };
})();
