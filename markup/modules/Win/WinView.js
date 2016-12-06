import { model } from 'modules/Model/Model';
import { config } from 'modules/Util/Config';
import { Glista } from 'modules/Class/Glista';

import { controller as soundController } from 'modules/Sound/SoundController';
import { controller as winController } from 'modules/Win/WinController';
import { controller as fsController } from 'modules/States/FS/FSController';

export let view = (() => {

    let draw = {

        TotalWin: function ({
            winTotalData,
            game = model.el('game'),
            container = model.group('winTop'),
            style = {font: '60px Helvetice, Arial', fill: '#e8b075', align: 'center'}
        }) {
            if (winTotalData === 0) return;
            let winTotal = game.add.sprite(0, 0, 'winTotal', null, container);
                winTotal.anchor.set(0.5);

            let winTotalText = game.add.text(0, 5, winTotalData, style, container);
                winTotalText.anchor.set(0.5);
        },

        WinSplash: function ({
            number,
            ind,
            game = model.el('game'),
            container = model.group('winTop')
        }) {
            let gameMachine = model.el('gameMachine');
            let winSplash = game.add.sprite(0, 0, 'win', null, container);
                winSplash.anchor.set(0.5);
                winSplash.x = config[model.res].win[number][ind].x - gameMachine.width / 2;
                winSplash.y = config[model.res].win[number][ind].y - gameMachine.height / 2 - 25;
                winSplash.animations.add('win', Phaser.Animation.generateFrameNames('Splash-Splash', 1, 14, '.png', 1), 15, false);
                winSplash.animations.play('win');
                winSplash.animations.getAnimation('win').killOnComplete = true;
            return winSplash;
        },

        WinNumber: function ({number}) {
            if (number < 0) return;

            draw.WinSplash({number, ind: 0});
            draw.WinSplash({number, ind: 1});

        },

        WinElements: function ({
            number,
            amount,
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
                        element.show();
                }

            // Если есть скаттеры либо мозги
            } else {
                let lvlCounter = 0;
                wheels.forEach((wheelObj) => {
                    wheelObj.elements.forEach((element) => {
                        let elementName = parseInt(element.sprites[element.active - 1].animations.currentAnim.name);
                        // Показываем выигрышные скаттеры
                        if (elementName == '10') {
                            element.win();
                            element.show();
                            // Очищаем поле вручную так как нет глисты которая чистит автоматом
                            game.time.events.add(1000, () => {
                                winController.cleanWin();
                            });

                        }
                        // Если выпали мозги на фри-спинах
                        if (elementName == '11') {
                            element.win();
                            // Отыгрываем эффекты при выпадении мозгов
                            if(lvlCounter == 0){
                                fsController.brain();
                                lvlCounter++;
                            }
                            // Увеличиваем мозги
                            game.add.tween(element.group.scale)
                                .to({x: 1.7, y: 1.7}, 700, 'Linear', true)
                                .onComplete.add(() => {
                                    game.add.tween(element.group.scale).to({x: 1, y: 1}, 200, 'Linear', true);
                                });
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
                    y = 180 * (currentLineY + 0.5) + 135 - gameMachine.height / 2 - 25;
                } else {
                    x = 256 * (countValue - 0.5) + 140 - gameMachine.width / 2;
                    y = 240 * (currentLineY + 0.5) + 180 - gameMachine.height / 2 - 25;
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
                    y = 180 * (lastElement + 0.5) + 135 - gameMachine.height / 2 - 25;
                } else {
                    x = 256 * (lastWheel + 0.5) + 140 - gameMachine.width / 2;
                    y = 240 * (lastElement + 0.5) + 180 - gameMachine.height / 2 - 25;
                }
            }

            // Рисуем саму табличку и текст в зависимости от количества символов
            let winBG = game.add.sprite(x, y + 4, 'winLine', null, container);
                winBG.anchor.set(0.5);
            let font;
            if (winValue > 999) {
                font = '15px Arial, Helvetica';
            } else if (winValue > 99) {
                font = '18px Arial, Helvetica';
            } else {
                font = '25px Arial, Helvetica';
            }
            let text = game.add.text(x, y, winValue, {font: font, fill: '#9be20a'}, container);
                text.anchor.set(0.5);

        }

    };

    let play = {

        WinSound: function() {
            let winSound = Math.round(Math.random())
            ? soundController.sounds.playSound('lineWin', 1000)
            : soundController.sounds.playSound('lineWin2', 1000);
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
