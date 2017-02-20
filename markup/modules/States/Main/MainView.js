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
            model.group('panel', game.add.group());
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
            let mainBG;
            if (model.desktop) {
                mainBG = game.add.spine(game.world.centerX, game.world.centerY, 'fon');
                    mainBG.setAnimationByName(0, 'move2', true);
                    container.add(mainBG);
                model.el('mainBG', mainBG);
                // game.time.events.add(7000, () => {
                //     draw._lettersFall({});
                // });
            } else {
                mainBG = game.add.tileSprite(0, 0, game.width, game.height, 'gradientLine', null, container);

                let luchi = game.add.sprite(game.world.centerX, game.world.centerY, 'shine', null, container);
                luchi.anchor.set(0.5);
                game.add.tween(luchi).to({rotation: 2 * Math.PI, alpha: 0.1}, 30000, 'Linear', true, 0, -1, true);
            }

        },

        _lettersFall: function ({
            game = model.el('game'),
            container = model.group('bg')
        }) {
            console.log('letters fall');
            let mainBG = model.el('mainBG');
            console.log(mainBG);
            mainBG.addAnimationByName(0, 'move5', false);
            mainBG.addAnimationByName(0, 'move2', true);

            let rnd = game.rnd.integerInRange(15, 20);
            game.time.events.add(rnd * 1000, () => {
                draw._lettersFall({});
            });
        },

        addBalloons: function ({
            game = model.el('game'),
            container = model.group('bg')
        }) {
            let balloons = game.add.sprite(100, game.height + 500, 'balloons', null, container);
            balloons.anchor.set(0.5);
            if (model.mobile) {
                balloons.scale.set(0.66);
            }

            let side = game.rnd.integerInRange(0, 1) ? 'left' : 'right';
            let deltaX;
            if (side == 'left') {
                balloons.x = game.rnd.integerInRange(100, 400);
                deltaX = balloons.x + 300;
            } else {
                let random = game.rnd.integerInRange(7, 9) / 10;
                balloons.x = game.width * random;
                deltaX = balloons.x - 300;
            }

            game.add.tween(balloons).to({y: -500, x: deltaX}, 10000, 'Linear', true);

            let rnd = game.rnd.integerInRange(18, 23);
            game.time.events.add(rnd * 1000, () => {
                draw.addBalloons({});
            });
        },

        addCloud: function ({
            x = model.el('game').rnd.integerInRange(0, model.el('game').width),
            container = model.group('bg')
        }) {
            let game = model.el('game');
            let randomScale = game.rnd.integerInRange(3, 9);

            for (let i = 0; i < 5; i++) {
                let cloud = game.add.sprite(0, 150, 'cloud', null, container);
                cloud.anchor.set(0.5);
                cloud.angle = 40;
                cloud.scale.set(randomScale / 10);

                let time = game.rnd.integerInRange(30, 50);
                let delay = game.rnd.integerInRange(500, 1500);
                let side = game.rnd.integerInRange(0, 1) ? 'left' : 'right';
                console.log(side);
                if (model.desktop) {
                    cloud.y = cloud.y = cloud.y + game.rnd.integerInRange(20, 350) + 80;
                } else {
                    cloud.y = cloud.y = cloud.y + game.rnd.integerInRange(20, 250) + 50;
                }
                cloud.x = x;

                if (container === model.group('bg')){
                    cloud.x = (side === 'left') ? -cloud.width : game.width + cloud.width;
                }
                let delta = (side === 'left') ? game.width + cloud.width : -cloud.width;

                game.add.tween(cloud).to({x: delta}, time * 1000, 'Linear', true, delay)
                    .onComplete.add(() => {
                        cloud.destroy();
                    }, this);
            }
            game.time.events.add(20000, () => {
                draw.addCloud({});
            });

        },

        addConfetti: function ({
            game = model.el('game'),
            container = model.group('bg')
        }) {
            let i = game.rnd.integerInRange(1, 3);
            let confetti = game.add.sprite(100, -500, `confetti${i}`, null, container);
            confetti.anchor.set(0.5);
            if (model.mobile) {
                confetti.scale.set(0.66);
            }

            let side = game.rnd.integerInRange(0, 1) ? 'left' : 'right';
            let deltaX;
            if (side == 'left') {
                confetti.x = game.rnd.integerInRange(100, 600);
                deltaX = confetti.x + 300;
            } else {
                let random = game.rnd.integerInRange(6, 9) / 10;
                confetti.x = game.width * random;
                deltaX = confetti.x - 300;
            }

            game.add.tween(confetti).to({y: game.height + 500, x: deltaX}, 10000, 'Linear', true, 2000);

            let rnd = game.rnd.integerInRange(10, 15);
            game.time.events.add(rnd * 1000, () => {
                draw.addConfetti({});
            });
        },

        // addCConfetti: function ({
        //     game = model.el('game'),
        //     container = model.group('bg')
        // }) {
        //     let back_emitter = game.add.emitter(game.width / 2, -500, 100);
        //         back_emitter.makeParticles('confetti1');
        //         back_emitter.maxParticleScale = 0.6;
        //         back_emitter.minParticleScale = 0.2;
        //         back_emitter.setYSpeed(20, 100);
        //         back_emitter.gravity = 0;
        //         back_emitter.width = game.world.width * 1.5;
        //         back_emitter.minRotation = -10;
        //         back_emitter.maxRotation = 10;
        //
        //     let mid_emitter = game.add.emitter(game.width / 2, -500, 100);
        //         mid_emitter.makeParticles('confetti2');
        //         mid_emitter.maxParticleScale = 1.2;
        //         mid_emitter.minParticleScale = 0.8;
        //         mid_emitter.setYSpeed(50, 150);
        //         mid_emitter.gravity = 5;
        //         mid_emitter.width = game.world.width * 1.5;
        //         mid_emitter.minRotation = -10;
        //         mid_emitter.maxRotation = 10;
        //
        //     let front_emitter = game.add.emitter(game.width / 2, -500, 100);
        //         front_emitter.makeParticles('confetti3');
        //         front_emitter.maxParticleScale = 1;
        //         front_emitter.minParticleScale = 0.5;
        //         front_emitter.setYSpeed(100, 200);
        //         front_emitter.gravity = 10;
        //         front_emitter.width = game.world.width * 1.5;
        //         front_emitter.minRotation = -10;
        //         front_emitter.maxRotation = 10;
        //
        //     container.add(back_emitter);
        //     container.add(mid_emitter);
        //     container.add(front_emitter);
        //
        //     back_emitter.start(false, 20000, 1000);
        //     mid_emitter.start(false, 25000, 1000);
        //     front_emitter.start(false, 30000, 1000);
        //
        // },

        addBurst ({
                game = model.el('game'),
                container = model.group('bg')
        }) {
            let emitter = game.add.emitter(game.world.centerX, game.world.centerY + 100, 20);
            model.el('emitter', emitter);

            emitter.makeParticles('trash', [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19], 100, true, true);
            container.add(emitter);

            emitter.minParticleSpeed.setTo(-1200, -1300);
            emitter.maxParticleSpeed.setTo(1200, -1400);
            emitter.minParticleScale = 0.4;
            emitter.maxParticleScale = 0.8;
            emitter.gravity = 150;
            emitter.bounce.setTo(0.5, 0.5);
            emitter.angularDrag = 30;

            emitter.start(false, 3000, 100);
        },

        mainContainer: function ({
            game = model.el('game'),
            container = model.group('main')
        }) {
            const elSize = config[model.res].elements;
            let deltaY = (model.desktop) ? 20 : 10;

            // let gameBG = game.add.graphics(-elSize.width * 2.5, -elSize.height * 1.5, container);
            //     gameBG.beginFill(0x000000, 0.6).drawRect(0, 0, elSize.width * 5, elSize.height * 3 + deltaY);
            // model.el('gameBG', gameBG);
            let gameBG = game.add.sprite(0, config[model.res].gameMachine.y, 'gameBG', null, container);
                gameBG.anchor.set(0.5);
            model.el('gameBG', gameBG);

            let gameMachine = game.add.sprite(0, config[model.res].gameMachine.y, 'gameMachine', null, container);
                gameMachine.anchor.set(0.5);
            model.el('gameMachine', gameMachine);

            let logoGM = game.add.sprite(0, model.el('gameMachine').top, 'logoGM', null, container);
                logoGM.anchor.set(0.5);
            model.el('logoGM', logoGM);

        },

        lineNumbers: function({
            game = model.el('game'),
            container = model.group('numbers'),
            gameMachine = model.el('gameMachine'),
            side = 'left'
        }){
            let x = (side == 'right') ? gameMachine.right - 11 : gameMachine.left + 11;
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

                if(model.state('fs')) {
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
                            lineNumber.frameName = 'line_' + lineNumber.name + '.png',
                            lineNumber.lineShape.destroy();
                        }
                        lineNumber.frameName = 'line_big_' + lineNumber.name + '.png',
                        lineNumber.lineShape = this.lineShape(lineNumber.name);
                    });

                    lineNumber.events.onInputOut.add(() => {
                        if (lineNumber.lineShape) {
                            lineNumber.frameName = 'line_' + lineNumber.name + '.png',
                            lineNumber.lineShape.destroy();
                        }
                    });
                } else {
                    lineNumber.events.onInputDown.add(() => {
                        if (lineNumber.lineShape) {
                            lineNumber.frameName = 'line_' + lineNumber.name + '.png',
                            lineNumber.lineShape.destroy();
                        }
                        lineNumber.frameName = 'line_big_' + lineNumber.name + '.png',
                        lineNumber.lineShape = this.lineShape(lineNumber.name);
                        game.time.events.add(1500, () => {
                            if (lineNumber.lineShape) {
                                lineNumber.frameName = 'line_' + lineNumber.name + '.png',
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

        lineShape: function(number) {
           let game = model.el('game');
           let container = model.group('glistaLight');
           let line = model.data('lines')[number - 1];
           let elSize = config[model.res].elements;
           let lineShape = game.add.graphics(0, 0, container);
           let y = (model.desktop) ? 60 : 30;
           lineShape
               .lineStyle(4, 0xf48725, 0.8)
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
            container.addAt(machineGroup, 2);
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
            let deltaY = (model.desktop) ? 10 : 0;

            let someGraphic = game.add.graphics(-elSize.width * 2.5, -elSize.height * 1.5 + deltaY, machineGroup);
                someGraphic.beginFill(0xffffff).drawRect(0, 0, elSize.width * 5, elSize.height * 3);
            machineGroup.mask = someGraphic;
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

            // let popup = game.add.sprite(
            //     game.width / 2,
            //     game.height / 2,
            //     'popup',
            //     null,
            //     container);
            //     popup.anchor.set(0.5);
            // model.el('popup', popup);

            let boy = game.add.spine(game.width * 0.3, game.height * 0.7, 'boy');
                boy.setAnimationByName(0, 'S4-newone', false);
                boy.addAnimationByName(0, 'S4-idle', true);
                (model.desktop) ? boy.scale.set(0.5) : boy.scale.set(0.3);
                container.add(boy);
            model.el('boy', boy);

            let cleanMessage = message.toLowerCase();
            console.log(cleanMessage);

            let popupText = game.add.bitmapText(game.width * 0.32, game.height * 0.32, 'textGreen', cleanMessage, 60, container);
                popupText.anchor.set(0.5);
                popupText.maxWidth = 500;
                popupText.align = 'center';
                popupText.scale.set(0.1);
                popupText.alpha = 0;
            model.el('popupText', popupText);

            let scaleX = (model.desktop) ? 1.0 : 0.7;
            let scaleY = (model.desktop) ? 1.0 : 0.7;
            game.add.tween(popupText).to({alpha: 1}, 500, 'Linear', true, 700);
            game.add.tween(popupText.scale).to({x: scaleX, y: scaleY}, 1000, Phaser.Easing.Elastic.Out, true, 700);

            // let popupText = game.add.text(
            //     popup.x - 40,
            //     popup.y,
            //     message,
            //     {font: font, fill: color, align: 'center', wordWrap: true, wordWrapWidth: 380, stroke: '#000000', strokeThickness: 3},
            //     container);
            //     popupText.anchor.set(0.5);

            // popup.inputEnabled = true;
            // popup.input.priorityID = 3;
            // popup.events.onInputDown.add(() => {
            //     (balance) ? container.removeAll() : window.location.reload();
            // });

            overlay.inputEnabled = true;
            overlay.input.priorityID = 2;
            overlay.events.onInputDown.add(() => {
                (balance) ? container.removeAll() : window.location.reload();
            });
        },


    };

    return {
        create,
        draw
    };
})();
