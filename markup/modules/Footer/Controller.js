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
            if(model.state('lockedButtons') || model.state('roll:progress') || !model.state('autoEnd')) return;
            model.state('menuOpened', true);
            soundController.sounds.button.play();

            $('#volume').prop('value', soundController.volume * 100);
            $('#checkSound').prop('checked', model.state('sound'));
            $('#checkMusic').prop('checked', model.state('music'));
            $('#fastSpin').prop('checked', model.state('fastRoll'));
            $('#isAnimations').prop('checked', model.state('isAnimations'));
            $('#isAnimBG').prop('checked', model.state('isAnimBG'));
            $('#optionAutoplay4').prop('checked', model.state('autoStopWhenFS'));
            $('#optionAutoplay5').prop('checked', model.state('optionAutoplay5'));

            $('#settings').removeClass('closed');
            $('#darkness').removeClass('closed');

            $('#darkness').on('click', function () {
                model.state('menuOpened', false);
                $('#settings').addClass('closed');
                $('#darkness').addClass('closed');
                $('.history').addClass('closed');
                $('#darkness').off();
            });
        },
        Sound: function () {
            let soundButton = model.el('soundButton');
            if (soundController.volume > 0) {
                soundButton.frameName = 'soundOff.png';
                soundController.lastVolume = soundController.volume * 100;
                soundController.volume = 0;
            } else {
                soundButton.frameName = 'soundOn.png';
                soundController.volume = soundController.lastVolume;
            }
        },
        Fast: function () {
            soundController.sounds.button.play();
            let fastButton = model.el('fastButton');
            if (model.state('fastRoll')) {
                model.state('fastRoll', false);
                fastButton.frameName = 'fastSpin.png';
            } else {
                model.state('fastRoll', true);
                fastButton.frameName = 'fastSpinOff.png';
            }
        },
        Home: function () {
            soundController.sounds.button.play();
            request.send('Logout')
                .then((response) => {
                    console.log('Logout response:', response);
                });
            window.history.back();
        }
    };

    return {
        initDesktop,
        initMobile,
        updateTime
    };

})();
