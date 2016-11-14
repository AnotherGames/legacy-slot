import { model } from 'modules/Model/Model';
import { view } from 'modules/States/Init/View';

export class Init {
    constructor(game) {

    }
    init() {
        const game = model.el('game');
        game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    }

    create() {
        view.playMusic();
        view.drawBG();
        view.drawLogo();

        let initPlay = view.drawPlay();
        initPlay.inputEnabled = true;
        initPlay.events.onInputDown.add(this.handlePlay.bind(this));
        model.el('initPlayTween')
            .onComplete.add(() => {
                view.playYoyoTween({});
            });

        view.firstDarkness();
    }

    handlePlay() {
        const game = model.el('game');
        // Старый метод выхода в фуллскрин
        // game.scale.startFullScreen(false);
        // Новый метод выхода в фуллскрин
        console.log(this);
        this.fullScreen();
        view.stopYoyoTween();
        view.lastDarkness()
            .onComplete.add(() => {
                view.stopMusic();
                game.state.start('Main');
            });
    }

    fullScreen(event) {
        let _e = event || document.querySelector('#game');

        if (_e.requestFullScreen) _e.requestFullScreen();
        else if (_e.mozRequestFullScreen) _e.mozRequestFullScreen();
        else if (_e.webkitRequestFullScreen) _e.webkitRequestFullScreen();
    }
}
