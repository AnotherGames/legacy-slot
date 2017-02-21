import { model } from 'modules/Model/Model';
import { request } from 'modules/Util/Request';
import { view } from 'modules/Footer/FooterView';
import { controller as soundController } from 'modules/Sound/SoundController';

export let controller = (() => {

    function initDesktop() {
        view.draw.DesktopFooter({});
        view.draw.Time({});

        let homeButton = view.draw.HomeButton({x: 30});
        homeButton.onInputDown.add(handle.Home);

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
    }

    function initSettingInfoButtons() {
        view.draw.info({});
        handle.info();

        let infoButton = view.draw.InfoButton({x: 50, y: model.el('game').height - 100});
        infoButton.onInputDown.add(handle.openInfo);

        let settingsButton = view.draw.SettingsButton({x: 80});
        settingsButton.onInputDown.add(handle.Setting);
    }

    function initMobile() {
        view.draw.MobileFooter({
            alphaTop: 0.6,
            alphaBottom: 0.85
        });
        view.draw.Time({});

        let homeButton = view.draw.HomeButton({});
        homeButton.onInputDown.add(handle.Home);
    }

    function updateTime() {
        view.update.Time();
    }

    const handle = {
        Setting: function () {
            if (model.state('buttons:locked')
            || model.state('roll:progress')
            || model.state('autoplay:start')) {
                return;
            }

            let game = model.el('game');
            // Выключаем управление с клавиатуры
            game.input.keyboard.enabled = false;

            // после нажатия кнопки и открытия поверх нее меню, она зависает до перовго наведения
            // костыль чтоб исправить это
            model.el('settingsButton').destroy();
            let settingsButton = view.draw.SettingsButton({x: 80});
            settingsButton.onInputDown.add(handle.Setting);

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
            soundController.sound.playSound({
                sound: 'buttonClick'
            });
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
            soundController.sound.playSound({
                sound: 'buttonClick'
            });
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
        },

        info: function () {
            let infoTable = model.el('infoTable');
            let overlay = model.el('overlay');
            let closeButton = model.el('closeButton');
            let arrowRight = model.el('arrowRight');
            let arrowLeft = model.el('arrowLeft');

            overlay.inputEnabled = true;
            overlay.input.priorityID = 2;
            infoTable.inputEnabled = true;
            infoTable.input.priorityID = 3;
            closeButton.inputEnabled = true;
            closeButton.input.priorityID = 4;
            arrowRight.inputEnabled = true;
            arrowRight.input.priorityID = 4;
            arrowLeft.inputEnabled = true;
            arrowLeft.input.priorityID = 4;

            overlay.events.onInputDown.add(handle.closeInfo);
            closeButton.events.onInputDown.add(handle.closeInfo);
            arrowRight.events.onInputDown.add(handle.switchInfoRight);
            arrowLeft.events.onInputDown.add(handle.switchInfoLeft);
        },

        openInfo: function () {
            if (model.state('buttons:locked')
            || model.state('roll:progress')
            || model.state('isAnim:info')
            || model.state('autoplay:start')) {
                return;
            }

            let infoTable = model.el('infoTable');
            let infoMarkers = model.el('infoMarkers');
            let game = model.el('game');
            let counter = 1;
            let container = model.group('infoTable');

            // после нажатия кнопки и открытия поверх нее меню, она зависает до перовго наведения
            // костыль чтоб исправить это
            model.el('infoButton').destroy();
            let infoButton = view.draw.InfoButton({x: 50, y: model.el('game').height - 100});
            infoButton.onInputDown.add(handle.openInfo);

            model.state('infoPanelOpen', true);
            soundController.sound.playSound({sound: 'buttonClick'});
            model.el('infoCounter', counter);

            infoMarkers.forEach((elem) => {
                elem.frameName = 'marker_off.png';
            });
            infoMarkers[counter - 1].frameName = 'marker_on.png';
            infoTable.frameName = `${counter}_en.png`;

            model.state('isAnim:info', true);
            container.visible = true;
            game.add.tween(container).to( { alpha: 1 }, 700, 'Quart.easeOut', true)
                .onComplete.add( () => {
                    model.state('isAnim:info', false);
                });
        },

        closeInfo: function () {
            if (model.state('isAnim:info')) {
                return;
            }

            let game = model.el('game');
            let counter = 1;
            model.el('infoCounter', counter);

            game.input.keyboard.enabled = true;
            model.state('infoPanelOpen', false);

            let container = model.group('infoTable');
            model.state('isAnim:info', true);
            game.add.tween(container).to( { alpha: 0 }, 700, 'Quart.easeOut', true)
                .onComplete.add( () => {
                    model.state('isAnim:info', false);
                    container.visible = false;
                });
        },

        switchInfoRight: function () {
            let counter = model.el('infoCounter');
            let infoTable = model.el('infoTable');
            let infoMarkers = model.el('infoMarkers');
            let game = model.el('game');
            let numberOfInfoImages = game.cache._cache.image.infoTable.frameData._frames.length;

            infoMarkers.forEach((elem) => {
                elem.frameName = 'marker_off.png';
            });

            if (counter >= numberOfInfoImages) {
                counter = 1;
            } else {
                counter++;
            }
            model.el('infoCounter', counter);

            infoMarkers[counter - 1].frameName = 'marker_on.png';
            infoTable.frameName = `${counter}_en.png`;
        },

        switchInfoLeft: function () {
            let infoTable = model.el('infoTable');
            let counter = model.el('infoCounter');
            let infoMarkers = model.el('infoMarkers');
            let game = model.el('game');
            let numberOfInfoImages = game.cache._cache.image.infoTable.frameData._frames.length;

            infoMarkers.forEach((elem) => {
                elem.frameName = 'marker_off.png';
            });

            if (counter <= 1) {
                counter = numberOfInfoImages;
            } else {
                counter--;
            }
            model.el('infoCounter', counter);

            infoMarkers[counter - 1].frameName = 'marker_on.png';
            infoTable.frameName = `${counter}_en.png`;
        },
    };

    return {
        initDesktop,
        initSettingInfoButtons,
        initMobile,
        updateTime,
        handle
    };

})();
