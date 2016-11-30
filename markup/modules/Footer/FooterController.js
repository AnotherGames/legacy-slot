import { model } from 'modules/Model/Model';
import { request } from 'modules/Util/Request';
import { sound } from 'modules/Sound/Sound';
import { view } from 'modules/Footer/FooterView';

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
            let game = model.el('game');
            if(model.state('lockedButtons') || model.state('roll:progress') || !model.state('autoEnd')) return;
            game.input.keyboard.enabled = false;
            sound.sounds.button.play();

            $('#volume').prop('value', sound.volume * 100);
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
                game.input.keyboard.enabled = true;
                $('#settings').addClass('closed');
                $('#darkness').addClass('closed');
                $('.history').addClass('closed');
                $('#darkness').off();
            });
        },
        Sound: function () {
            let soundButton = model.el('soundButton');
            if (sound.volume > 0) {
                soundButton.frameName = 'soundOff.png';
                sound.lastVolume = sound.volume * 100;
                sound.volume = 0;
            } else {
                soundButton.frameName = 'soundOn.png';
                sound.volume = sound.lastVolume;
            }
        },
        Fast: function () {
            sound.sounds.button.play();
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
            sound.sounds.button.play();
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
