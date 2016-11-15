import { model } from 'modules/Model/Model';
import { config } from 'modules/Util/Config';
import { Zombie } from 'modules/Class/Zombie';
import { Brain } from 'modules/Class/Brain';

export let view = (() => {

    let create = {
        groups: function ({
            game = model.el('game')
        }) {
            game.bgContainer = game.add.group();
            model.el('bgContainer', game.bgContainer);

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
                '2',     // Animation's name
                true        // If the animation should loop or not
            );
            game.bgContainer.add(animBG);
            model.el('animMainBG', animBG);

            let mainBG = game.add.sprite(0, 0, 'mainBG', null, game.bgContainer);
            model.el('mainBG', mainBG);

            if (model.state('isAnimations')) {
                mainBG.visible = false;
            } else {
                animBG.visible = false;
            }
        },

        mainContainer: function ({
            game = model.el('game')
        }) {
            let mainGroup = game.mainContainer;

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
            mainGroup.addAt(game.winTopContainer, 2);

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
            const elSize = config[model.state('res')].elements;

            let mask = game.add.graphics();
                mask.beginFill(0x000000);
                mask.drawRect(0, config[model.state('res')].machine.y, game.width, elSize.height * 3);

            machineGroup.mask = mask;
            model.el('mask', mask);
        },

        darkness: function ({
            game = model.el('game')
        }) {
            let darkness = game.add.graphics();
            darkness.beginFill(0x000000);
            darkness.drawRect(0, 0, game.width, game.height);
            return game.add.tween(darkness).to( { alpha: 0 }, 1000, 'Linear', true);
        },

        Zombie() {
            const game = model.el('game');
            let x, y, scale;

            if (model.state('mobile')) {
                x = 120;
                y = 440;
                scale = 0.8;
            } else {
                x = 270;
                y = 700;
                scale = 1;
            }

            let zombie = new Zombie({
                game,
                position: {
                    x,
                    y
                }
            });

            zombie.char.scale.x = zombie.char.scale.y = scale;
            model.el('zombie', zombie);
        },

        Brain() {
            const game = model.el('game');
            let x, y, scale;

            if (model.state('mobile')) {
                x = 100;
                y = 80;
                scale = 0.8;
            } else {
                x = 200;
                y = 120;
                scale = 1;
            }

            let brain = new Brain({
                game,
                position: {
                    x,
                    y
                }
            });

            brain.char.scale.x = brain.char.scale.y = scale;
            model.el('flyingBrain', brain);
        },

        Multi: function({
            start = 2,
            container = model.group('panel')
        }) {
            const game = model.el('game');
            let x, y;
            if (model.state('mobile')) {
                x = 125;
                y = 625;
                let multiBG = game.add.sprite(x, y, 'multiRip', null, container);
                    multiBG.anchor.set(0.5);
            } else {
                x = 860;
                y = 118;
            }
            const fsMulti = game.add.sprite(
                x,
                y,
                'numbers',
                `multi${start}.png`,
                container);
            fsMulti.anchor.set(0.5);
            model.el('fsMulti', fsMulti);
            return fsMulti;
        },

        Count: function({
            start = 15,
            fontDesktop = '80',
            fontMobile = '50',
            container = model.group('panel')
        }) {
            const game = model.el('game');
            let x, y, font;
            if (model.state('mobile')) {
                x = 1183;
                y = 68;
                font = fontMobile;
                const countBG = game.add.sprite(x, y - 5, 'fsTotalTable', null, container);
                countBG.anchor.set(0.5);
            } else {
                x = 659;
                y = 98;
                font = fontDesktop;
            }
            const fsCount = game.add.bitmapText(x, y, 'fsLevelNumbers', start, font, container);
            fsCount.anchor.set(0.5)
            model.el('fsCount', fsCount);
        },

        BrainLevel: function({
            container = model.group('panel')
        }) {
            const game = model.el('game');
            let x, y;
            if (model.state('mobile')) {
                x = 350;
                y = 33;
                let brainBG = game.add.sprite(x, y, 'multiTable', null, container);
                    brainBG.anchor.set(0.5);
            } else {
                x = 437;
                y = 100;
            }
            let brainPanel = game.add.sprite(x, y, 'mozgiPanel', '01.png', container);
                brainPanel.anchor.set(0.5);
                brainPanel.visible = false;
            model.el('brainPanel', brainPanel);
        }

    };

    return {
        create,
        draw
    };
})();
