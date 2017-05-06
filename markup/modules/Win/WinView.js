import { model } from 'modules/Model/Model';
import { config } from 'modules/Util/Config';
import { Glista } from 'modules/Class/Glista';
import { Element } from 'modules/Class/Element';

import { controller as soundController } from '../../../Info/SoundController';
import { controller as winController } from 'modules/Win/WinController';
import { controller as fsController } from 'modules/States/FS/FSController';

export let view = (() => {

    let draw = {

        UpWinContainer: function ({
            game = model.el('game'),
            container = model.group('winUp')
        }) {
            let elSize = config[model.res].elements;
            let upWheels = [];
            let deltaY = (model.desktop) ? 28 : 15;
            for (var i = 0; i < 5; i++) {
                upWheels.push([]);
                for (var j = 0; j < 3; j++) {
                    let el = new Element({
                        container,
                        position: {
                            x: elSize.width * (i + 0.5 - 2.5),
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
            container = model.group('winTop'),
            style = {font: '90px Helvetice, Arial', fill: '#e1b249', align: 'center', stroke: '#000000', strokeThickness: 2}
        }) {
            if (winTotalData === 0) return;
            let winTotal = game.add.sprite(0, 0, 'winTotal', null, container);
                winTotal.anchor.set(0.5);

            let winTotalText = game.add.bitmapText(0, 25, 'numbersFont', winTotalData, 75, container);
                winTotalText.anchor.set(0.5);
        },

        WinSplash: function ({
            number,
            ind,
            game = model.el('game'),
            container = model.group('winTop')
        }) {

            let leftArr = model.el('leftArr');
            let rightArr = model.el('rightArr');

            let winSplashLeft = leftArr.filter((el) => {
                return el.name === number;
            })[0];
            let winSplashRight = rightArr.filter((el) => {
                return el.name === number;
            })[0];

            winSplashLeft.animations.play('win');
            winSplashRight.animations.play('win');

            winSplashLeft.openedTable = true;
            winSplashRight.openedTable = true;

        },

        WinNumber: function ({number}) {
            if (number < 0) return;
            draw.WinSplash({number, ind: 0});
        },

        WinElements: function ({
            number,
            amount,
            alpha = false,
            finalScale = (model.desktop) ? 1.3 : 1.5,
            wheels = model.el('wheels'),
            upWheels = model.el('upWheels'),
            game = model.el('game')
        }) {

            // Если нам нужно зажечь несколько линий элементов одновременно
            if(typeof number == 'object'
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

        findElements: function({
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

            number.forEach((curNumber, indx) => {
                if (curNumber != -1) {
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

        scaleJumping: function({
            game = model.el('game'),
            el,
            start,
            finish
        }) {
            el.group.scale.set(start);
            game.add.tween(el.group.scale).to({x: finish,  y: finish}, 700, Phaser.Easing.Bounce.Out, true)
                .onComplete.add(() => {
                    game.add.tween(el.group.scale).to({x: 1.0,  y: 1.0}, 400, 'Linear', true)
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
            if (winValue == 0) {
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
                    y = 180 * (currentLineY + 0.5) + 135 - gameMachine.height / 2 - 25;
                } else {
                    x = 256 * (countValue - 0.5) + 140 - gameMachine.width / 2;
                    y = 240 * (currentLineY + 0.5) + 170 - gameMachine.height / 2;
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
                    y = 240 * (lastElement + 0.5) + 170 - gameMachine.height / 2 - 25;
                }
            }

            // Рисуем саму табличку и текст в зависимости от количества символов
            let winBG = game.add.sprite(x - 8, y + 5, 'winLine', null, container);
                winBG.anchor.set(0.5);
            let font;
            if (winValue > 999) {
                font = '15px Arial, Helvetica';
            } else if (winValue > 99) {
                font = '18px Arial, Helvetica';
            } else {
                font = '25px Arial, Helvetica';
            }
            let text = game.add.text(x - 7, y + 9, winValue, {font: font}, container);
                text.anchor.set(0.5);

            let grd = text.context.createLinearGradient(0, 0, 0, text.canvas.height);
            grd.addColorStop(0, '#fef900');
            grd.addColorStop(1, '#f8a600');
            text.fill = grd;

        },

        Aim: function ({
            game = model.el('game'),
            container = model.group('aim')
        }) {

            soundController.sound.playSound({sound : 'aim'});

            let darkness = game.add.graphics(0, 0, model.group('bonusDarkness'));
                darkness.beginFill(0x000000, 0.7).drawRect(0, 0, game.world.width, game.world.height);
            model.el('shurikenDarkness', darkness);

            let aim = game.add.sprite(game.world.centerX, (model.desktop) ? (game.world.centerY - 150) : (game.world.centerY - 80), 'aim', null, container);
                aim.anchor.set(0.5);
            model.el('aim', aim);

            game.add.tween(aim)
                .from({y: -600}, 800, Phaser.Easing.Bounce.Out, true);
            return aim;
        },

        FireShuriken(data, index) {
            let game = model.el('game');
            let container = model.group('aim');

            let x = config.coords[parseInt(data.curValue.Multi)][index].x;
            let y = config.coords[parseInt(data.curValue.Multi)][index].y;
            let scaleX = config.coords[parseInt(data.curValue.Multi)][index].scaleX;
            let scaleY = config.coords[parseInt(data.curValue.Multi)][index].scaleY;
            if (model.mobile) {
                x *= 0.66;
                y *= 0.66;
                scaleX *= 0.66;
                scaleY *= 0.66;
            }
            let leftSide = config.coords[parseInt(data.curValue.Multi)][index].left;

            soundController.sound.playSound({sound: 'shurikenFly'});

            // Играй анимацию сурикена
            let shuriken = game.add.sprite(x, y, 'shuriken', null, container);
                shuriken.anchor.set(0.5);
                shuriken.scale.x = (leftSide) ? -scaleX : scaleX;
                shuriken.scale.y = scaleY;
                shuriken.angle = game.rnd.integerInRange(-30, 30);
                shuriken.animations.add('win');
                shuriken.animations.play('win', 30);
            game.add.tween(shuriken.scale)
                .from({x: 2.5, y: 2.5}, 400, 'Linear', true);
            game.add.tween(shuriken)
                .from({x: (leftSide) ? 0 : game.width}, 400, 'Linear', true)
                .onComplete.add(() => {
                    let winText = game.add.bitmapText(game.world.centerX, game.world.centerY, 'numbersFont', `+${data.winCoins}`, 80, container);
                        winText.align = 'center';
                        winText.anchor.set(0.5);
                        winText.scale.set(0.05);
                    game.add.tween(winText.scale)
                        .to({x: 1, y: 1}, 700, Phaser.Easing.Bounce.Out, true);
                    game.add.tween(winText)
                        .to({y: game.world.centerY - 500, alpha: 0}, 2000, 'Linear', true);
                });
        }

    };

    let play = {

        WinSound: function() {
            let winSound = Math.round(Math.random())
            ? soundController.sound.playSound({sound: 'lineWin', duration: 1200})
            : soundController.sound.playSound({sound: 'lineWin2', duration: 1200});
            return winSound;

        }

    };

    let hide = {

        WinTop: function({
            game = model.el('game'),
            container = model.group('winTop')
        }) {
            return game.add.tween(container).to( { alpha: 0 }, 150, 'Linear', true);
        },

        Aim: function ({
            game = model.el('game'),
            container = model.group('aim'),
            shurikenDarkness = model.el('shurikenDarkness'),
            cb = false
        }) {
            game.add.tween(container)
                .to({y: -800}, 800, Phaser.Easing.Back.In, true)
                .onComplete.add(() => {
                    container.y = 0;
                    if (cb) {
                        cb();
                    }
                });

            game.add.tween(shurikenDarkness)
                .to({alpha: 0}, 800, 'Linear', true)
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
