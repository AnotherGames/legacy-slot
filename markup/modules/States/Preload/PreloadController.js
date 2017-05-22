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
        game.load.audio('moo', 'moo.mp3');
        game.load.audio('whip', 'whip.mp3');
        game.load.audio('fsFon', 'fsAmbient.mp3');
        game.load.audio('initFon', 'logoAmbient.mp3');
        game.load.audio('baraban', 'baraban.mp3');
        game.load.audio('buttonClick', 'buttonClick.mp3');
        game.load.audio('startPerehod', 'startPerehod.mp3');
        game.load.audio('finishPerehod', 'finishPerehod.mp3');
        game.load.audio('lineWin', 'lineWin.mp3');
        game.load.audio('lineWin2', 'lineWin2.mp3');
        game.load.audio('bottleBangSound', 'bottleBang.mp3');
        game.load.audio('cows', 'cows.mp3');

    }

    loadInitAssets() {
        const game = model.el('game');
        game.load.path = `static/img/content/${model.res}/`;
        game.load.image('initBG', 'bg/initBG.png');
        game.load.atlasJSONArray('text', 'text/text.png', 'text/text.json');
    }

    loadMainAssets() {
        const game = model.el('game');
        game.load.image('mainBG', 'bg/mainBG.png');
        game.load.image('transitionBG', 'bg/transitionBG.png');
        game.load.image('transitionSky', 'bg/transitionSky.png');
        game.load.image('mainBGSky', 'bg/mainBGSky.png');
        // game.load.image('sky', 'bg/sky.png');
        game.load.image('zaglushka', 'bg/zaglushka.png');
        game.load.image('gradient', 'bg/gradient.png');
        // BG Anim
        game.load.image('cloud', 'bg/cloud.png');
        game.load.image('sun', 'bg/sun.png');
        game.load.image('luchi', 'bg/luchi.png');
        game.load.image('fonLine', 'bg/fonLine.png');
        game.load.atlasJSONArray('skull', 'bg/skull.png', 'bg/skull.json');
        game.load.atlasJSONArray('pole', 'bg/pole.png', 'bg/pole.json');
        if (model.desktop) {
            game.load.atlasJSONArray('bird', 'bg/bird.png', 'bg/bird.json');
            game.load.atlasJSONArray('bird2', 'bg/bird2.png', 'bg/bird2.json');
            game.load.atlasJSONArray('birdFly', 'bg/birdFly.png', 'bg/birdFly.json');
            game.load.atlasJSONArray('cow1', 'bg/cow1.png', 'bg/cow1.json');
            game.load.atlasJSONArray('cow2', 'bg/cow2.png', 'bg/cow2.json');
            game.load.atlasJSONArray('cow3', 'bg/cow3.png', 'bg/cow3.json');
            game.load.atlasJSONArray('cowboy', 'bg/cowboy.png', 'bg/cowboy.json');
            game.load.atlasJSONArray('red_indian', 'bg/red_indian.png', 'bg/red_indian.json');
            game.load.atlasJSONArray('table', 'bg/table.png', 'bg/table.json');
        }
        game.load.image('gameMachine', 'game/gameMachine.png');
        game.load.image('gameBG', 'game/gameBG.png');
        game.load.image('gameBGfs', 'game/gameBGfs.png');
        game.load.image('gameShadow', 'game/gameShadow.png');
        game.load.image('smoke', 'other/smoke.png');

        game.load.image('arrow', 'other/ar.png');
        game.load.image('closeButton', 'other/closed.png');
        game.load.image('infoTableBg', 'other/infoTableBg.png');
        game.load.atlasJSONArray('infoTable', 'other/infoTable.png', 'other/infoTable.json');
        game.load.atlasJSONArray('infoMarker', 'other/infoMarker.png', 'other/infoMarker.json');
        game.load.image('winLine', 'win/winLineRect.png');
        game.load.image('winTotal', 'win/winTotalRect.png');
        game.load.atlasJSONArray('lineNumbers', 'win/lineNumbers.png', 'win/lineNumbers.json');
        game.load.atlasJSONArray('footerButtons', 'footer/footerButtons.png', 'footer/footerButtons.json');
	    game.load.bitmapFont('numbersFont', 'numbers/numbers.png', 'numbers/numbers.xml');
	    if (model.desktop) {
		    game.load.image('ui', 'game/UI.png');
		    game.load.image('uiFS', 'game/UI_FS.png');
		    game.load.atlasJSONArray('deskButtons', 'desk_buttons/deskButtons.png', 'desk_buttons/deskButtons.json');
		    game.load.image('autoSelect', 'desk_buttons/autoSelect.png');
	    }
	    if (model.mobile) {
		    game.load.atlasJSONArray('mobileButtons', 'mobile_buttons/mobileButtons.png', 'mobile_buttons/mobileButtons.json');
		    game.load.atlasJSONArray('menuButtons', 'menu/menu.png', 'menu/menu.json');
		    game.load.atlasJSONArray('menuButtons', 'menu/menu.png', 'menu/menu.json');
	    }

        // Glista
        game.load.image('ligthGlista', 'glista/lightGlista.png');
        game.load.atlasJSONArray('glistaAtlas', 'glista/glista.png', 'glista/glista.json');
    }

    loadFSAssets() {
        const game = model.el('game');
        game.load.image('fsBG', 'bg/fsBG.png');
        game.load.image('x4', 'fs/x4.png');
        game.load.image('x6', 'fs/x6.png');
        game.load.image('x8', 'fs/x8.png');
        game.load.image('aim', 'fs/pritsel.png');
        game.load.atlasJSONArray('bottle', 'fs/bottle.png', 'fs/bottle.json');
        game.load.atlasJSONArray('bigBang', 'fs/bigBang.png', 'fs/bigBang.json');
        game.load.atlasJSONArray('baraban', 'fs/baraban.png', 'fs/baraban.json');
        game.load.atlasJSONArray('fsCountBG', 'fs/bang.png', 'fs/bang.json');
        game.load.image('plus3', 'fs/plus3.png');
        if (model.mobile) {
            game.load.image('drumBG', 'fs/fsDrumBG.png');
            game.load.image('bottleBG', 'fs/shkaf.png');
        } else {
            game.load.image('bottleShadow', 'fs/bottleShadow.png');
            game.load.image('brokenBottleShadow', 'fs/brokenBottleShadow.png');
        }
    }

    loadSpineAssets() {
        const game = model.el('game');
        game.load.spine('pole', 'spine/p-pole.json');


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
	        game.load.reset(true, true);
            return;
        }
        view.hideCoin();
        view.hideBar();
        game.state.start('Init');
    }
}
