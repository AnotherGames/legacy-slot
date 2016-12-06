import { model } from 'modules/Model/Model';

export let view = (() => {

    let draw = {
        Button: function ({
            game = model.el('game'),
            container = model.el('autoplayContainer'),
            heightPercentage = 0.2,
            text = '0',
            side = 'left'
        }) {
            let button = game.add.sprite(
                0,
                game.height * heightPercentage,
                'menuButtons',
                'empty.png',
                container);
                button.anchor.set(0.5);

            let buttonMargin = (container.width - button.width * 2.5) / 3;
            if (side === 'left') {
                button.x = buttonMargin + button.width / 2;
            } else {
                button.x = 2 * buttonMargin + 1.5 * button.width;
            }

            let buttonText = game.add.text(
                button.x + 2,
                button.y + 2,
                text,
                {font: 'bold 45px Arial', fill: '#90fd5a', align: 'center'},
                container);
                buttonText.anchor.set(0.5);
                buttonText.setShadow(0, 0, '#90fd5a', 6);

            return button;
        },

        Container: function ({
            game = model.el('game')
        }) {
            let container = game.add.group();
                container.x = game.world.width;
            model.el('autoplayContainer', container);
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
            model.el('autoplayOverlay', overlay);
            return overlay;
        },

        BG: function ({
            game = model.el('game'),
            container = model.el('autoplayContainer'),
            widthPercentage = 0.22,
            color = 0x000000
        }) {
            let menuBG = game.add.graphics(0, 0, container)
                .beginFill(color)
                .drawRect(0, 0, game.width * widthPercentage, game.height);
            model.el('autoplayBG', menuBG);
            return menuBG;
        },

        Border: function ({
            game = model.el('game'),
            container = model.el('autoplayContainer'),
            color = 0xffffff,
            alpha = 0.3,
            widthPercentage = 0.002
        }) {
            let menuBorder = game.add.graphics(0, 0, container)
                .beginFill(color, alpha)
                .drawRect(0, 0, game.width * widthPercentage, game.height);
            model.el('autoplayBorder', menuBorder);
            return menuBorder;
        },

        Title: function ({
            game = model.el('game'),
            container = model.el('autoplayContainer'),
            heightPercentage = 0.07,
            text = 'AUTOPLAY',
            style = {font: 'bold 40px Arial', fill: '#fff', align: 'center'}
        }) {
            let autoplayTitle = game.add.text(
                container.width / 2,
                game.height * heightPercentage,
                text,
                style,
                container);
                autoplayTitle.anchor.set(0.5);
            model.el('autoplayTitle', autoplayTitle);
            return autoplayTitle;
        },

        BackButton: function ({
            game = model.el('game'),
            container = model.el('autoplayContainer'),
            heightPercentage = 0.9
        }) {
            let backButton = game.add.sprite(
                container.width / 2,
                game.world.height * heightPercentage,
                'mobileButtons',
                'return.png',
                container);
                backButton.anchor.set(0.5);
            model.el('autoplayBackButton', backButton);
            return backButton;
        }

    };

    let show = {

        Panel: function ({
            game = model.el('game'),
            container = model.el('autoplayContainer'),
            time = 700
        }) {
            let border = model.el('autoplayBorder');
            if (model.state('gameSideLeft')) {
                container.x = game.width;
                border.x = 0;
                return game.add.tween(container).to( { x: game.width - container.width }, time, 'Quart.easeOut', true);
            } else {
                container.x = -container.width;
                border.x = model.el('autoplayContainer').width - border.width;
                return game.add.tween(container).to( { x: 0 }, time, 'Quart.easeOut', true);
            }
        },

        Overlay: function ({
            game = model.el('game'),
            finalAlpha = 0.5,
            time = 700
        }) {
            let overlay = model.el('autoplayOverlay');
                overlay.visible = true;
            return game.add.tween(overlay).to( { alpha: finalAlpha }, time, 'Quart.easeOut', true);
        }
    };

    let hide = {

        Panel: function ({
            game = model.el('game'),
            container = model.el('autoplayContainer'),
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
            let overlay = model.el('autoplayOverlay');
            let tween = game.add.tween(overlay).to( { alpha: 0 }, time, 'Quart.easeOut', true);
                tween.onComplete.add(() => {
                    model.el('autoplayOverlay').visible = false;
                });
            return tween;
        }

    };

    return {
        draw,
        show,
        hide
    };
})();
