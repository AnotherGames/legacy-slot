import { model } from '../../modules/Model/Model';
import { events } from '../../modules/Events/Events';

export class Boot {
    constructor(game) {

    }
    init() {
        console.info('Boot State!');
        if (this.game.device.desktop) {
            this.game.scale.setGameSize(1920, 1080);
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
        this.load.path = `static/img/content/${model.state('res')}/`;
        this.load.image('preloadBar', 'preloader/preloaderBar.png');
        this.load.atlasJSONHash('preloadCoin', 'preloader/coin-0.png', 'preloader/coin.json');
    }
    create() {
        this.state.start('Preload');
    }
}
