import { model } from 'modules/Model/Model';
import { config } from 'modules/Util/Config';
import { motionPath } from 'modules/Util/Motion';
import { controller as panelController } from 'modules/Panel/PanelController';
import { controller as buttonsController } from 'modules/Buttons/ButtonsController';
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
            let lever = game.add.spine(755, 250, 'lever');
            container.add(lever);
            lever.setAnimationByName(0, 'idle', true);
            model.el('lever', lever);
            if (model.mobile) {
                lever.scale.set(0.75);
                lever.x = 570;
                lever.y = 40;
            }

            let gameBG = game.add.sprite(0, config[model.res].gameMachine.y, 'gameMachineBG', null, container);
            gameBG.anchor.set(0.5);
            model.el('gameBG', gameBG);

            let gameBGFS = game.add.sprite(0, config[model.res].gameMachine.y, 'gameMachineFSBG', null, container);
            gameBGFS.anchor.set(0.5);
            model.el('gameBGFS', gameBGFS);
            gameBGFS.visible = false;

            let gameMachine = game.add.sprite(0, config[model.res].gameMachine.y, 'gameMachine', null, container);
            gameMachine.anchor.set(0.5);
            model.el('gameMachine', gameMachine);

            let darknessBG = game.add.sprite(0, config[model.res].gameMachine.y + 5, 'darkness', null, container);
            darknessBG.anchor.set(0.5);
            darknessBG.visible = false;
            model.el('darknessBG', darknessBG);

            let deltaY = (model.desktop) ? 90 : 45;
            let logoGM = game.add.spine(0, deltaY, 'logoGM');
            container.add(logoGM);
            if (model.mobile) {
                logoGM.scale.set(0.75);
            }
            logoGM.setAnimationByName(0, 'idle', true);
            model.el('logoGM', logoGM);


            // Hit area for lever
            let deltaY2 = (model.desktop) ? 250 : 200;
            let circle = game.add.graphics(lever.x, lever.y - deltaY2, container).beginFill(0xffffff, 0.01).drawCircle(0, 0, 100);
            circle.inputEnabled = true;
            circle.events.onInputDown.add(() => {
                if (model.desktop) {
                    panelController.handle.spin();
                } else {
                    buttonsController.handle.spinButton();
                }
            });
        },

        changeBG: function ({
            game = model.el('game'),
            container = model.group('main'),
            gameBG = model.el('gameBG'),
            gameBGFS = model.el('gameBGFS')
        }) {
            if (model.state('fs')) {
                gameBG.visible = false;
                gameBGFS.visible = true;
            } else {
                gameBGFS.visible = false;
                gameBG.visible = true;
            }

        },

        machineContainer: function ({
            game = model.el('game'),
            container = model.group('main')
        }) {
            let flagsContainer = game.add.group();
            container.addAt(flagsContainer, 1);
            model.group('flags', flagsContainer);

            let blurBGContainer = game.add.group();
            container.addAt(blurBGContainer, 4);
            model.group('blurBG', blurBGContainer);

            let machineGroup = game.add.group();
            container.addAt(machineGroup, 5);
            model.group('machine', machineGroup);

            let lightContainer = game.add.group();
            container.addAt(lightContainer, 6);
            model.group('light', lightContainer);

            let twinkleDownContainer = game.add.group();
            container.addAt(twinkleDownContainer, 8);
            model.group('twinkleDown', twinkleDownContainer);

            let twinkleContainer = game.add.group();
            container.addAt(twinkleContainer, 9);
            model.group('twinkle', twinkleContainer);

            let winUp = game.add.group();
            container.addAt(winUp, 10);
            model.group('winUp', winUp);

            let winTop = game.add.group();
            container.addAt(winTop, 11);
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
            let deltaY = (model.desktop) ? -15 : 20;

            let someGraphic = game.add.graphics(-elSize.width * 2.5 - 500, -elSize.height * 1.5 - deltaY, machineGroup);
            someGraphic.beginFill(0xffffff).drawRect(0, 0, elSize.width * 5 + 1500, elSize.height * 3);
            machineGroup.mask = someGraphic;
        },

        drawBlurBg: function ({
            game = model.el('game'),
            container = model.group('blurBG'),
            elSize = config[model.res].elements
        }) {
            let color = (model.state('fs')) ? 'redRoll' : 'greenRoll';
            for (let i = 0; i < 5; i++) {
                let blurBG = game.add.sprite((i - 2) * elSize.width, config[model.res].gameMachine.y, color, null, container);
                blurBG.anchor.set(0.5);
                model.el('blurBG', blurBG);
            }
            container.alpha = 0;

        },

        showBlurBg: function ({
            game = model.el('game'),
            container = model.group('blurBG'),
            time = 300
        }) {
            game.add.tween(container).to({alpha: 1}, time, 'Linear', true);
        },

        hideBlurBg: function ({
            game = model.el('game'),
            container = model.group('blurBG'),
            time = 200
        }) {
            game.add.tween(container).to({alpha: 0}, 200, 'Linear', true);
        },

        showFlag: function ({
            number = 1,
            container = model.group('flags'),
            game = model.el('game'),
            gameMachine = model.el('gameMachine'),
            deltaY = (model.desktop) ? 50 : 60,
            timeDelay = 500
        }) {

            let flagRight = game.add.spine(gameMachine.right - 30, -300, 'flagRight');
            container.add(flagRight);
            flagRight.width = -flagRight.width;
            model.el('flagRight', flagRight);

            let flagLeft = game.add.spine(gameMachine.left + 30, -300, 'flagLeft');
            container.add(flagLeft);
            model.el('flagLeft', flagLeft);

            if (model.mobile) {
                flagRight.x = gameMachine.right - 55;
                flagLeft.x = gameMachine.left + 55;
            }

            let color;
            if (model.state('fs')) {
                color = 'r';
            } else {
                color = 'g';
            }

            flagRight.setAnimationByName(0, `open_${color}_${number}`, false);
            flagRight.y = config[model.res].win[number][0].y - gameMachine.height / 2 - deltaY;

            flagLeft.setAnimationByName(0, `open_${color}_${number}`, false);
            flagLeft.y = config[model.res].win[number][0].y - gameMachine.height / 2 - deltaY;

            game.time.events.add(timeDelay, () => {
                flagRight.setAnimationByName(0, `close_${color}_${number}`, false);
                flagLeft.setAnimationByName(0, `close_${color}_${number}`, false);
            });
        },

        hideFlag: function ({
            flagRight = model.el('flagRight'),
            flagLeft = model.el('flagLeft')
        }) {
            if (flagRight) {
                flagRight.destroy();
            }
            if (flagLeft) {
                flagLeft.destroy();
            }
        },

        addLight: function ({
            game = model.el('game'),
            container = model.group('light'),
            gameMachine = model.el('gameMachine'),
            side = 'left'
        }) {
            let deltaX = model.desktop ? 125 : 95;
            let x = (side === 'right') ? gameMachine.right - deltaX : gameMachine.left + deltaX;
            let deltaY = (model.desktop) ? 45 : 55;
            let lightColor = (model.state('fs')) ? 'lightRed' : 'lightGreen';
            let innerLightArr = [];

            for (let i = 1; i < 11; i++) {
                let innerLight = game.add.sprite(x, config[model.res].win[i][0].y - gameMachine.height / 2 - deltaY,
                    lightColor,
                    null,
                    container);
                innerLight.name = i;
                innerLight.anchor.set(0.5);
                if (side == 'right') {
                    innerLight.scale.set(-1, 1);
                }
                innerLight.alpha = 0;

                if (model.state('fs')) {
                    innerLightArr.push(innerLight);
                    continue;
                }

                innerLight.inputEnabled = true;
                innerLight.input.priorityID = 2;
                innerLight.hitArea = new Phaser.Circle(0, 0, 100);

                if (model.desktop) {
                    innerLight.events.onInputOver.add(() => {
                        if (innerLight.lineShape) {
                            innerLight.lineShape.destroy();
                        }
                        innerLight.lineShape = this.lineShape(innerLight.name);
                    });

                    innerLight.events.onInputOut.add(() => {
                        if (innerLight.lineShape) {
                            innerLight.lineShape.destroy();
                        }
                    });
                } else {
                    innerLight.events.onInputDown.add(() => {
                        if (innerLight.lineShape) {
                            innerLight.lineShape.destroy();
                        }
                        innerLight.lineShape = this.lineShape(innerLight.name);
                        game.time.events.add(1500, () => {
                            if (innerLight.lineShape) {
                                innerLight.lineShape.destroy();
                            }
                        });
                    });
                }
                innerLightArr.push(innerLight);
            }

            model.el(side + 'InnerLightArr', innerLightArr);
        },

        lineShape: function (number) {
            let game = model.el('game');
            let container = model.group('glistaLight');
            let line = model.data('lines')[number - 1];
            let elSize = config[model.res].elements;
            let lineShape = game.add.graphics(0, 0, container);
            let y = (model.desktop) ? 60 : 30;
            lineShape
               .lineStyle(4, 0xdf9e4c, 0.8)
               .moveTo((line[0].X + 0.5) * elSize.width - model.el('gameMachine').width / 2 + 50, (line[0].Y + 0.5) * elSize.height - model.el('gameMachine').height / 2 + y)
               .lineTo((line[1].X + 0.5) * elSize.width - model.el('gameMachine').width / 2 + 50, (line[1].Y + 0.5) * elSize.height - model.el('gameMachine').height / 2 + y)
               .lineTo((line[2].X + 0.5) * elSize.width - model.el('gameMachine').width / 2 + 50, (line[2].Y + 0.5) * elSize.height - model.el('gameMachine').height / 2 + y)
               .lineTo((line[3].X + 0.5) * elSize.width - model.el('gameMachine').width / 2 + 50, (line[3].Y + 0.5) * elSize.height - model.el('gameMachine').height / 2 + y)
               .lineTo((line[4].X + 0.5) * elSize.width - model.el('gameMachine').width / 2 + 50, (line[4].Y + 0.5) * elSize.height - model.el('gameMachine').height / 2 + y);
            return lineShape;
        },

        addBigLight: function ({
            game = model.el('game'),
            container = model.group('panel'),
            gameMachine = model.el('gameMachine')
        }) {
            if (model.mobile) return;

            if (model.state('fs')) {
                container = model.group('panelFS');
            }
            let bigLightArr = [];
            let y = [46, 100, 150, 50, 100, 150];
            for (let i = 0; i < 6; i++) {
                let light = game.add.sprite(25, y[i], 'light', null, container);
                light.anchor.set(0.5);
                if (i > 2) {
                    light.x = 1350;
                }
                light.animations.add('green', Phaser.Animation.generateFrameNames('L-Bgreen_', 0, 15, '.png', 1), 15, true);
                light.animations.add('red', Phaser.Animation.generateFrameNames('L-Bred_', 0, 15, '.png', 1), 15, true);

                if (i % 2 == 0) {
                    light.animations.play('green');
                } else {
                    light.animations.play('red');
                }
                bigLightArr.push(light);
            }
            model.el('bigLightArr', bigLightArr);
        },

        changeBigLight: function ({
            game = model.el('game'),
            bigLightArr = model.el('bigLightArr')
        }) {
            if (model.mobile) return;

            console.log(bigLightArr);

            let count = 0;
            let bigLightTimer = game.time.events.loop(500, () => {
                count++;

                if (count % 2) {
                    bigLightArr.forEach((light) => {
                        light.animations.play('red');
                    });
                } else {
                    bigLightArr.forEach((light) => {
                        light.animations.play('green');
                    });
                }
            });
            model.el('bigLightTimer', bigLightTimer);
        },

        addTwinkleLight: function ({
            game = model.el('game'),
            container = model.group('twinkle'),
            gameMachine = model.el('gameMachine'),
            side = 'left'
        }) {

            let lightArr = [];

            let x = (side === 'right') ? gameMachine.right - 30 : gameMachine.left + 33;
            let y = (model.desktop) ? 100 : 50;
            let delta = (model.desktop) ? 60 : 45;

            let x2 = (model.desktop) ? -630 : -470;
            let y2 = (side === 'right') ? gameMachine.top + 33 : gameMachine.bottom - 35;
            if (model.mobile) {
                x = (side === 'right') ? gameMachine.right - 22 : gameMachine.left + 25;
                y2= (side === 'right') ? gameMachine.top + 25 : gameMachine.bottom - 27;
            }

            // add right and left right (depends on a side)
            for (let i = 0; i < 12; i++) {

                let light = game.add.sprite(x, y + delta * i - gameMachine.height / 2,
                    'light',
                    'L-green_1_0.png',
                    container);
                light.name = i;
                light.anchor.set(0.5);

                light.animations.add('green', Phaser.Animation.generateFrameNames('L-green_1_', 0, 15, '.png', 1), 15, true);
                light.animations.add('red', Phaser.Animation.generateFrameNames('L-red_1_', 0, 15, '.png', 1), 15, true);
                light.animations.add('greenWin', Phaser.Animation.generateFrameNames('L-green_2_', 0, 15, '.png', 1), 15, true);
                light.animations.add('redWin', Phaser.Animation.generateFrameNames('L-red_2_', 0, 15, '.png', 1), 15, true);
                light.animations.add('greenBigWin', Phaser.Animation.generateFrameNames('L-green_3_', 0, 15, '.png', 1), 15, true);
                light.animations.add('redBigWin', Phaser.Animation.generateFrameNames('L-red_3_', 0, 15, '.png', 1), 15, true);

                if (i % 2 == 0) {
                    if (container == model.group('twinkleDown')) {
                        light.animations.play('green');
                    } else {
                        light.animations.play('red');
                    }
                } else {
                    if (container == model.group('twinkleDown')) {
                        light.animations.play('red');
                    } else {
                        light.animations.play('green');
                    }
                }
                if (side =='right' && i == 10) {
                    light.visible = false;
                }

                lightArr.push(light);
            }

            // top and bottom lights (depends on a side)
            for (let i = 0; i < 22; i++) {
                let rnd = (game.rnd.integerInRange(0, 1)) ? 'red' : 'green';
                let light = game.add.sprite(x2 + delta * i, y2,
                    'light',
                    'L-green_1_0.png',
                    container);
                light.name = i;
                light.anchor.set(0.5);

                light.animations.add('green', Phaser.Animation.generateFrameNames('L-green_1_', 0, 15, '.png', 1), 15, true);
                light.animations.add('red', Phaser.Animation.generateFrameNames('L-red_1_', 0, 15, '.png', 1), 15, true);
                light.animations.add('greenWin', Phaser.Animation.generateFrameNames('L-green_2_', 0, 15, '.png', 1), 15, true);
                light.animations.add('redWin', Phaser.Animation.generateFrameNames('L-red_2_', 0, 15, '.png', 1), 15, true);
                light.animations.add('greenBigWin', Phaser.Animation.generateFrameNames('L-green_3_', 0, 15, '.png', 1), 15, true);
                light.animations.add('redBigWin', Phaser.Animation.generateFrameNames('L-red_3_', 0, 15, '.png', 1), 15, true);

                if (i % 2 == 0) {
                    if (container == model.group('twinkleDown')) {
                        light.animations.play('green');
                    } else {
                        light.animations.play('red');
                    }
                } else {
                    if (container == model.group('twinkleDown')) {
                        light.animations.play('red');
                    } else {
                        light.animations.play('green');
                    }
                }
                if (side =='right' && i == 2) {
                    light.visible = false;
                }

                lightArr.push(light);
            }

            if (container == model.group('twinkleDown')) {
                model.el(side + 'DownLightArr', lightArr);
                container.alpha = 0;
            } else {
                model.el(side + 'LightArr', lightArr);
            }
            if (container == model.group('twinkle')) {
            }

        },

        addBrokenLight: function ({
            game = model.el('game'),
            container = model.group('main'),
            gameMachine = model.el('gameMachine')
        }) {
            let lightBroken1 = game.add.sprite((model.desktop) ? -510 : -380,
                (model.desktop) ? gameMachine.top + 33 : gameMachine.top + 25,
                'lightBroken',
                null,
                container);
            lightBroken1.anchor.set(0.5);

            let lightBroken2 = game.add.sprite((model.desktop) ? gameMachine.right - 30 : gameMachine.right - 22,
                (model.desktop) ? 700 - gameMachine.height / 2 : 500 - gameMachine.height / 2,
                'lightBroken',
                null,
                container);
            lightBroken2.anchor.set(0.5);
        },

        lightToggle: function ({
            game = model.el('game'),
            leftLightArr = model.el('leftLightArr'),
            rightLightArr = model.el('rightLightArr'),
            leftDownLightArr = model.el('leftDownLightArr'),
            rightDownLightArr = model.el('rightDownLightArr'),
            twinkleContainer = model.group('twinkle'),
            twinkleDownContainer = model.group('twinkleDown')
        }) {

            leftDownLightArr.forEach((light, index) => {
                if (index % 2 == 0) {
                    light.animations.play('green');
                } else {
                    light.animations.play('red');
                }
            });
            rightDownLightArr.forEach((light, index) => {
                if (index % 2 == 0) {
                    light.animations.play('green');
                } else {
                    light.animations.play('red');
                }
            });

            let count = 0;
            let twinkleTimer = game.time.events.loop(200, () => {
                count++;

                if (count % 2) {
                    twinkleContainer.alpha = 0;
                    twinkleDownContainer.alpha = 1;
                } else {
                    twinkleContainer.alpha = 1;
                    twinkleDownContainer.alpha = 0;
                }
            });
            model.el('twinkleTimer', twinkleTimer);
        },

        lightPlay: function ({
            game = model.el('game'),
            leftLightArr = model.el('leftLightArr'),
            rightLightArr = model.el('rightLightArr'),
            win = true
        }) {

            let greenAnim, redAnim;
            if (win) {
                greenAnim = 'greenBigWin';
                redAnim = 'redBigWin';
            } else {
                greenAnim = 'green';
                redAnim = 'red';
            }

            leftLightArr.forEach((light, index) => {
                if (index % 2 == 0) {
                    light.animations.play(redAnim);
                } else {
                    light.animations.play(greenAnim);
                }
            });
            rightLightArr.forEach((light, index) => {
                if (index % 2 == 0) {
                    light.animations.play(redAnim);
                } else {
                    light.animations.play(greenAnim);
                }
            });

        },

        lightOneColor: function ({
            game = model.el('game'),
            leftDownLightArr = model.el('leftDownLightArr'),
            rightDownLightArr = model.el('rightDownLightArr'),
            anim = null,
            twinkleContainer = model.group('twinkle'),
            twinkleDownContainer = model.group('twinkleDown')
        }) {
            twinkleContainer.alpha = 0;
            twinkleDownContainer.alpha = 1;
            leftDownLightArr.forEach((light, index) => {
                light.animations.play(anim);
            });
            rightDownLightArr.forEach((light, index) => {
                light.animations.play(anim);
            });
            console.log('twinkleDown', twinkleDownContainer);
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
