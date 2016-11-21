import { model } from 'modules/Model/Model';
import { config } from 'modules/Util/Config';
import { view as transitionView } from 'modules/Transition/TransitionView';

export let view = (() => {

    let create = {
        groups: function ({
            game = model.el('game')
        }) {
            game.bgContainer = game.add.group();
            model.el('bgContainer', game.bgContainer);
            model.group('bg', game.bgContainer);

            game.mainContainer = game.add.group();
            model.el('mainContainer', game.mainContainer);
            model.group('main', game.mainContainer);

            game.buttonsContainer = game.add.group();
            model.group('buttons', game.buttonsContainer);

            game.panelContainer = game.add.group();
            model.group('panel', game.panelContainer);

            game.balanceContainer = game.add.group();
            model.el('balanceContainer', game.balanceContainer);

            game.menuContainer = game.add.group();
            model.el('menuContainer', game.menuContainer);

            game.footerContainer = game.add.group();
            model.group('footer', game.footerContainer);

            game.balanceCashContainer = game.add.group();
            model.group('balanceCash', game.balanceCashContainer);

            game.balanceCoinContainer = game.add.group();
            model.group('balanceCoin', game.balanceCoinContainer);

            game.popupContainer = game.add.group();
            model.group('popup', game.popupContainer);

            game.transitionContainer = game.add.group();
            model.group('transition', game.transitionContainer);
        }
    };

    let draw = {
        mainBG: function ({
            game = model.el('game')
        }) {
            let animBG = game.add.spine(
                game.world.centerX,        // X positon
                game.world.centerY,        // Y position
                'animBG'     // the key of the object in cache
            );
            animBG.setAnimationByName(
                0,          // Track index
                '1',     // Animation's name
                true        // If the animation should loop or not
            );
            game.bgContainer.add(animBG);
            model.el('animMainBG', animBG);

            let mainBG = game.add.sprite(0, 0, 'mainBG', null, game.bgContainer);
            model.el('mainBG', mainBG);

            if (model.state('isAnimBG')) {
                mainBG.visible = false;
            } else {
                animBG.visible = false;
                for (let i = 0; i < 5; i++) {
                    transitionView.addCloud({container: model.group('bg')});
                }
            }
        },

        mainContainer: function ({
            game = model.el('game')
        }) {
            let mainGroup = game.mainContainer;

            let gameBG = game.add.sprite(config[model.state('res')].machine.x, config[model.state('res')].machine.y, 'gameBG', null, mainGroup);
            model.el('gameBG', gameBG);
            let gameMachine = game.add.sprite(0, 0, 'gameMachine', null, mainGroup);
            model.el('gameMachine', gameMachine);
        },

        machineContainer: function ({
            game = model.el('game'),
            mainGroup = game.mainContainer
        }) {
            let machineGroup = mainGroup.machineContainer = game.add.group();
            model.el('machineContainer', machineGroup);
            mainGroup.addAt(machineGroup, 1);

            game.winTopContainer = game.add.group();
            model.group('winTop', game.winTopContainer);
            mainGroup.addAt(game.winTopContainer, 3);

            machineGroup.position.set(mainGroup.width / 2 + config[model.state('res')].machine.x, mainGroup.height / 2);

            machineGroup.glistaLightContainer = game.add.group();
            model.el('glistaLightContainer', machineGroup.glistaLightContainer);
            machineGroup.add(machineGroup.glistaLightContainer);

            machineGroup.elementsContainer = game.add.group();
            model.el('elementsContainer', machineGroup.elementsContainer);
            machineGroup.add(machineGroup.elementsContainer);

            machineGroup.glistaContainer = game.add.group();
            model.el('glistaContainer', machineGroup.glistaContainer);
            machineGroup.add(machineGroup.glistaContainer);
        },

        machineMask: function ({
            game = model.el('game'),
            machineGroup = model.el('machineContainer')
        }) {
            let maskMarginX = config[model.state('res')].machine.x;
            if (model.state('mobile')) {
                maskMarginX += model.data('mainXLeft');
            } else {
                maskMarginX += (game.width - game.mainContainer.width) / 2;
            }

            const elSize = config[model.state('res')].elements;
            let mask = game.add.graphics();
            mask.beginFill(0x000000);
            mask.drawRect(maskMarginX, config[model.state('res')].machine.y, elSize.width * 5, elSize.height * 3);
            machineGroup.mask = mask;

            if (model.state('side') === 'right')
                mask.x = model.data('mainXRight') - model.data('mainXLeft');

            model.el('mask', mask);
        },

        darkness: function ({
            game = model.el('game')
        }) {
            let darkness = game.add.graphics();
            darkness.beginFill(0x000000);
            darkness.drawRect(0, 0, game.width, game.height);
            return darkness;
        },

        showPopup: function({
            message = 'popup',
            container = model.group('popup'),
            font = 'normal 54px Arial',
            color = '#e8b075'
        }) {
            console.log('i am showing popup');
            const game = model.el('game');
            const overlay = game.add.graphics(0, 0).beginFill(0x000000, 0.8).drawRect(0, 0, game.width, game.height);
            container.add(overlay);
            const popup = game.add.sprite(game.width / 2, game.height / 2, 'popup', null, container);
            popup.anchor.set(0.5);
            model.el('popup', popup);
            const popupText = game.add.text(game.width / 2, game.height / 2, message, {font: font, fill: color, align: 'center', wordWrap: true, wordWrapWidth: popup.width - 80}, container);
            popupText.anchor.set(0.5);

            overlay.inputEnabled = true;
            overlay.input.priorityID = 2;
            popup.inputEnabled = true;
            popup.input.priorityID = 3;
            popup.events.onInputDown.add(() => {
                container.removeAll();
                if (message === 'Your session is closed. Please click to restart') {
                    window.location.reload();
                }
            });
            overlay.events.onInputDown.add(() => {
                container.removeAll();
                if (message === 'Your session is closed. Please click to restart') {
                    window.location.reload();
                }
            });
        }
    };

    return {
        create,
        draw
    };
})();
