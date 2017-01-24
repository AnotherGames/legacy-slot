import { model } from 'modules/Model/Model';
import { config } from 'modules/Util/Config';
import { Glista } from 'modules/Class/Glista';
import { Element } from 'modules/Class/Element';

import { controller as soundController } from 'modules/Sound/SoundController';
import { controller as winController } from 'modules/Win/WinController';
import { controller as fsController } from 'modules/States/FS/FSController';

export let view = (() => {

    let draw = {

        UpWinContainer: function ({
            game = model.el('game'),
            container = model.group('winUp')
        }) {
            let elSize = config[model.res].elements;
            let upElements = [];
            let deltaY = (model.desktop) ? 0 : 50;
            for (var i = 0; i < 5; i++) {
                upElements.push([]);
                for (var j = 0; j < 3; j++) {
                    let el = new Element({
                        container,
                        position: {
                            x: elSize.width * (i + 0.5 - 2.5),
                            y: elSize.height * (j + 0.5 - 1.5) - deltaY
                        }
                    });
                    el.hide(0);
                    upElements[i].push(el);
                }
            }
            model.el('upElements', upElements);
        },

        TotalWin: function ({
            winTotalData,
            game = model.el('game'),
            container = model.group('winTop')
        }) {
            if (winTotalData === 0) return;
            let winTotal = game.add.sprite(0, 20, 'winTotal', null, container);
                winTotal.anchor.set(0.5);
                winTotal.scale.set(1.4);

            let winTotalText = game.add.bitmapText(0, 0, 'numbersFont2', winTotalData, 100, container);
                winTotalText.anchor.set(0.5);
        },

        WinSplash: function ({
            number,
            // ind,
            game = model.el('game'),
            container = model.group('winTop')
        }) {
            let lineNumbersArr = model.el('lineNumbersArr');
            let winSplash = lineNumbersArr.filter((el) => {
                return el.name === number;
            })[0];

            winSplash.visible = true;
            winSplash.animations.play('win');
            winSplash.animations.getAnimation('win').onComplete.add(() => {
                winSplash.visible = false;
            });


            // let rightArr = model.el('rightArr');
            // let winSplashRight = rightArr.filter((el) => {
            //     return el.name === number;
            // })[0];
            //
            // winSplashRight.animations.add('win', Phaser.Animation.generateFrameNames('line_splash-' + number + '_', 1, 8, '.png', 1), 15, false);
            // winSplashRight.animations.play('win');
            // winSplashRight.animations.getAnimation('win').onComplete.add(() => {
            //     winSplashRight.frameName = 'line_splash-' + number + '_8.png';
            // });

        },

        WinNumber: function ({number}) {
            if (number < 0) return;

            draw.WinSplash({number, ind: 0});
            // draw.WinSplash({number, ind: 1});

        },

        WinElements: function ({
            number,
            amount,
            alpha = false,
            finalScale = (model.desktop) ? 1.2 : 1.3,
            wheels = model.el('wheels'),
            upElements = model.el('upElements'),
            game = model.el('game')
        }) {

            wheels.forEach((wheel, wheelIndex) => {
                wheel.elements.forEach((element, elementIndex) => {
                    element.hide(0);
                    upElements[wheelIndex][elementIndex].show();
                    upElements[wheelIndex][elementIndex].playIfNotWin(`${element.active}-n`);
                });
            });

            // Затемняем элементы
            if (alpha) {
                wheels.forEach((wheel) => {
                    wheel.elements.forEach((element) => {
                        element.hide();
                    });
                });
            }

            // Если есть линии
            if (number > 0) {
                let line = model.data('lines')[number - 1];

                for (let col = 0; col < amount; col++) {
                    let upWheelElements = upElements[col];
                    let coord = line[col].Y;
                    let element = upWheelElements[coord];
                        element.win();
                        element.show();
                        element.group.alpha = 1;
                        element.group.scale.set(0.3);

                    game.add.tween(element.group.scale).to({x: finalScale,  y: finalScale}, 700, Phaser.Easing.Bounce.Out, true)
                        .onComplete.add(() => {
                            game.add.tween(element.group.scale).to({x: 1.0,  y: 1.0}, 400, 'Linear', true)
                        }, this);
                }
            // Если есть скаттеры либо элемент фриспинов
            } else {
                wheels.forEach((wheelObj, wheelIndex) => {
                    wheelObj.elements.forEach((wheelElement, elementIndex) => {
                        let elementName = parseInt(wheelElement.sprites[wheelElement.active - 1].animations.currentAnim.name);
                        // Показываем выигрышные скаттеры
                        if (elementName == '10') {
                            let element = upElements[wheelIndex][elementIndex];
                                element.win();
                                element.show();
                                element.group.scale.set(0.3);

                            game.add.tween(element.group.scale).to({x: finalScale,  y: finalScale}, 700, Phaser.Easing.Bounce.Out, true)
                                .onComplete.add(() => {
                                    game.add.tween(element.group.scale).to({x: 1.0,  y: 1.0}, 400, 'Linear', true)
                                }, this);
                            // Очищаем поле вручную так как нет глисты которая чистит автоматом
                            game.time.events.add(1000, () => {
                                winController.cleanWin();
                            });

                        }
                        // Если выпали пули на фри-спинах
                        if (elementName == '11') {

                            // Берем пулю с верхнего экрана
                            let bullet = upElements[wheelIndex][elementIndex];
                                bullet.win();
                            // Записываем ее начальные координаты (нам нужно будет вернуть ее обратно)
                            // let bulletX = bullet.group.x;
                            // let bulletY = bullet.group.y;
                            //
                            // let x = (model.desktop) ? 0 : -550;
                            // let y = (model.desktop) ? 500 : -50;
                            // game.add.tween(bullet.group).to({x: x, y: y, alpha: 0.3}, 500, 'Linear', true);
                            // game.add.tween(bullet.group.scale).to({x: 0.2, y: 0.2}, 500, 'Linear', true)
                            //     .onComplete.add(() => {
                            //         bullet.group.alpha = 0;
                            //         bullet.group.x = bulletX;
                            //         bullet.group.y = bulletY;
                            //         game.add.tween(bullet.group).to({alpha: 1}, 400, 'Linear', true);
                            //         game.add.tween(bullet.group.scale).to({x: 1, y: 1}, 400, 'Linear', true)
                            //         bullet.normal();
                            //         fsController.bullet(bullet.group);
                            //     });
                        }
                    });
                });
            }
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

        WinLineTable: function({
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
                    x = 192 * (countValue - 0.5) + 165 - gameMachine.width / 2;
                    y = 180 * (currentLineY + 0.5) + 125 - gameMachine.height / 2 - 25;
                } else {
                    x = 256 * (countValue - 0.5) + 200 - gameMachine.width / 2;
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
                        let name = parseInt(element.sprites[element.active - 1]
                                    .animations.currentAnim.name);
                        if (name == 10) {
                            if (wheelIndex > lastWheel) {
                                lastWheel = wheelIndex;
                                lastElement = elementIndex;
                            }
                        }
                    });
                });
                if (model.mobile) {
                    x = 192 * (lastWheel + 0.5) + 165 - gameMachine.width / 2;
                    y = 180 * (lastElement + 0.5) + 125 - gameMachine.height / 2 - 25;
                } else {
                    x = 256 * (lastWheel + 0.5) + 200 - gameMachine.width / 2;
                    y = 240 * (lastElement + 0.5) + 310 - gameMachine.height / 2 - 25;
                }
            }

            // Рисуем саму табличку и текст в зависимости от количества символов
            let winBG = game.add.sprite(x, y, 'winLine', null, container);
                winBG.anchor.set(0.5);
            let font;
            if (winValue > 999) {
                font = '15px Arial, Helvetica';
            } else if (winValue > 99) {
                font = '18px Arial, Helvetica';
            } else {
                font = '25px Arial, Helvetica';
            }
            let text = game.add.text(x, y + 2, winValue, {font: font, fill: '#fff'}, container);
                text.anchor.set(0.5);

        }

    };

    let play = {

        WinSound: function() {
            // let winSound = Math.round(Math.random())
            // ? soundController.sound.playSound('lineWin', 1000)
            // : soundController.sound.playSound('lineWin2', 1000);
            // return winSound;
            let game = model.el('game');
            soundController.sound.playSound({sound: 'lineWin', duration: 1000});
            game.time.events.add(300, () => {
                soundController.sound.playSound({sound: 'lineWin2', duration: 1000});
            });
        }

    };

    let hide = {

        WinTop: function({
            game = model.el('game'),
            container = model.group('winTop')
        }) {
            return game.add.tween(container).to( { alpha: 0 }, 300, 'Linear', true);
        }

    };

    return {
        draw,
        play,
        hide
    };
})();
