import { model } from 'modules/Model/Model';
import { config } from 'modules/Util/Config';
import { controller as soundController } from '../../../../Info/SoundController';

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
            let deltaY = (model.desktop) ? 30 : -10;

            let gameMachineBG = game.add.sprite(0, deltaY, 'gameMachineBG', null, container);
            gameMachineBG.anchor.set(0.5);
            model.el('gameMachineBG', gameMachineBG);

            let pipeX = (model.desktop) ? 480 : 350;
            let pipeY = (model.desktop) ? 90 : 40;
            let pipe = game.add.sprite(pipeX, pipeY, 'pipe', null, container);
            pipe.anchor.set(0.5);
            model.el('pipe', pipe);
            if (model.desktop) {
                pipe.scale.set(1.3);
            }

            let gameMachineAsset = (model.desktop) ? 'gameMachineFS' : 'gameMachine';
            let machineY = (model.desktop) ? -5 : -35;

            let gameMachine = game.add.sprite(0, machineY, gameMachineAsset, null, container);
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
            container.addAt(numbersContainer, 4);
            model.group('numbers', numbersContainer);

            let winUp = game.add.group();
            container.addAt(winUp, 5);
            model.group('winUp', winUp);

            let winTop = game.add.group();
            container.addAt(winTop, 6);
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

            console.log(model.group('main'));
        },

        machineMask: function ({
            game = model.el('game'),
            machineGroup = model.group('machine')
        }) {
            const elSize = config[model.res].elements;
            let deltaY = (model.desktop) ? 30 : -10;
            let someGraphic = game.add.graphics(-elSize.width * 2.5, -elSize.height * 1.5 + deltaY, machineGroup);
            someGraphic.beginFill(0xffffff).drawRect(0, 0, elSize.width * 5, elSize.height * 3);
            machineGroup.mask = someGraphic;
        },

        Multi: function ({
            game = model.el('game'),
            container = model.group('panel'),
            start = 1
        }) {

            let x = (model.desktop) ? game.width * 0.35 : game.width * 0.58;
            let y = (model.desktop) ? 20 : game.height * 0.88;

            let fsMultiBG = game.add.sprite(x, y, 'multi', null, container);
            fsMultiBG.anchor.set(0.5);

            if (model.desktop) {
                fsMultiBG.scale.set(1.3);
            }

            let multiCloseArr = [];
            let x2 = (model.desktop) ? [510, 685, 855, 1025, 1195] : [620, 752, 882, 1015, 1148];

            for (let i = 0; i < 5; i++) {
                let multiClose = game.add.sprite(x2[i], y - 2, 'multiClose', null, container);
                multiClose.anchor.set(0.5);

                multiCloseArr.push(multiClose);
            }
            model.el('multiCloseArr', multiCloseArr);

        },

        // _drawChest: function ({
        //     game = model.el('game'),
        //     container = model.group('panel')
        // }) {
        //     let x = (model.desktop) ? game.width * 0.82 : game.width * 0.95;
        //     let y = (model.desktop) ? -450 : 370;
        //     let chestFS = game.add.spine(x, y, 'chestFS');
        //     container.add(chestFS);
        //     if (model.mobile) {
        //         chestFS.scale.set(0.6);
        //     }
        //     model.el('chestFS', chestFS);
        //     chestFS.setAnimationByName(1, '1', false);
        //     chestFS.addAnimationByName(1, '2', false);
        //
        //     game.add.tween(chestFS).to({y: chestFS.y + 10}, 3000, 'Linear', true, 0, -1, true);
        //
        // },

        changeMulti: function ({
            game = model.el('game'),
            number = 1,
            multiCloseArr = model.el('multiCloseArr')
        }) {
            // let fsMulti = model.el('fsMulti');
            // fsMulti.text = number;
            // model.el('fsMulti', fsMulti);

            console.warn('change multi!');

            multiCloseArr.forEach((multi, index) => {
                if (index + 2 == number) {
                    game.add.tween(multi).to({alpha: 0}, 300, 'Linear', true);
                }
            });
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


            // draw._drawDiver({});
        },

        // _drawDiver: function ({
        //     game = model.el('game'),
        //     container = model.group('panel')
        // }) {
        //     let x = (model.desktop) ? -50 : 80;
        //     let y = (model.desktop) ? -500 : 350;
        //     let diverFS = game.add.spine(x, y, 'diverFS');
        //     container.add(diverFS);
        //     if (model.mobile) {
        //         diverFS.scale.set(0.6);
        //     }
        //     model.el('diverFS', diverFS);
        //     diverFS.setAnimationByName(1, 'start', false);
        //
        //     game.add.tween(diverFS).to({y: diverFS.y + 10}, 3000, 'Linear', true, 500, -1, true);
        //
        // },

        changeLevel: function ({
            number = 1,
            animation = '0'
        }) {
            let fsLevel = model.el('fsLevel');
            fsLevel.text = number;
            model.el('fsLevel', fsLevel);

            let diverFS = model.el('diverFS');
            diverFS.addAnimationByName(1, animation, false);
            soundController.sound.playSound({sound: 'diverDown'});
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
                x = game.width * 0.85;
                y = 60;
                deltaX = 50;
                deltaY = 16;
                font = fontMobile;
            } else {
                x = game.width * 0.6;
                y = -750;
                deltaX = 65;
                deltaY = 15;
                font = fontDesktop;
            }

            let fsCountBG = game.add.sprite(x, y, 'fsCountBG', null, container);
            fsCountBG.anchor.set(0.5);
            model.el('fsCountBG', fsCountBG);
            if (model.desktop) {
                fsCountBG.scale.set(1.3);
            }

            let fsCount = game.add.bitmapText(x + deltaX, y + deltaY, 'numbersFont', start + '', 140, container);
            fsCount.align = 'center';
            fsCount.anchor.set(0.5);
            fsCount.scale.set(0.1);
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
