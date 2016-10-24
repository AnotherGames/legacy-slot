import { model } from '../../modules/Model/Model';

export class Preload {
    constructor(game) {

    }
    init() {
        console.info('Preload State!');
    }
    preload() {

        let preloadBar = createPreloadBar(this);
        this.load.setPreloadSprite(preloadBar);

        let preloadCoin = createPreloadCoin(this);

        this.load.path = `static/img/content/${model.state('res')}/`;
        this.load.audio('myAudio', 'sound/ambient.mp3');
        this.load.audio('myAudio2', 'sound/doorsAmbient.mp3');
        this.load.audio('myAudio3', 'sound/door1.mp3');
        this.load.audio('myAudio4', 'sound/door2.mp3');
        this.load.audio('myAudio5', 'sound/door3.mp3');
        this.load.audio('myAudio6', 'sound/door4.mp3');
        this.load.audio('myAudio7', 'sound/door5.mp3');
        this.load.audio('myAudio8', 'sound/doorsAmbient.mp3');
    }
    create() {
        let music = this.add.audio('myAudio');
        music.play();
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
