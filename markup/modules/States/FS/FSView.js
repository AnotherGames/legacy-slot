import { model } from 'modules/Model/Model';
import { config } from 'modules/Util/Config';
import { Zombie } from 'modules/Class/Zombie';
import { Brain } from 'modules/Class/Brain';
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
            model.group('fs', game.add.group());
            model.group('popup', game.add.group());
            model.group('transition', game.add.group());
        }
    };

    let draw = {
        mainBG: function ({
            game = model.el('game'),
            container = model.group('bg')
        }) {
            // let animBG = game.add.spine(
            //     game.world.centerX,
            //     game.world.centerY,
            //     'animBG'
            // );
            // animBG.setAnimationByName(0, '2', true);
            // container.add(animBG);
            // model.el('animMainBG', animBG);
            let mainBGSky = game.add.sprite(0, 0, 'mainBGSky', null, container);
            model.el('mainBGSky', mainBGSky);

            let gradient = game.add.sprite(0, 0, 'gradient', null, container);
            gradient.alpha = 0.1;
            model.el('gradient', gradient);
            game.add.tween(gradient).to({alpha: 0.9}, 50000, 'Linear', true, 0, -1, true);

            for (let i = 0; i < 5; i++) {
                transitionView.addCloud({container: model.group('bg')});
            }

            let mainBG = game.add.sprite(0, 0, 'fsBG', null, container);
            model.el('mainBG', mainBG);

            let logoZaglushka = game.add.sprite(0, game.height * 0.84, 'zaglushka', null, container);
            model.el('logoZaglushka', logoZaglushka);

            // if (model.state('isAnimBG')) {
            //     mainBG.visible = false;
            // } else {
            //     animBG.visible = false;
            //     for (let i = 0; i < 5; i++) {
            //         transitionView.addCloud({ container });
            //     }
            // }
        },

        addPole: function ({
            game = model.el('game'),
            container = model.group('bg')
        }) {
            let pole = game.add.sprite(0, game.height * 0.84, 'pole', null, container);
            pole.scale.set(1.2);
            model.el('pole', pole);
            pole.animations.add('go');
            pole.animations.play('go', 10, true);

            let time = game.rnd.integerInRange(20, 35);
            let side = game.rnd.integerInRange(0, 1) ? 'left' : 'right';

            pole.x = (side === 'left') ? -pole.width : game.width + pole.width;
            let delta = (side === 'left') ? game.width + pole.width : -pole.width;
            if (side === 'right') {
                pole.width = -pole.width;
            }

            game.add.tween(pole).to({x: delta}, time * 1000, 'Linear', true)
                .onComplete.add(() => {
                    pole.destroy();
                    game.time.events.add(3000, () => {
                        this.addPole({});
                    });
                }, this);

        },

        mainContainer: function ({
            game = model.el('game'),
            container = model.group('main')
        }) {

            let gameBGfs = game.add.sprite(0, 0, 'gameBGfs', null, container);
                gameBGfs.anchor.set(0.5);
                model.el('gameBGfs', gameBGfs);

            let gameMachine = game.add.sprite(0, config[model.res].gameMachine.y, 'gameMachine', null, container);
                gameMachine.anchor.set(0.5);
                model.el('gameMachine', gameMachine);
        },

        lineNumbers: function ({
            game = model.el('game'),
            container = model.group('numbers')
        }) {
            let gameMachine = model.el('gameMachine');

            let leftArr = [];

            for (let i = 1; i < 11; i++) {
                let name = i;
                let lineNumber = game.add.sprite(config[model.res].win[i][0].x - gameMachine.width / 2, config[model.res].win[i][0].y - gameMachine.height / 2 - 40, 'lineNumbers', 'line_splash-' + i +'_0.png', container);
                lineNumber.normal = function() {lineNumber.frameName = 'line_splash-' + name + '_0.png'};
                lineNumber.name = name;
                lineNumber.anchor.set(0.5);
                leftArr.push(lineNumber);
            }

            model.el('leftArr', leftArr);

            let rightArr = [];

            for (let i = 1; i < 11; i++) {
                let name = i;
                let lineNumber = game.add.sprite(config[model.res].win[i][1].x - gameMachine.width / 2, config[model.res].win[i][0].y - gameMachine.height / 2 - 40, 'lineNumbers', 'line_splash-' + i +'_0.png', container);
                lineNumber.normal = function() {lineNumber.frameName = 'line_splash-' + name + '_0.png'};
                lineNumber.name = name;
                lineNumber.anchor.set(0.5);
                rightArr.push(lineNumber);
            }
            model.el('rightArr', rightArr);
        },

        machineContainer: function ({
            game = model.el('game'),
            container = model.group('main')
        }) {
            let machineGroup = game.add.group();
            container.addAt(machineGroup, 1);
            model.group('machine', machineGroup);

            let numbersContainer = game.add.group();
            container.addAt(numbersContainer, 3);
            model.group('numbers', numbersContainer);

            let winUp = game.add.group();
            container.addAt(winUp, 4);
            model.group('winUp', winUp);

            let winTop = game.add.group();
            container.addAt(winTop, 5);
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

        Zombie(multi) {
            multi = multi || 2;

            let game = model.el('game');
            let fsContainer = model.group('fs');
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
                multi
            });

            let brain = model.el('flyingBrain');
            if (multi == 7) {
                brain.Up(() => {
                    zombie.Up();
                });
            }

            zombie.char.scale.set(scale);
            fsContainer.add(zombie.char);
            model.el('zombie', zombie);
        },

        fsCandle: function({
            game = model.el('game'),
            container = model.group('fs'),
            x = 35,
            y = 480
        }) {
            let candle = game.add.sprite(x, y, 'candle', null, container);
                candle.animations.add('burn');
                candle.animations.play('burn', 12, true);
            return candle;
        },

        Brain() {
            let game = model.el('game');
            let fsContainer = model.group('fs');
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

            brain.char.scale.set(scale);
            fsContainer.add(brain.char);
            model.el('flyingBrain', brain);
        },

        Multi: function({
            game = model.el('game'),
            container = model.group('panel'),
            start = 2
        }) {
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
            game = model.el('game'),
            container = model.group('panel'),
            start = 15,
            fontDesktop = '80px Helvetica, Arial',
            fontMobile = '50px Helvetica, Arial'
        }) {
            let x, y, font;
            if (model.mobile) {
                x = 1183;
                y = 68;
                font = fontMobile;
                let countBG = game.add.sprite(x, y - 5, 'fsTotalTable', null, container);
                countBG.anchor.set(0.5);
            } else {
                x = 665;
                y = 97;
                font = fontDesktop;
            }
            // let fsCount = game.add.bitmapText(x, y, 'fsLevelNumbers', start, font, container);
            let fsCount = game.add.text(x, y, start, {font: '80px Helvetica, Arial', fill: '#e8b075', align: 'center'}, container);
                fsCount.anchor.set(0.5)
                model.el('fs:count', fsCount);
        },

        BrainLevel: function({
            game = model.el('game'),
            container = model.group('panel')
        }) {
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
            container = model.group('main'),
            x = 0,
            y = game.height / 5 * -1,
            deltaY = 15
        }) {
            if (model.state('CountPlus3')) return;
            model.state('CountPlus3', true);

            if (model.desktop) {
                deltaY = 30;
            }
            let plus3 = game.add.sprite(x, y - deltaY, 'plus3', null, container);
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
            game = model.el('game'),
            container = model.group('panel')
        }) {
            let x, y;
            if (model.mobile) {
                x = 1180;
                y = 105;
            } else {
                x = 660;
                y = 100;
            }
            // let fsCountBG = game.add.spine(x, y, 'fsCount');
            // container.add(fsCountBG);
            //     fsCountBG.setAnimationByName(0, 'w-0', false);
            // model.el('fsCountBG', fsCountBG);
            let fsCountBG = game.add.sprite(x, y, 'fsCountBG', null, container);
                fsCountBG.anchor.set(0.5);
                fsCountBG.scale.set(1.2);
                model.el('fsCountBG', fsCountBG);

            // let fsCount = model.el('fsCount');
                // container.swap(fsCount, fsCountBG);

            fsCountBG.animations.add('bang');
            fsCountBG.animations.play('bang', 12, false);

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
