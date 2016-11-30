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
            if (!model.state('sound') && !model.state('music')) {
                soundButton.frameName = 'soundOut.png';
            }
            model.el('soundButton', soundButton);
            return soundButton;
        },

        autoCount: function({
            amount = 10,
            game = model.el('game'),
            container = model.group('buttons'),
            x = model.el('spinButton').x,
            y = model.el('spinButton').y,
            font = '60px Arial, Helvetica',
            color = '#fff'
        }) {
            if (amount >= 250) {
                font = '40px Arial, Helvetica';
            }
            let autoCount = game.add.text(x, y, amount, {font: font, fill: color, align: 'center'}, container);
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

        lockedButtons: function() {
            model.el('betButton').frameName = 'setBetOut.png';
            model.el('menuButton').frameName = 'menuOut.png';
            model.el('autoButton').frameName = 'autoOut.png';
        },

        unlockedButtons: function() {
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
