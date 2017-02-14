import { model } from 'modules/Model/Model';

export let view = (() => {

    let draw = {

        MobileFooter: function({
            game = model.el('game'),
            container = model.group('footer'),
            color = 0x000000,
            heightTop = 40,
            heightBottom = 30,
            alphaTop = 0.25,
            alphaBottom = 0.7
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

            model.data('footerTopCenterY', game.height - (heightBottom + heightTop / 2));
            model.data('footerBottomCenterY', game.height - heightBottom / 2);

        },

        DesktopFooter: function({
            game = model.el('game'),
            container = model.group('footer'),
            color = 0x000000,
            heightBottom = 50,
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

        MenuButton: function({
            game = model.el('game'),
            container = model.group('footer'),
            x = 30,
            y = model.el('game').height - 25
        }) {
            let menuButton = game.add.button(x, y, 'footerButtons', null, null, 'menuOn.png', 'menu.png', 'menuOn.png', null, container);
            menuButton.anchor.set(0.5);
            model.el('menuButton', menuButton);
            return menuButton;
        },

        HomeButton: function({
            game = model.el('game'),
            container = model.group('footerMenu'),
            x = 30,
            y = model.el('game').height - 20
        }) {
            if (model.mobile) {
                y = model.el('game').height - 17;
            }
            let homeButton = game.add.button(x, y, 'footerButtons', null, null, 'homeOn.png', 'home.png', 'homeOn.png', null, container);
            homeButton.anchor.set(0.5);
            homeButton.visible = false;
            model.el('homeButton', homeButton);
            return homeButton;
        },

        SoundButton: function({
            game = model.el('game'),
            container = model.group('footerMenu'),
            x = 30,
            y = model.el('game').height - 20
        }) {
            let soundButton = game.add.button(x, y, 'footerButtons', null, null, 'sound.png', null, null, null, container);
            soundButton.anchor.set(0.5);
            soundButton.visible = false;
            // Определяем начальный фрейм
            if (model.state('globalSound')) {
                soundButton.frameName = 'sound.png';
            } else {
                soundButton.frameName = 'soundOff.png';
            }
            model.el('soundButton', soundButton);
            return soundButton;
        },

        InfoButton: function({
            game = model.el('game'),
            container = model.group('footerMenu'),
            x = 30,
            y = model.el('game').height - 20
        }) {
            let infoButton = game.add.button(x, y, 'footerButtons', null, null, 'infoOn.png', 'info.png', 'infoOn.png', null, container);
            infoButton.anchor.set(0.5);
            infoButton.visible = false;

            model.el('infoButton', infoButton);
            return infoButton;
        },

        FullScreenButton: function({
            game = model.el('game'),
            container = model.group('footerMenu'),
            x = 30,
            y = model.el('game').height - 20
        }) {
            let fullScreeButton = game.add.button(x, y, 'footerButtons', null, null, 'fullscreen.png', 'fullscreenOff.png', 'fullscreen.png', null, container);
            fullScreeButton.anchor.set(0.5);
            fullScreeButton.visible = false;

            model.el('fullScreeButton', fullScreeButton);
            return fullScreeButton;
        },

        SettingsButton: function({
            game = model.el('game'),
            container = model.group('footerMenu'),
            x = 30,
            y = model.el('game').height - 20
        }) {
            let settingsButton = game.add.button(x, y, 'footerButtons', null, null, 'settingsOn.png', 'settings.png', 'settingsOn.png', null, container);
            settingsButton.anchor.set(0.5);
            settingsButton.visible = false;

            model.el('settingsButton', settingsButton);
            return settingsButton;
        },

        FastButton: function({
            game = model.el('game'),
            container = model.group('footerMenu'),
            x = 30,
            y = model.el('game').height - 20
        }) {
            let fastButton = game.add.button(x, y, 'footerButtons', null, null, null, 'fastSpin.png', null, null, container);
            fastButton.anchor.set(0.5);
            fastButton.visible = false;
            fastButton.frameName = (model.state('fastRoll')) ? 'fastSpinOff.png' : 'fastSpin.png';

            model.el('fastButton', fastButton);
            return fastButton;
        },

        Time: function({
            game = model.el('game'),
            container = model.group('footer'),
            styleDesktop = {
                font: '18px Helvetica, Arial',
                align: 'center',
                fill: '#e8b075'
            },
            styleMobile = {
                font: '22px Helvetica, Arial',
                align: 'center',
                fill: '#e8b075'
            }
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

            let footerTime = game.add.text(
                0,
                game.height - 18,
                `${currentHour} : ${currentMinutes}`,
                style,
                container);
            footerTime.anchor.set(0.5);
            footerTime.x = game.width - footerTime.width;

            model.el('footerTime', footerTime);

        }

    };

    let update = {

        Time: function() {
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
