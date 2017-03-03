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
        game.load.audio('cat', 'cat.mp3');
        game.load.audio('gun', 'gun.mp3');
        game.load.audio('gaz', 'gaz.mp3');
        game.load.audio('burstConfetti', 'burstConfetti.mp3');

    }

    loadInitAssets() {
        const game = model.el('game');
        game.load.path = `static/img/content/${model.res}/`;
        game.load.image('initLogo', 'bg/initLogo.png');
        game.load.image('logosSmall', 'bg/logosSmall.png');
        game.load.image('gradientLine', 'bg/gradientLine.png');
        game.load.atlasJSONArray('text', 'text/text.png', 'text/text.json');
    }

    loadMainAssets() {
        const game = model.el('game');
        game.load.image('gameMachine', 'game/gameMachine.png');
        game.load.image('gameBG', 'game/gameBG.png');
        game.load.image('logoGM', 'game/logoGM.png');
        game.load.image('cloud', 'bg/cloud.png');
        game.load.image('shine', 'bg/shine.png');
        game.load.image('green', 'bg/f-green.png');
        game.load.image('orange', 'bg/f-orange.png');
        game.load.image('red', 'bg/f-red.png');
        game.load.image('bubble', 'bg/bubble.png');
        game.load.image('balloons', 'bg/balloons.png');
        game.load.image('confetti1', 'bg/confetti1.png');
        game.load.image('confetti2', 'bg/confetti2.png');
        game.load.image('confetti3', 'bg/confetti3.png');
        game.load.atlasJSONArray('trash', 'bg/trash.png', 'bg/trash.json');
        game.load.atlasJSONArray('cat2', 'bg/cat2.png', 'bg/cat2.json');
        game.load.image('closeButton', 'other/closeButton.png');
        game.load.image('arrow', 'other/arrow.png');
        game.load.image('infoTableBg', 'other/infoTableBg.png');
        game.load.atlasJSONArray('infoTable', 'other/infoTable.png', 'other/infoTable.json');
        game.load.atlasJSONArray('infoMarker', 'other/infoMarker.png', 'other/infoMarker.json');
        game.load.image('winLine', 'win/winLine.png');
        game.load.image('winTotal', 'win/winTotal.png');
        game.load.atlasJSONArray('lineNumbers', 'win/lineNumbers.png', 'win/lineNumbers.json');
        game.load.atlasJSONArray('winNumbers', 'win/winNumbers.png', 'win/winNumbers.json');
        game.load.atlasJSONArray('menuButtons', 'menu/menu.png', 'menu/menu.json');
        game.load.atlasJSONArray('footerButtons', 'footer/footerButtons.png', 'footer/footerButtons.json');
        game.load.bitmapFont('numbersFont', 'numbers/numbers.png', 'numbers/numbers.xml');
        game.load.bitmapFont('textOrange', 'text/text1.png', 'text/text1.xml');
        game.load.bitmapFont('textGreen', 'text/text2.png', 'text/text2.xml');
        if (model.desktop) {
            game.load.image('panel', 'game/panel.png');
            game.load.atlasJSONArray('panelBG', 'game/panelBG.png', 'game/panelBG.json');
            game.load.atlasJSONArray('deskButtons', 'desk_buttons/deskButtons.png', 'desk_buttons/deskButtons.json');
            game.load.atlasJSONArray('deskButtonsAnim', 'desk_buttons/deskButtonsAnim.png', 'desk_buttons/deskButtonsAnim.json');
            game.load.atlasJSONArray('switcher', 'desk_buttons/switcher.png', 'desk_buttons/switcher.json');
        }
        if (model.mobile) {
            game.load.atlasJSONArray('mobileButtons', 'mobile_buttons/mobileButtons.png', 'mobile_buttons/mobileButtons.json');
        }

        // Glista
        game.load.image('ligthGlista', 'glista/lightGlista.png');
        game.load.atlasJSONArray('glista', 'glista/glista.png', 'glista/glista.json');
        game.load.atlasJSONArray('stars', 'glista/stars.png', 'glista/stars.json');
    }

    loadFSAssets() {
        const game = model.el('game');
        game.load.atlasJSONArray('fsCountBG', 'fs/fsCountBG.png', 'fs/fsCountBG.json');
        game.load.image('fsWinText', 'fs/fsWinText.png');
    }

    loadSpineAssets() {
        const game = model.el('game');
        game.load.spine('bottle', 'spine/Bottle.json');
        game.load.spine('boy', 'spine/boy.json');
        game.load.spine('cat', 'spine/skeleton.json');
        game.load.spine('gun', 'spine/gun.json');
        if (model.desktop) {
            game.load.spine('fon', 'spine/Zastavka.json');
        }

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
        game.load.atlasJSONArray('18', 'elements/18.png', 'elements/18.json');
        game.load.atlasJSONArray('19', 'elements/19.png', 'elements/19.json');
        game.load.atlasJSONArray('20', 'elements/20.png', 'elements/20.json');
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
