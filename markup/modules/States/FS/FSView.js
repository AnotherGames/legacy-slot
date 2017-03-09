import { model } from 'modules/Model/Model';
import { config } from 'modules/Util/Config';
import { controller as soundController } from 'modules/Sound/SoundController';

export let view = (() => {

    let create = {
        groups: function ({
            game = model.el('game')
        }) {
            model.group('bg', game.add.group());
            model.group('main', game.add.group());
            model.group('panel', game.add.group());
            model.group('buttons', game.add.group());
            model.group('balanceContainer', game.add.group());
            model.group('menuContainer', game.add.group());
            model.group('footer', game.add.group());
            model.group('balanceCash', game.add.group());
            model.group('balanceCoin', game.add.group());
            model.group('fs', game.add.group());
            model.group('popup', game.add.group());
            model.group('transition', game.add.group());
            model.group('infoTable', game.add.group());
            model.group('footerMenu', game.add.group());
        }
    };

    let draw = {
        mainBG: function ({
            game = model.el('game'),
            container = model.group('bg')
        }) {
            let mainBG = game.add.sprite(0, 0, 'mainBG', null, container);
            model.el('mainBG', mainBG);

            let transitionBG = game.add.graphics(0, 0, container).beginFill(0x000000, 0.7).drawRect(0, 0, game.width, game.height);
            model.el('transitionBG', transitionBG);

        },

        mainContainer: function ({
            game = model.el('game'),
            container = model.group('main')
        }) {
            let gameMachine = game.add.sprite(0, config[model.res].gameMachine.y, 'gameMachine', null, container);
            gameMachine.anchor.set(0.5);
            gameMachine.alpha = 0;
            model.el('gameMachine', gameMachine);

            let deltaX = (model.desktop) ? 106 : 81;
            let deltaY = (model.desktop) ? 55 : 50;
            let deltaY2 = (model.desktop) ? 37 : -18;

            let logoGM = game.add.sprite(0, gameMachine.top + deltaY, 'logoGM', null, container);
            logoGM.anchor.set(0.5);

            let lineLeft = game.add.sprite(gameMachine.left + deltaX, config[model.res].gameMachine.y - deltaY2, 'lineLeft', null, container);
            lineLeft.anchor.set(0.5);

            let lineRight = game.add.sprite(gameMachine.right - deltaX, config[model.res].gameMachine.y - deltaY2, 'lineRight', null, container);
            lineRight.anchor.set(0.5);
        },

        machineContainer: function ({
            game = model.el('game'),
            container = model.group('main')
        }) {
            let machineGroup = game.add.group();
            container.addAt(machineGroup, 2);
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
            let deltaY = (model.desktop) ? 50 : 25;
            let someGraphic = game.add.graphics(-elSize.width * 2.5 - 250, -elSize.height * 1.5 + deltaY, machineGroup);
            someGraphic.beginFill(0xffffff).drawRect(0, 0, elSize.width * 5 + 550, elSize.height * 3);
            machineGroup.mask = someGraphic;
        },

        Multi: function ({
            game = model.el('game'),
            container = model.group('panel'),
            start = 1,
            fontDesktop = '60px Titania, Arial',
            fontMobile = '50px Titania, Arial'
        }) {

            let x, y, deltaX = 0, deltaY = 0, font, fsMultiBG;
            if (model.desktop) {
                x = 175;
                y = -55;
                font = fontDesktop;
            } else {
                x = model.el('game').width / 2 + 145;
                y = 610;
                deltaY = 13;
                font = fontMobile;
                fsMultiBG = game.add.sprite(x, y, 'fsMultiBG', null, container);
                fsMultiBG.anchor.set(0.5);
            }

            let fsMulti;
            fsMulti = game.add.text(x + deltaX, y + deltaY, start, {font: font, fill: '#ffffff', align: 'center', stroke: '#188bb4', strokeThickness: 5}, container);
            // fsMulti.setShadow(5, 5, 'rgba(0, 0, 0, 0.7)', 8);
            fsMulti.anchor.set(0.5);
            if (model.mobile) {
                fsMulti.visible = false;
                fsMultiBG.visible = false;
            }
            model.el('fsMulti', fsMulti);
            setTimeout(() => {
                fsMulti.text = 2;
                fsMulti.text = start;
            }, 300);

            draw._drawShell({});
        },

        _drawShell: function ({
            game = model.el('game'),
            container = model.group('panel')
        }) {
            let x = (model.desktop) ? 800 : 1200;
            let y = (model.desktop) ? -300 : 500;
            let deltaY = (model.desktop) ? 250 :  170;

            let shell1 = game.add.sprite(x, y, 'shell', null, container);
            shell1.anchor.set(0.5);

            shell1.animations.add('idle', Phaser.Animation.generateFrameNames('s-idle-c', 0, 29, '.png', 2), 20, true);
            shell1.animations.add('open', Phaser.Animation.generateFrameNames('s-o-', 0, 29, '.png', 2), 20, false);
            shell1.animations.add('openIdle', Phaser.Animation.generateFrameNames('s-idle-o', 0, 29, '.png', 2), 20, true);
            shell1.animations.play('idle');
            model.el('shell1', shell1);

            let shell2 = game.add.sprite(x, y - deltaY, 'shell', null, container);
            shell2.anchor.set(0.5);

            shell2.animations.add('idle', Phaser.Animation.generateFrameNames('s-idle-c', 0, 29, '.png', 2), 20, true);
            shell2.animations.add('open', Phaser.Animation.generateFrameNames('s-o-', 0, 29, '.png', 2), 20, false);
            shell2.animations.add('openIdle', Phaser.Animation.generateFrameNames('s-idle-o', 0, 29, '.png', 2), 20, true);
            game.time.events.add(500, () => {
                shell2.animations.play('idle');
            });

            model.el('shell2', shell2);

            let shell3 = game.add.sprite(x, y - deltaY * 2, 'shell', null, container);
            shell3.anchor.set(0.5);

            shell3.animations.add('idle', Phaser.Animation.generateFrameNames('s-idle-c', 0, 29, '.png', 2), 20, true);
            shell3.animations.add('open', Phaser.Animation.generateFrameNames('s-o-', 0, 29, '.png', 2), 20, false);
            shell3.animations.add('openIdle', Phaser.Animation.generateFrameNames('s-idle-o', 0, 29, '.png', 2), 20, true);
            game.time.events.add(500, () => {
                shell3.animations.play('idle');
            });

            model.el('shell3', shell3);

            if (model.mobile) {
                shell1.scale.set(0.8);
                shell2.scale.set(0.8);
                shell3.scale.set(0.8);
            }
        },

        changeMulti: function ({
            number = 1,
            counter = 1,
            container = model.group('panel'),
            game = model.el('game')
        }) {
            let fsMulti = model.el('fsMulti');
            fsMulti.text = number;
            model.el('fsMulti', fsMulti);

            let shell= model.el(`shell${counter}`);
            shell.animations.play('open');
            shell.animations.getAnimation('open').onComplete.add(() => {
                shell.animations.play('openIdle');
            });

            let fsMultiBig = game.add.sprite(shell.x, shell.y, 'multi', `x${number}.png`, container);
            fsMultiBig.anchor.set(0.5);
            fsMultiBig.alpha = 0;
            game.add.tween(fsMultiBig).to({alpha: 1, y: fsMultiBig.y - 120}, 700, 'Linear', true)
                .onComplete.add(() => {
                    game.add.tween(fsMultiBig).to({y: shell.y - 30}, 400, Phaser.Easing.Back.Out, true);
                }, this);

            // soundController.sound.playSound({currentSound: 'chestDown'});
        },

        Level: function ({
            game = model.el('game'),
            container = model.group('panel'),
            start = 1,
            fontDesktop = '60px Titania, Arial',
            fontMobile = '50px Titania, Arial'
        }) {

            let x, y, deltaX = 0, deltaY = 0, font, fsLevelBG;
            if (model.desktop) {
                x = -175;
                y = -55;
                font = fontDesktop;
            } else {
                x = model.el('game').width / 2 - 115;
                y = 610;
                deltaY = 13;
                font = fontMobile;
                fsLevelBG = game.add.sprite(x, y, 'fsLevelBG', null, container);
                fsLevelBG.anchor.set(0.5);
            }

            let fsLevel;
                fsLevel = game.add.text(x + deltaX, y + deltaY, start, {font: font, fill: '#ffffff', align: 'center', stroke: '#188bb4', strokeThickness: 5}, container);
                // fsLevel.setShadow(5, 5, 'rgba(0, 0, 0, 0.7)', 8);
                fsLevel.anchor.set(0.5);
                if (model.mobile) {
                    fsLevel.visible = false;
                    fsLevelBG.visible = false;
                }
                model.el('fsLevel', fsLevel);
            setTimeout(() => {
                fsLevel.text = 2;
                fsLevel.text = start;
            }, 300);


            // draw._drawDiver({});
        },

        _drawDiver: function ({
            game = model.el('game'),
            container = model.group('panel')
        }) {
            let x = (model.desktop) ? -50 : 80;
            let y = (model.desktop) ? -500 : 350;
            let diverFS = game.add.spine(x, y, 'diverFS');
            container.add(diverFS);
            if (model.mobile) {
                diverFS.scale.set(0.6);
            }
            model.el('diverFS', diverFS);
            diverFS.setAnimationByName(1, 'start', false);

            game.add.tween(diverFS).to({y: diverFS.y + 10}, 3000, 'Linear', true, 500, -1, true);

        },

        changeLevel: function ({
            number = 1,
            animation = '0'
        }) {
            let fsLevel = model.el('fsLevel');
            fsLevel.text = number;
            model.el('fsLevel', fsLevel);

            // let diverFS = model.el('diverFS');
            // diverFS.addAnimationByName(1, animation, false);
            // soundController.sound.playSound({currentSound: 'diverDown'});
        },

        Count: function ({
            game = model.el('game'),
            container = model.group('panel'),
            start = 15,
            fontDesktop = '80px Titania, Arial',
            fontMobile = '50px Titania, Arial'
        }) {
            let x, y, deltaX, deltaY, font;
            if (model.mobile) {
                x = 80;
                y = 100;
                deltaX = 0;
                deltaY = 13;
                font = fontMobile;

                let fsCountBG = game.add.sprite(x, y, 'fsCountBG', null, container);
                fsCountBG.anchor.set(0.5);
                if (model.desktop) {
                    fsCountBG.scale.set(1.3);
                }
                model.el('fsCountBG', fsCountBG);
            } else {
                x = 10;
                y = -75;
                deltaX = -15;
                deltaY = 0;
                font = fontDesktop;
            }

            let fsCount = game.add.text(x + deltaX, y + deltaY, start, {font: font, fill: '#ffffff', align: 'center', stroke: '#188bb4', strokeThickness: 5}, container);
            // fsCount.setShadow(5, 5, 'rgba(0, 0, 0, 0.7)', 8);
            fsCount.anchor.set(0.5);
            model.el('fs:count', fsCount);
        },

        CountPlus3: function ({
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

            let plus3Group = game.add.group(container);
            plus3Group.scale.set(0.3);
            plus3Group.x = x;
            plus3Group.y = y - deltaY;

            let circle = game.add.graphics(0, 0, plus3Group);
            circle.beginFill(0x000000, 0.3).drawCircle(0, 0, 200);
            // let plus3 = game.add.sprite(0, 0, 'plus3', null, plus3Group);
            // plus3.anchor.set(0.5);
            // model.el('plus3', plus3);

            let fontSize = (model.desktop) ? 35 : 25;

            let plus3 = game.add.bitmapText(0, 40, 'numbersFont', '+3', fontSize, plus3Group);
            plus3.align = 'center';
            plus3.anchor.set(0.5);
            model.el('plus3', plus3);

            let tweenY;
            let tweenX;

            if (model.desktop) {
                tweenX = plus3Group.x;
                tweenY = 900;
            } else {
                tweenX = plus3Group.x;
                tweenY = 650;
            }

            game.add.tween(plus3Group.scale).to({x: 1.0, y: 1.0}, 500, Phaser.Easing.Elastic.Out, true);
            game.add.tween(plus3Group).to({x: tweenX, y: tweenY}, 400, 'Linear', true, 500);
            game.add.tween(plus3Group).to({alpha: 0}, 200, 'Linear', true, 700)
                .onComplete.add(() => {
                    plus3Group.destroy();
                    model.state('CountPlus3', false);
                }, this);
        }


    };

    return {
        create,
        draw
    };
})();
