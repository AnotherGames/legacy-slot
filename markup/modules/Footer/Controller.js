import { model } from 'modules/Model/Model';
import { request } from 'modules/Util/Request';

import { view } from 'modules/Footer/View';

import { controller as soundController } from 'modules/Sound/Controller';

export let controller = (() => {

    function initDesktop() {
        view.draw.DesktopFooter({});
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

            soundController.sounds.playSound('buttonClick');

            // Обновляем состояния чекбоксов в настройках
            $('#volume').prop('value', soundController.volume * 100);
            $('#checkSound').prop('checked', model.state('sound'));
            $('#checkMusic').prop('checked', model.state('music'));
            $('#fastSpin').prop('checked', model.state('fastRoll'));
            $('#isAnimations').prop('checked', model.state('isAnimations'));
            $('#isAnimBG').prop('checked', model.state('isAnimBG'));
            $('#optionAutoplay4').prop('checked', model.state('autoStopWhenFS'));
            $('#optionAutoplay5').prop('checked', model.state('optionAutoplay5'));

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
                soundController.sounds.switchVolume()
            } else {
                model.state('globalSound', true)
                soundButton.frameName = 'sound.png';
                soundController.sounds.switchVolume();
            }
            // if (soundController.volume > 0) {
            //     // Если были звуки - мы их вырубаем
            //     soundButton.frameName = 'soundOff.png';
            //     soundController.lastVolume = soundController.volume * 100;
            //     soundController.volume = 0;
            // } else {
            //     // Если не было - включаем на последнюю сохраненную громкость
            //     soundButton.frameName = 'soundOn.png';
            //     soundController.volume = soundController.lastVolume;
            // }
        },

        Fast: function () {
            soundController.sounds.playSound('buttonClick');
            let fastButton = model.el('fastButton');
            // Ищменяем состояние fastRoll и меняем фрейм кнопки
            if (model.state('fastRoll')) {
                model.state('fastRoll', false);
                fastButton.frameName = 'fastSpin.png';
            } else {
                model.state('fastRoll', true);
                fastButton.frameName = 'fastSpinOff.png';
            }
        },

        Home: function () {
            soundController.sounds.playSound('buttonClick');
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
