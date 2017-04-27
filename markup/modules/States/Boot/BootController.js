import { model } from 'modules/Model/Model';
import { request } from '../../../../Info/Request';

export class Boot {

    init() {
        model.state('isNoConnect', false);
        const game = model.el('game');

        request.setMode({
            normal: 'jokerjack4',
            fsBonus: 'jokerfs1'
        });

        request.send('Initialise', 'normal')
            .then((initData) => {
                console.log('Init: ', initData);
                model.initStates(initData);
                model.initSettings(initData.Settings);
                model.initBalance(initData.Balance);
                model.initSaved(initData);
            })
            .catch((err) => {
                console.error(err);
            });

        this._checkDevice();
        $(window).on('beforeunload', function () {
            request.send('Logout')
                .then((response) => {
                    console.log('Logout response:', response);
                });
        });

        // При выходе из вкладки анимации будут останавливаться
        game.stage.disableVisibilityChange = true;

        // Ставим игру на паузу при не активном окне браузера
        let visibilityChange;
        if (typeof document.hidden !== 'undefined') {
            visibilityChange = 'visibilitychange';
        } else if (typeof document.mozHidden !== 'undefined') {
            visibilityChange = 'mozvisibilitychange';
        } else if (typeof document.msHidden !== 'undefined') {
            visibilityChange = 'msvisibilitychange';
        } else if (typeof document.webkitHidden !== 'undefined') {
            visibilityChange = 'webkitvisibilitychange';
        }
        document.addEventListener(
            visibilityChange,
            () => {
                game.paused = (game.paused) ? false : true;
            }
        );
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
        game.load.image('popup', 'popup.png');
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
            // Это хак для фулскрина на iOS
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
