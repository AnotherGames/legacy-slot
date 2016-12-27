import {
    model
} from 'modules/Model/Model';
import {
    request
} from 'modules/Util/Request';

import {
    view
} from 'modules/Footer/FooterView';

import {
    controller as soundController
} from 'modules/Sound/SoundController';

export let controller = (() => {

    function initDesktop() {
        // view.draw.DesktopFooter({});
        let fastButton = view.draw.FastButton({});
        fastButton.freezeFrames = true;
        fastButton.onInputDown.add(handle.Fast);

        let settingsButton = view.draw.SettingsButton({});
        settingsButton.onInputDown.add(handle.Settings);

        let fullScreenButton = view.draw.FullScreenButton({});
        fullScreenButton.onInputDown.add(handle.toggleFullScreen);
        fullScreenButton.freezeFrames = true;

        let infoButton = view.draw.InfoButton({});
        infoButton.onInputDown.add(handle.Info);

        let soundButton = view.draw.SoundButton({});
        soundButton.freezeFrames = true;
        soundButton.onInputDown.add(handle.Sound);

        let homeButton = view.draw.HomeButton({});
        homeButton.onInputDown.add(handle.Home);

        let menuButton = view.draw.MenuButton({});
        menuButton.onInputDown.add(handle.Menu);

        view.draw.Time({});
    }

    function initMobile() {
        view.draw.MobileFooter({});
        view.draw.Time({});

        let homeButton = view.draw.HomeButton({});
        homeButton.onInputDown.add(handle.Home);
    }

    function updateTime() {
        view.update.Time();
    }

    const handle = {

        Menu: function() {
            if (model.state('buttons:locked') ||
                model.state('roll:progress') ||
                model.state('autoplay:start')) return;

            let game = model.el('game');
            let footerButtons = model.group('footer');
            let buttons = footerButtons.children;
            let menuButton = model.el('menuButton');

            if (model.state('menuOpened')) {
                model.state('menuOpened', false)
                let y = menuButton.y;
                for (let i = 0; i < 6; i++) {
                    game.add.tween(buttons[i]).to({
                            y: y,
                            alpha: 0
                        }, 250, 'Linear', true)
                        .onComplete.add(() => {
                            buttons[i].visible = false;
                        });
                }
            } else {
                model.state('menuOpened', true)
                let fullScreeButton = model.el('fullScreeButton');
                fullScreeButton.frameName = (!window.screenTop && !window.screenY) ? 'fullscreenOff.png' : 'fullscreen.png';

                let y = menuButton.y - 50;
                for (let i = 0; i < 6; i++) {
                    buttons[i].alpha = 0;
                    game.add.tween(buttons[i]).to({
                        y: y,
                        alpha: 1
                    }, 250, 'Linear', true);
                    buttons[i].visible = true;
                    y -= 50;
                }
            }

        },

        Settings: function() {
            if (model.state('buttons:locked') ||
                model.state('roll:progress') ||
                model.state('autoplay:start')) return;

            let game = model.el('game');
            // Выключаем управление с клавиатуры
            game.input.keyboard.enabled = false;

            soundController.sound.playSound({
                sound: 'buttonClick'
            });

            // Обновляем состояния чекбоксов в настройках
            $('#volume').prop('value', (model.state('globalSound')) ? soundController.volume.getVolume() * 100 : 0);
            $('#checkSound').prop('checked', model.state('sound'));
            $('#checkMusic').prop('checked', model.state('music'));
            $('#fastSpin').prop('checked', model.state('fastRoll'));
            $('#isAnimBG').prop('checked', model.state('isAnimBG'));
            $('#optionAutoplay4').prop('checked', model.state('autoStopWhenFS'));
            $('#optionAutoplay5').prop('checked', model.state('autoTransititon'));

            // Открываем настройки
            $('#settings').removeClass('closed');
            $('#darkness').removeClass('closed');

            // при клике на оверлей закрываем настройки
            $('#darkness').on('click', function() {
                // Включаем управление с клавиатуры
                game.input.keyboard.enabled = true;
                $('#settings').addClass('closed');
                $('#darkness').addClass('closed');
                $('.history').addClass('closed');
                $('#darkness').off();
            });
        },

        Sound: function() {
            let soundButton = model.el('soundButton');
            if (model.state('globalSound')) {
                soundButton.frameName = 'soundOff.png';
                soundController.volume.switchVolume()
            } else {
                soundButton.frameName = 'sound.png';
                soundController.volume.switchVolume();
            }
        },

        Info: function() {
            if (model.state('buttons:locked') ||
                model.state('roll:progress') ||
                model.state('autoplay:start')) return;

            soundController.sound.playSound({
                sound: 'buttonClick'
            });

            let game = model.el('game');
            let infoRules = view.draw.info({});
            let overlay = model.el('overlay');
            let closed = model.el('closed');
            let infoMarkers = model.el('infoMarkers');
            let arrowRight = model.el('arrowRight');
            let arrowLeft = model.el('arrowLeft');
            let counter = 0;

            model.el('infoCounter', counter);
            model.state('infoPanelOpen', true);

            game.input.keyboard.enabled = false;
            overlay.inputEnabled = true;
            overlay.input.priorityID = 2;
            infoRules.inputEnabled = true;
            infoRules.input.priorityID = 3;
            closed.inputEnabled = true;
            closed.input.priorityID = 4;
            arrowRight.inputEnabled = true;
            arrowRight.input.priorityID = 4;
            arrowLeft.inputEnabled = true;
            arrowLeft.input.priorityID = 4;

            overlay.events.onInputDown.add(handle.closeInfo);
            closed.events.onInputDown.add(handle.closeInfo);
            arrowRight.events.onInputDown.add(handle.switchInfoRight);
            arrowLeft.events.onInputDown.add(handle.switchInfoLeft);
        },

        toggleFullScreen: function() {
            let _e = document.querySelector('#game');
            let fullScreeButton = model.el('fullScreeButton');
            if (!document.fullscreenElement && // alternative standard method
                !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) { // current working methods
                    fullScreeButton.frameName = 'fullscreen.png';
                if (_e.requestFullscreen) {
                    _e.requestFullscreen();
                } else if (_e.msRequestFullscreen) {
                    _e.msRequestFullscreen();
                } else if (_e.mozRequestFullScreen) {
                    _e.mozRequestFullScreen();
                } else if (_e.webkitRequestFullscreen) {
                    _e.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
                }
            } else {
                fullScreeButton.frameName = 'fullscreenOff.png';
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                }
            }
        },

        Fast: function() {
            soundController.sound.playSound({
                sound: 'buttonClick'
            });
            let fastButton = model.el('fastButton');
            // Ищменяем состояние fastRoll и меняем фрейм кнопки
            if (model.state('fastRoll')) {
                model.state('fastRoll', false);
                model.cookie('fastRoll', false);
                fastButton.frameName = 'fastSpin.png';
            } else {
                model.state('fastRoll', true);
                model.cookie('fastRoll', true);
                fastButton.frameName = 'fastSpinOff.png';
            }
        },

        Home: function() {
            soundController.sound.playSound({
                sound: 'buttonClick'
            });
            // Отправляем запрос Logout
            request.send('Logout')
                .then((response) => {
                    console.log('Logout response:', response);
                });
            // Возвращаемся на предыдущую страницу
            window.history.back();
        },

        closeInfo: function() {
            let game = model.el('game');

            game.input.keyboard.enabled = true;
            model.group('popup').removeAll();
            model.state('infoPanelOpen', false);
        },

        switchInfoRight: function() {
            let infoRules = model.el('infoRules');
            let counter = model.el('infoCounter');
            let infoMarkers = model.el('infoMarkers');

            infoMarkers.forEach((elem) => {
                elem.frameName = 'marker_off.png';
            });
            if (counter > 4) {
                counter = 0;
            } else {
                counter++;
            }
            model.el('infoCounter', counter);
            infoMarkers[counter].frameName = 'marker_on.png';
            infoRules.frameName = `${counter + 1}_en.png`;
        },

        switchInfoLeft: function() {
            let infoRules = model.el('infoRules');
            let counter = model.el('infoCounter');
            let infoMarkers = model.el('infoMarkers');

            infoMarkers.forEach((elem) => {
                elem.frameName = 'marker_off.png';
            });
            if (counter < 1) {
                counter = 5;
            } else {
                counter--;
                infoMarkers[counter + 1].frameName = 'marker_off.png';
            }
            model.el('infoCounter', counter);
            infoMarkers[counter].frameName = 'marker_on.png';
            infoRules.frameName = `${counter + 1}_en.png`;
        }
    };

    return {
        initDesktop,
        initMobile,
        updateTime,
        handle
    };

})();
