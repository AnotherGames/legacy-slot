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
            homeButton.onInputDown.add(handleHome);
        let menuButton = view.drawMenuButton({});
            menuButton.onInputDown.add(handleMenu);
        let soundButton = view.drawSoundButton({});
            soundButton.freezeFrames = true;
            soundButton.onInputDown.add(handleSound);
        let fastButton = view.drawFastButton({});
            fastButton.freezeFrames = true;
            fastButton.onInputDown.add(handleFast);
    }

    function initMobile() {
        view.drawMobileFooter({});
        view.drawTime({});

        let homeButton = view.drawHomeButton({});
            homeButton.onInputDown.add(handleHome);
    }

    function updateTime() {
        view.updateTime();
    }

    function handleHome() {
        sound.sounds.button.play();
        request.send('Logout')
            .then((response) => {
                console.log('Logout response:', response);
            });
        window.history.back();
    }

    function handleMenu() {
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

    }

    function handleSound() {
        let soundButton = model.el('soundButton');
        if (sound.volume > 0) {
            soundButton.frameName = 'soundOff.png';
            sound.volume = 0;
        } else {
            soundButton.frameName = 'soundOn.png';
            sound.volume = 100;
        }
    }

    function handleFast() {
        sound.sounds.button.play();
        let fastButton = model.el('fastButton');
        if (model.state('fastRoll')) {
            model.state('fastRoll', false);
            fastButton.frameName = 'fastSpinOff.png';
        } else {
            model.state('fastRoll', true);
            fastButton.frameName = 'fastSpinOn.png';
        }
    }

    return {
        initDesktop,
        initMobile,
        updateTime
    }

})();
