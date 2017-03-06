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
            let mainBG = game.add.sprite(0, 0, 'fsBG', null, container);
            model.el('mainBG', mainBG);

        },

        mainContainer: function ({
            game = model.el('game'),
            container = model.group('main')
        }) {
            let deltaY = (model.desktop) ? 50 : -25;
            let gameMachineBG = game.add.sprite(0, deltaY, 'gameMachineBG', null, container);
            gameMachineBG.anchor.set(0.5);
            model.el('gameMachineBG', gameMachineBG);

            let gameMachineAsset = (model.desktop) ? 'gameMachineFS' : 'gameMachine';

            let gameMachine = game.add.sprite(0, config[model.res].gameMachine.y, gameMachineAsset, null, container);
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
            let someGraphic = game.add.graphics(-elSize.width * 2.5, -elSize.height * 1.5 + deltaY, machineGroup);
            someGraphic.beginFill(0xffffff).drawRect(0, 0, elSize.width * 5, elSize.height * 3);
            machineGroup.mask = someGraphic;
        },

        Multi: function ({
            game = model.el('game'),
            container = model.group('panel'),
            start = 1,
            fontDesktop = '70px Titania, Arial',
            fontMobile = '50px Titania, Arial'
        }) {

            let x, y, deltaX = 0, deltaY = 0, font;
            if (model.desktop) {
                x = 950;
                y = -47;
                font = fontDesktop;
            } else {
                x = model.el('game').width / 2 + 145;
                y = 610;
                deltaY = 13;
                font = fontMobile;
                let fsMultiBG = game.add.sprite(x, y, 'fsMultiBG', null, container);
                fsMultiBG.anchor.set(0.5);
            }

            let fsMulti;
            fsMulti = game.add.text(x + deltaX, y + deltaY, start, {font: font, fill: '#ffffff', align: 'center', stroke: '#188bb4', strokeThickness: 5}, container);
            fsMulti.setShadow(5, 5, 'rgba(0, 0, 0, 0.7)', 8);
            fsMulti.anchor.set(0.5);
            model.el('fsMulti', fsMulti);
            setTimeout(() => {
                fsMulti.text = 2;
                fsMulti.text = start;
            }, 300);


            draw._drawChest({});
        },

        _drawChest: function ({
            game = model.el('game'),
            container = model.group('panel')
        }) {
            let x = (model.desktop) ? game.width * 0.82 : game.width * 0.95;
            let y = (model.desktop) ? -450 : 370;
            let chestFS = game.add.spine(x, y, 'chestFS');
            container.add(chestFS);
            if (model.mobile) {
                chestFS.scale.set(0.6);
            }
            model.el('chestFS', chestFS);
            chestFS.setAnimationByName(1, '1', false);
            chestFS.addAnimationByName(1, '2', false);

            game.add.tween(chestFS).to({y: chestFS.y + 10}, 3000, 'Linear', true, 0, -1, true);

        },

        changeMulti: function ({
            number = 1,
            animation = '3'
        }) {
            let fsMulti = model.el('fsMulti');
            fsMulti.text = number;
            model.el('fsMulti', fsMulti);

            let chestFS = model.el('chestFS');
            chestFS.addAnimationByName(1, animation, false);
            soundController.sound.playSound({currentSound: 'chestDown'});
        },

        Level: function ({
            game = model.el('game'),
            container = model.group('panel'),
            start = 1,
            fontDesktop = '70px Titania, Arial',
            fontMobile = '50px Titania, Arial'
        }) {

            let x, y, deltaX = 0, deltaY = 0, font;
            if (model.desktop) {
                x = 585;
                y = -50;
                font = fontDesktop;
            } else {
                x = model.el('game').width / 2 - 115;
                y = 610;
                deltaY = 13;
                font = fontMobile;
                let fsLevelBG = game.add.sprite(x, y, 'fsLevelBG', null, container);
                fsLevelBG.anchor.set(0.5);
            }

            let fsLevel;
                fsLevel = game.add.text(x + deltaX, y + deltaY, start, {font: font, fill: '#ffffff', align: 'center', stroke: '#188bb4', strokeThickness: 5}, container);
                fsLevel.setShadow(5, 5, 'rgba(0, 0, 0, 0.7)', 8);
                fsLevel.anchor.set(0.5);
                model.el('fsLevel', fsLevel);
            setTimeout(() => {
                fsLevel.text = 2;
                fsLevel.text = start;
            }, 300);


            draw._drawDiver({});
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

            let diverFS = model.el('diverFS');
            diverFS.addAnimationByName(1, animation, false);
            soundController.sound.playSound({currentSound: 'diverDown'});
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
                x = model.el('game').width / 2;
                y = 600;
                deltaX = 13;
                deltaY = 13;
                font = fontMobile;

                let fsCountBG = game.add.sprite(x + 10, y, 'fsCountBG', null, container);
                fsCountBG.anchor.set(0.5);
                if (model.desktop) {
                    fsCountBG.scale.set(1.3);
                }
                model.el('fsCountBG', fsCountBG);
            } else {
                x = 767;
                y = -65;
                deltaX = 0;
                deltaY = 0;
                font = fontDesktop;
            }

            let fsCount = game.add.text(x + deltaX, y + deltaY, start, {font: font, fill: '#ffffff', align: 'center', stroke: '#188bb4', strokeThickness: 5}, container);
            fsCount.setShadow(5, 5, 'rgba(0, 0, 0, 0.7)', 8);
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
            let plus3 = game.add.sprite(0, 0, 'plus3', null, plus3Group);
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
