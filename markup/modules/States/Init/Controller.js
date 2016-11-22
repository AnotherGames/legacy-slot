import { model } from 'modules/Model/Model';
import { view } from 'modules/States/Init/View';

export class Init {
    constructor(game) {

    }
    init() {
        let game = model.el('game');
            game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
            game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    }

    create() {
        let game = model.el('game');
        let settingsWidth = $('#settings').width();
        let multiplay = window.innerWidth / settingsWidth * 0.8;
        $('#settings').css('transform', 'translate(-50%, -50%) scale(' + multiplay + ',' + multiplay + ')');

        $('.history__button').click((event) => {
            $('.history').addClass('closed');
        });

        view.playMusic();
        view.drawBG();
        view.drawBGLogo();
        let luchi = view.drawLuchi();
        game.add.tween(luchi).to({rotation: 2 * Math.PI}, 20000, 'Linear', true, 0, -1);
        view.drawLogo();

        let initPlay = view.drawPlay();
            initPlay.inputEnabled = true;
            initPlay.events.onInputDown.add(this.handlePlay, this);

        model.el('initPlayTween')
            .onComplete.add(() => {
                view.playYoyoTween({});
            });

        view.firstDarkness();
    }

    handlePlay() {
        const game = model.el('game');

        if (model.state('mobile')) game.scale.startFullScreen();
        else this.fullScreen();

        document.body.addEventListener('touchstart', () => {
            model.el('game').scale.startFullScreen();
        });
        // window.addEventListener("orientationchange", function() {
        //     console.log('game.refresh');
        // });

        view.stopYoyoTween();
        view.lastDarkness()
            .onComplete.add(() => {
                view.stopMusic();
                game.state.start('Main');
            });
    }

    fullScreen(element) {
        let _e = element || document.querySelector('#game');

        if (_e.requestFullScreen) _e.requestFullScreen();
        else if (_e.mozRequestFullScreen) _e.mozRequestFullScreen();
        else if (_e.webkitRequestFullScreen) _e.webkitRequestFullScreen();
    }
}
