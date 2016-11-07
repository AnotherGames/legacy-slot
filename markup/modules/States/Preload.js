import { model } from '../../modules/Model/Model';

export class Preload {
    constructor(game) {

    }
    init() {
        console.info('Preload State!');
        this.add.plugin(Fabrique.Plugins.Spine);
    }
    preload() {

        this.preloadBar = createPreloadBar(this);
        this.load.setPreloadSprite(this.preloadBar);

        this.preloadCoin = createPreloadCoin(this);

        this.load.path = 'static/img/content/';
        loadSoundAssets(this);
        this.load.path = `static/img/content/${model.state('res')}/`;
        loadInitAssets(this);
        loadMainAssets(this);
        loadFSAssets(this);
        loadGlistaAssets(this);
        loadSkeletonAssets(this);

        this.load.onLoadComplete.add(this.closePreloader, this);
    }
    create() {
        // let music = this.add.audio('myAudio');
        // music.play();
    }
    closePreloader() {
        let closeCoinTween = this.add.tween(this.preloadCoin.scale);
        closeCoinTween.to({x: 0, y: 0}, 500, Phaser.Easing.In);
        closeCoinTween.start();
        closeCoinTween.onComplete.add(() => {
            this.state.start('Init');
        }, this);

        let closeBarTween = this.add.tween(this.preloadBar);
        closeBarTween.to({alpha: 0}, 400, Phaser.Easing.In);
        closeBarTween.start();
    }
}

function createPreloadBar(game) {
    let preloadBar = game.add.sprite(game.world.centerX, game.world.centerY * 1.3, 'preloadBar');
    preloadBar.anchor.set(0, 0.5);
    preloadBar.position.x -= preloadBar.width / 2;

    return preloadBar;
}

function createPreloadCoin(game) {
    let preloadCoin = game.add.sprite(game.world.centerX, game.world.centerY * 0.9, 'preloadCoin');
    preloadCoin.anchor.set(0.5);
    preloadCoin.scale.set(0);
    preloadCoin.animations.add('coin', null, 15, true);
    preloadCoin.animations.play('coin');

    let coinTween = game.add.tween(preloadCoin.scale);
    coinTween.to({x: 1, y: 1}, 1000, Phaser.Easing.Out);
    coinTween.start();

    return preloadCoin;
}

function loadSoundAssets(game) {
    game.load.audio('fon', 'sound/ambient.mp3');
    game.load.audio('fsFon', 'sound/fsAmbient.mp3');
    game.load.audio('initFon', 'sound/logoAmbient.mp3');
    game.load.audio('baraban', 'sound/baraban.mp3');
    game.load.audio('buttonClick', 'sound/buttonClick.mp3');
    game.load.audio('startPerehod', 'sound/startPerehod.mp3');
    game.load.audio('finishPerehod', 'sound/finishPerehod.mp3');
    game.load.audio('lineWin', 'sound/lineWin.mp3');
    game.load.audio('lineWin2', 'sound/lineWin2.mp3');
}

function loadInitAssets(game) {

    game.load.image('initBG', 'bg/initBG.png');
    game.load.atlasJSONArray('text', 'text/text.png', 'text/text.json');
}

function loadMainAssets(game) {
    game.load.image('mainBG', 'bg/mainBG.png');
    game.load.atlasJSONArray('candle', 'bg/candle.png', 'bg/candle.json');
    game.load.image('gameMachine', 'game/gameMachine.png');
    game.load.image('gameBG', 'game/gameBG.png');
    game.load.image('gameShadow', 'game/gameShadow.png');
    game.load.image('infoRules', 'other/infoRules.png');
    game.load.image('popup', 'other/popup.png');
    game.load.image('winLine', 'win/winLineRect.png');
    game.load.image('winTotal', 'win/winTotalRect.png');
    game.load.atlasJSONArray('win', 'win/win.png', 'win/win.json');
    game.load.atlasJSONArray('numbers', 'numbers/numbers.png', 'numbers/numbers.json');
    game.load.atlasJSONArray('menuButtons', 'menu/menu.png', 'menu/menu.json');
    game.load.atlasJSONArray('menuButtons', 'menu/menu.png', 'menu/menu.json');
    game.load.atlasJSONArray('footerButtons', 'footer/footerButtons.png', 'footer/footerButtons.json');
    if (model.flag('desktop')) {
        game.load.image('ui', 'game/UI.png');
        game.load.image('uiFS', 'game/UI_FS.png');
        game.load.atlasJSONArray('deskButtons', 'desk_buttons/deskButtons.png', 'desk_buttons/deskButtons.json');
        game.load.image('autoSelect', 'desk_buttons/autoSelect.png');
    }
    if (model.flag('mobile')) {
        game.load.atlasJSONArray('mobileButtons', 'mobile_buttons/mobileButtons.png', 'mobile_buttons/mobileButtons.json');
    }
    game.load.atlasJSONArray('1', 'elements/one.png', 'elements/one.json');
    game.load.atlasJSONArray('2', 'elements/two.png', 'elements/two.json');
    game.load.atlasJSONArray('3', 'elements/three.png', 'elements/three.json');
    game.load.atlasJSONArray('4', 'elements/four.png', 'elements/four.json');
    game.load.atlasJSONArray('5', 'elements/five.png', 'elements/five.json');
    game.load.atlasJSONArray('6', 'elements/six.png', 'elements/six.json');
    game.load.atlasJSONArray('7', 'elements/seven.png', 'elements/seven.json');
    game.load.atlasJSONArray('8', 'elements/eight.png', 'elements/eight.json');
    game.load.atlasJSONArray('9', 'elements/nine.png', 'elements/nine.json');
    game.load.atlasJSONArray('10', 'elements/ten.png', 'elements/ten.json');
    game.load.atlasJSONArray('11', 'elements/elleven.png', 'elements/elleven.json');
    // all elements
    game.load.atlasJSONArray('elements', 'elements/elements.png', 'elements/elements.json');
}

function loadFSAssets(game) {
    game.load.image('fsBG', 'bg/fsBG.png');
    if (model.flag('mobile')) {
        game.load.image('altary', 'fs/altary.png');
        game.load.image('fsTotalTable', 'fs/fsTotalTable.png');
        game.load.image('multiRip', 'fs/multiRip.png');
        game.load.image('multiTable', 'fs/multiTable.png');
    }
}

function loadGlistaAssets(game) {
    game.load.image('ligthGlista', 'glista/lightGlista.png');
    game.load.atlasJSONArray('glistaAtlas', 'glista/glista.png', 'glista/glista.json');
}

function loadSkeletonAssets(game) {
    game.load.spine(
        'animBG',                        // The key used for Phaser's cache
        'skeleton/skeleton.json'    // The location of the spine's json file
    );
}
