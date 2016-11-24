import { model } from 'modules/Model/Model';
import { view } from 'modules/States/Init/View';
import { Element } from 'modules/Class/Element';

export class Init {
    constructor(game) {

    }
    init() {
        let game = model.el('game');
            game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
            game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    }

    create() {
        let settingsWidth = $('#settings').width();
        let multiplay = window.innerWidth / settingsWidth * 0.8;
        $('#settings').css('transform', 'translate(-50%, -50%) scale(' + multiplay + ',' + multiplay + ')');

        $('.history__button').click((event) => {
            $('.history').addClass('closed');
        });

        view.playMusic();
        view.drawBG();
        view.drawLogo();

        let initPlay = view.drawPlay();
            initPlay.inputEnabled = true;
            initPlay.events.onInputDown.add(this.handlePlay, this);

        let game = model.el('game');
        let group = game.add.group();
        let testElements = [];
        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < 6; j++) {
                let testElement = new Element({
                    game: game,
                    parent: group,
                    el: 10,
                    animation: 'w',
                    x: 80 * i,
                    y: 60 * j
                });
                testElements.push(testElement);
            }
        }
        model.el('testElements', testElements);

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
