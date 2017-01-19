import { model } from 'modules/Model/Model';
import { view } from 'modules/States/Init/InitView';
import { Element } from 'modules/Class/Element';
import { controller as soundController} from 'modules/Sound/SoundController';

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
            // Ставим игру на паузу при не активном окне браузера
        let hidden, state, visibilityChange;
        if (typeof document.hidden !== "undefined") {
          hidden = "hidden";
          visibilityChange = "visibilitychange";
          state = "visibilityState";
        } else if (typeof document.mozHidden !== "undefined") {
          hidden = "mozHidden";
          visibilityChange = "mozvisibilitychange";
          state = "mozVisibilityState";
        } else if (typeof document.msHidden !== "undefined") {
          hidden = "msHidden";
          visibilityChange = "msvisibilitychange";
          state = "msVisibilityState";
        } else if (typeof document.webkitHidden !== "undefined") {
          hidden = "webkitHidden";
          visibilityChange = "webkitvisibilitychange";
          state = "webkitVisibilityState";
        }
        document.addEventListener(
            visibilityChange,
            ()=>{ game.paused = (game.paused) ? false : true }
        );
    }

    create() {
        let game = model.el('game')

        this.checkSettingsWidth();

        view.drawBG();
        view.drawLogo();

        let initPlay = view.drawPlay();
            initPlay.inputEnabled = true;
            initPlay.events.onInputDown.add(this.handlePlay, this);

        model.el('initPlayTween')
            .onComplete.add(() => {
                view.playYoyoTween({});
            });

        this.drawSoundTrigger();

        game.camera.flash(0x000000, 500)

        if(!model.state('globalSound')){
            this.sprite2.x = 270;
            this.textOff.setStyle(this.styleOn);
            this.textOn.setStyle(this.styleOff);
        }
    }

    switchSound() {
        if (model.state('globalSound')) {
            soundController.volume.switchVolume()
            this.sprite2.x = 270;
            this.textOff.setStyle(this.styleOn);
            this.textOn.setStyle(this.styleOff);
        } else {
            soundController.volume.switchVolume()
            this.sprite2.x = 310;
            this.textOff.setStyle(this.styleOff);
            this.textOn.setStyle(this.styleOn);
        }
    }

    handlePlay() {
        const game = model.el('game');

        if (model.mobile) game.scale.startFullScreen();

        document.body.addEventListener('touchstart', () => {
            model.el('game').scale.startFullScreen();
        });

        view.stopYoyoTween();

        game.camera.onFadeComplete.add(()=>{
            game.state.start('Main');
        })
        game.camera.fade(0x000000, 500)
    }

    checkSettingsWidth() {
        let settingsWidth = $('#settings').width();
        let multiplay = window.innerWidth / settingsWidth * 0.8;
        $('#settings').css('transform', 'translate(-50%, -50%) scale(' + multiplay + ',' + multiplay + ')');
    }

    drawSoundTrigger() {
        const game = model.el('game');
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
    }
}
