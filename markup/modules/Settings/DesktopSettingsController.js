import { model } from 'modules/Model/Model';
import { view as transitionView } from 'modules/Transition/TransitionView';

import { controller as soundController } from 'modules/Sound/SoundController';
import { controller as panelController } from 'modules/Panel/PanelController';

export let controller = (function () {
    function initDesktopSettings(game) {
        $('#volume').on('input change', function () {
            let soundButton = model.el('soundButton');
            if (this.value == 0) {
                model.state('globalSound', false);
                model.cookie('globalSound', false);
                soundButton.frameName = 'soundOff.png';
            } else {
                model.state('globalSound', true);
                model.cookie('globalSound', true);
                soundButton.frameName = 'soundOn.png';
            }
            soundController.volume.changeVolume(this.value);
            if(this.value > 0){
                soundController.volume.setVolume(this.value);
                model.cookie('volume', this.value);
            } else {
                soundController.volume.setVolume(model.data('lastVolume'));
                model.cookie('volume', model.data('lastVolume'));
            }

        });
        $('#volume').on('mousedown', function () {
            if (this.value > 0){
                model.data('lastVolume', this.value)
            }
        });
        $('#checkSound').on('change', function () {
            model.cookie('sound', this.checked);
            model.state('sound', this.checked);
        });
        $('#checkMusic').on('change', function () {
            model.state('music', this.checked);
            model.cookie('music', this.checked);
            if(model.state('music')){
                soundController.music.playMusic('fon');
            } else {
                soundController.music.pauseMusic('fon');
            }
        });
        $('#fastSpin').on('change', function () {
            model.state('fastRoll', this.checked);
            model.cookie('fastRoll', this.checked);
            let fastButton = model.el('fastButton');
            if (model.state('fastRoll')) {
                fastButton.frameName = 'fastSpinOff.png';
            } else {
                fastButton.frameName = 'fastSpin.png';
            }
        });
        $('#optionAutoplay1').on('change', function () {
            console.log(this.id, this.checked);
            model.state('autoplay:cashRoll', this.checked);
        });
        $('#optionAutoplayVal1').on('input change', function () {
            if (this.value < 0) {
                this.value = 0;
            }
            console.log('optionAutoplayVal1', this.value);
            model.state('autoplay:cashRollDelta', this.value);
        });
        $('#optionAutoplay2').on('change', function () {
            console.log(this.id, this.checked);
            model.state('autoplay:cashUp', this.checked);
        });
        $('#optionAutoplayVal2').on('input change', function () {
            if (this.value < 0) {
                this.value = 0;
            }
            console.log('optionAutoplayVal2', this.value);
            model.state('autoplay:cashDelta', this.value);
        });
        $('#optionAutoplay3').on('change', function () {
            console.log(this.id, this.checked);
            model.state('autoplay:cashDown', this.checked);
        });
        $('#optionAutoplayVal3').on('input change', function () {
            if (this.value < 0) {
                this.value = 0;
            }
            console.log('optionAutoplayVal3', this.value);
            model.state('autoplay:cashDelta', this.value);
        });
        $('#optionAutoplay4').on('change', function () {
            model.state('autoStopWhenFS', this.checked);
            console.log(this.id, this.checked);
        });
        $('#optionAutoplay5').on('change', function () {
            model.cookie('autoTransititon', this.checked);
            model.state('autoTransititon', this.checked);
        });
        $('#btnHistory').on('click', function () {
            $('.history').removeClass('closed');
        });
        $('#btnRules').on('click', function () {
            console.log('btnRules');
            panelController.handle.openInfo();
            // panelController.handle.info();
            $('#settings').addClass('closed');
            $('#darkness').addClass('closed');
            // $('.history').addClass('closed');
            $('#darkness').off();
        });
        $('#settingsSave').on('click', function () {
            game.input.keyboard.enabled = true;
            $('#settings').addClass('closed');
            $('#darkness').addClass('closed');
            $('.history').addClass('closed');
            $('#darkness').off();
            // TODO: request new settings.
        });
    }

    return {
        initDesktopSettings
    };
})();
