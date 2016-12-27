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

        MenuButton: function ({
            game = model.el('game'),
            container = model.group('footer'),
            x = 30,
            y = model.el('game').height - 30
        }) {
            let menuButton = game.add.button(x, y, 'footerButtons', null, null, 'menuOn.png', 'menu.png', 'menuOn.png', null, container);
            menuButton.anchor.set(0.5);
            model.el('menuButton', menuButton);
            return menuButton;
        },

        HomeButton: function ({
            game = model.el('game'),
            container = model.group('footer'),
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

        SoundButton: function ({
            game = model.el('game'),
            container = model.group('footer'),
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
            container = model.group('footer'),
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
            container = model.group('footer'),
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
            container = model.group('footer'),
            x = 30,
            y = model.el('game').height - 20
        }) {
            let settingsButton = game.add.button(x, y, 'footerButtons', null, null, 'settingsOn.png', 'settings.png', 'settingsOn.png', null, container);
                settingsButton.anchor.set(0.5);
                settingsButton.visible = false;

            model.el('settingsButton', settingsButton);
            return settingsButton;
        },

        FastButton: function ({
            game = model.el('game'),
            container = model.group('footer'),
            x = 30,
            y = model.el('game').height - 20
        }) {
            let fastButton = game.add.button(x, y, 'footerButtons', null, null, null, 'fastSpin.png', null, null, container);
                fastButton.anchor.set(0.5);
                fastButton.visible = false;

            if (model.state('fastRoll')) {
                fastButton.frameName = 'fastSpinOff.png';
            } else {
                fastButton.frameName = 'fastSpin.png';
            }
            model.el('fastButton', fastButton);
            return fastButton;
        },

        Time: function ({
            game = model.el('game'),
            container = model.group('footer'),
            styleDesktop = {font: '18px Helvetica, Arial', align: 'center', fill: '#0f607e'},
            styleMobile = {font: '22px Helvetica, Arial', align: 'center', fill: '#0f607e'}
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
            let y = 17;

            if (model.mobile) {
                y = 13;
            }

            let footerTime = game.add.text(
                0,
                game.height - y,
                `${currentHour} : ${currentMinutes}`,
                style,
                container);
            footerTime.anchor.set(0.5);
            footerTime.x = game.width - footerTime.width;

            model.el('footerTime', footerTime);

        },

        info: function({
            game = model.el('game'),
            container = model.group('popup'),
            x = model.el('game').world.centerX,
            y = model.el('game').world.centerY,
        }) {
            let overlay = game.add.graphics(0, 0, container).beginFill(0x000000, 0.8).drawRect(0, 0, game.width, game.height);
            model.el('overlay', overlay);

            let infoRules = game.add.sprite(x, y, 'info', '1_en.png', container);
                infoRules.anchor.set(0.5);
                infoRules.scale.set(1.3);
            model.el('infoRules', infoRules);

            let closed = game.add.sprite(game.width - 390, 200, 'closed', null, container);
            model.el('closed', closed);

            let arrowRight = game.add.sprite(game.width / 2 + 40, 780, 'ar', null, container);
            model.el('arrowRight', arrowRight);

            let arrowLeft = game.add.sprite(game.width / 2 - 180, 780, 'arLeft', null, container);
            model.el('arrowLeft', arrowLeft);

            let infoMarkers = [];
            let infoMarker = game.add.sprite(game.width / 2 - 100, 770, 'infoMarker', 'marker_on.png', container);
                infoMarker.name = 'infoMarker0';
                infoMarkers.push(infoMarker);

            for (let i = 1; i < 6; i++) {
                let name = 'infoMarker' + i;
                let counter = i;
                let marker = game.add.sprite(infoMarker.x, 770, 'infoMarker', 'marker_off.png', container);
                marker.name = name;
                marker.x = marker.x + 30 * i;
                infoMarkers.push(marker);
            }
            model.el('infoMarkers', infoMarkers);
            return infoRules;
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
