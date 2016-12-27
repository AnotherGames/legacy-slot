import { model } from 'modules/Model/Model';
import { config } from 'modules/Util/Config';
import { request } from 'modules/Util/Request';
import { Glista } from 'modules/Class/Glista';

import { controller as soundController } from 'modules/Sound/SoundController';
import { controller as winController } from 'modules/Win/WinController';
import { controller as fsController } from 'modules/States/FS/FSController';

export let view = (() => {

    let draw = {

        TotalWin: function ({
            winTotalData,
            fs = false,
            game = model.el('game'),
            container = model.group('winTop'),
            style = {font: '62px Helvetice, Arial', fill: '#fff', align: 'center', stroke: '#000000', strokeThickness: 2}
        }) {
            if (winTotalData === 0) return;
            if (fs) {
                let winTotal = game.add.sprite(6, 0, 'winTotalFS', null, container);
                    winTotal.anchor.set(0.5, 0.63);
            } else {
                let winTotal = game.add.sprite(6, 0, 'winTotal', null, container);
                    winTotal.anchor.set(0.5);
            }

            let winTotalText = game.add.text(0, 0, winTotalData, style, container);
                winTotalText.anchor.set(0.5);

        },

        WinSplash: function ({
            number,
            ind,
            game = model.el('game'),
            container = model.group('winTop')
        }) {
            let leftArr = model.el('leftArr');
            let winNumber = leftArr.filter((el) => {
                return el.name === number;
            })[0];

            // winNumber.visible = true
            game.add.tween(winNumber).to({alpha: 1}, 300, 'Linear', true);

            let winSplash = game.add.sprite(winNumber.x, winNumber.y, 'splash', null, container);
            winSplash.anchor.set(0.5);
            let winSplashAnim = winSplash.animations.add('win', null, 15, false);
            winSplashAnim.play();
            // winSplashAnim.onComplete.add(() => {winNumber.visible = true}, this);
            // winSplash.animations.getAnimation('win').onComplete.add(() => {
            //     // if (winNumber.frameName = 'line_splash-' + number + '_0.png') {
            //         winNumber.visible = true;
            //     // };
            // });

            let rightArr = model.el('rightArr');
            let winNumberRight = rightArr.filter((el) => {
                return el.name === number;
            })[0];

            // winNumberRight.visible = true
            game.add.tween(winNumberRight).to({alpha: 1}, 300, 'Linear', true);

            let winSplashRight = game.add.sprite(winNumberRight.x, winNumberRight.y, 'splash', null, container);
            winSplashRight.anchor.set(0.5);
            winSplashRight.animations.add('win', null, 15, false);
            winSplashRight.animations.play('win');
            // winSplashRight.animations.getAnimation('win').onComplete.add(() => {
            //     // if (winNumberRight.frameName = 'line_splash-' + number + '_0.png') {
            //         winNumberRight.visible = true;
            //     // };
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
            symbol,
            alpha = false,
            wheels = model.el('wheels'),
            game = model.el('game')
        }) {

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
                    let wheel = wheels[col].elements;
                    let coord = line[col].Y;
                    let element = wheel[coord];
                        element.win();
                        element.group.scale.set(0.3);
                        game.add.tween(element.group.scale).to({x: 1.2,  y: 1.2}, 700, Phaser.Easing.Bounce.Out, true)
                            .onComplete.add(() => {
                                game.add.tween(element.group.scale).to({x: 1.0,  y: 1.0}, 400, 'Linear', true)
                            }, this);
                }

            // Если есть скаттеры либо мозги
            } else {
                let lvlCounter = 0;
                wheels.forEach((wheelObj) => {
                    wheelObj.elements.forEach((element) => {
                        let elementName = parseInt(element.sprites[element.active - 1].animations.currentAnim.name);
                        // Показываем выигрышные скаттеры (Крампус)
                        if (elementName == '10' && symbol == '10') {
                            element.win();
                            element.group.scale.set(0.3);
                            game.add.tween(element.group.scale).to({x: 1.2,  y: 1.2}, 700, Phaser.Easing.Bounce.Out, true)
                                .onComplete.add(() => {
                                    game.add.tween(element.group.scale).to({x: 1.0,  y: 1.0}, 400, 'Linear', true)
                                }, this);
                            // Очищаем поле вручную так как нет глисты которая чистит автоматом
                            game.time.events.add(1000, () => {
                                winController.cleanWin();
                            });
                        }
                        // Показываем выигрышную коробку (Коробка)
                        if (elementName == '11' && symbol == '11') {
                            element.win(true);
                            element.group.scale.set(0.3);
                            game.add.tween(element.group.scale).to({x: 1.2,  y: 1.2}, 700, Phaser.Easing.Bounce.Out, true)
                                .onComplete.add(() => {
                                    game.add.tween(element.group.scale).to({x: 1.0,  y: 1.0}, 400, 'Linear', true)
                                }, this);


                                if (model.state('ready')) {
                                    request.send('Roll').then((data) => {
                                        let winCoins = data.Balance.TotalWinCoins;
                                        let winCents = data.Balance.TotalWinCents;
                                        request.send('Ready').then(() => {
                                            // TODO: Написать тескт битмепом, типа +60
                                            draw.TotalWin({
                                                winTotalData: winCoins
                                            });
                                        });
                                    });
                                } else {
                                    setTimeout(() => {
                                        request.send('Roll').then((data) => {
                                            let winCoins = data.Balance.TotalWinCoins;
                                            let winCents = data.Balance.TotalWinCents;
                                            request.send('Ready').then(() => {
                                                draw.TotalWin({
                                                    winTotalData: winCoins
                                                });
                                                model.updateBalance({endRoll: true});
                                            });
                                        });
                                    }, 300);
                                }

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
                    x = 192 * (countValue - 0.5) + 105 - gameMachine.width / 2;
                    y = 180 * (currentLineY + 0.5) + 125 - gameMachine.height / 2 - 25;
                } else {
                    x = 256 * (countValue - 0.5) + 140 - gameMachine.width / 2;
                    y = 240 * (currentLineY + 0.5) + 150 - gameMachine.height / 2 - 25;
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
                    x = 192 * (lastWheel + 0.5) + 105 - gameMachine.width / 2;
                    y = 180 * (lastElement + 0.5) + 125 - gameMachine.height / 2 - 25;
                } else {
                    x = 256 * (lastWheel + 0.5) + 140 - gameMachine.width / 2;
                    y = 240 * (lastElement + 0.5) + 150 - gameMachine.height / 2 - 25;
                }
            }

            // Рисуем саму табличку и текст в зависимости от количества символов
            let winBG = game.add.sprite(x, y - 3, 'winLine', null, container);
                winBG.anchor.set(0.5);
            let font;
            if (winValue > 999) {
                font = '15px Arial, Helvetica';
            } else if (winValue > 99) {
                font = '18px Arial, Helvetica';
            } else {
                font = '25px Arial, Helvetica';
            }
            let text = game.add.text(x, y, winValue, {font: font, fill: '#fff'}, container);
                text.anchor.set(0.5);
            if (model.mobile) {
                winBG.scale.set(0.8);
                text.scale.set(0.8);
            }

        }

    };

    let play = {

        WinSound: function() {
            let game = model.el('game');
            let winSound = game.rnd.integerInRange(0,1)
            ? soundController.sound.playSound({sound: 'lineWin', duration: 1000})
            : soundController.sound.playSound({sound: 'lineWin2', duration: 1000});
            return winSound;
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
