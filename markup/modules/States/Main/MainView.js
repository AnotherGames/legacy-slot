import { model } from 'modules/Model/Model';
import { config } from 'modules/Util/Config';
import { view as transitionView } from 'modules/Transition/TransitionView';
import { controller as soundController } from '../../../../Info/SoundController';

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
            model.group('footerMenu', game.add.group());
            model.group('balanceCash', game.add.group());
            model.group('balanceCoin', game.add.group());
            model.group('bonusDarkness', game.add.group());
            model.group('aim', game.add.group());
            model.group('popup', game.add.group());
            model.group('infoTable', game.add.group());
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

            if (model.desktop) {
                let gmRight = game.add.sprite(640, -338, 'gmRight', null, container);
                    gmRight.pivot.set(14, 97);
                model.el('gmRight', gmRight);

                let gmLeft = game.add.sprite(-633, -338, 'gmLeft', null, container);
                    gmLeft.pivot.set(209, 97);
                model.el('gmLeft', gmLeft);

                let lamp1 = game.add.sprite(-750, -240, 'lamp', null, container);
                    lamp1.anchor.set(0.5);
                    lamp1.animations.add('move');
                    lamp1.name = 'leftLampDropped';
                    lamp1.animations.play('move', 15, true);
                model.el('lamp1', lamp1);
                model.state('leftLampDropped', false);
                model.data('leftLampY', lamp1.y)

                let lamp2 = game.add.sprite(750, -240, 'lamp', null, container);
                    lamp2.anchor.set(0.5);
                    lamp2.scale.set(-1, 1);
                    lamp2.animations.add('move');
                    lamp2.name = 'rightLampDropped'
                game.time.events.add(300, () => {
                    lamp2.animations.play('move', 15, true);
                })
                model.el('lamp2', lamp2);
                model.state('rightLampDropped', false);
                model.data('rightLampY', lamp2.y)

                draw.moveHornAndLamp(gmLeft, lamp1, -10);
                draw.moveHornAndLamp(gmRight, lamp2, +10);

                draw.dropLamp(lamp1);
                draw.dropLamp(lamp2);
            }
        },

        moveHornAndLamp: function(horn, lamp, angle){
            let game = model.el('game');
            let time = 100;
            let lampfstY = lamp.y;
            let lampendY = lamp.y + 20;

            horn.inputEnabled = true;
            horn.events.onInputDown.add(()=>{
                game.add.tween(horn).to({angle: angle}, time, 'Linear', true)
                if (model.state(lamp.name)) return;
                game.add.tween(lamp).to({y: lampendY}, time, 'Linear', true)
            })
            horn.events.onInputUp.add(()=>{
                game.add.tween(horn).to({angle: 0}, time, 'Linear', true)
                if (model.state(lamp.name)) return;
                game.add.tween(lamp).to({y: lampfstY}, time, 'Linear', true)
            })
        },

        dropLamp: function(lamp){
            let game = model.el('game');
            let count = 0;

            lamp.inputEnabled = true;
            lamp.events.onInputDown.add(()=>{
                if (count < 1){
                    lamp.animations.stop();
                    lamp.animations.frameName = 'FN-animation_45.png';
                    lamp.animations.play('move', 15, true);
                    count++
                } else {
                    game.add.tween(lamp).to({y: game.height + lamp.height}, 500, 'Linear', true)
                    model.state(lamp.name, true)
                    count = 0;
                }
            })
        },

        returnDroppedLamps(){
            let game = model.el('game');
            let lamp1 = model.el('lamp1')
            let lamp2 = model.el('lamp2')

            if ( model.state('leftLampDropped')){
                lamp1.alpha = 0;
                game.add.tween(lamp1).to({y: model.data('leftLampY')}, 10, 'Linear', true)
                .onComplete.add(()=>{
                    game.add.tween(lamp1).to({alpha: 1}, 200, 'Linear', true)
                })
                model.state(lamp1.name, false)
            }

            if ( model.state('rightLampDropped')){
                lamp2.alpha = 0;
                game.add.tween(lamp2).to({y: model.data('rightLampY')}, 10, 'Linear', true)
                .onComplete.add(()=>{
                    game.add.tween(lamp2).to({alpha: 1}, 200, 'Linear', true)
                })
                model.state(lamp2.name, false)
            }
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
                if (model.desktop) {
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
                } else {
                    lineNumber.events.onInputDown.add(() => {
                        if (lineNumber.lineShape) {
                            lineNumber.animations.play('close');
                            lineNumber.lineShape.destroy();
                        }
                        lineNumber.lineShape = this.lineShape(lineNumber.name);
                        lineNumber.animations.play('win');
                        game.time.events.add(4000, () => {
                            lineNumber.animations.play('close');
                            lineNumber.lineShape.destroy();
                        });
                    });

                }

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
                if (model.desktop) {
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
                } else {
                    lineNumber.events.onInputDown.add(() => {
                        if (lineNumber.lineShape) {
                            lineNumber.animations.play('close');
                            lineNumber.lineShape.destroy();
                        }
                        lineNumber.lineShape = this.lineShape(lineNumber.name);
                        lineNumber.animations.play('win');
                        game.time.events.add(4000, () => {
                            lineNumber.animations.play('close');
                            lineNumber.lineShape.destroy();
                        });
                    });
                }

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
           let y = (model.desktop) ? 110 : 80;
           lineShape
               .lineStyle(4, 0xe1b249, 0.8)
               .moveTo((line[0].X + 0.5) * elSize.width - model.el('gameMachine').width / 2 + 50, (line[0].Y + 0.5) * elSize.height - model.el('gameMachine').height / 2 + y)
               .lineTo((line[1].X + 0.5) * elSize.width - model.el('gameMachine').width / 2 + 50, (line[1].Y + 0.5) * elSize.height - model.el('gameMachine').height / 2 + y)
               .lineTo((line[2].X + 0.5) * elSize.width - model.el('gameMachine').width / 2 + 50, (line[2].Y + 0.5) * elSize.height - model.el('gameMachine').height / 2 + y)
               .lineTo((line[3].X + 0.5) * elSize.width - model.el('gameMachine').width / 2 + 50, (line[3].Y + 0.5) * elSize.height - model.el('gameMachine').height / 2 + y)
               .lineTo((line[4].X + 0.5) * elSize.width - model.el('gameMachine').width / 2 + 50, (line[4].Y + 0.5) * elSize.height - model.el('gameMachine').height / 2 + y)
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


        initPopup: function () {
            let popup = document.querySelector('#popup');
            popup.addEventListener('click', draw.closePopup);
        },

        showPopup: function ({
            message = 'popup',
            balance = false
        }) {
            model.state('notReload', balance);

            let popup = document.querySelector('#popup');
            let overlay = document.querySelector('#darkness');
            let popupText = document.querySelector('#popup h2');
            let popupBottomText = document.querySelector('#popup p');
            let bottomText;

            popup.classList.remove('closed');
            overlay.classList.remove('closed');

            popupText.innerHTML = message;

            if (model.desktop) {
                bottomText = `Click to ${(balance) ? 'close' : 'restart'}`;
            } else {
                bottomText = `Tap to ${(balance) ? 'close' : 'restart'}`;
            }

            popupBottomText.innerHTML = bottomText;
        },

        closePopup: function () {
            if (model.state('notReload')) {
                let popup = document.querySelector('#popup');
                let overlay = document.querySelector('#darkness');

                popup.classList.add('closed');
                overlay.classList.add('closed');
            } else {
                window.location.reload();
            }
        }
    };

    return {
        create,
        draw
    };
})();
