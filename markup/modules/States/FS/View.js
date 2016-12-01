import { model } from 'modules/Model/Model';
import { config } from 'modules/Util/Config';
import { Zombie } from 'modules/Class/Zombie';
import { Brain } from 'modules/Class/Brain';
import { view as transitionView } from 'modules/Transition/View';

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

            game.fsContainer = game.add.group();
            model.group('fs', game.fsContainer);

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
                '2',     // Animation's name
                true        // If the animation should loop or not
            );
            game.bgContainer.add(animBG);
            model.el('animMainBG', animBG);

            let mainBG = game.add.sprite(0, 0, 'fsBG', null, game.bgContainer);
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

            let gameMachine = game.add.sprite(0, config[model.res].gameMachine.y, 'gameMachine', null, mainGroup);
            gameMachine.anchor.set(0.5);
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

            // machineGroup.position.set(mainGroup.width / 2 + config[model.res].machine.x, mainGroup.height / 2);

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
            const elSize = config[model.res].elements;

            let mask = game.add.graphics();
                mask.beginFill(0x000000);
                mask.drawRect(0, game.world.centerY + config[model.res].mainContainer.y, game.width, elSize.height * 3);
            mask.pivot.set(0, elSize.height * 1.5);

            machineGroup.mask = mask;
            model.el('mask', mask);
        },

        darkness: function ({
            game = model.el('game')
        }) {
            let darkness = game.add.graphics();
            darkness.beginFill(0x000000);
            darkness.drawRect(0, 0, game.width, game.height);
            return game.add.tween(darkness).to( { alpha: 0 }, 1500, 'Linear', true);
        },

        Zombie(start) {
            if (!start) start = 2;
            const game = model.el('game');
            const fsContainer = model.group('fs');
            let x, y, scale;

            if (model.mobile) {
                x = 120;
                y = 440;
                scale = 0.6;
            } else {
                x = 270;
                y = 700;
                scale = 1;
            }

            let zombie = new Zombie({
                position: {
                    x,
                    y
                },
                multi: start
            });

            let brain = model.el('flyingBrain');
            if (start == 7) {
                brain.Up(() => {
                    zombie.Up();
                });
            }

            zombie.char.scale.x = zombie.char.scale.y = scale;
            fsContainer.add(zombie.char);
            model.el('zombie', zombie);
        },

        fsCandle: function({
            x = 35,
            y = 480,
            container = model.group('fs')
        }) {
            const game = model.el('game');
            const candle = game.add.sprite(x, y, 'candle', null, container);
            candle.animations.add('burn');
            candle.animations.play('burn', 12, true);
            return candle;
        },

        Brain() {
            const game = model.el('game');
            const fsContainer = model.group('fs');
            let x, y, scale;

            if (model.mobile) {
                x = 100;
                y = 80;
                scale = 0.8;
            } else {
                x = 200;
                y = 120;
                scale = 1;
            }

            let brain = new Brain({
                position: {
                    x,
                    y
                }
            });

            brain.char.scale.x = brain.char.scale.y = scale;
            fsContainer.add(brain.char);
            console.log('fsContainer', fsContainer);
            model.el('flyingBrain', brain);
        },

        Multi: function({
            start = 2,
            container = model.group('panel')
        }) {
            const game = model.el('game');
            let x, y;
            if (model.mobile) {
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
            if (model.mobile) {
                x = 1183;
                y = 68;
                font = fontMobile;
                const countBG = game.add.sprite(x, y - 5, 'fsTotalTable', null, container);
                countBG.anchor.set(0.5);
            } else {
                x = 662;
                y = 94;
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
            if (model.mobile) {
                x = 350;
                y = 33;
                let brainBG = game.add.sprite(x, y, 'multiTable', null, container);
                    brainBG.anchor.set(0.5);
            } else {
                x = 437;
                y = 100;
            }
            let brainPanel = game.add.spine(x, y, 'mozgiCount');
            brainPanel.setAnimationByName(0, 'w1.5', true);
            brainPanel.visible = false;
            container.add(brainPanel);
            model.el('brainPanel', brainPanel);
        },

        CountPlus3: function({
            game = model.el('game'),
            x = 0, // model.el('gameMachine').width / 2,
            y = game.height / 5 * -1, // model.el('gameMachine').height / 3,
            deltaY = 15,
            container = model.group('main')
        }) {
            if (model.state('CountPlus3')) return;
            model.state('CountPlus3', true);

            if (model.desktop) {
                deltaY = 30;
            }
            const plus3 = game.add.sprite(x, y - deltaY, 'plus3', null, container);
            plus3.anchor.set(0.5);
            model.el('plus3', plus3);

            let tweenY;
            let tweenX;
            if(model.desktop) {
                tweenX = plus3.x;
                tweenY = 950;
            } else {
                tweenX = 1180;
                tweenY = 50;
            }

            game.add.tween(plus3.scale).to({x: 1.0, y: 1.0}, 1000, Phaser.Easing.Elastic.Out, true);
            game.add.tween(plus3).to({x: tweenX, y: tweenY}, 300, 'Linear', true, 1000);
            game.add.tween(plus3).to({alpha: 0}, 300, 'Linear', true, 1000)
                .onComplete.add(() => {
                    plus3.destroy();
                    model.state('CountPlus3', false);
                    view.draw._showBang({});
                }, this);
        },

        _showBang: function ({
            container = model.group('panel')
        }) {
            const game = model.el('game');
            let x, y;
            if (model.mobile) {
                x = 1180;
                y = 105;
            } else {
                x = 660;
                y = 100;
            }
            let fsCountBG = game.add.spine(x, y, 'fsCount');
            container.add(fsCountBG);
            model.el('fsCountBG', fsCountBG);
            fsCountBG.setAnimationByName(0, 'w-0', false);

            game.time.events.add(500, () => {
                fsCountBG.destroy();
            });
        }

    };

    return {
        create,
        draw
    };
})();
