import { model } from 'modules/Model/Model';

export let view = (() => {
    function drawContainer() {
        const game = model.el('game');
        let container = game.add.group();
        model.el('settingsContainer', container);
        return container;
    }

    function drawOverlay({
        container = model.el('settingsContainer'),
        color = 0x000000,
        alpha = 0
    }) {
        const game = model.el('game');
        let overlay = game.add.graphics(0, 0)
            .beginFill(color)
            .drawRect(0, 0, game.width, game.height);
        overlay.alpha = alpha;
        overlay.visible = false;
        model.el('settingsOverlay', overlay);
        return overlay;
    }

    function drawBG({
        container = model.el('settingsContainer'),
        widthPercentage = 0.22,
        color = 0x000000
    }) {
        const game = model.el('game');
        const menuBG = game.add.graphics(0, 0, container)
            .beginFill(color)
            .drawRect(0, 0, game.width * widthPercentage, game.height);
        model.el('settingsBG', menuBG);
        return menuBG;
    }

    function drawBorder({
        container = model.el('settingsContainer'),
        color = 0xffffff,
        alpha = 0.3,
        widthPercentage = 0.002
    }) {
        const game = model.el('game');
        const menuBorder = game.add.graphics(0, 0, container)
            .beginFill(color, alpha)
            .drawRect(0, 0, game.width * widthPercentage, game.height);
        model.el('settingsBorder', menuBorder);
        return menuBorder;
    }

    function drawTitle({
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

    function drawBackButton({
        container = model.el('settingsContainer'),
        heightPercentage = 0.9
    }) {
        const game = model.el('game');
        const backButton = game.add.sprite(container.width / 2, game.world.height * heightPercentage, 'mobileButtons', 'return.png', container);
        backButton.anchor.set(0.5);
        model.el('settingsBackButton', backButton);
        return backButton;
    }

    return {
        drawContainer,
        drawOverlay,
        drawBG,
        drawBorder,
        drawTitle,
        drawBackButton
    };
})();
