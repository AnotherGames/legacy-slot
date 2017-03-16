import { model } from 'modules/Model/Model';

export let view = (() => {

    let draw = {

        MobileFooter: function ({
            game = model.el('game'),
            container = model.group('footer'),
            color = 0x000000,
            heightTop = 40,
            heightBottom = 35,
            alphaTop = 0.5,
            alphaBottom = 0.8
        }) {

            let footerTop = game.add.graphics(0, 0, container)
                .beginFill(color, alphaTop).drawRect(
                    0,
                    game.height - (heightTop + heightBottom),
                    game.width,
                    heightTop
                );
            model.el('footerTop', footerTop);

            let footerBottom = game.add.graphics(0, 0, container)
                .beginFill(color, alphaBottom).drawRect(
                    0,
                    game.height - heightBottom,
                    game.width,
                    heightBottom
                );
            model.el('footerBottom', footerBottom);

            model.data('footerTopCenterY', game.height - (heightBottom + heightTop / 2) + 4);
            model.data('footerBottomCenterY', game.height - heightBottom / 2 + 4);

        },

        DesktopFooter: function ({
            game = model.el('game'),
            container = model.group('footer'),
            color = 0x000000,
            heightBottom = 40,
            alphaBottom = 0.7
        }) {

            let footerBottom = game.add.graphics(0, 0, container)
                .beginFill(color, alphaBottom).drawRect(
                    0,
                    game.height - heightBottom,
                    game.width,
                    heightBottom
                );
            model.el('footerBottom', footerBottom);

            model.data('footerBottomCenterY', game.height - heightBottom / 2 + 3);
        },

        HomeButton: function ({
            game = model.el('game'),
            container = model.group('footerMenu'),
            x = 30,
            y = model.el('game').height - 20
        }) {
            if (model.mobile) {
                y = game.height - 17;
            }
            let homeButton = game.add.button(x, y, 'footerButtons', null, null, null, 'home.png', null, null, container);
            homeButton.anchor.set(0.5);

            model.el('homeButton', homeButton);
            return homeButton;
        },

        FullScreenButton: function ({
            game = model.el('game'),
            container = model.group('footerMenu'),
            x = 80,
            y = model.el('game').height - 20
        }) {
            let fullScreeButton = game.add.button(x, y, 'footerButtons', null, null, null, 'fullScreenOn.png', null, null, container);
            fullScreeButton.anchor.set(0.5);

            model.el('fullScreeButton', fullScreeButton);
            return fullScreeButton;
        },

        SoundButton: function ({
            game = model.el('game'),
            container = model.group('footerMenu'),
            x = 130,
            y = model.el('game').height - 20
        }) {
            let soundButton = game.add.button(x, y, 'footerButtons', null, null, null, 'soundOn.png', null, null, container);
            soundButton.anchor.set(0.5);

            // Определяем начальный фрейм
            if (model.state('globalSound')) {
                soundButton.frameName = 'soundOn.png';
            } else {
                soundButton.frameName = 'soundOff.png';
            }
            model.el('soundButton', soundButton);
            return soundButton;
        },

        FastButton: function ({
            game = model.el('game'),
            container = model.group('footerMenu'),
            x = 180,
            y = model.el('game').height - 20
        }) {
            let fastButton = game.add.button(x, y, 'footerButtons', null, null, null, 'fastSpinOff.png', null, null, container);
            fastButton.anchor.set(0.5);
            fastButton.frameName = (model.state('fastRoll')) ? 'fastSpinOff.png' : 'fastSpinOn.png';

            model.el('fastButton', fastButton);
            return fastButton;
        },

        SettingsButton: function ({
            game = model.el('game'),
            container = model.group('footerMenu'),
            x = 280,
            y = model.el('game').height - 20
        }) {
            let settingsButton = game.add.button(x, y, 'footerButtons', null, null, null, 'settings.png', null, null, container);
            settingsButton.anchor.set(0.5);

            settingsButton.onInputOver.add(() => {
                settingsButton.scale.set(1.4);
            });
            settingsButton.onInputOut.add(() => {
                settingsButton.scale.set(1);
            });

            model.el('settingsButton', settingsButton);
            return settingsButton;
        },

        Time: function ({
            game = model.el('game'),
            container = model.group('footer'),
            styleDesktop = {font: '18px Helvetica, Arial', align: 'center', fill: '#e8b075'},
            styleMobile = {font: '22px Helvetica, Arial', align: 'center', fill: '#e8b075'}
        }) {
            let currentHour = new Date().getHours();
            let currentMinutes = new Date().getMinutes();

            if (currentHour < 10) {
                currentHour = `0${currentHour}`;
                model.data('currentHour', currentHour);
            }
            if (currentMinutes < 10) {
                currentMinutes = `0${currentMinutes}`;
                model.data('currentMinutes', currentMinutes);
            }

            let style;

            if (model.desktop) {
                style = styleDesktop;
            }

            if (model.mobile) {
                style = styleMobile;
            }

            let timeHeight = (model.desktop) ? game.height - 17 : game.height - 11;

            let footerTime = game.add.text(
                0,
                timeHeight,
                `${currentHour} : ${currentMinutes}`,
                style,
                container);
            footerTime.anchor.set(0.5);
            footerTime.x = game.width - footerTime.width;

            model.el('footerTime', footerTime);

        }

    };

    let update = {

        Time: function () {
            let footerTime = model.el('footerTime');
            let currentHour = model.el('currentHour');
            let currentMinutes = model.el('currentMinutes');

            let hours = new Date().getHours();
            let minutes = new Date().getMinutes();

            if (hours < 10) {
                hours = `0${hours}`;
            }
            if (minutes < 10) {
                minutes = `0${minutes}`;
            }

            if (currentHour !== hours) {
                currentHour = hours;
                footerTime.text = `${currentHour} : ${currentMinutes}`;
            }

            if (currentMinutes !== minutes) {
                currentMinutes = minutes;
                footerTime.text = `${currentHour} : ${currentMinutes}`;
            }

        }

    };

    return {
        draw,
        update
    };

})();
