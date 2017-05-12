import {model} from 'modules/Model/Model';
import {request} from '../../../../Info/Request';

export class Boot {

    init() {
        model.state('isNoConnect', false);
        const game = model.el('game');
        this.game = game;

        request.setMode({
            normal: 'candyland5',
            fsBonus: 'candyfs1'
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


        if (this.game.device.android && this.game.device.chrome && this.game.device.chromeVersion >= 55) {
            this.game.sound.touchLocked = true;
            this.game.input.touch.addTouchLockCallback(function () {
                if (this.noAudio || !this.touchLocked || this._unlockSource !== null) {
                    return true;
                }
                if (this.usingWebAudio) {
                    // Create empty buffer and play it
                    // The SoundManager.update loop captures the state of it and then resets touchLocked to false

                    let buffer = this.context.createBuffer(1, 1, 22050);
                    this._unlockSource = this.context.createBufferSource();
                    this._unlockSource.buffer = buffer;
                    this._unlockSource.connect(this.context.destination);

                    if (this._unlockSource.start === undefined) {
                        this._unlockSource.noteOn(0);
                    } else {
                        this._unlockSource.start(0);
                    }

                    // Hello Chrome 55!
                    if (this._unlockSource.context.state === 'suspended') {
                        this._unlockSource.context.resume();
                    }
                }

                //  We can remove the event because we've done what we needed (started the unlock sound playing)
                return true;

            }, this.game.sound, true);
        }


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
