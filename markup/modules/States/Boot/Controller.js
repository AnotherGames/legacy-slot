import { model } from 'modules/Model/Model';
import { request } from 'modules/Util/Request';

export class Boot {
    constructor(game) {

    }

    init() {
        model.state('isNoConnect', false);

        request.send('Initialise', 'fsBonus')
            .then((initData) => {
                model.initStates(initData);
                model.initSettings(initData.Settings);
                model.initBalance(initData.Balance);
                model.initSaved(initData.Saved);
            })
            .catch((err) => {
                console.error(err);
            });

        this._checkDevice();
    }

    preload() {
        const game = model.el('game');

        this.loadPreloadAssets();

        game.load.onLoadComplete.add(() => {
            game.state.start('Preload');
        });
    }

    loadPreloadAssets() {
        const game = model.el('game');

        game.load.path = `static/img/content/${model.res}/preloader/`;
        game.load.image('preloadBar', 'preloaderBar.png');
        game.load.atlasJSONHash('preloadCoin', 'coin-0.png', 'coin.json');
    }

    _checkDevice() {
        const game = model.el('game');

        if (game.device.desktop) {
            game.scale.setGameSize(1920, 1080);
            model.desktop = true;
            model.res = 'fullHD';
        } else {
            if (game.device.iOS) {
                $('html, body').addClass('ios');
            }
            game.scale.setGameSize(1280, 720);
            model.mobile = true;
            model.res = 'HD';
        }
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    }
}
