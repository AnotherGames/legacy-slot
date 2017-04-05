import { model } from 'modules/Model/Model';
import { config } from 'modules/Util/Config';
import { Glista } from 'modules/Class/Glista';
import { Element } from 'modules/Class/Element';

import { view as mainView } from 'modules/States/Main/MainView';

import { controller as soundController } from '../../../Info/SoundController';
import { controller as winController } from 'modules/Win/WinController';

export let view = (() => {

    let draw = {

        UpWinContainer: function ({
            game = model.el('game'),
            container = model.group('winUp')
        }) {
            let elSize = config[model.res].elements;
            let upWheels = [];
            upWheels.containers = [];
            let deltaY = (model.desktop) ? 0 : 20;
            for (let i = 0; i < 5; i++) {
                upWheels.push([]);
                let currentContainer = game.add.group();
                for (let j = 0; j < 3; j++) {
                    let el = new Element({
                        container: currentContainer,
                        position: {
                            x: elSize.width * (i + 0.5 - 2.5),
                            y: elSize.height * (j + 0.5 - 1.5) - deltaY
                        }
                    });
                    el.hide(0);
                    upWheels[i].push(el);
                }
                upWheels.containers.push(currentContainer);
                container.add(currentContainer);
            }
            model.el('upWheels', upWheels);
        },

        TotalWin: function ({
            winTotalData,
            game = model.el('game'),
            container = model.group('winTop'),
            style = {
                font: '90px Helvetice, Arial',
                fill: '#e1b249',
                align: 'center',
                stroke: '#000000',
                strokeThickness: 2
            },
            style2 = {
                font: '40px Helvetice, Arial',
                fill: '#ffffff',
                align: 'center',
                stroke: '#000000',
                strokeThickness: 2
            }
        }) {
            if (winTotalData === 0) {
                return;
            }
            if (model.state('balance') === 'cash') {
                winTotalData = `${model.balance('currencySymbol')} ${(model.balance('coinValue') * winTotalData).toFixed(2)}`;
            }

            let winTotal = game.add.sprite(0, 0, 'winTotal', null, container);
            winTotal.anchor.set(0.5);

            let fontSize = (model.desktop) ? 30 : 20;
            let winTotalText = game.add.bitmapText(0, 20, 'numbersFont', winTotalData + '', fontSize, container);
            winTotalText.anchor.set(0.5);

            // small table
            if (!model.state('fs') && model.desktop) {
                let winTotalSmall = game.add.sprite(model.group('panel').width / 2, 100, 'deskButtons', 'win.png');
                winTotalSmall.anchor.set(0.5);
                winTotalSmall.alpha = 0;
                model.group('panel').addAt(winTotalSmall, 2);

                let winTotalTextSmall = game.add.text(model.group('panel').width / 2, 120, winTotalData, style2);
                winTotalTextSmall.anchor.set(0.5);
                winTotalTextSmall.alpha = 0;
                model.group('panel').addAt(winTotalTextSmall, 3);

                model.el('winTotalSmall', winTotalSmall);
                model.el('winTotalTextSmall', winTotalTextSmall);

                game.add.tween(winTotalSmall).to({ alpha: 1, y: 0 }, 300, 'Linear', true);
                game.add.tween(winTotalTextSmall).to({ alpha: 1, y: 15 }, 300, 'Linear', true);

            }

        },

        WinSplash: function ({
            number,
            ind,
            game = model.el('game')
        }) {

            mainView.draw.lightWin({});
            mainView.draw.showFlag({number: number});

        },

        WinNumber: function ({
            number
        }) {
            if (number < 0) return;
            draw.WinSplash({
                number,
                ind: 0
            });
        },

        WinElements: function ({
            number,
            amount
        }) {

            // Если нам нужно зажечь несколько линий элементов одновременно
            if (typeof number == 'object' ||
                typeof amount == 'object') {
                let winElements = draw.findElements({
                    number,
                    amount
                });
                model.el('winElements', winElements);
                winElements.elements.forEach((el) => {
                    el.hide(0);
                });
                winElements.upElements.forEach((upEl) => {
                    upEl.show();
                    upEl.win();
                });
                return;
            }

        },

        findElements: function ({
            number,
            amount,
            game = model.el('game')
        }) {
            let lines = model.data('lines');
            let upWheels = model.el('upWheels');
            let wheels = model.el('wheels').map((wheel) => {
                return wheel.elements;
            });
            let result = {
                upElements: [],
                elements: []
            };

            number.forEach((curNumber, indx) => {
                if (curNumber !== -1) {
                    let curLine = lines[curNumber - 1];
                    for (let i = 0; i < amount[indx]; i++) {
                        let curElement = wheels[i][curLine[i].Y];
                        let curUpElement = upWheels[i][curLine[i].Y];
                        result.upElements.push(curUpElement);
                        result.elements.push(curElement);
                    }
                } else {
                    game.time.events.remove(model.data('oneAfterAnotherTimer'));
                }
            });
            return result;
        },

        scaleJumping: function ({
            game = model.el('game'),
            el,
            start,
            finish
        }) {
            el.group.scale.set(start);
            game.add.tween(el.group.scale).to({
                x: finish,
                y: finish
            }, 700, Phaser.Easing.Bounce.Out, true)
            .onComplete.add(() => {
                game.add.tween(el.group.scale).to({
                    x: 1.0,
                    y: 1.0
                }, 400, 'Linear', true);
            }, this);
        },

        copyFinishScreenToUpWheels: function ({
            finishScreen = model.data('finishScreen'),
            upWheels = model.el('upWheels')
        }) {
            upWheels.forEach((wheel, wheelIndex) => {
                wheel.forEach((el, elIndex) => {
                    let curEl = finishScreen[wheelIndex][elIndex + 1];
                    el.play(`${curEl}-n`);
                });
            });
        },

        WinGlista: function ({
            number,
            game = model.el('game'),
            glistaLightContainer = model.group('glistaLight'),
            glistaContainer = model.group('glista'),
            glistaFiredCounter = +model.data('glistaFiredCounter'),
            glistaDoneCounter = +model.data('glistaDoneCounter'),
            time = 1000
        }) {
            if (number < 0) {
                return;
            }
            // Для каждой линии отрисовуем глисту
            let glista = new Glista({
                game,
                lightParent: glistaLightContainer,
                parent: glistaContainer,
                elSize: config[model.res].elements
            });
            // Обновляем счетчик запущенных глист
            glistaFiredCounter++;
            model.data('glistaFiredCounter', glistaFiredCounter);
            // Создаем массив координат для пробега глистой
            let glistaMas = [];
            let line = model.data('lines')[number - 1];
            line.forEach((coord) => {
                glistaMas.push(coord.Y);
            });

            // Запускаем глисту
            glista.start(glistaMas, time, () => {
                // По окончании пути глиста удалится
                glista.remove();
                glistaDoneCounter++;
                model.data('glistaDoneCounter', glistaDoneCounter);
                // Если пришли все запущенные глисты, то очищаем выигрышный экран
                if (glistaDoneCounter === glistaFiredCounter) {
                    winController.cleanWin();
                }

            });

            return glista;
        },

        WinLineTable: function ({
            line,
            scatter,
            container = model.group('winTop'),
            game = model.el('game')
        }) {
            let gameMachine = model.el('gameMachine');
            let winValue = line.Win;
            if (winValue === 0) {
                return;
            }
            let countValue = line.Count;
            let lineValue = line.Line;
            let currentLineY;
            let x, y;
            // Если обычная линия
            if (!scatter) {
                currentLineY = model.data('lines')[lineValue - 1][countValue - 1].Y;
                if (model.mobile) {
                    x = 192 * (countValue - 0.5) + 105 - gameMachine.width / 2;
                    y = 180 * (currentLineY + 0.5) + 125 - gameMachine.height / 2 - 25;
                } else {
                    x = 256 * (countValue - 0.5) + 140 - gameMachine.width / 2;
                    y = 240 * (currentLineY + 0.5) + 130 - gameMachine.height / 2;
                }
            }
            // Рассчитываем если скаттер
            if (scatter) {
                let lastWheel = 0;
                let lastElement = 0;
                let wheels = model.el('wheels');
                wheels.forEach((wheel, wheelIndex) => {
                    wheel.elements.forEach((element, elementIndex) => {
                        let name = parseInt(element.sprites[element.active - 1]
                            .animations.currentAnim.name);
                        if (name === 10) {
                            if (wheelIndex > lastWheel) {
                                lastWheel = wheelIndex;
                                lastElement = elementIndex;
                            }
                        }
                    });
                });
                if (model.mobile) {
                    x = 192 * (lastWheel + 0.5) + 105 - gameMachine.width / 2;
                    y = 180 * (lastElement + 0.5) + 125 - gameMachine.height / 2 - 25;
                } else {
                    x = 256 * (lastWheel + 0.5) + 140 - gameMachine.width / 2;
                    y = 240 * (lastElement + 0.5) + 130 - gameMachine.height / 2 - 25;
                }
            }

            // Рисуем саму табличку и текст в зависимости от количества символов
            let winBG = game.add.sprite(x - 5, y + 5, 'winLine', null, container);
            winBG.anchor.set(0.5);
            let font;
            if (winValue > 999) {
                font = '14px Arial, Helvetica';
            } else if (winValue > 99) {
                font = '18px Arial, Helvetica';
            } else {
                font = '26px Arial, Helvetica';
            }
            let text = game.add.text(x - 7, y + 7, winValue, {
                font: font
            }, container);
            text.anchor.set(0.5);

            let grd = text.context.createLinearGradient(0, 0, 0, text.canvas.height);
            grd.addColorStop(0, '#ffffff');
            grd.addColorStop(1, '#eeeeee');
            text.fill = grd;

        }

        // addBigBottleToStage: function (fsLevelNumber) {
        //     let game = model.el('game');
        //     let wheels = model.el('wheels');
        //     let container = model.group('winUp');
        //
        //     let bottle1, bottle2, bottle3;
        //     let bottleBG1, bottleBG2, bottleBG3;
        //     let bottleContainer1, bottleContainer2, bottleContainer3;
        //
        //     switch (+fsLevelNumber) {
        //         case 1:
        //             bottleContainer1 = draw.addBottleContainer(+fsLevelNumber).bottleContainer1;
        //             bottleBG1 = draw.addBottleBG(bottleContainer1, wheels[0].elements[1]);
        //
        //             bottle1 = game.add.spine(0, 70, 'bottle');
        //             draw.playBottleAnim(bottle1, wheels[0].elements[1]);
        //
        //             draw.hideWheels([0]);
        //             break;
        //
        //         case 2:
        //             bottleContainer1 = draw.addBottleContainer(+fsLevelNumber).bottleContainer1;
        //             bottleBG1 = draw.addBottleBG(bottleContainer1, wheels[2].elements[1]);
        //
        //             bottle1 = game.add.spine(0, 70, 'bottle');
        //             draw.playBottleAnim(bottle1, wheels[2].elements[1]);
        //
        //             draw.hideWheels([2]);
        //             break;
        //         case 3:
        //             bottleContainer1 = draw.addBottleContainer(+fsLevelNumber).bottleContainer1;
        //             bottleBG1 = draw.addBottleBG(bottleContainer1, wheels[4].elements[1]);
        //
        //             bottle1 = game.add.spine(0, 70, 'bottle');
        //             draw.playBottleAnim(bottle1, wheels[4].elements[1]);
        //
        //             draw.hideWheels([4]);
        //             break;
        //         case 4:
        //             bottleContainer1 = draw.addBottleContainer(+fsLevelNumber).bottleContainer1;
        //             bottleContainer2 = draw.addBottleContainer(+fsLevelNumber).bottleContainer2;
        //
        //             bottleBG1 = draw.addBottleBG(bottleContainer1, wheels[0].elements[1]);
        //             bottleBG2 = draw.addBottleBG(bottleContainer2, wheels[2].elements[1]);
        //
        //             bottle1 = game.add.spine(0, 70, 'bottle');
        //             bottle2 = game.add.spine(0, 70, 'bottle');
        //
        //             draw.playBottleAnim(bottle1, wheels[0].elements[1]);
        //             draw.playBottleAnim(bottle2, wheels[2].elements[1]);
        //
        //             draw.hideWheels([0, 2]);
        //             break;
        //         case 5:
        //             bottleContainer1 = draw.addBottleContainer(+fsLevelNumber).bottleContainer1;
        //             bottleContainer2 = draw.addBottleContainer(+fsLevelNumber).bottleContainer2;
        //             bottleBG1 = draw.addBottleBG(bottleContainer1, wheels[2].elements[1]);
        //             bottleBG2 = draw.addBottleBG(bottleContainer2, wheels[4].elements[1]);
        //
        //             bottle1 = game.add.spine(0, 70, 'bottle');
        //             bottle2 = game.add.spine(0, 70, 'bottle');
        //             draw.playBottleAnim(bottle1, wheels[2].elements[1]);
        //             draw.playBottleAnim(bottle2, wheels[4].elements[1]);
        //
        //             draw.hideWheels([2, 4]);
        //             break;
        //         case 6:
        //             bottleContainer1 = draw.addBottleContainer(+fsLevelNumber).bottleContainer1;
        //             bottleContainer2 = draw.addBottleContainer(+fsLevelNumber).bottleContainer2;
        //             bottleBG1 = draw.addBottleBG(bottleContainer1, wheels[0].elements[1]);
        //             bottleBG2 = draw.addBottleBG(bottleContainer2, wheels[4].elements[1]);
        //
        //             bottle1 = game.add.spine(0, 70, 'bottle');
        //             bottle2 = game.add.spine(0, 70, 'bottle');
        //             draw.playBottleAnim(bottle1, wheels[0].elements[1]);
        //             draw.playBottleAnim(bottle2, wheels[4].elements[1]);
        //
        //             draw.hideWheels([0, 4]);
        //             break;
        //         case 7:
        //             bottleContainer1 = draw.addBottleContainer(+fsLevelNumber).bottleContainer1;
        //             bottleContainer2 = draw.addBottleContainer(+fsLevelNumber).bottleContainer2;
        //             bottleContainer3 = draw.addBottleContainer(+fsLevelNumber).bottleContainer3;
        //             bottleBG1 = draw.addBottleBG(bottleContainer1, wheels[0].elements[1]);
        //             bottleBG2 = draw.addBottleBG(bottleContainer2, wheels[2].elements[1]);
        //             bottleBG3 = draw.addBottleBG(bottleContainer3, wheels[4].elements[1]);
        //
        //             bottle1 = game.add.spine(0, 70, 'bottle');
        //             bottle2 = game.add.spine(0, 70, 'bottle');
        //             bottle3 = game.add.spine(0, 70, 'bottle');
        //             draw.playBottleAnim(bottle1, wheels[0].elements[1]);
        //             draw.playBottleAnim(bottle2, wheels[2].elements[1]);
        //             draw.playBottleAnim(bottle3, wheels[4].elements[1]);
        //
        //             draw.hideWheels([0, 2, 4]);
        //             break;
        //         default:
        //
        //     }
        //     if (bottle1) {
        //         bottleContainer1.add(bottle1);
        //         model.el('bottleContainer1', bottleContainer1);
        //         bottleContainer1.alpha = 0;
        //         game.add.tween(bottleContainer1).to({
        //             alpha: 1
        //         }, 1000, 'Linear', true);
        //         container.addAt(bottleContainer1, 0);
        //         soundController.sound.playSound({sound: 'gaz'});
        //
        //         if (model.desktop) {
        //             draw.addBubbles({
        //                 bottle: bottleBG1,
        //                 container: bottleContainer1
        //             });
        //         }
        //     }
        //
        //     if (bottle2) {
        //         bottleContainer2.add(bottle2);
        //         model.el('bottleContainer2', bottleContainer2);
        //         bottleContainer2.alpha = 0;
        //         game.add.tween(bottleContainer2).to({
        //             alpha: 1
        //         }, 1000, 'Linear', true);
        //         container.addAt(bottleContainer2, 1);
        //         soundController.sound.playSound({sound: 'gaz'});
        //
        //         if (model.desktop) {
        //             draw.addBubbles({
        //                 bottle: bottleBG1,
        //                 container: bottleContainer1
        //             });
        //         }
        //     }
        //
        //     if (bottle3) {
        //         bottleContainer3.add(bottle3);
        //         model.el('bottleContainer3', bottleContainer3);
        //         bottleContainer3.alpha = 0;
        //         game.add.tween(bottleContainer3).to({
        //             alpha: 1
        //         }, 1000, 'Linear', true);
        //         container.addAt(bottleContainer3, 2);
        //         soundController.sound.playSound({sound: 'gaz'});
        //
        //         if (model.desktop) {
        //             draw.addBubbles({
        //                 bottle: bottleBG1,
        //                 container: bottleContainer1
        //             });
        //         }
        //     }
        //
        // },

        // hideWheels: function (array) {
        //     let game = model.el('game');
        //     let wheels = model.el('wheels');
        //     let upWheels = model.el('upWheels');
        //     array.forEach((item) => {
        //         upWheels.containers[item].visible = false;
        //         game.add.tween(wheels[item].container).to({
        //             alpha: 0
        //         }, 1000, 'Linear', true);
        //     });
        // },
        //
        // addBottleContainer: function (fsLevelNumber) {
        //
        //     let bottleContainer1, bottleContainer2, bottleContainer3;
        //     let x = (model.desktop) ? 512 : 384;
        //
        //     switch (+fsLevelNumber) {
        //         case 1:
        //             bottleContainer1 = draw.createBottleContainer(-x);
        //
        //             return {
        //                 bottleContainer1
        //             };
        //         case 2:
        //             bottleContainer1 = draw.createBottleContainer(0);
        //
        //             return {
        //                 bottleContainer1
        //             };
        //         case 3:
        //             bottleContainer1 = draw.createBottleContainer(x);
        //
        //             return {
        //                 bottleContainer1
        //             };
        //         case 4:
        //             bottleContainer1 = draw.createBottleContainer(-x);
        //             bottleContainer2 = draw.createBottleContainer(0);
        //
        //             return {
        //                 bottleContainer1,
        //                 bottleContainer2
        //             };
        //         case 5:
        //             bottleContainer1 = draw.createBottleContainer(0);
        //             bottleContainer2 = draw.createBottleContainer(x);
        //
        //             return {
        //                 bottleContainer1,
        //                 bottleContainer2
        //             };
        //         case 6:
        //             bottleContainer1 = draw.createBottleContainer(-x);
        //             bottleContainer2 = draw.createBottleContainer(x);
        //
        //             return {
        //                 bottleContainer1,
        //                 bottleContainer2
        //             };
        //         case 7:
        //             bottleContainer1 = draw.createBottleContainer(-x);
        //             bottleContainer2 = draw.createBottleContainer(0);
        //             bottleContainer3 = draw.createBottleContainer(x);
        //
        //             return {
        //                 bottleContainer1,
        //                 bottleContainer2,
        //                 bottleContainer3
        //             };
        //         default:
        //     }
        // },
        //
        // createBottleContainer: function (x) {
        //     let game = model.el('game');
        //     let deltaY = (model.desktop) ? 10 : 0;
        //     let elSize = config[model.res].elements;
        //     let bottleContainer = game.add.group();
        //
        //     let someGraphic = game.add.graphics(-elSize.width * 0.5, -elSize.height * 1.5 + deltaY, bottleContainer);
        //     someGraphic.beginFill(0xffffff).drawRect(0, 0, elSize.width * 1, elSize.height * 3);
        //
        //     bottleContainer.mask = someGraphic;
        //     bottleContainer.x = x;
        //
        //     return bottleContainer;
        // },
        //
        // addBottleBG: function (container, element) {
        //     let bottleBG;
        //     let game = model.el('game');
        //     let y = (model.desktop) ? 12 : 2;
        //     if (element.active === 10) {
        //         bottleBG = game.add.sprite(0, y, 'green', null, container);
        //     }
        //     if (element.active === 13) {
        //         bottleBG = game.add.sprite(0, y, 'red', null, container);
        //     }
        //     if (element.active === 16) {
        //         bottleBG = game.add.sprite(0, y, 'orange', null, container);
        //     }
        //     bottleBG.anchor.set(0.5);
        //     return bottleBG;
        // },
        //
        // addBubbles: function ({
        //     game = model.el('game'),
        //     container = model.group('bottle'),
        //     bottle = model.el('bottleBG')
        // }) {
        //     let emitter = game.add.emitter(bottle.x, game.height, 1800);
        //     container.addAt(emitter, 2);
        //     emitter.makeParticles('bubble');
        //     emitter.width = bottle.width;
        //     // console.log(container);
        //
        //     emitter.setRotation(0, 0);
        //     emitter.setAlpha(0.1, 1, 3000);
        //     emitter.minParticleScale = 0.1;
        //     emitter.maxParticleScale = 0.4;
        //     emitter.setYSpeed(20, 60);
        //     emitter.gravity = -200;
        //
        //     emitter.start(false, 7000, 10);
        //
        //     let emitter2 = game.add.emitter(bottle.x, game.height, 100);
        //     container.addAt(emitter2, 4);
        //     emitter2.makeParticles('bubble');
        //     emitter2.width = bottle.width;
        //
        //     emitter2.setRotation(0, 0);
        //     emitter2.setAlpha(0.1, 1, 3000);
        //     emitter2.minParticleScale = 0.3;
        //     emitter2.maxParticleScale = 0.6;
        //     emitter2.setYSpeed(10, 30);
        //     emitter2.gravity = -200;
        //
        //     emitter2.start(false, 7000, 60);
        // },
        //
        // playBottleAnim: function (bottle, element) {
        //     if (model.mobile) {
        //         bottle.scale.set(0.75);
        //     }
        //     if (element.active === 10) {
        //         bottle.setAnimationByName(0, 'bang1_g', false);
        //         bottle.addAnimationByName(0, 'open_g', false);
        //         bottle.addAnimationByName(0, 'pena_idle_g', true);
        //     }
        //     if (element.active === 13) {
        //         bottle.setAnimationByName(0, 'bang1_r', false);
        //         bottle.addAnimationByName(0, 'open_r', false);
        //         bottle.addAnimationByName(0, 'pena_idle_r', true);
        //     }
        //     if (element.active === 16) {
        //         bottle.setAnimationByName(0, 'bang1_y', false);
        //         bottle.addAnimationByName(0, 'open_y', false);
        //         bottle.addAnimationByName(0, 'pena_idle_y', true);
        //     }
        //
        // },
        //
        // hideBottle: function () {
        //     let bottleContainer1 = model.el('bottleContainer1');
        //     let bottleContainer2 = model.el('bottleContainer2');
        //     let bottleContainer3 = model.el('bottleContainer3');
        //     bottleContainer1.removeAll();
        //     if (bottleContainer2) {
        //         bottleContainer2.removeAll();
        //     }
        //     if (bottleContainer3) {
        //         bottleContainer3.removeAll();
        //     }
        //
        //     let array = [0, 2, 4];
        //
        //     let game = model.el('game');
        //     let wheels = model.el('wheels');
        //     let upWheels = model.el('upWheels');
        //     array.forEach((item) => {
        //         upWheels.containers[item].visible = true;
        //         game.add.tween(wheels[item].container).to({
        //             alpha: 1
        //         }, 1000, 'Linear', true);
        //     });
        // }

    };

    let play = {

        WinSound: function () {
            let winSound = Math.round(Math.random()) ?
                soundController.sound.playSound({
                    sound: 'lineWin',
                    duration: 1200
                }) :
                soundController.sound.playSound({
                    sound: 'lineWin2',
                    duration: 1200
                });
            return winSound;

        }

    };

    let hide = {

        WinTop: function ({
            game = model.el('game'),
            container = model.group('winTop')
        }) {
            return game.add.tween(container).to({
                alpha: 0
            }, 150, 'Linear', true);
        },

        Aim: function ({
            game = model.el('game'),
            container = model.group('aim'),
            shurikenDarkness = model.el('shurikenDarkness'),
            cb = false
        }) {
            game.add.tween(container)
                .to({
                    y: -800
                }, 800, Phaser.Easing.Back.In, true)
                .onComplete.add(() => {
                    container.y = 0;
                    if (cb) {
                        cb();
                    }
                });

            game.add.tween(shurikenDarkness)
                .to({
                    alpha: 0
                }, 800, 'Linear', true)
                .onComplete.add(() => {
                    shurikenDarkness.destroy();
                    container.removeAll();
                });
        }

    };

    return {
        draw,
        play,
        hide
    };
})();
