import { model } from 'modules/Model/Model';
import { view } from 'modules/States/Init/InitView';
import { controller as soundController} from 'modules/Sound/SoundController';
import { controller as keyboardController} from 'modules/keyboard/KeyboardController';
import { view as transitionView} from 'modules/Transition/TransitionView';

export class Init {
    constructor(game) {

    }
    init() {
        let game = model.el('game');
        game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        soundController.music.playMusic('initFon');

        // При выходе из вкладки анимации будут останавливаться
        game.stage.disableVisibilityChange = true;
    }

    create() {
        let game = model.el('game');

        // Лочим 30фпс
        this.game.plugins.add(new Phaser.Plugin.SaveCPU(this));

        view.drawBG();
        view.drawLogo();
        view.drawBaraban();

        transitionView.addLines({container: game.add.group()});

        if (model.desktop) {
            keyboardController.initInitKeys();
        }

        let initPlay = view.drawPlay();
        initPlay.inputEnabled = true;
        initPlay.events.onInputDown.add(this.handlePlay, this);

        model.el('initPlayTween')
            .onComplete.add(() => {
                view.playYoyoTween({});
            });

        this.drawSoundTrigger();

        game.camera.flash(0x000000, 500);

        if (!model.state('globalSound')) {
            this.triggerSoundLeft();
        }
    }

    switchSound() {
        soundController.volume.switchVolume();

        (model.state('globalSound')) ? this.triggerSoundRight() : this.triggerSoundLeft();
    }

    handlePlay() {
        const game = model.el('game');

        if (model.mobile) {
            game.scale.startFullScreen();
        }

        document.body.addEventListener('touchstart', () => {
            model.el('game').scale.startFullScreen();
        });

        view.stopYoyoTween();
        game.camera.onFadeComplete.add(() => {
            if (model.data('savedFS')) {
                game.state.start('FS');
            } else {
                game.state.start('Main');
            }
        });
        game.camera.fade(0x000000, 500);
    }

    checkSettingsWidth() {
        let settingsWidth = $('#settings').width();
        let multiplay = window.innerWidth / settingsWidth * 0.8;
        $('#settings').css('transform', 'translate(-50%, -50%) scale(' + multiplay + ',' + multiplay + ')');
    }

    triggerSoundLeft() {
        this.sprite2.x = 270;
        this.textOff.setStyle(this.styleOn);
        this.textOn.setStyle(this.styleOff);
    }

    triggerSoundRight() {
        this.sprite2.x = 310;
        this.textOff.setStyle(this.styleOff);
        this.textOn.setStyle(this.styleOn);
    }

    drawSoundTrigger() {
        const game = model.el('game');
        let soundContainer = game.add.group();
        soundContainer.position.set(game.width - 500, game.height - 100);
        let style = { font: 'bold 42px Arial', fill: '#f3eba0'};
        this.styleOff = { font: 'bold 42px Arial', fill: '#474747'};
        this.textOff = game.add.text(170, 0, 'Off', style, soundContainer);
        this.textOff.setStyle(this.styleOff);
        this.styleOn = { font: 'bold 42px Arial', fill: '#b8ff31'};
        this.textOn = game.add.text(350, 0, 'On', style, soundContainer);
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
    }
}
