import { model } from '../../modules/Model/Model';

export class Preload {
    constructor(game) {

    }
    init() {
        console.info('Preload State!');
    }
    preload() {

        this.preloadBar = createPreloadBar(this);
        this.load.setPreloadSprite(this.preloadBar);

        this.preloadCoin = createPreloadCoin(this);

        this.load.path = `static/img/content/${model.state('res')}/`;
        this.load.audio('myAudio', 'sound/ambient.mp3');
        this.load.audio('myAudio2', 'sound/doorsAmbient.mp3');
        this.load.audio('myAudio3', 'sound/door1.mp3');
        this.load.audio('myAudio4', 'sound/door2.mp3');
        this.load.audio('myAudio5', 'sound/door3.mp3');
        this.load.audio('myAudio6', 'sound/door4.mp3');
        this.load.audio('myAudio7', 'sound/door5.mp3');
        this.load.audio('myAudio8', 'sound/doorsAmbient.mp3');

        this.load.onLoadComplete.add(this.closePreloader, this);
    }
    create() {
        let music = this.add.audio('myAudio');
        music.play();
    }
    closePreloader() {
        let closeCoinTween = this.add.tween(this.preloadCoin.scale);
        closeCoinTween.to({x: 0, y: 0}, 500, Phaser.Easing.In);
        closeCoinTween.start();
        closeCoinTween.onComplete.add(() => {
            this.state.start('Init');
        }, this);

        let closeBarTween = this.add.tween(this.preloadBar);
        closeBarTween.to({alpha: 0}, 400, Phaser.Easing.In);
        closeBarTween.start();
    }
}

function createPreloadBar(game) {
    let preloadBar = game.add.sprite(game.world.centerX, game.world.centerY * 1.3, 'preloadBar');
    preloadBar.anchor.set(0, 0.5);
    preloadBar.position.x -= preloadBar.width / 2;

    return preloadBar;
}

function createPreloadCoin(game) {
    let preloadCoin = game.add.sprite(game.world.centerX, game.world.centerY * 0.9, 'preloadCoin');
    preloadCoin.anchor.set(0.5);
    preloadCoin.scale.set(0);
    preloadCoin.animations.add('coin', null, 15, true);
    preloadCoin.animations.play('coin');

    let coinTween = game.add.tween(preloadCoin.scale);
    coinTween.to({x: 1, y: 1}, 1000, Phaser.Easing.Out);
    coinTween.start();

    return preloadCoin;
}
