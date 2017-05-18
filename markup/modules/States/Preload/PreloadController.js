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

        game.load.onLoadComplete.add(this.checkInit, this);

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
        game.load.audio('finishPerehod', 'finishPerehod.mp3');
        game.load.audio('win', 'totalWin.mp3');
        game.load.audio('lineWin', 'lineWin1.mp3');
        game.load.audio('lineWin2', 'lineWin2.mp3');
        game.load.audio('bubbleFail', 'bubbleFail.mp3');
        game.load.audio('sea', 'sea.mp3');
        game.load.audio('coins', 'coins.mp3');
        game.load.audio('sundukOpen', 'sundukOpen.mp3');
    }

    loadInitAssets() {
        const game = model.el('game');
        game.load.path = `static/img/content/${model.res}/`;
        game.load.image('initBG', 'bg/initBG.jpg');
        game.load.image('play', 'preloader/play.png');
        game.load.image('logoSmall', 'bg/logoSmall.png');
        game.load.atlasJSONArray('text', 'text/text.png', 'text/text.json');
    }

    loadMainAssets() {
        const game = model.el('game');
        game.load.image('mainBG', 'bg/mainBG.jpg');
        game.load.image('fonTop', 'bg/fonTop.png');
        game.load.image('fonBottom', 'bg/fonBottom.png');
        game.load.image('bubble', 'bg/bubble.png');
        game.load.image('topLight', 'bg/topLight.png');
        game.load.atlasJSONArray('shark', 'bg/shark.png', 'bg/shark.json');
        game.load.atlasJSONArray('fish1', 'bg/fish1.png', 'bg/fish1.json');
        game.load.atlasJSONArray('fish2', 'bg/fish2.png', 'bg/fish2.json');
        game.load.atlasJSONArray('fish3', 'bg/fish3.png', 'bg/fish3.json');
        game.load.image('gameMachine', 'game/gameMachine.png');
        game.load.image('lineLeft', 'game/lineLeft.png');
        game.load.image('lineRight', 'game/lineRight.png');
        game.load.image('logoGM', 'game/logoGM.png');
        game.load.image('closeButton', 'other/closeButton.png');
        game.load.image('arrow', 'other/arrow.png');
        game.load.image('infoTableBg', 'other/infoTableBG.jpg');
        game.load.atlasJSONArray('infoTable', 'other/infoTable.png', 'other/infoTable.json');
        game.load.atlasJSONArray('infoMarker', 'other/infoMarker.png', 'other/infoMarker.json');
        game.load.image('winLine', 'win/winNumber.png');
        game.load.image('winTotal', 'win/winTable.png');
        game.load.atlasJSONArray('winSplash', 'win/splash.png', 'win/splash.json');
        game.load.atlasJSONArray('glista', 'win/glista.png', 'win/glista.json');
        game.load.atlasJSONArray('footerButtons', 'footer/footerButtons.png', 'footer/footerButtons.json');
	    game.load.bitmapFont('numbersFont', 'numbers/numbers.png', 'numbers/numbers.xml');
	    game.load.bitmapFont('numbersFont2', 'numbers/numbers2.png', 'numbers/numbers2.xml');
	    if (model.desktop) {
		    game.load.image('panelBG', 'game/panelBG.png');
		    game.load.atlasJSONArray('deskButtons', 'desk_buttons/deskButtons.png', 'desk_buttons/deskButtons.json');
	    }
	    if (model.mobile) {
		    game.load.atlasJSONArray('menuButtons', 'menu/menu.png', 'menu/menu.json');
		    game.load.atlasJSONArray('mobileButtons', 'mobile_buttons/mobileButtons.png', 'mobile_buttons/mobileButtons.json');
        }

    }

    loadFSAssets() {
        const game = model.el('game');
        game.load.image('fsBG', 'bg/fsBG.jpg');
        game.load.image('fonTopFS', 'bg/fonTopFS.png');
        game.load.image('fonBottomFS', 'bg/fonBottomFS.png');
        game.load.image('perlSmall', 'fs/perlSmall.png');
        game.load.image('perlCounter', 'fs/perlCounter.png');
        game.load.atlasJSONArray('multi', 'fs/multi.png', 'fs/multi.json');
        game.load.atlasJSONArray('shell', 'fs/shell.png', 'fs/shell.json');
        game.load.atlasJSONArray('mermaid', 'fs/mermaid.png', 'fs/mermaid.json');
        game.load.atlasJSONArray('mermaidFS', 'fs/mermaidFS.png', 'fs/mermaidFS.json');
        game.load.atlasJSONArray('box', 'fs/box.png', 'fs/box.json');
        game.load.atlasJSONArray('perl', 'fs/perl.png', 'fs/perl.json');
        if (model.mobile) {
            game.load.image('fsCountBG', 'fs/fsCountBG.png');
            game.load.image('fsLevelBG', 'fs/fsLevelBG.png');
            game.load.image('fsMultiBG', 'fs/fsMultiBG.png');
            game.load.image('autoSelect', 'fs/autoSelect.png');
        } else {
            game.load.image('panelBGfs', 'game/panelBGfs.png');
        }

    }

    loadBonusAssets() {
        const game = model.el('game');
        game.load.image('bonusBG', 'bg/bonusBG.jpg');
        game.load.atlasJSONArray('doors', 'bonus/doors.png', 'bonus/doors.json');
        game.load.image('bonusFish', 'bonus/bonusFish.png');

    }

    loadSpineAssets() {
        const game = model.el('game');
        game.load.spine('logoBack', 'spine/ZST-back.json');
        game.load.spine('logoFront', 'spine/ZST-top.json');
        game.load.spine('element1', 'spine/BG_dveri.json');
        game.load.spine('element2', 'spine/BG_ship.json');
        game.load.spine('element3', 'spine/BG_sclep.json');
        game.load.spine('element4', 'spine/BG_sunduk.json');
        game.load.spine('element5', 'spine/BG_kuvshin.json');
        game.load.spine('BG_top', 'spine/BG_top.json');
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
        game.load.atlasJSONArray('elementBackground', 'elements/elementBackground.png', 'elements/elementBackground.json');
        // game.load.atlasJSONArray('elementBackground2', 'elements/elementBackground2.png', 'elements/elementBackground2.json');
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
	                mainView.draw.showPopup({message: 'Connection problem.'});
                }
            }, 3000)
        }
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
