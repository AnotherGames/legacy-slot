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
        // checkForBonus();

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

            shurikens.elements.forEach((el) => {
                el.hide(0);
            });

            shurikens.upElements.forEach((upEl) => {
                upEl.show();
                game.add.tween(upEl.group.scale)
                    .to({x: 1.8, y: 1.8}, 800, Phaser.Easing.Bounce.Out, true)
                    .onComplete.add(() => {
                        game.add.tween(upEl.group.scale)
                            .to({x: 1, y: 1}, 300, 'Linear', true)
                    });


                upEl.win(false, () => {
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
        let result = {};
        result.upElements = [];
        result.elements = [];
        let wheels = model.el('wheels');
        let upWheels = model.el('upWheels');
        wheels.forEach((wheel) => {
            wheel.elements.forEach((el) => {
                if (el.active == 12) {
                    result.elements.push(el);
                }
            });
        });
        upWheels.forEach((wheel) => {
            wheel.forEach((el) => {
                if (el.active == 12) {
                    result.upElements.push(el);
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
                view.draw.FireShuriken(data, index);
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
                view.draw.FireShuriken({
                    curValue: multi
                }, ind);
            }, 1000 * ind);
        });
    }




    return {
        showWin,
        cleanWin
    };

})();
