import { model } from 'modules/Model/Model';
import { events } from 'modules/Util/Events';
import { request } from 'modules/Util/Request';
import { sound } from 'modules/Sound/Sound';
import { view } from 'modules/Footer/FooterView';

export let controller = (() => {

    function initDesktop() {
        view.drawDesktopFooter({});
        view.drawTime({});

        let homeButton = view.drawHomeButton({});
            homeButton.onInputDown.add(handle.Home);
        let menuButton = view.drawMenuButton({});
            menuButton.onInputDown.add(handle.Menu);
        let soundButton = view.drawSoundButton({});
            soundButton.freezeFrames = true;
            soundButton.onInputDown.add(handle.Sound);
        let fastButton = view.drawFastButton({});
            fastButton.freezeFrames = true;
            fastButton.onInputDown.add(handle.Fast);
    }

    function initMobile() {
        view.drawMobileFooter({});
        view.drawTime({});

        let homeButton = view.drawHomeButton({});
            homeButton.onInputDown.add(handle.Home);
    }

    function updateTime() {
        view.updateTime();
    }

    const handle = {
        Menu: function() {
            sound.sounds.button.play();

            $('#volume').prop('value', sound.volume * 100);
            $('#checkSound').prop('checked', model.state('sound'));
            $('#checkMusic').prop('checked', model.state('music'));
            $('#fastSpin').prop('checked', model.state('fastRoll'));
            $('#isAnimations').prop('checked', model.state('isAnimations'));

            $('#settings').removeClass('closed');
            $('#darkness').removeClass('closed');

            $('#darkness').on('click', function () {
                $('#settings').addClass('closed');
                $('#darkness').addClass('closed');
                $('.history').addClass('closed');
                $('#darkness').off();
            });
        },
        Sound: function() {
            let soundButton = model.el('soundButton');
            if (sound.volume > 0) {
                soundButton.frameName = 'soundOff.png';
                sound.volume = 0;
            } else {
                soundButton.frameName = 'soundOn.png';
                sound.volume = 100;
            }
        },
        Fast: function () {
            sound.sounds.button.play();
            let fastButton = model.el('fastButton');
            if (model.state('fastRoll')) {
                model.state('fastRoll', false);
                fastButton.frameName = 'fastSpinOff.png';
            } else {
                model.state('fastRoll', true);
                fastButton.frameName = 'fastSpinOn.png';
            }
        },
        Home: function() {
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
    }

})();
