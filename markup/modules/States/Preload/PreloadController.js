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

        model.state('loadError', false);
        game.load.onFileError.add(() => {
            model.state('loadError', true);
        });

        this.loadSounds();
        this.loadInitAssets();
        this.loadMainAssets();
        this.loadFSAssets();
        this.loadSpineAssets();
        this.loadElements();

        mainView.draw.initPopup();

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
        game.load.audio('startPerehod', 'transition.mp3');
        game.load.audio('finishPerehod', 'transition.mp3');
        game.load.audio('lineWin', 'lineWin.mp3');
        game.load.audio('lineWin2', 'lineWin2.mp3');

    }

    loadInitAssets() {
        const game = model.el('game');
        game.load.path = `static/img/content/${model.res}/`;
        game.load.image('initBG', 'bg/initBG.png');
        game.load.image('logosSmall', 'preloader/logosSmall.png');
        game.load.atlasJSONArray('text', 'text/text.png', 'text/text.json');
    }

    loadMainAssets() {
        const game = model.el('game');
        game.load.image('mainBG', 'bg/mainBG.png');
        game.load.atlasJSONArray('light', 'game/light.png', 'game/light.json');
        game.load.image('lightBroken', 'game/lightBroken.png');
        game.load.image('lightGreen', 'game/lightGreen.png');
        game.load.image('lightRed', 'game/lightRed.png');
        game.load.image('gameMachine', 'game/gameMachine.png');
        game.load.image('gameMachineBG', 'game/gameMachineBG.png');
        game.load.image('redRoll', 'game/redRoll.png');
        game.load.image('greenRoll', 'game/greenRoll.png');
        game.load.image('darkness', 'game/darkness.png');
        game.load.image('closeButton', 'other/closeButton.png');
        game.load.image('infoTableBg', 'other/infoTableBg.png');
        game.load.atlasJSONArray('infoTable', 'other/infoTable.png', 'other/infoTable.json');
        game.load.atlasJSONArray('infoMarker', 'other/infoMarker.png', 'other/infoMarker.json');
        game.load.image('winLine', 'win/winLine.png');
        game.load.image('winTotal', 'win/winTotal.png');
        game.load.atlasJSONArray('menuButtons', 'menu/menu.png', 'menu/menu.json');
        game.load.atlasJSONArray('footerButtons', 'footer/footerButtons.png', 'footer/footerButtons.json');
        game.load.bitmapFont('numbersFont', 'numbers/numbers.png', 'numbers/numbers.xml');
        if (model.desktop) {
            game.load.image('panel', 'game/panel.png');
            game.load.atlasJSONArray('deskButtons', 'desk_buttons/deskButtons.png', 'desk_buttons/deskButtons.json');
            game.load.atlasJSONArray('deskButtonsAnim', 'desk_buttons/deskButtonsAnim.png', 'desk_buttons/deskButtonsAnim.json');
            game.load.atlasJSONArray('arrow', 'other/arrow.png', 'other/arrow.json');
        }
        if (model.mobile) {
            game.load.atlasJSONArray('mobileButtons', 'mobile_buttons/mobileButtons.png', 'mobile_buttons/mobileButtons.json');
            game.load.image('arrow', 'other/arrow.png');
        }

        // Glista
        game.load.image('ligthGlista', 'glista/lightGlista.png');
        game.load.atlasJSONArray('glista', 'glista/glista.png', 'glista/glista.json');
        game.load.atlasJSONArray('stars', 'glista/stars.png', 'glista/stars.json');
    }

    loadFSAssets() {
        const game = model.el('game');
        game.load.image('fsCountBG', 'fs/fsCountBG.png');
        game.load.image('jack', 'fs/jack.png');
        game.load.image('coin1', 'fs/coin1.png');
        game.load.image('coin2', 'fs/coin2.png');
        game.load.image('gameMachineFSBG', 'game/gameMachineFSBG.png');
        if (model.desktop) {
            game.load.image('panelFS', 'game/panelFS.png');
        }
    }

    loadSpineAssets() {
        const game = model.el('game');
        game.load.spine('lever', 'spine/img.json');
        game.load.spine('initFon', 'spine/skeleton.json');
        game.load.spine('flagLeft', 'spine/Flag_l.json');
        game.load.spine('flagRight', 'spine/Flag_R.json');
        game.load.spine('logoGM', 'spine/Z_top.json');
    }

    loadElements() {
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
        game.load.atlasJSONArray('13', 'elements/13.png', 'elements/13.json');
        game.load.atlasJSONArray('14', 'elements/14.png', 'elements/14.json');
        game.load.atlasJSONArray('15', 'elements/15.png', 'elements/15.json');
        game.load.atlasJSONArray('16', 'elements/16.png', 'elements/16.json');
        game.load.atlasJSONArray('17', 'elements/17.png', 'elements/17.json');
        game.load.atlasJSONArray('18', 'elements/18.png', 'elements/18.json');
    }

    hidePreloader() {
        const game = model.el('game');
        if (model.state('loadError')) {
            model.el('preloadBar').visible = false;
            model.el('preloadCoin').visible = false;
            mainView.draw.showPopup({message: 'Connection problem. Click to restart.'});
            game.load.reset(true, true);
            return;
        }
        view.hideBar();
        view.hideCoin();
        game.state.start('Init');
    }
}
