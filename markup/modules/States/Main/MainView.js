import { model } from 'modules/Model/Model';
import { config } from 'modules/Util/Config';
import { view as transitionView } from 'modules/Transition/TransitionView';
import { controller as soundController } from 'modules/Sound/SoundController';

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
            game = model.el('game'),
            container = model.group('bg')
        }) {

            let mainBG = game.add.sprite(0, 0, 'mainBG', null, container);
            model.el('mainBG', mainBG);

        },

        mainContainer: function ({
            game = model.el('game'),
            container = model.group('main')
        }) {
            let gameBG = game.add.sprite(0, 10, 'gameBG', null, container);
                gameBG.anchor.set(0.5);
            model.el('gameBG', gameBG);

            let gameMachine = game.add.sprite(0, config[model.res].gameMachine.y, 'gameMachine', null, container);
                gameMachine.anchor.set(0.5);
            model.el('gameMachine', gameMachine);

            let x1 = (model.desktop) ? 760 : 570;
            let x2 = (model.desktop) ? -760 : -570;
            let y = (model.desktop) ? -370 : -280;

            let gmRight = game.add.sprite(x1, y, 'gmRight', null, container);
                gmRight.anchor.set(0.5);
            model.el('gmRight', gmRight);

            let gmLeft = game.add.sprite(x2, y, 'gmLeft', null, container);
                gmLeft.anchor.set(0.5);
            model.el('gmLeft', gmLeft);
        },

        lineNumbers: function ({
            game = model.el('game'),
            container = model.group('numbers')
        }) {
            let gameMachine = model.el('gameMachine');

            let leftArr = [];

            for (let i = 1; i < 11; i++) {
                let name = i;
                let sprite = (i < 10) ? 'plashka2-0' + i +'-open_0.png' : 'plashka2-' + i +'-open_0.png';
                let prefix = (i < 10) ? 'plashka2-0' : 'plashka2-';

                let lineNumber = game.add.sprite(config[model.res].win[i][0].x - gameMachine.width / 2,
                    config[model.res].win[i][0].y - gameMachine.height / 2,
                    'lineNumbersLeft',
                    sprite,
                    container);

                lineNumber.name = name;
                lineNumber.anchor.set(0.5);

                lineNumber.animations.add('close', Phaser.Animation.generateFrameNames(prefix + i +'-open_', 19, 0, '.png', 1), 30, false);
                lineNumber.animations.add('win', Phaser.Animation.generateFrameNames(prefix + i +'-open_', 0, 20, '.png', 1), 30, false);

                lineNumber.inputEnabled = true;
                lineNumber.input.priorityID = 2;
                // lineNumber.input.pixelPerfectOver = 1;
                lineNumber.events.onInputOver.add(() => {
                    if (lineNumber.lineShape) {
                        lineNumber.animations.play('close');
                        lineNumber.lineShape.destroy();
                    }
                    lineNumber.lineShape = this.lineShape(lineNumber.name);
                    lineNumber.animations.play('win');
                });

                lineNumber.events.onInputOut.add(() => {
                    if (lineNumber.lineShape) {
                        lineNumber.animations.play('close');
                        lineNumber.lineShape.destroy();
                    }
                });
                leftArr.push(lineNumber);
            }

            model.el('leftArr', leftArr);

            let rightArr = [];

            for (let i = 1; i < 11; i++) {
                let name = i;
                let sprite = (i < 10) ? 'plashka-0' + i +'-open_0.png' : 'plashka-' + i +'-open_0.png';
                let prefix = (i < 10) ? 'plashka-0' : 'plashka-';

                let lineNumber = game.add.sprite(config[model.res].win[i][1].x - gameMachine.width / 2 - 8,
                    config[model.res].win[i][0].y - gameMachine.height / 2,
                    'lineNumbers',
                    sprite,
                    container);

                lineNumber.name = name;
                lineNumber.anchor.set(0.5);

                lineNumber.animations.add('close', Phaser.Animation.generateFrameNames(prefix + i +'-open_', 19, 0, '.png', 1), 30, false);
                lineNumber.animations.add('win', Phaser.Animation.generateFrameNames(prefix + i +'-open_', 0, 20, '.png', 1), 30, false);

                lineNumber.inputEnabled = true;
                lineNumber.input.priorityID = 2;
                // lineNumber.input.pixelPerfectOver = 1;
                lineNumber.events.onInputOver.add(() => {
                    if (lineNumber.lineShape) {
                        lineNumber.animations.play('close');
                       lineNumber.lineShape.destroy();
                    }
                    lineNumber.lineShape = this.lineShape(lineNumber.name);
                    lineNumber.animations.play('win');
                });

                lineNumber.events.onInputOut.add(() => {
                    if (lineNumber.lineShape) {
                        lineNumber.animations.play('close');
                        lineNumber.lineShape.destroy();
                    }
                });
                rightArr.push(lineNumber);
            }
            model.el('rightArr', rightArr);
        },

        lineShape: function(number) {
           let game = model.el('game');
           let container = model.group('glistaLight');
           let line = model.data('lines')[number - 1];
           let elSize = config[model.res].elements;
           let lineShape = game.add.graphics(0, 0, container);
           lineShape
               .lineStyle(4, 0x332206, 0.8)
               .moveTo((line[0].X + 0.5) * elSize.width - model.el('gameMachine').width / 2 + 50, (line[0].Y + 0.5) * elSize.height - model.el('gameMachine').height / 2 + 50)
               .lineTo((line[1].X + 0.5) * elSize.width - model.el('gameMachine').width / 2 + 50, (line[1].Y + 0.5) * elSize.height - model.el('gameMachine').height / 2 + 50)
               .lineTo((line[2].X + 0.5) * elSize.width - model.el('gameMachine').width / 2 + 50, (line[2].Y + 0.5) * elSize.height - model.el('gameMachine').height / 2 + 50)
               .lineTo((line[3].X + 0.5) * elSize.width - model.el('gameMachine').width / 2 + 50, (line[3].Y + 0.5) * elSize.height - model.el('gameMachine').height / 2 + 50)
               .lineTo((line[4].X + 0.5) * elSize.width - model.el('gameMachine').width / 2 + 50, (line[4].Y + 0.5) * elSize.height - model.el('gameMachine').height / 2 + 50)
           return lineShape;
        },

        machineContainer: function ({
            game = model.el('game'),
            container = model.group('main')
        }) {
            let machineGroup = game.add.group();
            container.addAt(machineGroup, 1);
            model.group('machine', machineGroup);

            let numbersContainer = game.add.group();
            container.addAt(numbersContainer, 0);
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

            let someGraphic = game.add.graphics(-elSize.width * 2.5, -elSize.height * 1.5, machineGroup);
                someGraphic.beginFill(0xffffff).drawRect(0, 0, elSize.width * 5, elSize.height * 3 + 18);
            machineGroup.mask = someGraphic;
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
            font = 'normal 45px Arial',
            color = '#c28531',
            balance = false
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
                popup.x - 40,
                popup.y,
                message,
                {font: font, fill: color, align: 'center', wordWrap: true, wordWrapWidth: 380, stroke: '#000000', strokeThickness: 3},
                container);
                popupText.anchor.set(0.5);

            popup.inputEnabled = true;
            popup.input.priorityID = 3;
            popup.events.onInputDown.add(() => {
                (!balance) ? window.location.reload() : container.removeAll();
            });

            overlay.inputEnabled = true;
            overlay.input.priorityID = 2;
            overlay.events.onInputDown.add(() => {
                (!balance) ? window.location.reload() : container.removeAll();
            });
        },

        flyingSmoke: function({
            game = model.el('game'),
            container = model.group('bg'),
            x = game.width / 39,
            y = game.height / 5.6,
            speed = 60000,
            delay = game.rnd.between(1000, 20000)

        }){
            let smoke = game.add.sprite(x, y, 'smoke', null, container);
                smoke.anchor.set(0.5);
                smoke.scale.set(0.1);
                smoke.alpha = 0;

            game.add.tween(smoke).to({alpha: 0.8 }, 300, Phaser.Easing.Sinusoidal.InOut, true, delay);
            game.add.tween(smoke.scale).to({y: 1, x: 1}, speed, Phaser.Easing.Sinusoidal.InOut, true, delay);
            game.add.tween(smoke).to({y: smoke.y / 2}, speed, Phaser.Easing.Sinusoidal.InOut, true, delay)
                .onComplete.add(()=>{
                    game.add.tween(smoke).to({y: -smoke.y, alpha: 0}, speed / 3, Phaser.Easing.Quintic.In, true)
                        .onComplete.add(()=>{
                            smoke.destroy();
                            draw.flyingSmoke({});
                        })

                });
        }

    };

    return {
        create,
        draw
    };
})();
