import { model } from 'modules/Model/Model';

export let view = (() => {

    function drawSettingsContainer() {
        const game = model.el('game');
        let container = game.add.group();
        model.el('settingsContainer', container);
        return container;
    }

    function drawMenuBG({
        container = model.el('settingsContainer'),
        widthPercentage = 0.22,
        color = 0x000000
    }) {
        const game = model.el('game');
        const menuBG = game.add.graphics(0, 0, model.el('settingsContainer'))
            .beginFill(color)
            .drawRect(0, 0, game.width * widthPercentage, game.height);
        model.el('menuBG', menuBG);
        return menuBG;
    }

    function drawMenuBorder({
        container = model.el('settingsContainer'),
        color = 0xffffff,
        alpha = 0.3,
        widthPercentage = 0.002
    }) {
        const game = model.el('game');
        const menuBorder = game.add.graphics(0, 0, container)
            .beginFill(color, alpha)
            .drawRect(0, 0, game.width * widthPercentage, game.height);
        model.el('menuBorder', menuBorder);
        return menuBorder;
    }

    function drawMenuTitle({
        container = model.el('settingsContainer'),
        heightPercentage = 0.07,
        text = 'SETTINGS',
        style = {font: 'bold 40px Arial', fill: '#fff', align: 'center'}
    }) {
        const game = model.el('game');
        const settingsTitle = game.add.text(
            container.width / 2,
            game.height * heightPercentage,
            text,
            style,
            container);
        settingsTitle.anchor.set(0.5);
        model.el('settingsTitle', settingsTitle);
        return settingsTitle;
    }

    function drawOverlay({
        container = model.el('settingsContainer'),
        color = 0x000000,
        alpha = 0
    }) {
        const game = model.el('game');
        let overlay = game.add.graphics(0, 0, container)
            .beginFill(color)
            .drawRect(0, 0, game.width, game.height);
        overlay.alpha = alpha;
        model.el('overlay', overlay);
        return overlay;
    }

    function drawSoundButton({
        container = model.el('settingsContainer'),
        heightPercentage = 0.2
    }) {
        const game = model.el('game');
        let soundButton = game.add.sprite(
            0,
            game.height * heightPercentage,
            'menuButtons',
            'soundOn.png',
            container);
        soundButton.anchor.set(0.5);
        model.el('soundButton', soundButton);

        // Расчет отступа от края контенера
        let buttonMargin = _calcButtonsMargin(soundButton, container);
        soundButton.x = buttonMargin + soundButton.width / 2;
        model.data('buttonMargin', buttonMargin);

        // В зависимости от состояния sound выбираем нужный фрейм
        if (model.state('sound')) {
            // changeSoundButtonFrameToOff();
        } else {
            // changeSoundButtonFrameToOn();
        }

        return soundButton;
    }

    function changeSoundButtonFrameToOn() {
        const soundButton = model.el('soundButton');
        soundButton.frameName = 'soundOn.png';
        return soundButton;
    }

    function changeSoundButtonFrameToOff() {
        const soundButton = model.el('soundButton');
        soundButton.frameName = 'soundOff.png';
        return soundButton;
    }

    function drawSoundButtonText({
        container = model.el('settingsContainer'),
    }) {
        const game = model.el('game');
        const soundButton = model.el('soundButton');
        const buttonMargin = model.data('buttonMargin');

        const soundText = game.add.sprite(
            soundButton.x,
            soundButton.y + soundButton.height / 2 + buttonMargin,
            'menuButtons',
            'soundText.png',
            container);
        soundText.anchor.set(0.5);
        model.el('soundText', soundText);
        return soundText;
    }

    function drawMusicButton({
        container = model.el('settingsContainer'),
        heightPercentage = 0.2
    }) {
        const game = model.el('game');
        const soundButton = model.el('soundButton');
        const buttonMargin = model.data('buttonMargin');

        let musicButton = game.add.sprite(
            2 * buttonMargin + 1.5 * soundButton.width,
            game.height * heightPercentage,
            'menuButtons',
            null,
            container);
        musicButton.anchor.set(0.5);
        model.el('musicButton', musicButton);

        // В зависимости от состояния music выбираем нужный фрейм
        if (model.state('music')) {
            changeMusicButtonFrameToOff();
        } else {
            changeMusicButtonFrameToOn();
        }

        return musicButton;
    }

    function changeMusicButtonFrameToOn() {
        const musicButton = model.el('musicButton');
        musicButton.frameName = 'musicOn.png';
        return musicButton;
    }

    function changeMusicButtonFrameToOff() {
        const musicButton = model.el('musicButton');
        musicButton.frameName = 'musicOff.png';
        return musicButton;
    }

    function drawMusicButtonText({
        container = model.el('settingsContainer'),
    }) {
        const game = model.el('game');
        const musicButton = model.el('musicButton');
        const buttonMargin = model.data('buttonMargin');

        const musicText = game.add.sprite(
            musicButton.x,
            musicButton.y + musicButton.height / 2 + buttonMargin,
            'menuButtons',
            'musicText.png',
            container);
        musicText.anchor.set(0.5);
        model.el('musicText', musicText);
        return musicText;
    }

    function showOverlay({
        time = 700,
        finalAlpha = 0.7
    }) {
        const game = model.el('game');
        const overlay = model.el('overlay');
        console.log('I am showing!');
        return game.add.tween(overlay).to( { alpha: finalAlpha }, time, 'Quart.easeOut', true)
    }

    function hideOverlay({
        time = 700,
        finalAlpha = 0
    }) {
        const game = model.el('game');
        const overlay = model.el('overlay');
        return game.add.tween(overlay).to( { alpha: finalAlpha }, time, 'Quart.easeOut', true)

    }

    function _calcButtonsMargin(button, container) {
        return (container.width - button.width * 2.5) / 3;
    }

    return {
        drawSettingsContainer,
        drawMenuBG,
        drawMenuBorder,
        drawMenuTitle,
        drawSoundButton,
        drawSoundButtonText,
        changeSoundButtonFrameToOn,
        changeSoundButtonFrameToOff,
        drawMusicButton,
        drawMusicButtonText,
        changeMusicButtonFrameToOn,
        changeMusicButtonFrameToOff,
        drawOverlay,
        showOverlay,
        hideOverlay
    };
})();
