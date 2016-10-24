import { model } from '../../modules/Model/Model';
import { events } from '../../modules/Events/Events';

export class Boot {
    constructor(game) {

    }
    init() {
        console.info('Boot State!');
        if (this.game.device.desktop) {
            this.game.scale.setGameSize(1960, 1080);
            model.flag('desktop', true);
            model.state('res', 'fullHD');
        } else {
            this.game.scale.setGameSize(1280, 720);
            model.flag('mobile', true);
            model.state('res', 'HD');
        }
        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    }
    preload() {
        this.load.path = `static/img/content/${model.state('res')}/preloader/`;
        this.load.image('preloaderBar', 'preloaderBar.png');
        this.load.atlasJSONHash('preloaderCoin', 'Coin-0.png', 'Coin.json');
    }
    create() {
        let preloadBar = this.add.sprite(this.world.centerX, this.world.centerY * 1.3, 'preloaderBar');
        let preloaderCoin = this.add.sprite(this.world.centerX, this.world.centerY * 0.9, 'preloaderCoin');
        preloaderCoin.scale.set(0);
        let coinTween = this.add.tween(preloaderCoin.scale);
        coinTween.to({x: 1, y: 1}, 1000, Phaser.Easing.Out);
        coinTween.start();
        preloaderCoin.animations.add('coin', null, 15, true);
        preloaderCoin.animations.play('coin');
        preloadBar.anchor.set(0.5);
        preloaderCoin.anchor.set(0.5);
    }
}
