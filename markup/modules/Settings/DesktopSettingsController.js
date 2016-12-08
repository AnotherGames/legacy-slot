import { model } from 'modules/Model/Model';
import { view as transitionView } from 'modules/Transition/TransitionView';

import { controller as soundController } from 'modules/Sound/SoundController';
import { controller as panelController } from 'modules/Panel/PanelController';

export let controller = (function () {
    function initDesktopSettings(game) {
        $('#volume').on('input change', function () {
            let soundButton = model.el('soundButton');
            if (this.value == 0) {
                soundButton.frameName = 'soundOff.png';
            } else {
                soundButton.frameName = 'soundOn.png';
            }
            soundController.volume.changeVolume(this.value);
            soundController.volume.setVolume(this.value);
            localStorage['volume'] = this.value;
        });
        $('#checkSound').on('change', function () {
          localStorage['sound'] = this.checked;
            model.state('sound', this.checked);
        });
        $('#checkMusic').on('change', function () {
            model.state('music', this.checked);
            localStorage['music'] = this.checked;
            if(model.state('music')){
                soundController.music.playMusic('fon');
            } else {
                soundController.music.pauseMusic('fon');
            }
        });
        $('#fastSpin').on('change', function () {
            model.state('fastRoll', this.checked);
            localStorage['fastRoll'] = this.checked;
            let fastButton = model.el('fastButton');
            if (model.state('fastRoll')) {
                fastButton.frameName = 'fastSpinOff.png';
            } else {
                fastButton.frameName = 'fastSpin.png';
            }
        });
        $('#isAnimations').on('change', function () {
            let isAnim = this.checked;
            model.state('isAnimations', isAnim);

            game.spriteAnims.forEach((elem) => {
                elem.sprite.animations.paused = !isAnim;
            });
        });
        $('#isAnimBG').on('change', function () {
            let isAnim = this.checked;
            localStorage['isAnimBG'] = this.checked;
            model.state('isAnimBG', isAnim);

            let animMainBG = model.el('animMainBG');
            let mainBG = model.el('mainBG');

            if (isAnim) {
                animMainBG.visible = true;
                mainBG.visible = false;
            } else {
                mainBG.visible = true;
                animMainBG.visible = false;
                for (let i = 0; i < 5; i++) {
                    transitionView.addCloud({container: model.group('bg')});
                }
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
            localStorage['optionAutoplay5'] = this.checked;
            model.state('autoTransititon', this.checked);
        });
        $('#btnHistory').on('click', function () {
            $('.history').removeClass('closed');
        });
        $('#btnRules').on('click', function () {
            console.log('btnRules');
            panelController.handle.info();
            $('#settings').addClass('closed');
            $('#darkness').addClass('closed');
            $('.history').addClass('closed');
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
