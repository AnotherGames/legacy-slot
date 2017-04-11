import { model } from 'modules/Model/Model';
import { config } from 'modules/Util/Config';

export let view = (() => {

    let draw = {
        _button: function ({
            game = model.el('game'),
            container = model.el('settingsContainer'),
            spriteName = 'soundOn.png',
            heightPercentage = 0.2,
            side = 'left'
        }) {
            let button = game.add.sprite(
                0,
                game.height * heightPercentage,
                'menuButtons',
                spriteName,
                container);
            button.anchor.set(0.5);

            // Расчет отступа от края контенера
            let buttonMargin = (container.width - button.width * 2.5) / 3;
            if (side === 'left') {
                button.x = buttonMargin + button.width / 2;
            } else {
                button.x = 2 * buttonMargin + 1.5 * button.width;
            }

            return button;
        },

        _buttonText: function ({
            game = model.el('game'),
            container = model.el('settingsContainer'),
            button = model.el('settingsSoundButton'),
            spriteName = 'soundText.png'
        }) {
            let text = game.add.sprite(
                button.x,
                button.y + button.height / 2,
                'menuButtons',
                spriteName,
                container);
            text.y += text.height;
            text.anchor.set(0.5);
            return text;
        },

        Container: function ({
            game = model.el('game')
        }) {
            let container = game.add.group();
            container.x = game.world.width;
            model.el('settingsContainer', container);
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
            model.el('settingsOverlay', overlay);
            return overlay;
        },

        BG: function ({
            game = model.el('game'),
            container = model.el('settingsContainer'),
            widthPercentage = 0.22,
            color = 0x000000
        }) {
            let menuBG = game.add.graphics(0, 0, container)
                .beginFill(color)
                .drawRect(0, 0, game.width * widthPercentage, game.height);
            model.el('settingsBG', menuBG);
            return menuBG;
        },

        Border: function ({
            game = model.el('game'),
            container = model.el('settingsContainer'),
            color = 0xffffff,
            alpha = 0.3,
            widthPercentage = 0.002
        }) {
            let menuBorder = game.add.graphics(0, 0, container)
                .beginFill(color, alpha)
                .drawRect(0, 0, game.width * widthPercentage, game.height);
            model.el('settingsBorder', menuBorder);
            return menuBorder;
        },

        Title: function ({
            game = model.el('game'),
            container = model.el('settingsContainer'),
            heightPercentage = 0.07,
            text = 'SETTINGS',
            style = {font: 'bold 40px Arial', fill: '#fff', align: 'center'}
        }) {
            let settingsTitle = game.add.text(
                container.width / 2,
                game.height * heightPercentage,
                text,
                style,
                container);
            settingsTitle.anchor.set(0.5);
            model.el('settingsTitle', settingsTitle);
            return settingsTitle;
        },

        SoundButton: function ({
            container = model.el('settingsContainer'),
            heightPercentage = 0.2
        }) {
            let button = this._button({
                container,
                spriteName: 'soundOn.png',
                heightPercentage,
                side: 'left'
            });

            if (!model.state('sound')) {
                button.frameName = 'soundOff.png';
            }

            model.el('settingsSoundButton', button);
            return button;
        },

        SoundButtonText: function ({
            container = model.el('settingsContainer')
        }) {
            let text = this._buttonText({
                container,
                button: model.el('settingsSoundButton'),
                spriteName: 'soundText.png'
            });

            model.el('SettingsSoundText', text);
            return text;
        },

        MusicButton: function ({
            container = model.el('settingsContainer'),
            heightPercentage = 0.2
        }) {
            let button = this._button({
                container,
                spriteName: 'musicOn.png',
                heightPercentage,
                side: 'right'
            });

            if (!model.state('music')) {
                button.frameName = 'musicOff.png';
            }

            model.el('settingsMusicButton', button);
            return button;
        },

        MusicButtonText: function ({
            container = model.el('settingsContainer')
        }) {
            let text = this._buttonText({
                container,
                button: model.el('settingsMusicButton'),
                spriteName: 'musicText.png'
            });

            model.el('SettingsMusicText', text);
            return text;
        },

        FastSpinButton: function ({
            container = model.el('settingsContainer'),
            heightPercentage = 0.45
        }) {
            let button = this._button({
                container,
                spriteName: 'fastSpinOn.png',
                heightPercentage,
                side: 'left'
            });

            if (!model.state('fastRoll')) {
                button.frameName = 'fastSpinOff.png';
            }

            model.el('settingsFastSpinButton', button);
            return button;
        },

        FastSpinButtonText: function ({
            container = model.el('settingsContainer')
        }) {
            let text = this._buttonText({
                container,
                button: model.el('settingsFastSpinButton'),
                spriteName: 'fastSpinText.png'
            });

            model.el('SettingsFastSpinText', text);
            return text;
        },

        HandModeButton: function ({
            container = model.el('settingsContainer'),
            heightPercentage = 0.45
        }) {
            let button = this._button({
                container,
                spriteName: 'handModeOn.png',
                heightPercentage,
                side: 'rigth'
            });

            if (model.state('gameSideLeft')) {
                button.frameName = 'handModeOff.png';
            }

            model.el('settingsHandModeButton', button);
            return button;
        },

        HandModeButtonText: function ({
            container = model.el('settingsContainer')
        }) {
            let text = this._buttonText({
                container,
                button: model.el('settingsHandModeButton'),
                spriteName: 'handModeText.png'
            });

            model.el('SettingsHandModeText', text);
            return text;
        },

        RulesButton: function ({
            container = model.el('settingsContainer'),
            heightPercentage = 0.7
        }) {
            let button = this._button({
                container,
                spriteName: 'infoOn.png',
                heightPercentage,
                side: 'left'
            });

            model.el('settingsRulesButton', button);
            return button;
        },

        RulesButtonText: function ({
            container = model.el('settingsContainer')
        }) {
            let text = this._buttonText({
                container,
                button: model.el('settingsRulesButton'),
                spriteName: 'infoText.png'
            });

            model.el('SettingsRulesText', text);
            return text;
        },

        HistoryButton: function ({
            container = model.el('settingsContainer'),
            heightPercentage = 0.7
        }) {
            let button = this._button({
                container,
                spriteName: 'historyOff.png',
                heightPercentage,
                side: 'right'
            });

            model.el('settingsHistoryButton', button);
            return button;
        },

        HistoryButtonText: function ({
            container = model.el('settingsContainer')
        }) {
            let text = this._buttonText({
                container,
                button: model.el('settingsHistoryButton'),
                spriteName: 'historyText.png'
            });

            model.el('SettingsHistoryText', text);
            return text;
        },

        BackButton: function ({
            game = model.el('game'),
            container = model.el('settingsContainer'),
            heightPercentage = 0.9
        }) {
            let backButton = game.add.sprite(
                container.width / 2,
                game.world.height * heightPercentage,
                'mobileButtons',
                'return.png',
                container);
            backButton.anchor.set(0.5);
            model.el('settingsBackButton', backButton);
            return backButton;
        },

        RulesScreen: function (container) {
            let game = model.el('game');
            let infoRules = game.add.sprite(
                game.world.centerX,
                game.world.centerY,
                'info',
                '1_en.png',
                container);
            infoRules.anchor.set(0.5);
            infoRules.scale.set(1.1);
            model.el('infoRules', infoRules);

            let closed = game.add.sprite(
                game.width - 180,
                90,
                'closed',
                null,
                container);
            model.el('closed', closed);

            let arrowRight = game.add.sprite(
                game.width / 2 + 60,
                infoRules.height + 40,
                'ar',
                null,
                container);
            model.el('arrowRight', arrowRight);

            let arrowLeft = game.add.sprite(
                game.width / 2 - 100,
                infoRules.height + 40,
                'arLeft',
                null,
                container);
            model.el('arrowLeft', arrowLeft);

            let infoMarkers = [];
            let infoMarker = game.add.sprite(
                game.width / 2 - 82,
                infoRules.height + 20,
                'infoMarker',
                'marker_on.png',
                container);
            infoMarker.name = 'infoMarker0';
            infoMarkers.push(infoMarker);

            for (let i = 1; i < config.numOfInfoDots; i++) {
                let name = 'infoMarker' + i;
                let marker = game.add.sprite(
                    infoMarker.x,
                    infoRules.height + 20,
                    'infoMarker',
                    'marker_off.png',
                    container);
                marker.name = name;
                marker.x = marker.x + 30 * i;
                infoMarkers.push(marker);
            }

            model.el('infoMarkers', infoMarkers);
            container.visible = false;
            return container;
        }

    };

    let show = {

        Settings: function ({
            game = model.el('game'),
            container = model.el('settingsContainer'),
            time = 700
        }) {
            let border = model.el('settingsBorder');
            if (model.state('gameSideLeft')) {
                container.x = game.width;
                border.x = 0;
                return game.add.tween(container).to( { x: game.width - container.width }, time, 'Quart.easeOut', true);
            } else {
                container.x = -container.width;
                border.x = container.width - border.width;
                return game.add.tween(container).to( { x: 0 }, time, 'Quart.easeOut', true);
            }
        },

        Overlay: function ({
            game = model.el('game'),
            finalAlpha = 0.5,
            time = 700
        }) {
            let overlay = model.el('settingsOverlay');
            overlay.visible = true;
            return game.add.tween(overlay).to( { alpha: finalAlpha }, time, 'Quart.easeOut', true);
        },

        Rules: function ({
            game = model.el('game'),
            time = 700
        }) {
            let container = model.group('info');
            container.visible = true;
            return game.add.tween(container).to( { alpha: 1 }, time, 'Quart.easeOut', true);
        }
    };

    let hide = {

        Settings: function ({
            game = model.el('game'),
            container = model.el('settingsContainer'),
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
            let overlay = model.el('settingsOverlay');
            let tween = game.add.tween(overlay).to( { alpha: 0 }, time, 'Quart.easeOut', true);
            tween.onComplete.add(() => {
                model.el('settingsOverlay').visible = false;
            });
            return tween;
        },

        Rules: function ({
            game = model.el('game'),
            time = 700
        }) {
            let container = model.group('infoTable');
            let tween = game.add.tween(container).to( { alpha: 0 }, time, 'Quart.easeOut', true);
            tween.onComplete.add(() => {
                container.visible = false;
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
