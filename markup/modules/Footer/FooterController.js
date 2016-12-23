import { model } from 'modules/Model/Model';
import { request } from 'modules/Util/Request';

import { view } from 'modules/Footer/FooterView';

import { controller as soundController } from 'modules/Sound/SoundController';

export let controller = (() => {

    function initDesktop() {
        // view.draw.DesktopFooter({});
        view.draw.Time({});

        let homeButton = view.draw.HomeButton({});
            homeButton.onInputDown.add(handle.Home);

        let menuButton = view.draw.MenuButton({});
            menuButton.onInputDown.add(handle.Menu);

        let soundButton = view.draw.SoundButton({});
            soundButton.freezeFrames = true;
            soundButton.onInputDown.add(handle.Sound);

        let fastButton = view.draw.FastButton({});
            fastButton.freezeFrames = true;
            fastButton.onInputDown.add(handle.Fast);
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
        Menu: function () {
            if (model.state('buttons:locked')
            || model.state('roll:progress')
            || model.state('autoplay:start')) return;

            let game = model.el('game');
            // Выключаем управление с клавиатуры
            game.input.keyboard.enabled = false;

            soundController.sound.playSound({sound : 'buttonClick'});

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
            if (model.state('globalSound')){
                soundButton.frameName = 'soundOff.png';
                soundController.volume.switchVolume()
            } else {
                soundButton.frameName = 'sound.png';
                soundController.volume.switchVolume();
            }
        },

        Fast: function () {
            soundController.sound.playSound({sound : 'buttonClick'});
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

        Home: function () {
            soundController.sound.playSound({sound : 'buttonClick'});
            // Отправляем запрос Logout
            request.send('Logout')
                .then((response) => {
                    console.log('Logout response:', response);
                });
            // Возвращаемся на предыдущую страницу
            window.history.back();
        }
    };

    return {
        initDesktop,
        initMobile,
        updateTime
    };

})();
