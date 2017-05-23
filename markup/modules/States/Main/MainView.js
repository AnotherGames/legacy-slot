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

            } else {
                mainBG = game.add.tileSprite(0, 0, game.width, game.height, 'gradientLine', null, container);

                let luchi = game.add.sprite(game.world.centerX, game.world.centerY, 'shine', null, container);
                luchi.anchor.set(0.5);
                game.add.tween(luchi).to({rotation: 2 * Math.PI, alpha: 0.1}, 30000, 'Linear', true, 0, -1, true);
            }

        },

        changeBG: function ({
            game = model.el('game'),
            container = model.group('bg'),
            index = 4
        }) {
            let mainBG = model.el('mainBG');
            mainBG.setAnimationByName(0, 'move' + index, true);
        },

        addBalloons: function ({
            game = model.el('game'),
            container = model.group('bg')
        }) {
            let balloons = game.add.sprite(100, game.height + 500, 'balloons', null, container);
            balloons.anchor.set(0.5);

            let side = game.rnd.integerInRange(0, 1) ? 'left' : 'right';
            let deltaX;
            if (side === 'left') {
                balloons.x = game.rnd.integerInRange(100, 400);
                deltaX = balloons.x + 300;
            } else {
                let random = game.rnd.integerInRange(7, 9) / 10;
                balloons.x = game.width * random;
                deltaX = balloons.x - 300;
            }

            game.add.tween(balloons).to({y: -500, x: deltaX}, 10000, 'Linear', true)
                .onComplete.add(() => {
                    balloons.destroy();
                }, this);

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
                // console.log(side);
                if (model.desktop) {
                    cloud.y = cloud.y = cloud.y + game.rnd.integerInRange(20, 350) + 80;
                } else {
                    cloud.y = cloud.y = cloud.y + game.rnd.integerInRange(20, 250) + 50;
                }
                cloud.x = x;

                if (container === model.group('bg')) {
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

            let side = game.rnd.integerInRange(0, 1) ? 'left' : 'right';
            let deltaX;
            if (side === 'left') {
                confetti.x = game.rnd.integerInRange(100, 600);
                deltaX = confetti.x + 300;
            } else {
                let random = game.rnd.integerInRange(6, 9) / 10;
                confetti.x = game.width * random;
                deltaX = confetti.x - 300;
            }

            game.add.tween(confetti).to({y: game.height + 500, x: deltaX}, 10000, 'Linear', true, 2000)
                .onComplete.add(() => {
                    confetti.destroy();
                }, this);

            let rnd = game.rnd.integerInRange(10, 15);
            game.time.events.add(rnd * 1000, () => {
                draw.addConfetti({});
            });
        },

        addCat: function ({
            game = model.el('game'),
            container = model.group('bg')
        }) {
            let i = game.rnd.integerInRange(3, 9) / 10;
            let cat = game.add.spine(0, game.height * i, 'cat');
            container.add(cat);
            if (model.mobile) {
                cat.scale.set(0.66);
            }
            if (model.state('fs')) {
                cat.alpha = 0;
            } else {
                cat.alpha = 1;
            }
            cat.setAnimationByName(0, 'run', true);
            model.el('cat', cat);

            let side = game.rnd.integerInRange(0, 1) ? 'left' : 'right';
            let delay = game.rnd.integerInRange(5000, 10000);
            let delay2 = game.rnd.integerInRange(3000, 6000);
            let rnd = game.rnd.integerInRange(2, 4);
            let deltaX, deltaX2;

            if (side === 'left') {
                cat.x = -500;
                deltaX = game.width * 0.05;
                deltaX2 = game.width + 500;
            } else {
                cat.x = game.width + 500;
                deltaX = game.width * 0.95;
                deltaX2 = -500;
                cat.scale.set(-1, 1);
            }

            game.add.tween(cat).to({x: deltaX}, 10000, 'Linear', true, delay)
                .onComplete.add(() => {
                    cat.setAnimationByName(0, rnd + '', false);
                    cat.addAnimationByName(0, 'run', true);
                    if (!model.state('fs')) {
                        soundController.sound.playSound({sound: 'cat'});
                    }
                    game.add.tween(cat).to({x: deltaX2}, 10000, 'Linear', true, delay2)
                        .onComplete.add(() => {
                            cat.destroy();
                            draw.addCat({});
                        }, this);
                }, this);
        },

        addCat2: function ({
            game = model.el('game'),
            container = model.group('bg')
        }) {
            if (model.el('cat')) {
                let cat = model.el('cat');
                game.add.tween(cat).to({alpha: 0, y: -500}, 1500, 'Linear', true);
            }

            let i = game.rnd.integerInRange(3, 8) / 10;
            let cat2 = game.add.sprite(0, game.height * i, 'cat2', null, container);
            cat2.animations.add('slow', Phaser.Animation.generateFrameNames('skeleton-slow_', 0, 30, '.png', 1), 30, true);
            cat2.animations.add('fast', Phaser.Animation.generateFrameNames('skeleton-fast_', 0, 30, '.png', 1), 120, true);
            cat2.animations.play('fast');
            model.el('cat2', cat2);

            motionPath.motion.addPath({
                name: 'cat2',
                randomY: true,
                anim: cat2,
                speed: 10,
                randomSide: true,
                rotation: true,
                repeat: true,
            });
        },

        addBurst: function ({
            game = model.el('game'),
            container = model.group('bg')
        }) {
            let emitter = game.add.emitter(game.world.centerX, game.world.centerY + 100, 20);
            model.el('emitter', emitter);

            emitter.makeParticles('trash', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19], 500, true, false);
            container.add(emitter);

            emitter.minParticleSpeed.setTo(-1000, -5000);
            emitter.maxParticleSpeed.setTo(1000, -2000);
            emitter.minParticleScale = 0.4;
            emitter.maxParticleScale = 0.8;
            emitter.gravity = 5000;
            emitter.bounce.setTo(0.5, 0.5);
            emitter.angularDrag = 30;

            let emitterFrequency = (model.desktop) ? 200 : 40;

            emitter.start(true, 0, null, emitterFrequency, true);
        },

        addTrash: function ({
            game = model.el('game'),
            container = model.group('bg')
        }) {
            let emitterTrash = game.add.emitter(game.world.centerX, game.world.centerY + 100);
            model.el('emitterTrash', emitterTrash);

            emitterTrash.makeParticles('trash', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19], 50, true, true);
            container.add(emitterTrash);

            emitterTrash.minParticleSpeed.setTo(-1200, -1300);
            emitterTrash.maxParticleSpeed.setTo(1200, -1400);
            emitterTrash.minParticleScale = 0.4;
            emitterTrash.maxParticleScale = 0.8;
            emitterTrash.gravity = 150;
            emitterTrash.bounce.setTo(0.5, 0.5);
            emitterTrash.angularDrag = 30;

            emitterTrash.start(false, 3000, 60);

        },

        removeTrash: function () {
            let emitterTrash = model.el('emitterTrash');
            emitterTrash.destroy();
        },

        mainContainer: function ({
            game = model.el('game'),
            container = model.group('main')
        }) {
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

            let someGraphic = game.add.graphics(-elSize.width * 2.5 - 500, -elSize.height * 1.5 + deltaY, machineGroup);
            someGraphic.beginFill(0xffffff).drawRect(0, 0, elSize.width * 5 + 1500, elSize.height * 3);
            machineGroup.mask = someGraphic;
        }
    };

    return {
        create,
        draw
    };
})();
