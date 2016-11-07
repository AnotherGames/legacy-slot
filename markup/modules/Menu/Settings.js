import { model } from '../../modules/Model/Model';
import { sound } from '../../modules/Sound/Sound';

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
            }

            game.spriteAnims.forEach((elem) => {
                elem.sprite.animations.paused = !isAnim;
            });
        });
        $('#optionAutoplay1').on('change', function () {
            console.log(this.id, this.checked);
        });
        $('#optionAutoplayVal1').on('input change', function () {
            console.log('optionAutoplayVal1', this.value);
        });
        $('#optionAutoplay2').on('change', function () {
            console.log(this.id, this.checked);
        });
        $('#optionAutoplayVal2').on('input change', function () {
            console.log('optionAutoplayVal2', this.value);
        });
        $('#optionAutoplay3').on('change', function () {
            console.log(this.id, this.checked);
        });
        $('#optionAutoplayVal3').on('input change', function () {
            console.log('optionAutoplayVal3', this.value);
        });
        $('#optionAutoplay4').on('change', function () {
            console.log(this.id, this.checked);
        });
        $('#btnHistory').on('click', function () {
            $('.history').removeClass('closed');
        });
        $('#btnRules').on('click', function () {
            console.log('btnRules');
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
