import { model } from 'modules/Model/Model';
import { view } from 'modules/States/Preload/PreloadView';
import { view as mainView } from 'modules/States/Main/MainView';

export class Preload {
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
        this.loadBonusAssets();
        this.loadSpineAssets();
        this.loadTest();

        game.load.onLoadComplete.add(this.hidePreloader);

        mainView.draw.initPopup();
    }

    loadSounds() {
        const game = model.el('game');
        game.load.path = 'static/img/content/sound/';
        game.load.audio('fon', 'ambient.mp3');
        game.load.audio('fsFon', 'fsAmbient.mp3');
        game.load.audio('bonusFon', 'bonusAmbient.mp3');
        game.load.audio('initFon', 'logoAmbient.mp3');
        game.load.audio('baraban', 'baraban.mp3');
        game.load.audio('buttonClick', 'buttonClick.mp3');
        game.load.audio('startPerehod', 'startPerehod.mp3');
        game.load.audio('finishPerehod', 'startPerehod.mp3');
        game.load.audio('win', 'totalWin.mp3');
        game.load.audio('lineWin', 'lineWin1.mp3');
        game.load.audio('lineWin2', 'lineWin2.mp3');
        // game.load.audio('illumBreak1', 'illumBreak01.mp3');
        // game.load.audio('illumBreak2', 'illumBreak02.mp3');
        // game.load.audio('illumBreak3', 'illumBreak03.mp3');
        // game.load.audio('illumFail', 'illumFail.mp3');
        // game.load.audio('illumWin', 'illumWin.mp3');
        // game.load.audio('chestDown', 'chestDown.mp3');
        // game.load.audio('diverDown', 'diverDown.mp3');
    }

    loadInitAssets() {
        const game = model.el('game');
        game.load.path = `static/img/content/${model.res}/`;
        game.load.image('initBG', 'bg/initBG.jpg');
        game.load.image('initLogo', 'preloader/initLogo.png');
        game.load.image('initPlay', 'preloader/initPlay.png');
        game.load.spritesheet('clock', 'preloader/clock.png', 631, 403, 27);
        game.load.atlasJSONArray('text', 'text/text.png', 'text/text.json');
    }

    loadMainAssets() {
        const game = model.el('game');
        game.load.image('mainBG', 'bg/mainBG.jpg');
        game.load.spritesheet('light', 'bg/light.png', 887, 1080, 24);
        game.load.image('gameMachine', 'game/gameMachine.png');
        game.load.image('gameMachineBG', 'game/gameMachineBG.png');
        game.load.image('closeButton', 'other/closeButton.png');
        game.load.image('arrow', 'other/arrow.png');
        game.load.image('infoTableBg', 'other/infoTableBg.png');
        game.load.atlasJSONArray('infoTable', 'other/infoTable.png', 'other/infoTable.json');
        game.load.atlasJSONArray('infoMarker', 'other/infoMarker.png', 'other/infoMarker.json');
        game.load.atlasJSONArray('coins', 'bonus/coins.png', 'bonus/coins.json');
        game.load.image('winLine', 'win/winNumber.png');
        game.load.image('winTotal', 'win/winTable.png');
        game.load.image('lightLine', 'win/lightLine.png');
        game.load.spritesheet('winSplash', 'win/winSplash.png', 169, 167, 24);
        game.load.atlasJSONArray('menuButtons', 'menu/menu.png', 'menu/menu.json');
        game.load.atlasJSONArray('footerButtons', 'footer/footerButtons.png', 'footer/footerButtons.json');
        game.load.bitmapFont('numbersFont', 'numbers/numbers.png', 'numbers/numbers.xml');
        game.load.bitmapFont('numbersFont2', 'numbers/numbers2.png', 'numbers/numbers2.xml');
        if (model.desktop) {
            game.load.atlasJSONArray('deskButtons', 'desk_buttons/deskButtons.png', 'desk_buttons/deskButtons.json');
            game.load.image('gameMachineFS', 'game/gameMachineFS.png');
            game.load.atlasJSONArray('german1', 'bg/german1.png', 'bg/german1.json');
            game.load.atlasJSONArray('german2', 'bg/german2.png', 'bg/german2.json');
            game.load.atlasJSONArray('german3', 'bg/german3.png', 'bg/german3.json');
        }
        if (model.mobile) {
            game.load.atlasJSONArray('mobileButtons', 'mobile_buttons/mobileButtons.png', 'mobile_buttons/mobileButtons.json');
        }

    }

    loadFSAssets() {
        const game = model.el('game');
        game.load.image('fsBG', 'bg/fsBG.jpg');
        game.load.image('lizaBonus', 'fs/lizaBonus.png');
        game.load.image('lizaFS', 'fs/lizaFS.png');
        game.load.atlasJSONArray('liza', 'fs/liza.png', 'fs/liza.json');
        game.load.atlasJSONArray('logoFS', 'fs/logoFS.png', 'fs/logoFS.json');
        game.load.image('fsCountBG', 'fs/fsCountBG.png');
        game.load.image('fsTable', 'fs/fsTable.png');
        game.load.image('pipe', 'fs/pipe.png');
        game.load.image('multi', 'fs/multi.png');
        game.load.image('multiClose', 'fs/multiClose.png');
        game.load.image('multiBlink', 'fs/multiBlink.png');
        // game.load.image('fire', 'fs/fire.png');
        game.load.image('watchFS', 'fs/watchFS.png');
        game.load.image('card1', 'fs/card1.png');
        game.load.image('card2', 'fs/card2.png');
        game.load.image('card3', 'fs/card3.png');
        game.load.image('card4', 'fs/card4.png');
        game.load.atlasJSONArray('watchArrows', 'fs/watchArrows.png', 'fs/watchArrows.json');
        game.load.image('plus3', 'fs/plus3.png');

    }

    loadBonusAssets() {
        const game = model.el('game');
        game.load.image('fgDoors_0', 'bonus/fgDoors_0.png');
        game.load.image('fgDoors_1', 'bonus/fgDoors_1.png');
        game.load.image('fgDoors_2', 'bonus/fgDoors_2.png');
        game.load.image('fgDoors_3', 'bonus/fgDoors_3.png');
        game.load.image('fgDoors_4', 'bonus/fgDoors_4.png');
        game.load.atlasJSONArray('bgDoors_0', 'bonus/bgDoors_0.png', 'bonus/bgDoors_0.json');
        game.load.atlasJSONArray('bgDoors_1', 'bonus/bgDoors_1.png', 'bonus/bgDoors_1.json');
        game.load.atlasJSONArray('bgDoors_2', 'bonus/bgDoors_2.png', 'bonus/bgDoors_2.json');
        game.load.atlasJSONArray('bgDoors_3', 'bonus/bgDoors_3.png', 'bonus/bgDoors_3.json');
        game.load.atlasJSONArray('door_0', 'bonus/door_0.png', 'bonus/door_0.json');
        game.load.spritesheet('door_1', 'bonus/door_1.png', 133, 350, 10);
        game.load.spritesheet('door_2', 'bonus/door_2.png', 133, 350, 10);
        game.load.spritesheet('door_3', 'bonus/door_3.png', 133, 350, 10);
        game.load.spritesheet('door_4_1', 'bonus/door_4_1.png', 146, 147, 3);
        game.load.spritesheet('door_4_2', 'bonus/door_4_1.png', 146, 147, 3);
        game.load.spritesheet('door_4_3', 'bonus/door_4_1.png', 146, 147, 3);
        game.load.image('bigLight', 'bonus/bigLight.png');
        game.load.image('fly', 'bonus/fly.png');
        game.load.image('gold', 'bonus/gold.png');
    }

    loadSpineAssets() {
        const game = model.el('game');
        game.load.spine('fsEnd', 'spine/Final.json');
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
    }

    hidePreloader() {
        const game = model.el('game');
        if (model.state('loadError')) {
            model.el('preloadBar').visible = false;
            model.el('preloadCoin').visible = false;
            mainView.draw.initPopup();
            mainView.draw.showPopup({message: 'Connection problem'});
            game.load.reset(true, true);
            return;
        }
        view.hideBar();
        view.hideCoin();
        game.state.start('Init');
    }
}
