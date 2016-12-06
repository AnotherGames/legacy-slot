import { model } from 'modules/Model/Model';
import { config } from 'modules/Util/Config';
import { view as transitionView } from 'modules/Transition/TransitionView';

export let view = (() => {

    let create = {
        groups: function ({
            game = model.el('game')
        }) {
            model.group('bg', game.add.group());
            model.group('main', game.add.group());
            model.group('buttons', game.add.group());
            model.group('panel', game.add.group());
            model.group('balanceContainer', game.add.group());
            model.group('menuContainer', game.add.group());
            model.group('footer', game.add.group());
            model.group('balanceCash', game.add.group());
            model.group('balanceCoin', game.add.group());
            model.group('popup', game.add.group());
            model.group('transition', game.add.group());
        }
    };

    let draw = {
        mainBG: function ({
            game = model.el('game')
        }) {
            let animBG = game.add.spine(
                game.world.centerX - 3,
                game.world.centerY,
                'animBG'
            );
            animBG.setAnimationByName(0, '1', true);
            model.group('bg').add(animBG);
            model.el('animMainBG', animBG);

            let mainBG = game.add.sprite(0, 0, 'mainBG', null, model.group('bg'));
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
            game = model.el('game'),
            container = model.group('main')
        }) {
            let gameBG = game.add.sprite(0, 0, 'gameBG', null, container);
                gameBG.anchor.set(0.5);
            model.el('gameBG', gameBG);

            let gameMachine = game.add.sprite(0, config[model.res].gameMachine.y, 'gameMachine', null, container);
                gameMachine.anchor.set(0.5);
            model.el('gameMachine', gameMachine);
        },

        machineContainer: function ({
            game = model.el('game'),
            container = model.group('main')
        }) {
            let machineGroup = game.add.group();
            container.addAt(machineGroup, 1);
            model.group('machine', machineGroup);

            let winTop = game.add.group();
            container.addAt(winTop, 3);
            model.group('winTop', winTop);

            machineGroup.glistaLightContainer = game.add.group();
            model.group('glistaLight', machineGroup.glistaLightContainer);
            machineGroup.add(machineGroup.glistaLightContainer);

            machineGroup.elementsContainer = game.add.group();
            model.group('elements', machineGroup.elementsContainer);
            machineGroup.add(machineGroup.elementsContainer);

            machineGroup.glistaContainer = game.add.group();
            model.group('glista', machineGroup.glistaContainer);
            machineGroup.add(machineGroup.glistaContainer);
        },

        machineMask: function ({
            game = model.el('game'),
            machineGroup = model.group('machine')
        }) {
            const elSize = config[model.res].elements;
            let mask = game.add.graphics();
            mask.beginFill(0x000000);

            let maskX;
            if (model.mobile) {
                maskX = model.data('mainXLeft');
            } else {
                maskX = game.world.centerX;
            }

            mask.drawRect(
                maskX,
                game.world.centerY + config[model.res].mainContainer.y,
                elSize.width * 5,
                elSize.height * 3);
            mask.pivot.set(elSize.width * 2.5, elSize.height * 1.5);
            machineGroup.mask = mask;

            if (!model.state('gameSideLeft')) {
                mask.x = model.data('mainXRight') - model.data('mainXLeft');
            }

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

        showPopup: function ({
            game = model.el('game'),
            container = model.group('popup'),
            message = 'popup',
            font = 'normal 54px Arial',
            color = '#e8b075'
        }) {
            let overlay = game.add.graphics(0, 0, container)
                .beginFill(0x000000, 0.8)
                .drawRect(0, 0, game.width, game.height);

            let popup = game.add.sprite(
                game.width / 2,
                game.height / 2,
                'popup',
                null,
                container);
                popup.anchor.set(0.5);
            model.el('popup', popup);

            let popupText = game.add.text(
                popup.x,
                popup.y,
                message,
                {font: font, fill: color, align: 'center', wordWrap: true, wordWrapWidth: popup.width - 80},
                container);
                popupText.anchor.set(0.5);

            popup.inputEnabled = true;
            popup.input.priorityID = 3;
            popup.events.onInputDown.add(() => {
                container.removeAll();
                if (message === 'Your session is closed. Please click to restart') {
                    window.location.reload();
                }
            });

            overlay.inputEnabled = true;
            overlay.input.priorityID = 2;
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
