import { model } from 'modules/Model/Model';
import { view } from 'modules/States/Preload/PreloadView';
import { view as mainView } from 'modules/States/Main/MainView';

export class Preload {
    constructor(game) {

    }

    init() {
        const game = model.el('game');
        game.add.plugin(Fabrique.Plugins.Spine);
        if (!game.device.iOS) {
            game.scale.pageAlignHorizontally = true;
            // game.scale.windowConstraints = {bottom: 'visual', right: 'visual'};
            game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
        }

        // При выходе из вкладки анимации будут останавливаться
        game.stage.disableVisibilityChange = true;
    }

    preload() {
        const game = model.el('game');

        model.group('popup', game.add.group());
        $('#wait').addClass('closed');

        game.load.setPreloadSprite(view.drawPreloadBar());
        view.drawPreloadCoin();

        model.state('loadError', false)
        game.load.onFileError.add(()=>{
            model.state('loadError', true)
        })

        this.loadSounds();
        this.loadInitAssets();
        this.loadMainAssets();
        this.loadFSAssets();
        this.loadSpineAssets();
        this.loadTest();

        game.load.onLoadComplete.add(this.hidePreloader);
    }

    loadSounds() {
        const game = model.el('game');
        game.load.path = 'static/img/content/sound/';
        game.load.audio('fon', 'ambient.mp3');
        game.load.audio('fsFon', 'fsAmbient.mp3');
        game.load.audio('initFon', 'logoAmbient.mp3');
        game.load.audio('baraban', 'baraban.mp3');
        game.load.audio('buttonClick', 'buttonClick.mp3');
        game.load.audio('startPerehod', 'startPerehod.mp3');
        game.load.audio('finishPerehod', 'finishPerehod.mp3');
        game.load.audio('lineWin', 'lineWin.mp3');
        game.load.audio('lineWin2', 'lineWin2.mp3');
        game.load.audio('aim', 'aim.mp3');
        game.load.audio('coins', 'coins.mp3');
        game.load.audio('shurikenFly', 'shurikenFly.mp3');
        game.load.audio('bonusSword', 'bonusSword.mp3');
        game.load.audio('changeChar', 'changeChar.mp3');
        game.load.audio('wow', 'wow.mp3');
        game.load.audio('numberRustle', 'numberRustle.mp3');
    }

    loadInitAssets() {
        const game = model.el('game');
        game.load.path = `static/img/content/${model.res}/`;
        game.load.image('initBG', 'bg/initBG.png');
        game.load.image('initLogo', 'bg/initLogo.png');
        game.load.image('initSuriken', 'bg/initSuriken.png');
        game.load.atlasJSONArray('text', 'text/text.png', 'text/text.json');
    }

    loadMainAssets() {
        const game = model.el('game');
        game.load.image('mainBG', 'bg/mainBG.png');
        game.load.image('gameMachine', 'game/gameMachine.png');
        game.load.image('gameBG', 'game/gameBG.png');
        game.load.image('gmRight', 'game/gmRight.png');
        game.load.image('gmLeft', 'game/gmLeft.png');
        game.load.image('gameBGfs', 'game/gameBGfs.png');
        game.load.image('gameShadow', 'game/gameShadow.png');
        game.load.image('aim', 'other/aim.png');
        game.load.atlasJSONArray('shuriken', 'other/shuriken.png', 'other/shuriken.json');
        game.load.image('closed', 'other/closed.png');
        game.load.image('coinGold', 'other/coinGold.png');
        game.load.image('ar', 'other/ar.png');
        game.load.atlasJSONArray('info', 'other/info.png', 'other/info.json');
        game.load.atlasJSONArray('infoMarker', 'other/infoMarker.png', 'other/infoMarker.json');
        game.load.image('winLine', 'win/winLine.png');
        game.load.image('winTotal', 'win/winTotal.png');
        game.load.atlasJSONArray('lineNumbers', 'win/lineNumbers.png', 'win/lineNumbers.json');
        game.load.atlasJSONArray('lineNumbersLeft', 'win/lineNumbersLeft.png', 'win/lineNumbersLeft.json');
        game.load.atlasJSONArray('menuButtons', 'menu/menu.png', 'menu/menu.json');
        game.load.atlasJSONArray('menuButtons', 'menu/menu.png', 'menu/menu.json');
        game.load.atlasJSONArray('footerButtons', 'footer/footerButtons.png', 'footer/footerButtons.json');
        game.load.bitmapFont("numbersFont", "numbers/numbers.png", "numbers/numbers.xml");
        if (model.desktop) {
            game.load.image('ui', 'game/UI.png');
            game.load.image('uiFS', 'game/UI_FS.png');
            game.load.image('autoSelect', 'desk_buttons/autoSelect.png');
            game.load.atlasJSONArray('deskButtons', 'desk_buttons/deskButtons.png', 'desk_buttons/deskButtons.json');
            game.load.atlasJSONArray('lamp', 'bg/lamp.png', 'bg/lamp.json');
        }
        if (model.mobile) {
            game.load.atlasJSONArray('mobileButtons', 'mobile_buttons/mobileButtons.png', 'mobile_buttons/mobileButtons.json');
        }

        // Glista
        game.load.image('ligthGlista', 'glista/lightGlista.png');
        game.load.image('suriken', 'glista/suriken.png');
    }

