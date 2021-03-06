import { model } from 'modules/Model/Model';
import { view } from 'modules/States/Preload/PreloadView';
import Popup from '../../../../Info/Popup';

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

		let popup = new Popup(model);
		model.el('popup', popup);

		game.load.onLoadComplete.add(this.checkInit, this);
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
        game.load.audio('dragonEat', 'dragon.mp3');
        game.load.audio('dragonLaugh', 'dragonLaugh.mp3');
    }

    loadInitAssets() {
        const game = model.el('game');
        game.load.path = `static/img/content/${model.res}/`;
        game.load.image('initBG', 'bg/initBG.jpg');
        game.load.atlasJSONArray('text', 'text/text.png', 'text/text.json');
    }

    loadMainAssets() {
        const game = model.el('game');
        game.load.image('mainBG', 'bg/mainBG.jpg');
        game.load.image('logos', 'bg/logos.png');
        game.load.image('sticks', 'bg/palki.png');
        game.load.image('gameMachine', 'game/gameMachine.png');
        game.load.image('gameBG', 'game/gameBG.png');
        game.load.image('gameLogo', 'game/gmLogo.png');
        game.load.image('gameShadow', 'game/gameShadow.png');
        game.load.image('arrow', 'other/ar.png');
        game.load.image('infoTableBg', 'other/infoTableBg.png');
        game.load.image('closeButton', 'other/closed.png');
        game.load.atlasJSONArray('infoTable', 'other/infoTable.png', 'other/infoTable.json');
        game.load.atlasJSONArray('infoMarker', 'other/infoMarker.png', 'other/infoMarker.json');
        game.load.image('winLine', 'win/winLineRect.png');
        game.load.image('winTotal', 'win/winTotalRect.png');
        game.load.image('winTotalFS', 'win/winTotalRectFS.png');
        game.load.image('betBonus', 'win/betBonus.png');
        game.load.atlasJSONArray('lineNumbers', 'win/lineNumbers.png', 'win/lineNumbers.json');
        game.load.atlasJSONArray('multiNumbers', 'numbers/multiNumbers.png', 'numbers/multiNumbers.json');
        game.load.atlasJSONArray('footerButtons', 'footer/footerButtons.png', 'footer/footerButtons.json');
	    game.load.bitmapFont("numbersFont", "numbers/numbers.png", "numbers/numbers.xml");
	    if (model.desktop) {
		    game.load.image('ui', 'game/UI.png');
		    game.load.image('uiFS', 'game/UI_FS.png');
		    game.load.atlasJSONArray('deskButtons', 'desk_buttons/deskButtons.png', 'desk_buttons/deskButtons.json');
		    game.load.image('autoSelect', 'desk_buttons/autoSelect.png');
	    }
	    if (model.mobile) {
		    game.load.atlasJSONArray('mobileButtons', 'mobile_buttons/mobileButtons.png', 'mobile_buttons/mobileButtons.json');
		    game.load.atlasJSONArray('menuButtons', 'menu/menu.png', 'menu/menu.json');
	    }
        // Glista
        game.load.image('ligthGlista', 'glista/lightGlista.png');
        game.load.atlasJSONArray('glistaAtlas', 'glista/glista.png', 'glista/glista.json');
    }

    loadFSAssets() {
        const game = model.el('game');
        game.load.image('freeSpins', 'fs/freeSpins.png');
        game.load.image('multiplier', 'fs/multiplier.png');
        game.load.image('freeSpinsPanelFS', 'fs/freeSpinsPanelFS.png');
        game.load.image('multiPanelFS', 'fs/multiPanelFS.png');
    }

    loadSpineAssets() {
        const game = model.el('game');
	    if (model.desktop) {
		    game.load.spine('animBG', 'spine/skeleton.json');
	    }
        game.load.spine('logo', 'spine/logo.json');
        game.load.spine('dragon', 'spine/Dragon.json');

    }

    loadTest() {
        const game = model.el('game');
        game.load.atlasJSONArray('1', 'elements/01.png', 'elements/01.json');
        game.load.atlasJSONArray('2', 'elements/02.png', 'elements/02.json');
        game.load.atlasJSONArray('3', 'elements/03.png', 'elements/03.json');
        game.load.atlasJSONArray('4', 'elements/04.png', 'elements/04.json');
        game.load.atlasJSONArray('5', 'elements/05.png', 'elements/05.json');
        game.load.atlasJSONArray('6', 'elements/06.png', 'elements/06.json');
        game.load.atlasJSONArray('7', 'elements/07.png', 'elements/07.json');
        game.load.atlasJSONArray('8', 'elements/08.png', 'elements/08.json');
        game.load.atlasJSONArray('9', 'elements/09.png', 'elements/09.json');
        game.load.atlasJSONArray('10', 'elements/10.png', 'elements/10.json');
    }

    checkInit() {
        if (model.state('initialised')) {
	        this.hidePreloader();
        } else {
	        setTimeout( () => {
                if(model.state('initialised')) {
	                this.hidePreloader();
                } else {
	                model.el('preloadBar').visible = false;
	                model.el('preloadCoin').visible = false;
	                model.el('popup').showReloadPopup();
                }
            }, 3000)
        }
    }

    hidePreloader() {
        const game = model.el('game');
        if (model.state('loadError')) {
            model.el('preloadBar').visible = false;
            model.el('preloadCoin').visible = false;
	        model.el('popup').showReloadPopup();
	        game.load.reset(true, true)
            return;
        }
        view.hideCoin();
        view.hideBar();
        game.state.start('Init');
    }
}
