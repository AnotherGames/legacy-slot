import { model } from '../../modules/Model/Model';
import { events } from '../../modules/Events/Events';

import { drawBetMenu } from '../../modules/Menu/Bet';
import { drawAutoMenu } from '../../modules/Menu/Auto';
import { drawSettingsMenu } from '../../modules/Menu/Settings';

export let menu = (function () {

    function drawOverlay(game) {
        const overlay = game.add.graphics(0, 0, model.el('buttonsContainer')).beginFill(0x000000, 0.5).drawRect(0, 0, game.world.width, game.world.height);
        overlay.alpha = 0;
        let tween = game.add.tween(overlay).to( { alpha: 1 }, 1000, 'Quart.easeOut');
        tween.start();
        overlay.inputEnabled = true;
        overlay.input.priorityID = 0;
        overlay.events.onInputDown.add(function () {
            hideMenu();
            let tween = game.add.tween(overlay).to( { alpha: 0 }, 1000, 'Quart.easeOut');
            tween.start();
            tween.onComplete.add(() => {
                overlay.destroy();
            }, this);
        });
        model.el('menuOverlay', overlay);
        return overlay;
    }

    function drawMenuBG(game, container) {
        const menuBG = game.add.graphics(0, 0, container);
        menuBG.beginFill(0x000000).drawRect(0, 0, game.world.width * 0.22, game.world.height);
        menuBG.inputEnabled = true;
        menuBG.input.priorityID = 1;

        const menuBorder = game.add.graphics(0, 0, container);
        menuBorder.beginFill(0xffffff, 0.3).drawRect(0, 0, game.world.width * 0.002, game.world.height);
        return menuBG;
    }

    function drawBackButton(game, container) {
        const menuBack = game.add.sprite(container.width / 2, game.world.height * 0.9, 'mobileButtons', 'return.png', container);
        menuBack.anchor.set(0.5);
        menuBack.inputEnabled = true;
        menuBack.input.priorityID = 2;
        menuBack.events.onInputDown.add(function () {
            hideMenu();
            let overlay = model.el('menuOverlay');
            let tween = game.add.tween(overlay).to( { alpha: 0 }, 2000, 'Quart.easeOut');
            tween.start();
            overlay.destroy();
        });
    }

    function showMenu(name) {

        const game = model.el('game');
        const container = model.el('menuContainer');

        drawOverlay(game);

        drawMenuBG(game, container);

        drawBackButton(game, container);

        switch (name) {
            case 'bet':
                drawBetMenu(container, game);
                break;
            case 'auto':
                drawAutoMenu(container, game);
                break;
            case 'settings':
                drawSettingsMenu(container, game);
                break;
            default:
                console.warn('Wrong menu name!');
        }

        if (model.state('side') === 'left') {
            showMenuFromRight();
        }

        if (model.state('side') === 'right') {
            showMenuFromLeft();
        }

        // console.log(container);
    }

    function showMenuFromRight() {
        model.state('menu', 'opened');
        const game = model.el('game');
        const menuContainer = model.el('menuContainer');
        menuContainer.x = game.world.width + menuContainer.width;
        const tween = game.add.tween(menuContainer).to( { x: game.world.width - menuContainer.width }, 1000, 'Quart.easeOut');
        tween.start();
    }

    function showMenuFromLeft() {
        model.state('menu', 'opened');
        const game = model.el('game');
        const menuContainer = model.el('menuContainer');
        menuContainer.x = 0 - menuContainer.width;
        const menuBorder = menuContainer.getChildAt(1);
        menuBorder.x = menuContainer.width;
        const tween = game.add.tween(menuContainer).to( { x: 0 }, 1000, 'Quart.easeOut');
        tween.start();
    }

    function hideMenu() {
        const game = model.el('game');
        const menuContainer = model.el('menuContainer');

        if (model.state('side') === 'left') {
            const tween = game.add.tween(menuContainer).to( { x: game.world.width }, 1000, 'Quart.easeOut');
            tween.start();
            tween.onComplete.add(() => {
                model.state('menu', 'closed');
                menuContainer.removeAll(true);
            }, this);
        }

        if (model.state('side') === 'right') {
            const tween = game.add.tween(menuContainer).to( { x: 0 - menuContainer.width }, 1000, 'Quart.easeOut');
            tween.start();
            tween.onComplete.add(() => {
                model.state('menu', 'closed');
                menuContainer.removeAll(true);
            }, this);
        }

    }

    events.on('menu:showMenu', showMenu);

    return {
        showMenu,
        hideMenu
    };

})();