    loadFSAssets() {
        const game = model.el('game');
        game.load.image('fsBG', 'bg/fsBG.png');
        game.load.image('transitionFS', 'fs/transitionFS.png');
        game.load.image('fsCountBG', 'fs/fsCountBG.png');
        game.load.atlasJSONArray('fsMulti', 'fs/fsMulti.png', 'fs/fsMulti.json');
        game.load.atlasJSONArray('fsMultiBig', 'fs/fsMultiBig.png', 'fs/fsMultiBig.json');
        game.load.image('doorRight', 'bg/doorRight.png');
        game.load.image('doorLeft', 'bg/doorLeft.png');
        if (model.desktop) {
            game.load.atlasJSONArray('star', 'fs/star.png', 'fs/star.json');
        }
    }

    loadSpineAssets() {
        const game = model.el('game');
        game.load.spine('geisha', 'spine/Geisha.json');
        game.load.spine('ninja', 'spine/Ninja.json');
        game.load.spine('samurai', 'spine/Samurai.json');
        game.load.spine('ronin', 'spine/Ronin.json');
        game.load.spine('shadows', 'spine/shadows.json');

    }

    loadTest() {
        const game = model.el('game');
        game.load.atlasJSONArray('1', 'elements/1.png', 'elements/1.json');
        game.load.atlasJSONArray('2', 'elements/2.png', 'elements/2.json');
        game.load.atlasJSONArray('3', 'elements/3.png', 'elements/3.json');
        game.load.atlasJSONArray('4', 'elements/4.png', 'elements/4.json');
        game.load.atlasJSONArray('5', 'elements/5.png', 'elements/5.json');
        game.load.atlasJSONArray('6', 'elements/6.png', 'elements/6.json');
        game.load.atlasJSONArray('7', 'elements/7.png', 'elements/7.json');
        game.load.atlasJSONArray('8', 'elements/8.png', 'elements/8.json');
        game.load.atlasJSONArray('9', 'elements/9.png', 'elements/9.json');
        game.load.atlasJSONArray('10', 'elements/10.png', 'elements/10.json');
        game.load.atlasJSONArray('11', 'elements/11.png', 'elements/11.json');
        game.load.atlasJSONArray('12', 'elements/12.png', 'elements/12.json');
        game.load.atlasJSONArray('coin', 'elements/coin.png', 'elements/coin.json');
    }

    hidePreloader() {
        const game = model.el('game');
        if (model.state('loadError')) {
            model.el('preloadBar').visible = false;
            model.el('preloadCoin').visible = false;
            mainView.draw.showPopup({message: 'Connection problem. Click to restart.'});
            game.load.reset(true, true)
            return;
        }
        view.hideBar();
        view.hideCoin();
        if (model.state('initScreen')) {
            game.state.start('Init');
        } else {
            game.state.start('Main');
        }
    }
}
