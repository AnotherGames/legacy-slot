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
        game.load.image('balloons', 'bg/balloons.png');
        game.load.image('confetti1', 'bg/confetti1.png');
        game.load.image('confetti2', 'bg/confetti2.png');
        game.load.image('confetti3', 'bg/confetti3.png');
        game.load.atlasJSONArray('trash', 'bg/trash.png', 'bg/trash.json');
        // game.load.image('aim', 'other/aim.png');
        // game.load.atlasJSONArray('shuriken', 'other/shuriken.png', 'other/shuriken.json');
        game.load.image('closed', 'other/closed.png');
        game.load.image('coinGold', 'other/coinGold.png');
        game.load.image('ar', 'other/ar.png');
        game.load.image('arLeft', 'other/arLeft.png');
        game.load.atlasJSONArray('info', 'other/info.png', 'other/info.json');
        game.load.atlasJSONArray('infoMarker', 'other/infoMarker.png', 'other/infoMarker.json');
        game.load.image('winLine', 'win/winLine.png');
        game.load.image('winTotal', 'win/winTotal.png');
        game.load.atlasJSONArray('lineNumbers', 'win/lineNumbers.png', 'win/lineNumbers.json');
        game.load.atlasJSONArray('menuButtons', 'menu/menu.png', 'menu/menu.json');
        game.load.atlasJSONArray('footerButtons', 'footer/footerButtons.png', 'footer/footerButtons.json');
        game.load.bitmapFont("numbersFont", "numbers/numbers.png", "numbers/numbers.xml");
        game.load.bitmapFont("textOrange", "text/text1.png", "text/text1.xml");
        game.load.bitmapFont("textGreen", "text/text2.png", "text/text2.xml");
        if (model.desktop) {
            game.load.image('panel', 'game/panel.png');
            game.load.image('panelFS', 'game/panelFS.png');
            game.load.atlasJSONArray('panelBG', 'game/panelBG.png', 'game/panelBG.json');
            game.load.image('autoSelect', 'desk_buttons/autoSelect.png');
            game.load.atlasJSONArray('deskButtons', 'desk_buttons/deskButtons.png', 'desk_buttons/deskButtons.json');
            game.load.atlasJSONArray('deskButtonsAnim', 'desk_buttons/deskButtonsAnim.png', 'desk_buttons/deskButtonsAnim.json');
            game.load.atlasJSONArray('switcher', 'desk_buttons/switcher.png', 'desk_buttons/switcher.json');
        }
        if (model.mobile) {
            game.load.atlasJSONArray('mobileButtons', 'mobile_buttons/mobileButtons.png', 'mobile_buttons/mobileButtons.json');
        }

        // Glista
        game.load.image('ligthGlista', 'glista/lightGlista.png');
        game.load.image('suriken', 'glista/suriken.png');
        game.load.atlasJSONArray('glistaAtlas', 'glista/glista.png', 'glista/glista.json');
    }

    loadFSAssets() {
        const game = model.el('game');
        game.load.image('transitionFS', 'fs/transitionFS.png');
        game.load.image('fsCountBG', 'fs/fsCountBG.png');
        game.load.atlasJSONArray('fsMulti', 'fs/fsMulti.png', 'fs/fsMulti.json');
        game.load.atlasJSONArray('fsMultiBig', 'fs/fsMultiBig.png', 'fs/fsMultiBig.json');
        if (model.desktop) {
            // game.load.atlasJSONArray('star', 'fs/star.png', 'fs/star.json');
        }
    }

    loadSpineAssets() {
        const game = model.el('game');
        game.load.spine('bottle', 'spine/Bottle.json');
        game.load.spine('fon', 'spine/Zastavka.json');
        game.load.spine('boy', 'spine/boy.json');

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
        game.load.atlasJSONArray('13', 'elements/13.png', 'elements/13.json');
        game.load.atlasJSONArray('14', 'elements/14.png', 'elements/14.json');
        game.load.atlasJSONArray('15', 'elements/15.png', 'elements/15.json');
        game.load.atlasJSONArray('16', 'elements/16.png', 'elements/16.json');
        game.load.atlasJSONArray('17', 'elements/17.png', 'elements/17.json');
        game.load.atlasJSONArray('18', 'elements/18.png', 'elements/18.json');
        game.load.atlasJSONArray('19', 'elements/19.png', 'elements/19.json');
        game.load.atlasJSONArray('20', 'elements/20.png', 'elements/20.json');
        // game.load.atlasJSONArray('coin', 'elements/coin.png', 'elements/coin.json');
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
