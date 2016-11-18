import { model } from '../../modules/Model/Model';
import { sound } from '../../modules/Sound/Sound';
import { view as transitionView } from 'modules/Transition/TransitionView';
import { controller as panelController } from 'modules/Panel/PanelController';

export let settings = (function () {
    function initDesktopSettings(game) {
        $('#volume').on('input change', function () {
            sound.volume = this.value;
        });
        $('#checkSound').on('change', function () {
            sound.isSound = this.checked;
        });
        $('#checkMusic').on('change', function () {
            sound.isMusic = this.checked;
        });
        $('#fastSpin').on('change', function () {
            model.state('fastRoll', this.checked);
        });
        $('#isAnimations').on('change', function () {
            let isAnim = this.checked;
            model.state('isAnimations', isAnim);

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

            game.spriteAnims.forEach((elem) => {
                elem.sprite.animations.paused = !isAnim;
            });
        });
        $('#optionAutoplay1').on('change', function () {
            console.log(this.id, this.checked);
            model.state('autoCashLine', this.checked);
        });
        $('#optionAutoplayVal1').on('input change', function () {
            console.log('optionAutoplayVal1', this.value);
            model.data('autoCashLineDelta', this.value);
        });
        $('#optionAutoplay2').on('change', function () {
            console.log(this.id, this.checked);
            model.state('autoCashUp', this.checked);
        });
        $('#optionAutoplayVal2').on('input change', function () {
            console.log('optionAutoplayVal2', this.value);
            model.data('autoCashSumDelta', this.value);
        });
        $('#optionAutoplay3').on('change', function () {
            console.log(this.id, this.checked);
            model.state('autoCashDown', this.checked);
        });
        $('#optionAutoplayVal3').on('input change', function () {
            console.log('optionAutoplayVal3', this.value);
            model.data('autoCashSumDelta', this.value);
        });
        $('#optionAutoplay4').on('change', function () {
            console.log(this.id, this.checked);
        });
        $('#optionAutoplay5').on('change', function () {
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
