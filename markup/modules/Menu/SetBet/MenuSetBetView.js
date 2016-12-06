import { model } from 'modules/Model/Model';

export let view = (() => {

    let draw = {
        maxBetButton: function ({
            game = model.el('game'),
            container = model.el('setbetContainer')
        }) {
            let maxBetButton = game.add.sprite(
                container.width / 2,
                game.world.height * 0.22,
                'menuButtons',
                'maxBet.png',
                container);
                maxBetButton.anchor.set(0.5);
            return maxBetButton;
        },

        BetLevelText: function ({
            game = model.el('game'),
            container = model.el('setbetContainer')
        }) {
            let betLevelText = game.add.sprite(
                container.width / 2,
                game.world.height * 0.36,
                'menuButtons',
                'betLevelText.png',
                container);
                betLevelText.anchor.set(0.5);
            return betLevelText;
        },

        BetLevelBG: function ({
            game = model.el('game'),
            container = model.el('setbetContainer')
        }) {
            let betBG = game.add.sprite(
                container.width / 2,
                game.world.height * 0.47,
                'menuButtons',
                'empty.png',
                container);
                betBG.anchor.set(0.5);
            model.el('setbetPanelBetBG', betBG);
            return betBG;
        },

        BetLevelValue: function ({
            game = model.el('game'),
            container = model.el('setbetContainer'),
            betBG = model.el('setbetPanelBetBG'),
            value = model.balance('betValue')
        }) {
            let betLevelValue = game.add.text(
                betBG.x,
                betBG.y,
                value,
                {font: 'bold 60px Arial', fill: '#90fd5a', align: 'center'},
                container);
                betLevelValue.setShadow(0, 0, '#90fd5a', 8);
                betLevelValue.anchor.set(0.5);
            model.el('setbetPanelBetLevelValue', betLevelValue);
            return betLevelValue;
        },

        BetLevelPlus: function ({
            game = model.el('game'),
            container = model.el('setbetContainer'),
            betBG = model.el('setbetPanelBetBG')
        }) {
            let deltaX = container.width * 0.3;

            let betPlus = game.add.sprite(
                betBG.x + deltaX,
                game.world.height * 0.47,
                'menuButtons',
                'plus.png',
                container);
                betPlus.anchor.set(0.5);
            return betPlus;
        },

        BetLevelMinus: function ({
            game = model.el('game'),
            container = model.el('setbetContainer'),
            betBG = model.el('setbetPanelBetBG')
        }) {
            let deltaX = container.width * 0.3;

            let betMinus = game.add.sprite(
                betBG.x - deltaX,
                game.world.height * 0.47,
                'menuButtons',
                'minus.png',
                container);
                betMinus.anchor.set(0.5);
            return betMinus;
        },

        coinText: function ({
            game = model.el('game'),
            container = model.el('setbetContainer')
        }) {
            let coinValue = game.add.sprite(
                container.width / 2,
                game.world.height * 0.59,
                'menuButtons',
                'coinValueText.png',
                container);
                coinValue.anchor.set(0.5);
        },

        coinBG: function ({
            game = model.el('game'),
            container = model.el('setbetContainer')
        }) {
            let coinBG = game.add.sprite(
                container.width / 2,
                game.world.height * 0.7,
                'menuButtons',
                'empty.png',
                container);
                coinBG.anchor.set(0.5);
            model.el('setbetPanelCoinBG', coinBG);
            return coinBG;
        },

        coinValue: function ({
            game = model.el('game'),
            container = model.el('setbetContainer'),
            coinBG = model.el('setbetPanelCoinBG'),
            value = model.balance('coinValue')
        }) {
            let coinText = game.add.text(
                coinBG.x,
                coinBG.y,
                value,
                {font: 'bold 35px Arial', fill: '#90fd5a', align: 'center'},
                container);
                coinText.anchor.set(0.5);
                coinText.setShadow(0, 0, '#90fd5a', 8);
            model.el('setbetPanelCoinValue', coinText);
            return coinText;
        },

        CoinPlus: function ({
            game = model.el('game'),
            container = model.el('setbetContainer'),
            coinBG = model.el('setbetPanelCoinBG')
        }) {
            let deltaX = container.width * 0.3;

            let betPlus = game.add.sprite(
                coinBG.x + deltaX,
                game.world.height * 0.70,
                'menuButtons',
                'plus.png',
                container);
                betPlus.anchor.set(0.5);
            return betPlus;
        },

        CoinMinus: function ({
            game = model.el('game'),
            container = model.el('setbetContainer'),
            coinBG = model.el('setbetPanelCoinBG')
        }) {
            let deltaX = container.width * 0.3;

            let betMinus = game.add.sprite(
                coinBG.x - deltaX,
                game.world.height * 0.70,
                'menuButtons',
                'minus.png',
                container);
                betMinus.anchor.set(0.5);
            return betMinus;
        },

        Container: function ({
            game = model.el('game')
        }) {
            let container = game.add.group();
                container.x = game.world.width;
            model.el('setbetContainer', container);
            return container;
        },

        Overlay: function ({
            game = model.el('game'),
            color = 0x000000,
            alpha = 0
        }) {
            let overlay = game.add.graphics(0, 0)
                .beginFill(color)
                .drawRect(0, 0, game.width, game.height);
                overlay.alpha = alpha;
                overlay.visible = false;
            model.el('setbetOverlay', overlay);
            return overlay;
        },

        BG: function ({
            game = model.el('game'),
            container = model.el('setbetContainer'),
            widthPercentage = 0.22,
            color = 0x000000
        }) {
            let menuBG = game.add.graphics(0, 0, container)
                .beginFill(color)
                .drawRect(0, 0, game.width * widthPercentage, game.height);
            model.el('setbetBG', menuBG);
            return menuBG;
        },

        Border: function ({
            game = model.el('game'),
            container = model.el('setbetContainer'),
            color = 0xffffff,
            alpha = 0.3,
            widthPercentage = 0.002
        }) {
            let menuBorder = game.add.graphics(0, 0, container)
                .beginFill(color, alpha)
                .drawRect(0, 0, game.width * widthPercentage, game.height);
            model.el('setbetBorder', menuBorder);
            return menuBorder;
        },

        Title: function ({
            game = model.el('game'),
            container = model.el('setbetContainer'),
            heightPercentage = 0.07,
            text = 'SET BET',
            style = {font: 'bold 40px Arial', fill: '#fff', align: 'center'}
        }) {
            let setbetTitle = game.add.text(
                container.width / 2,
                game.height * heightPercentage,
                text,
                style,
                container);
                setbetTitle.anchor.set(0.5);
            model.el('setbetTitle', setbetTitle);
            return setbetTitle;
        },

        BackButton: function ({
            game = model.el('game'),
            container = model.el('setbetContainer'),
            heightPercentage = 0.9
        }) {
            let backButton = game.add.sprite(
                container.width / 2,
                game.world.height * heightPercentage,
                'mobileButtons',
                'return.png',
                container);
                backButton.anchor.set(0.5);
            model.el('setbetBackButton', backButton);
            return backButton;
        }

    };

    let update = {

        CoinValue: function () {
            model.el('setbetPanelCoinValue').text = model.balance('coinValue');
        },

        BetValue: function () {
            model.el('setbetPanelBetLevelValue').text = model.balance('betValue');
        }

    };

    let show = {

        Panel: function ({
            game = model.el('game'),
            container = model.el('setbetContainer'),
            time = 700
        }) {
            let border = model.el('setbetBorder');
            if (model.state('gameSideLeft')) {
                container.x = game.width;
                border.x = 0;
                return game.add.tween(container).to( { x: game.width - container.width }, time, 'Quart.easeOut', true);
            } else {
                container.x = -container.width;
                border.x = model.el('setbetContainer').width - border.width;
                return game.add.tween(container).to( { x: 0 }, time, 'Quart.easeOut', true);
            }
        },

        Overlay: function ({
            game = model.el('game'),
            finalAlpha = 0.5,
            time = 700
        }) {
            let overlay = model.el('setbetOverlay');
                overlay.visible = true;
            return game.add.tween(overlay).to( { alpha: finalAlpha }, time, 'Quart.easeOut', true);
        }
    };

    let hide = {

        Panel: function ({
            game = model.el('game'),
            container = model.el('setbetContainer'),
            time = 700
        }) {
            if (model.state('gameSideLeft')) {
                return game.add.tween(container).to( { x: game.width }, time, 'Quart.easeOut', true);
            } else {
                return game.add.tween(container).to( { x: -container.width }, time, 'Quart.easeOut', true);
            }
        },

        Overlay: function ({
            game = model.el('game'),
            time = 700
        }) {
            let overlay = model.el('setbetOverlay');
            let tween = game.add.tween(overlay).to( { alpha: 0 }, time, 'Quart.easeOut', true);
                tween.onComplete.add(() => {
                    model.el('setbetOverlay').visible = false;
                });
            return tween;
        }

    };

    return {
        draw,
        update,
        show,
        hide
    };
})();
