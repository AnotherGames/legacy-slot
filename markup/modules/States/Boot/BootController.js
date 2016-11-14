import { model } from 'modules/Model/Model';
import { events } from 'modules/Util/Events';
import { request } from 'modules/Util/Request';

export let controller = (() => {

    function init() {
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

        _checkDevice();
    }

    function preload() {
        const game = model.el('game');

        loadPreloadAssets();

        game.load.onLoadComplete.add(() => {
            game.state.start('Preload');
        });
    }

    function loadPreloadAssets() {
        const game = model.el('game');

        game.load.path = `static/img/content/${model.state('res')}/preloader/`;
        game.load.image('preloadBar', 'preloaderBar.png');
        game.load.atlasJSONHash('preloadCoin', 'coin-0.png', 'coin.json');
    }

    function _checkDevice() {
        const game = model.el('game');

        if (game.device.desktop) {
            game.scale.setGameSize(1920, 1080);
            model.state('desktop', true);
            model.state('res', 'fullHD');
        } else {
            game.scale.setGameSize(1280, 720);
            model.state('mobile', true);
            model.state('res', 'HD');
        }
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    }

    events.on('boot:init', init);
    events.on('boot:preload', preload);
})();
