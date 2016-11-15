import { model } from 'modules/Model/Model';
import { view } from 'modules/States/Init/View';

export class Init {
    constructor(game) {

    }
    init() {
        model.state('isNoConnect', true);
        model.state('side', 'left');
        model.state('autoPanel', false);
        model.state('fastRoll', false);
        model.state('isAnimations', true);
        model.state('autoEnd', true);
        model.state('FSMode', false);
        model.state('sound', true);
        model.state('volume', 1);
        model.state('music', true);

        let game = model.el('game');
            game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
            game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    }

    create() {
        view.playMusic();
        view.drawBG();
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
        this.fullScreen();
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
