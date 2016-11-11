import { model } from 'modules/Model/Model';
import { events } from 'modules/Util/Events';
import { view } from 'modules/States/Init/InitView';

export let controller = (() => {

    function init() {
        const game = model.el('game');
        game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    }

    function create() {
        view.playMusic();
        view.drawBG();
        view.drawLogo();

        let initPlay = view.drawPlay();
        initPlay.inputEnabled = true;
        initPlay.events.onInputDown.add(handlePlay);
        model.el('initPlayTween')
            .onComplete.add(() => {
                view.playYoyoTween({});
            });

        view.firstDarkness();
    }

    function handlePlay() {
        const game = model.el('game');
        // Старый метод выхода в фуллскрин
        // game.scale.startFullScreen(false);
        // Новый метод выхода в фуллскрин
        fullScreen();
        view.stopYoyoTween();
        view.lastDarkness()
            .onComplete.add(() => {
                view.stopMusic();
                game.state.start('Main');
            });
    }

    function fullScreen(e) {
        e = e || document.querySelector('#game');
        e.requestFullScreen ?
        e.requestFullScreen() :
        e.mozRequestFullScreen ?
        e.mozRequestFullScreen() :
        e.webkitRequestFullScreen &&
        e.webkitRequestFullScreen();
    }

    events.on('init:init', init);
    events.on('init:create', create);
})();
