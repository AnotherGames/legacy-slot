import { model } from 'modules/Model/Model';
import { request } from 'modules/Util/Request';

import { view } from 'modules/Footer/FooterView';

import { controller as soundController } from 'modules/Sound/SoundController';

export let controller = (() => {

    function initMainDesktop() {
        view.draw.DesktopFooter({});
        view.draw.Time({});

        let homeButton = view.draw.HomeButton({x: 30});
        homeButton.onInputDown.add(handle.Home);

        let settingsButton = view.draw.SettingsButton({x: 80});
        settingsButton.onInputDown.add(handle.Setting);

        let soundButton = view.draw.SoundButton({x: 130});
        soundButton.freezeFrames = true;
        soundButton.onInputDown.add(handle.Sound);

        let fastButton = view.draw.FastButton({x: 180});
        fastButton.freezeFrames = true;
        fastButton.onInputDown.add(handle.Fast);

        let fullScreenButton = view.draw.FullScreenButton({x: 230});
        fullScreenButton.onInputDown.add(handle.toggleFullScreen);
        fullScreenButton.freezeFrames = true;

        let footerMenu = model.group('footerMenu').children;
        footerMenu.forEach((elem) => {
            elem.onInputOver.add(() => {
                elem.scale.set(1.4);
            });
            elem.onInputOut.add(() => {
                elem.scale.set(1);
            });
        });

        model.group('footer').add(model.group('footerMenu'));
    }

    function initFsDesktop() {
        view.draw.DesktopFooter({});
        view.draw.Time({});

        let homeButton = view.draw.HomeButton({x: 30});
        homeButton.onInputDown.add(handle.Home);

        let soundButton = view.draw.SoundButton({x: 80});
        soundButton.freezeFrames = true;
        soundButton.onInputDown.add(handle.Sound);

        let fastButton = view.draw.FastButton({x: 130});
        fastButton.freezeFrames = true;
        fastButton.onInputDown.add(handle.Fast);

        let fullScreenButton = view.draw.FullScreenButton({x: 180});
        fullScreenButton.onInputDown.add(handle.toggleFullScreen);
        fullScreenButton.freezeFrames = true;

        let footerMenu = model.group('footerMenu').children;
        footerMenu.forEach((elem) => {
            elem.onInputOver.add(() => {
                elem.scale.set(1.4);
            });
            elem.onInputOut.add(() => {
                elem.scale.set(1);
            });
        });

        model.group('footer').add(model.group('footerMenu'));
    }

    function initMobile() {
        view.draw.MobileFooter({});
        view.draw.Time({});

        let homeButton = view.draw.HomeButton({x: 30});
            homeButton.onInputDown.add(handle.Home);
    }

    function updateTime() {
        view.update.Time();
    }

    const handle = {
        Setting: function () {
            if (model.state('buttons:locked')
            || model.state('roll:progress')
            || model.state('autoplay:start')) return;

            let game = model.el('game');
            // Выключаем управление с клавиатуры
            game.input.keyboard.enabled = false;

            // костыль на баг с зависанием кнопки после открытия области поверъ нее
            if (model.desktop) {
                model.el('settingsButton').destroy();
                let settingsButton = view.draw.SettingsButton({x: 80});
                settingsButton.onInputDown.add(handle.Setting);
            }

            soundController.sound.playSound({sound: 'buttonClick'});

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
            $('#darkness').on('click', function () {
                // Включаем управление с клавиатуры
                game.input.keyboard.enabled = true;
                $('#settings').addClass('closed');
                $('#darkness').addClass('closed');
                $('.history').addClass('closed');
                $('#darkness').off();
            });
        },

        Sound: function () {
            let soundButton = model.el('soundButton');
            if (model.state('globalSound')) {
                soundButton.frameName = 'soundOff.png';
                soundController.volume.switchVolume();
            } else {
                soundButton.frameName = 'soundOn.png';
                soundController.volume.switchVolume();
            }
        },

        Fast: function () {
            soundController.sound.playSound({sound: 'buttonClick'});
            let fastButton = model.el('fastButton');
            // Ищменяем состояние fastRoll и меняем фрейм кнопки
            if (model.state('fastRoll')) {
                model.state('fastRoll', false);
                model.cookie('fastRoll', false);
                fastButton.frameName = 'fastSpinOn.png';
            } else {
                model.state('fastRoll', true);
                model.cookie('fastRoll', true);
                fastButton.frameName = 'fastSpinOff.png';
            }
        },

        Home: function () {
            soundController.sound.playSound({sound: 'buttonClick'});
            // Отправляем запрос Logout
            request.send('Logout')
                .then((response) => {
                    // Возвращаемся на предыдущую страницу
                    window.history.back();
                    console.log('Logout response:', response);
                });
        },

        toggleFullScreen: function () {
            let game = model.el('game');

            if (game.scale.isFullScreen) {
                game.scale.stopFullScreen();
            } else {
                game.scale.startFullScreen();
            }
        }
    };

    return {
        initMainDesktop,
        initFsDesktop,
        initMobile,
        updateTime
    };

})();
