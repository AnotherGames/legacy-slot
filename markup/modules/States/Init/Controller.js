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
        let settingsWidth = $('#settings').width();
        let multiplay = window.innerWidth / settingsWidth * 0.8;
        $('#settings').css('transform', 'translate(-50%, -50%) scale(' + multiplay + ',' + multiplay + ')');

        $('.history__button').click((event) => {
            $('.history').addClass('closed');
        });

        // view.playMusic();
        view.drawBG();
        view.drawLogo();

        let initPlay = view.drawPlay();
            initPlay.inputEnabled = true;
            initPlay.events.onInputDown.add(this.handlePlay, this);

        model.el('initPlayTween')
            .onComplete.add(() => {
                view.playYoyoTween({});
            });

        let soundContainer = game.add.group();
        soundContainer.position.set(game.width - 500, game.height - 100);
        let style = { font: "bold 42px Arial", fill: "#f3eba0"};
        let textSound = game.add.text(0, 0, "Sound:", style, soundContainer);
        this.styleOff = { font: "bold 42px Arial", fill: "#474747"};
        this.textOff = game.add.text(170, 0, "Off", style, soundContainer);
        this.textOff.setStyle(this.styleOff);
        this.styleOn = { font: "bold 42px Arial", fill: "#b8ff31"};
        this.textOn = game.add.text(350, 0, "On", style, soundContainer);
        this.textOn.setStyle(this.styleOn);

        let graphics = game.add.graphics(0, 0);
        graphics.beginFill(0x6da600, 1);
        graphics.drawRoundedRect(0, 0, 70, 30, 150);

        let sprite = game.add.sprite(290, 25, graphics.generateTexture(), null, soundContainer);
        sprite.anchor.set(0.5);
        sprite.inputEnabled = true;
        sprite.events.onInputDown.add(this.switchSound, this);
        graphics.destroy();

        let graphics2 = game.add.graphics(0, 0);
        graphics2.beginFill(0xffffff, 1);
        graphics2.drawCircle(0, 0, 30);
        this.sprite2 = game.add.sprite(310, 25, graphics2.generateTexture(), null, soundContainer);
        this.sprite2.anchor.set(0.5);
        graphics2.destroy();

        view.firstDarkness();
    }

    switchSound() {
        let game = model.el('game');
        if (game.sound.volume > 0) {
            game.sound.volume = 0;
            this.sprite2.x = 270;
            model.state('volume', 0);
            this.textOff.setStyle(this.styleOn);
            this.textOn.setStyle(this.styleOff);
        } else {
            game.sound.volume = 1;
            this.sprite2.x = 310;
            model.state('volume', 1);
            this.textOff.setStyle(this.styleOff);
            this.textOn.setStyle(this.styleOn);
        }
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
                // view.stopMusic();
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
