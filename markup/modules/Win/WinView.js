import { model } from 'modules/Model/Model';
import { config } from 'modules/Util/Config';
import { Glista } from 'modules/Class/Glista';
import { Element } from 'modules/Class/Element';

import { controller as soundController } from '../../../Info/SoundController';
import { controller as winController } from 'modules/Win/WinController';

export let view = (() => {

    let draw = {

        UpWinContainer: function ({
            container = model.group('winUp')
        }) {
            let elSize = config[model.res].elements;
            let upWheels = [];
            let deltaX = (model.desktop) ? 20 : 10;
            let deltaY = (model.desktop) ? 20 : -10;
            for (let i = 0; i < 5; i++) {
                upWheels.push([]);
                for (let j = 0; j < 3; j++) {
                    let el = new Element({
                        container,
                        position: {
                            x: elSize.width * (i + 0.5 - 2.5) - deltaX,
                            y: elSize.height * (j + 0.5 - 1.5) + deltaY
                        }
                    });
                    el.hide(0);
                    upWheels[i].push(el);
                }
            }
            model.el('upWheels', upWheels);
        },

        TotalWin: function ({
            winTotalData,
            game = model.el('game'),
            container = model.group('winTop')
        }) {
            if (winTotalData === 0) return;
            let winTotal = game.add.sprite(0, (model.mobile) ? -30 : 20, 'winTotal', null, container);
            winTotal.anchor.set(0.5);
            winTotal.scale.set(1.4);

            let winTotalText = game.add.bitmapText(0, (model.mobile) ? -50 : 0, 'numbersFont2', winTotalData, 100, container);
            winTotalText.anchor.set(0.5);
        },

        WinSplash: function ({
            number
        }) {
            let lineNumbersArr = model.el('lineNumbersArr');
            let winSplash = lineNumbersArr.filter((el) => {
                return el.name === number;
            })[0];

            winSplash.alpha = 1;
            winSplash.animations.play('win', 25, false);
            winSplash.animations.getAnimation('win').onComplete.add(() => {
                winSplash.alpha = 0.05;
            });
        },

        WinNumber: function ({number}) {
            if (number < 0) return;
            draw.WinSplash({number, ind: 0});
        },

        WinElements: function ({
            number,
            amount,
            finalScale = (model.desktop) ? 1.3 : 1.5
        }) {

            // Если нам нужно зажечь несколько линий элементов одновременно
            if (typeof number == 'object'
            || typeof amount == 'object') {
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
                    draw.scaleJumping({
                        el: upEl,
                        start: 0.3,
                        finish: finalScale
                    });
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
            let result = { upElements: [], elements: [] };

            number.forEach((currentNumber, indx) => {
                if (currentNumber != -1) {
                    let curLine = lines[currentNumber - 1];
                    for (let i = 0; i < amount[indx]; i++) {
                        let curElement = wheels[i][curLine[i].Y];
                        let curUpElement = upWheels[i][curLine[i].Y];
                        result.upElements.push(curUpElement);
                        result.elements.push(curElement);
                    }
                } else if (model.state('fs')) {
                    wheels.forEach((wheel) => {
                        wheel.forEach((element) => {
                            if (element.active == 14) {
                                result.elements.push(element);
                            }
                        });
                    });
                    upWheels.forEach((upWheel) => {
                        upWheel.forEach((element) => {
                            if (element.active == 14) {
                                result.upElements.push(element);
                            }
                        });
                    });
                } else {
                    wheels.forEach((wheel) => {
                        wheel.forEach((element) => {
                            if (element.active == 10) {
                                result.elements.push(element);
                            }
                        });
                    });
                    upWheels.forEach((upWheel) => {
                        upWheel.forEach((element) => {
                            if (element.active == 10) {
                                result.upElements.push(element);
                            }
                        });
                    });
                    // game.time.events.remove(model.data('oneAfterAnotherTimer'));
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
            game.add.tween(el.group.scale).to({x: finish, y: finish}, 700, Phaser.Easing.Bounce.Out, true)
                .onComplete.add(() => {
                    game.add.tween(el.group.scale).to({x: 1.0, y: 1.0}, 400, 'Linear', true);
                }, this);
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
            if (number < 0) return;
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
                if (glistaDoneCounter == glistaFiredCounter) {
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
            let countValue = line.Count;
            let lineValue = line.Line;
            let currentLineY;
            let x, y;
            // Если обычная линия
            if (!scatter) {
                currentLineY = model.data('lines')[lineValue - 1][countValue - 1].Y;
                if (model.mobile) {
                    x = 192 * (countValue - 0.5) + 120 - gameMachine.width / 2;
                    y = 180 * (currentLineY + 0.5) + 140 - gameMachine.height / 2 - 25;
                } else {
                    x = 256 * (countValue - 0.5) + 150 - gameMachine.width / 2;
                    y = 240 * (currentLineY + 0.5) + 310 - gameMachine.height / 2 - 25;
                }
            }
            // Рассчитываем если скаттер
            if (scatter) {
                let lastWheel = 0;
                let lastElement = 0;
                let wheels = model.el('wheels');
                wheels.forEach((wheel, wheelIndex) => {
                    wheel.elements.forEach((element, elementIndex) => {
                        let name = parseInt(element.sprites[element.active - 1].animations.currentAnim.name, 10);
                        if (name == 10) {
                            if (wheelIndex > lastWheel) {
                                lastWheel = wheelIndex;
                                lastElement = elementIndex;
                            }
                        }
                    });
                });
                if (model.mobile) {
                    x = 192 * (lastWheel + 0.5) + 120 - gameMachine.width / 2;
                    y = 180 * (lastElement + 0.5) + 140 - gameMachine.height / 2 - 25;
                } else {
                    x = 256 * (lastWheel + 0.5) + 150 - gameMachine.width / 2;
                    y = 240 * (lastElement + 0.5) + 310 - gameMachine.height / 2 - 25;
                }
            }

            // Рисуем саму табличку и текст в зависимости от количества символов
            let winBG = game.add.sprite(x, y, 'winLine', null, container);
            winBG.anchor.set(0.5);
            if (model.desktop) {
                winBG.scale.set(1.3);
            }
            let font;
            if (winValue > 999) {
                font = '14px Arial, Helvetica';
            } else if (winValue > 99) {
                font = '18px Arial, Helvetica';
            } else {
                font = '22px Arial, Helvetica';
            }
            let text = game.add.text(x, y + 4, winValue, {font: font, fill: '#fff'}, container);
            text.anchor.set(0.5);

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

        Diver: function ({
            game = model.el('game'),
            el
        }) {
            let container = el.group.parent;
            let diver = game.add.spine(0, el.group.y, 'diverBig');
            if (model.mobile) {
                diver.scale.set(0.75);
            }
            diver.pivot.x = 10;
            diver.pivot.y = -380;
            container.add(diver);
            diver.setAnimationByName(1, '1', true);
            model.el('diver', diver);
        }

    };

    let play = {

        WinSound: function () {
            let winSound = Math.round(Math.random())
            ? soundController.sound.playSound({sound: 'lineWin', duration: 1200})
            : soundController.sound.playSound({sound: 'lineWin2', duration: 1200});
            return winSound;

        }

    };

    let hide = {

        WinTop: function ({
            game = model.el('game'),
            container = model.group('winTop')
        }) {
            return game.add.tween(container).to( { alpha: 0 }, 300, 'Linear', true);
        },

        CroppedDiver: function ({
            wheels = model.el('wheels')
        }) {
            let middleEl;
            wheels.forEach((wheel) => {
                wheel.elements.forEach((el) => {
                    if (el.active == 11
                    || el.active == 12
                    || el.active == 13) {
                        el.hide(0);
                        if (el.active == 12) {
                            middleEl = el;
                        }
                    }
                });
            });
            return middleEl;
        }

    };

    return {
        draw,
        play,
        hide
    };
})();
