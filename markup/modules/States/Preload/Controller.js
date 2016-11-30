import { model } from 'modules/Model/Model';
import { view } from 'modules/States/Preload/View';

export class Preload {
    constructor(game) {

    }

    init() {
        const game = model.el('game');
        game.add.plugin(Fabrique.Plugins.Spine);
    }

    preload() {
        const game = model.el('game');
        game.load.setPreloadSprite(view.drawPreloadBar());
        view.drawPreloadCoin();

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
        game.load.audio('mozgi1', 'mozgi1.mp3');
        game.load.audio('mozgi2', 'mozgi2.mp3');
        game.load.audio('zombie1', 'zombie1.mp3');
        game.load.audio('zombie2', 'zombie2.mp3');
    }

    loadInitAssets() {
        const game = model.el('game');
        game.load.path = `static/img/content/${model.state('res')}/`;
        game.load.image('initBG', 'bg/initBG.png');
        game.load.atlasJSONArray('text', 'text/text.png', 'text/text.json');
    }

    loadMainAssets() {
        const game = model.el('game');
        game.load.image('mainBG', 'bg/mainBG.png');
        game.load.atlasJSONArray('clouds', 'bg/clouds.png', 'bg/clouds.json');
        game.load.atlasJSONArray('candle', 'bg/candle.png', 'bg/candle.json');
        game.load.image('gameMachine', 'game/gameMachine.png');
        game.load.image('gameBG', 'game/gameBG.png');
        game.load.image('gameShadow', 'game/gameShadow.png');
        game.load.image('popup', 'other/popup.png');
        game.load.image('closed', 'other/closed.png');
        game.load.image('transitionCoin', 'other/transitionCoin.png');
        game.load.image('ar', 'other/ar.png');
        game.load.image('arLeft', 'other/arLeft.png');
        game.load.atlasJSONArray('info', 'other/info.png', 'other/info.json');
        game.load.atlasJSONArray('infoMarker', 'other/infoMarker.png', 'other/infoMarker.json');
        game.load.image('winLine', 'win/winLineRect.png');
        game.load.image('winTotal', 'win/winTotalRect.png');
        game.load.atlasJSONArray('win', 'win/win.png', 'win/win.json');
        game.load.atlasJSONArray('numbers', 'numbers/multiNumbers.png', 'numbers/multiNumbers.json');
        game.load.atlasJSONArray('menuButtons', 'menu/menu.png', 'menu/menu.json');
        game.load.atlasJSONArray('menuButtons', 'menu/menu.png', 'menu/menu.json');
        game.load.atlasJSONArray('footerButtons', 'footer/footerButtons.png', 'footer/footerButtons.json');
        game.load.bitmapFont("numbersFont", "numbers/numbers.png", "numbers/numbers.xml");
        game.load.bitmapFont("fsLevelNumbers", "numbers/numbers1.png", "numbers/numbers1.xml");
        if (model.desktop) {
            game.load.image('ui', 'game/UI.png');
            game.load.image('uiFS', 'game/UI_FS.png');
            game.load.atlasJSONArray('deskButtons', 'desk_buttons/deskButtons.png', 'desk_buttons/deskButtons.json');
            game.load.image('autoSelect', 'desk_buttons/autoSelect.png');
        }
        if (model.mobile) {
            game.load.atlasJSONArray('mobileButtons', 'mobile_buttons/mobileButtons.png', 'mobile_buttons/mobileButtons.json');
        }
        // all elements
        game.load.atlasJSONArray('elements', 'elements/elements.png', 'elements/elements.json');
        // Glista
        game.load.image('ligthGlista', 'glista/lightGlista.png');
        game.load.atlasJSONArray('glistaAtlas', 'glista/glista.png', 'glista/glista.json');
    }

    loadFSAssets() {
        const game = model.el('game');
        game.load.image('fsBG', 'bg/fsBG.png');
        game.load.image('axe', 'fs/axe.png');
        game.load.image('axeSmall', 'fs/axeSmall.png');
        game.load.image('skull', 'fs/skull.png');
        game.load.image('plus3', 'fs/plus3.png');
        if (model.mobile) {
            game.load.image('fsTotalTable', 'fs/fsTotalTable.png');
            game.load.image('multiRip', 'fs/multiRip.png');
            game.load.image('multiTable', 'fs/multiTable.png');
        }
    }

    loadSpineAssets() {
        const game = model.el('game');
        game.load.spine('animBG', 'skeleton/skeleton.json');
        game.load.spine('FSCharapter', 'FSCharapter/Zomb.json');
        game.load.spine('FlyingBrain', 'FSCharapter/Brain.json');
        game.load.spine('mozgiCount', 'fs/mozgi.json');
        game.load.spine('fsCount', 'fs/bang.json');

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
    }

    hidePreloader() {
        const game = model.el('game');
        view.hideCoin();
        view.hideBar();
        view.lastDarkness();
        if (model.state('initScreen')) {
            game.state.start('Init');
        } else {
            game.state.start('Main');
        }
        // TODO: Нужно переходить на главный экран после окончания затемнения,
        // но таким образом мы зависаем на состоянии Preload
        // view.lastDarkness().onComplete.add(() => {
        //     if (model.state('initScreen')) {
            //     game.state.start('Init');
            // } else {
            //     game.state.start('Main');
            // }
        // });
    }
}
