import { model } from 'modules/Model/Model';
import { config } from 'modules/Util/Config';
import { motionPath } from 'modules/Util/Motion';
import { controller as soundController } from '../../../../Info/SoundController';

export let view = (() => {

    let create = {
        groups: function ({
            game = model.el('game')
        }) {
            model.group('bg', game.add.group());
            model.group('main', game.add.group());
            model.group('panel', game.add.group());
            model.group('panelFS', game.add.group());
            model.group('buttons', game.add.group());
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

        },

        mainContainer: function ({
            game = model.el('game'),
            container = model.group('main')
        }) {
            let gameBG = game.add.sprite(0, config[model.res].gameMachine.y, 'gameMachineBG', null, container);
            gameBG.anchor.set(0.5);
            model.el('gameBG', gameBG);

            let gameMachine = game.add.sprite(0, config[model.res].gameMachine.y, 'gameMachine', null, container);
            gameMachine.anchor.set(0.5);
            model.el('gameMachine', gameMachine);

            let darknessBG = game.add.sprite(0, config[model.res].gameMachine.y, 'darkness', null, container);
            darknessBG.anchor.set(0.5);
            darknessBG.visible = false;
            model.el('darknessBG', darknessBG);

            let lever = game.add.spine(gameMachine.right + 60, gameMachine.bottom - 160, 'lever');
            container.add(lever);
            lever.setAnimationByName(0, 'idle', true);
            model.el('lever', lever);
            if (model.mobile) {
                lever.scale.set(0.75);
                lever.x = gameMachine.right + 45;
                lever.y = gameMachine.bottom - 240;
            }

            let gameMachineUp = game.add.sprite(0, config[model.res].gameMachine.y, 'gameMachineUp', null, container);
            gameMachineUp.anchor.set(0.5);
            model.el('gameMachineUp', gameMachineUp);
            gameMachineUp.visible = false;

            let logoGM = game.add.sprite(0, model.el('gameMachine').top + 30, 'logoGM', null, container);
            logoGM.anchor.set(0.5);
            model.el('logoGM', logoGM);

        },

        lineNumbers: function ({
            game = model.el('game'),
            container = model.group('numbers'),
            gameMachine = model.el('gameMachine'),
            side = 'left'
        }) {
            let x = (side === 'right') ? gameMachine.right - 11 : gameMachine.left + 11;
            let deltaY = (model.desktop) ? 70 : 60;
            let lineNumbersArr = [];
            let winNumbersArr = [];

            for (let i = 1; i < 11; i++) {
                let lineNumber = game.add.sprite(x, config[model.res].win[i][0].y - gameMachine.height / 2 - deltaY,
                    'lineNumbers',
                    'line_' + i + '.png',
                    container);
                lineNumber.name = i;
                lineNumber.anchor.set(0.5);
                lineNumber.visible = false;

                let winNumber = game.add.sprite(x, config[model.res].win[i][0].y - gameMachine.height / 2 - deltaY,
                    'winNumbers',
                    'line-' + i + '-bang_0.png',
                    container);
                winNumber.name = i;
                winNumber.anchor.set(0.5);
                winNumber.scale.set(1.4);
                winNumber.visible = false;

                winNumber.animations.add('win', Phaser.Animation.generateFrameNames('line-' + i + '-bang_', 0, 30, '.png', 1), 30, false);
                winNumber.animations.getAnimation('win').onComplete.add(() => {
                    winNumber.frameName = 'line-' + i + '-bang_0.png';
                    winNumber.visible = false;
                });

                if (model.state('fs')) {
                    lineNumbersArr.push(lineNumber);
                    winNumbersArr.push(winNumber);
                    continue;
                }

                lineNumber.inputEnabled = true;
                lineNumber.input.priorityID = 2;
                lineNumber.hitArea = new Phaser.Circle(0, 0, 50);

                if (model.desktop) {
                    lineNumber.events.onInputOver.add(() => {
                        if (lineNumber.lineShape) {
                            lineNumber.frameName = 'line_' + lineNumber.name + '.png';
                            lineNumber.lineShape.destroy();
                        }
                        lineNumber.frameName = 'line_big_' + lineNumber.name + '.png';
                        lineNumber.lineShape = this.lineShape(lineNumber.name);
                    });

                    lineNumber.events.onInputOut.add(() => {
                        if (lineNumber.lineShape) {
                            lineNumber.frameName = 'line_' + lineNumber.name + '.png';
                            lineNumber.lineShape.destroy();
                        }
                    });
                } else {
                    lineNumber.events.onInputDown.add(() => {
                        if (lineNumber.lineShape) {
                            lineNumber.frameName = 'line_' + lineNumber.name + '.png';
                            lineNumber.lineShape.destroy();
                        }
                        lineNumber.frameName = 'line_big_' + lineNumber.name + '.png';
                        lineNumber.lineShape = this.lineShape(lineNumber.name);
                        game.time.events.add(1500, () => {
                            if (lineNumber.lineShape) {
                                lineNumber.frameName = 'line_' + lineNumber.name + '.png';
                                lineNumber.lineShape.destroy();
                            }
                        });
                    });
                }
                lineNumbersArr.push(lineNumber);
                winNumbersArr.push(winNumber);
            }

            model.el(side + 'LineArr', lineNumbersArr);
            model.el(side + 'WinArr', winNumbersArr);
        },

        lineShape: function (number) {
            let game = model.el('game');
            let container = model.group('glistaLight');
            let line = model.data('lines')[number - 1];
            let elSize = config[model.res].elements;
            let lineShape = game.add.graphics(0, 0, container);
            let y = (model.desktop) ? 50 : 30;
            lineShape
               .lineStyle(4, 0xffffff, 0.8)
               .moveTo((line[0].X + 0.5) * elSize.width - model.el('gameMachine').width / 2 + 50, (line[0].Y + 0.5) * elSize.height - model.el('gameMachine').height / 2 + y)
               .lineTo((line[1].X + 0.5) * elSize.width - model.el('gameMachine').width / 2 + 50, (line[1].Y + 0.5) * elSize.height - model.el('gameMachine').height / 2 + y)
               .lineTo((line[2].X + 0.5) * elSize.width - model.el('gameMachine').width / 2 + 50, (line[2].Y + 0.5) * elSize.height - model.el('gameMachine').height / 2 + y)
               .lineTo((line[3].X + 0.5) * elSize.width - model.el('gameMachine').width / 2 + 50, (line[3].Y + 0.5) * elSize.height - model.el('gameMachine').height / 2 + y)
               .lineTo((line[4].X + 0.5) * elSize.width - model.el('gameMachine').width / 2 + 50, (line[4].Y + 0.5) * elSize.height - model.el('gameMachine').height / 2 + y);
            return lineShape;
        },

        machineContainer: function ({
            game = model.el('game'),
            container = model.group('main')
        }) {
            let machineGroup = game.add.group();
            container.addAt(machineGroup, 1);
            model.group('machine', machineGroup);

            let winUp = game.add.group();
            container.addAt(winUp, 3);
            model.group('winUp', winUp);

            let winTop = game.add.group();
            container.addAt(winTop, 4);
            model.group('winTop', winTop);

            let numbersContainer = game.add.group();
            container.addAt(numbersContainer, 5);
            model.group('numbers', numbersContainer);

            let lightContainer = game.add.group();
            container.addAt(lightContainer, 6);
            model.group('light', lightContainer);

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
            let deltaY = (model.desktop) ? -15 : 20;

            let someGraphic = game.add.graphics(-elSize.width * 2.5 - 500, -elSize.height * 1.5 - deltaY, machineGroup);
            someGraphic.beginFill(0xffffff).drawRect(0, 0, elSize.width * 5 + 1500, elSize.height * 3);
            machineGroup.mask = someGraphic;
        },

        addLight: function ({
            game = model.el('game'),
            container = model.group('light'),
            gameMachine = model.el('gameMachine'),
            side = 'left'
        }) {
            let lightArr = [];
            let x = (side === 'right') ? gameMachine.right - 30 : gameMachine.left + 33;
            let y = [80, 140, 200, 260, 320, 380, 440, 500, 560, 620, 680, 735, 790, 845];

            let xHorisontal = [-630, -570, -450, -390, -330, -270, -210, -150, -90, -30, 30, 90, 150, 210, 270, 330, 390, 450, 510, 570, 630, 690];
            let yHorisontal = (side === 'right') ? gameMachine.top + 33 : gameMachine.bottom - 35;
            if (model.mobile) {
                x = (side === 'right') ? gameMachine.right - 22 : gameMachine.left + 25;
                y = [50, 90, 130, 170, 210, 250, 290, 330, 370, 410, 450, 490, 530];

                xHorisontal = [-550, -510, -470];
                yHorisontal = (side === 'right') ? gameMachine.top + 22 : gameMachine.bottom - 25;

            }

            for (let i = 0; i < 13; i++) {

                let light = game.add.sprite(x, y[i] - gameMachine.height / 2,
                    'light',
                    'L-green_1_0.png',
                    container);
                light.name = i;
                light.anchor.set(0.5);


                light.animations.add('green', Phaser.Animation.generateFrameNames('L-green_1_', 0, 15, '.png', 1), 15, true);
                light.animations.add('red', Phaser.Animation.generateFrameNames('L-red_1_', 0, 15, '.png', 1), 15, true);

                if (i % 2 == 0) {
                    light.animations.play('green');
                } else {
                    light.animations.play('red');
                }

                lightArr.push(light);
            }

            for (let i = 0; i < 21; i++) {
                let rnd = (game.rnd.integerInRange(0, 1)) ? 'red' : 'green';
                let light = game.add.sprite(xHorisontal[i], yHorisontal,
                    'light',
                    'L-green_1_0.png',
                    container);
                light.name = i;
                light.anchor.set(0.5);

                light.animations.add('green', Phaser.Animation.generateFrameNames('L-green_1_', 0, 15, '.png', 1), 15, true);
                light.animations.add('red', Phaser.Animation.generateFrameNames('L-red_1_', 0, 15, '.png', 1), 15, true);
                if (i % 2 == 0) {
                    light.animations.play('green');
                } else {
                    light.animations.play('red');
                }

                lightArr.push(light);
            }
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
