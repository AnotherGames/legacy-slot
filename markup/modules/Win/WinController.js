import { model } from 'modules/Model/Model';
import { request } from 'modules/Util/Request';

import { view } from 'modules/Win/WinView';
import { view as transitionView } from 'modules/Transition/TransitionView';

import { controller as autoplayController } from 'modules/Autoplay/AutoplayController';
import { controller as fsController } from 'modules/States/FS/FSController';
import { view as panelView } from 'modules/Panel/PanelView';
import { view as buttonsView } from 'modules/Buttons/ButtonsView';
import { view as mainView } from 'modules/States/Main/MainView';

export let controller = (() => {

    model.data('glistaFiredCounter', 0);
    model.data('glistaDoneCounter', 0);

    function showWin() {

        let game = model.el('game'),
            mainContainer = model.group('main'),
            winTopContainer = model.group('winTop');

        let data = model.data('rollResponse'),
            winTotalData = data.Balance.TotalWinCoins,
            winLines = data.WinLines,
            mode = data.Mode,
            nextMode = data.NextMode;
        // Если нет выигрыша - выходим
        if (winLines.length === 0) return;
        // Записываем финишный экран на верхний слой
        view.draw.copyFinishScreenToUpWheels({});

        // Проверяем переход на Фри-Спины
        checkForFS();

        // Проверяем наличие бонуса сурикена
        checkForBonus();

        // Играем звук выигрыша
        view.play.WinSound();
        // Рисуем табличку
        view.draw.TotalWin({winTotalData});
        // Для каждой линии проигрываем символы, глисты и номерки
        let winElements = { number: [], amount: [] };
        winLines.forEach((winLine) => {
            if(winLine.Line == -1
            && winLine.Symbol == '11'
            && model.state('fs')) {
                fsController.changeMulti();
            }
            view.draw.WinNumber({number: winLine.Line});
            winElements.number.push(winLine.Line);
            winElements.amount.push(winLine.Count);
            view.draw.WinGlista({number: winLine.Line});
        });
        view.draw.WinElements({number: winElements.number, amount: winElements.amount});
        // Запускаем таймер для показа линий одна за другой
        let oneAfterAnotherTimer = game.time.events.add(1400, () => {
            if(model.state('autoplay:end')
            && model.state('fs:end')
            && !model.state('bonus')
            && !model.state('roll:progress')) {
                oneAfterAnother();
            }
        });
        model.data('oneAfterAnotherTimer', oneAfterAnotherTimer);
    }

    function cleanWin(cleanAlpha = false, normalAnim = true) {
        let container = model.group('winTop');
        // Обнуляем счетчики глист
        model.data('glistaFiredCounter', 0);
        model.data('glistaDoneCounter', 0);

        // Прячем верхний экран, показываем нижний
        let upWheels = model.el('upWheels');
        upWheels.forEach((upWheel) => {
            upWheel.forEach((upEl) => {
                upEl.hide(0);
                upEl.normal();
            })
        })
        let wheels = model.el('wheels');
        wheels.forEach((wheel) => {
            wheel.elements.forEach((el) => {
                el.show();
            });
        });

        let leftArr = model.el('leftArr');
        let rightArr = model.el('rightArr');

        leftArr.forEach((el) => {
            if (el.openedTable) {
                el.animations.play('close');
                el.openedTable = false;
            }
        });

        rightArr.forEach((el) => {
            if (el.openedTable) {
                el.animations.play('close');
                el.openedTable = false;
            }
        })

        // Перевод в нормальную анимацию
        if (normalAnim) {
            let wheels = model.el('wheels');
            wheels.forEach((wheel) => {
                wheel.elements.forEach((element) => {
                    element.normal();
                });
            });
        }

        // Если нужно очистить элементы от прозрачности
        if (cleanAlpha) {
            let wheels = model.el('wheels');
            wheels.forEach((wheel) => {
                wheel.elements.forEach((element) => {
                    element.show();
                });
            });
        }
        // Убираем элементы в контенере WinTop (это таблички с выигрышами)
        view.hide.WinTop({})
            .onComplete.add(() => {
                container.removeAll();
                container.alpha = 1;
            });
    }

    function oneAfterAnother() {
        // Если идет крутка - пропускаем
        if (model.state('roll:progress')) return;

        // Обнуляем счетчики для глист
        model.data('glistaFiredCounter', 0);
        model.data('glistaDoneCounter', 0);

        // Определяем индекс линии которую будем сейчас проигрывать
        let index = model.data('currentLineIndex') || 0;
        let winLines = model.data('rollResponse').WinLines;
        if (index >= winLines.length) {
            index = 0;
        }
        let currentLine = winLines[index];

        if (currentLine) {
            // Если нормальная линия
            if (currentLine.Line > 0) {
                model.state('axesPlaing', false);
                // view.draw.WinNumber({number: currentLine.Line});
                view.draw.WinElements({number: [currentLine.Line], amount: [currentLine.Count]});
                view.draw.WinGlista({number: currentLine.Line});
                view.draw.WinLineTable({line: currentLine});
                view.draw.WinNumber({number: currentLine.Line});
            // Если скаттеры
            } else {
                view.draw.WinElements({number: [currentLine.Line], amount: [currentLine.Count]});
                view.draw.WinLineTable({line: currentLine, scatter: true});
                view.draw.WinNumber({number: currentLine.Line});
            }
        } else {
            return;
        }

        // Обновляем индекс для следующей линии
        let nextIndex = ++index;
        if (nextIndex == winLines.length) {
            nextIndex = 0;
        }
        model.data('currentLineIndex', nextIndex);

        // Выставляем таймер для проигрыша следующей линии
        let game = model.el('game');
        game.time.events.add(1400, () => {
            oneAfterAnother();
        });

    }

    function checkForFS() {
        let game = model.el('game');
        let data = model.data('rollResponse'),
            mode = data.Mode,
            nextMode = data.NextMode;

        if (mode == 'root' && nextMode.indexOf('fsBonus') != -1 ) {
            // Лочим все кнопки
            model.state('buttons:locked', true);
            // Остонавливаем автоплей если был
            if (model.state('autoplay:start')) {
                model.data('remainAutoCount', model.data('autoplay:count'));
                autoplayController.stop();
            }
            // Записываем экран с которого вошли на Фри-Спины
            model.data('startFSScreen', data.Screen);
            model.data('firstScreen', data.Screen);
            // Убираем управление с клавиатуры
            game.input.keyboard.enabled = false;
            // Запускаем переходной экран
            game.time.events.add(800, () => {
                transitionView.fsStart();
            });
        }
    }

    function checkForBonus() {
        let game = model.el('game');
        let data = model.data('rollResponse'),
            mode = data.Mode,
            nextMode = data.NextMode;
        if (mode == 'root' && nextMode.indexOf('shuriken') != -1) {

            let shurikenArray = [];
            model.data('shurikenArray', shurikenArray);

            // Лочим все кнопки
            model.state('buttons:locked', true);

            // Остонавливаем автоплей если был
            if (model.state('autoplay:start')) {
                if (!model.state('autoStopWhenFS')) {
                    model.data('remainAutoCount', model.data('autoplay:count'));
                }
                autoplayController.stop();
            }

            let shurikens = findShurikens();
            let amountOFShurikens = +nextMode[8];
            let counter = 0;

            shurikens.forEach((el) => {
                game.add.tween(el.group.scale)
                    .to({x: 1.8, y: 1.8}, 800, Phaser.Easing.Bounce.Out, true)
                    .onComplete.add(() => {
                        game.add.tween(el.group.scale)
                            .to({x: 1, y: 1}, 300, 'Linear', true)
                    });


                el.win(false, () => {
                    counter++;
                    if (counter == 1) {
                        model.state('bonus', true);
                        getShurikens(amountOFShurikens);
                    }
                });
            });
            if (model.desktop) mainView.draw.returnDroppedLamps();
        }
    }

    function findShurikens() {
        let result = [];
        let wheels = model.el('wheels');
        wheels.forEach((wheel) => {
            wheel.elements.forEach((el) => {
                if (el.active == 12) {
                    result.push(el);
                }
            });
        });
        return result;
    }

    function getShurikens(i) {
        request.send('Roll')
            .then((data) => {
                console.log('Data is: ', data);
                writeShurikenData(data);
                request.send('Ready')
                .then(() => {
                    i--;
                    if (i > 0) {
                        getShurikens(i)
                    } else {
                        fireAllShurikens();
                    }
                });
            })
            .catch((err) => {
                console.error(err);
            });
    }

    function writeShurikenData(data) {
        let shurikenArray = model.data('shurikenArray');
        shurikenArray.push({
            curValue: data.CurrentValue,
            winCoins: data.Balance.TotalWinCoins,
            winCents: data.Balance.TotalWinCents
        });
    }

    function finishShurikens(totalSum) {
        view.draw.TotalWin({
            winTotalData: totalSum
        });
        model.updateBalance({
            bonus: true
        });
        if (model.data('remainAutoCount')) {
            let count = model.data('remainAutoCount');
            setTimeout(() => {
                autoplayController.start(count);
            }, 800);
            model.data('remainAutoCount', null);
        }
    }

    function fireAllShurikens() {
        let game = model.el('game');
        let shurikenArray = model.data('shurikenArray');
        let aim = view.draw.Aim({});
        let bonusSum = 0, bonusCashSum = 0;
        let totalSum = model.data('rollResponse').Balance.TotalWinCoins;

        shurikenArray.forEach((data, index) => {
            setTimeout(() => {
                fireShuriken(data, index);
            }, 800 * (index + 1));
            totalSum += data.winCoins;
            bonusSum += data.winCoins;
            bonusCashSum += data.winCents;
        });
        model.data('bonusSum', bonusSum);
        model.data('bonusCashSum', bonusCashSum);

        setTimeout(() => {
            model.state('buttons:locked', false);
            model.state('bonus', false);
            view.hide.Aim({
                cb: finishShurikens.bind(null, totalSum)
            });
            game.input.keyboard.enabled = true;
            if (model.desktop) {
                panelView.unlockButtons({});
            } else {
                buttonsView.draw.unlockButtons({});
            }
        }, 800 * shurikenArray.length + 2000);
    }

    function fireAllSurikDemo(multi) {
        coords[multi].forEach((sur, ind) => {
            setTimeout(() => {
                fireShuriken({
                    curValue: multi
                }, ind);
            }, 1000 * ind);
        });
    }

    let coords = {
        2: [
            {
                x: 640,
                y: 515,
                left: true,
                scaleX: 0.8,
                scaleY: 0.8
            },
            {
                x: 780,
                y: 700,
                left: true,
                scaleX: 0.7,
                scaleY: 0.9
            },
            {
                x: 1230,
                y: 600,
                left: false,
                scaleX: 0.6,
                scaleY: 0.7
            },
            {
                x: 1250,
                y: 400,
                left: false,
                scaleX: 0.9,
                scaleY: 0.8
            },
            {
                x: 860,
                y: 200,
                left: true,
                scaleX: 1,
                scaleY: 0.9
            }
        ],
        4: [
            {
                x: 760,
                y: 450,
                left: true,
                scaleX: 0.7,
                scaleY: 0.9
            },
            {
                x: 870,
                y: 680,
                left: true,
                scaleX: 1,
                scaleY: 1
            },
            {
                x: 1160,
                y: 520,
                left: false,
                scaleX: 0.7,
                scaleY: 0.8
            },
            {
                x: 1180,
                y: 380,
                left: false,
                scaleX: 1,
                scaleY: 0.8
            },
            {
                x: 1050,
                y: 270,
                left: false,
                scaleX: 1,
                scaleY: 1
            }
        ],
        6: [
            {
                x: 850,
                y: 520,
                left: true,
                scaleX: 0.7,
                scaleY: 0.7
            },
            {
                x: 780,
                y: 450,
                left: true,
                scaleX: 0.8,
                scaleY: 0.8
            },
            {
                x: 1070,
                y: 450,
                left: false,
                scaleX: 0.5,
                scaleY: 0.5
            },
            {
                x: 880,
                y: 360,
                left: true,
                scaleX: 0.9,
                scaleY: 0.9
            },
            {
                x: 1050,
                y: 560,
                left: false,
                scaleX: 1,
                scaleY: 1
            }
        ],
        10: [
            {
                x: 920,
                y: 500,
                left: true,
                scaleX: 0.5,
                scaleY: 0.7
            },
            {
                x: 930,
                y: 440,
                left: true,
                scaleX: 0.5,
                scaleY: 0.6
            },
            {
                x: 1040,
                y: 450,
                left: false,
                scaleX: 0.5,
                scaleY: 0.5
            },
            {
                x: 880,
                y: 460,
                left: true,
                scaleX: 0.5,
                scaleY: 0.4
            },
            {
                x: 1050,
                y: 520,
                left: false,
                scaleX: 1,
                scaleY: 1
            }
        ]
    }

    function fireShuriken(data, index) {
        let game = model.el('game');
        let container = model.group('aim');

        let x = coords[parseInt(data.curValue)][index].x;
        let y = coords[parseInt(data.curValue)][index].y;
        let scaleX = coords[parseInt(data.curValue)][index].scaleX;
        let scaleY = coords[parseInt(data.curValue)][index].scaleY;
        if (model.mobile) {
            x *= 0.66;
            y *= 0.66;
            scaleX *= 0.66;
            scaleY *= 0.66;
        }
        let leftSide = coords[parseInt(data.curValue)][index].left;

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

    function closeAim() {

    }

    return {
        showWin,
        cleanWin,
        fireShuriken,
        fireAllSurikDemo
    };

})();
