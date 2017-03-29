import { model } from 'modules/Model/Model';

import { view } from 'modules/Win/WinView';
import { view as transitionView } from 'modules/Transition/TransitionView';

import { controller as autoplayController } from 'modules/Autoplay/AutoplayController';
import { controller as fsController } from 'modules/States/FS/FSController';

export let controller = (() => {

    model.data('glistaFiredCounter', 0);
    model.data('glistaDoneCounter', 0);

    function showWin() {

        let game = model.el('game');

        let data = model.data('rollResponse'),
            winTotalData = data.Balance.TotalWinCoins,
            winLines = data.WinLines;
        // Если нет выигрыша - выходим
        if (winLines.length === 0) return;
        view.draw.copyFinishScreenToUpWheels({});

        checkForChest(winLines);

        // Проверяем переход на Фри-Спины
        checkForFS();

        // Проверяем переход на бонус с илюминаторами
        checkForShipBonus();
        // Играем звук выигрыша
        view.play.WinSound();
        // Рисуем табличку
        view.draw.TotalWin({winTotalData});
        // Для каждой линии проигрываем символы, глисты и номерки
        let winElements = { number: [], amount: [] };
        winLines.forEach((winLine) => {
            view.draw.WinNumber({number: winLine.Line});
            view.draw.WinGlista({number: winLine.Line});
            winElements.number.push(winLine.Line);
            winElements.amount.push(winLine.Count);
        });
        view.draw.WinElements({number: winElements.number, amount: winElements.amount});

        let oneAfterAnotherTimer = game.time.events.add(1400, () => {
            if (model.state('autoplay:end')
            && model.state('fs:end')
            && !model.state('bonus')
            && !model.state('fsChecked')
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
            });
        });
        let wheels = model.el('wheels');
        wheels.forEach((wheel) => {
            wheel.elements.forEach((el) => {
                el.show();
            });
        });

        // Перевод в нормальную анимацию
        if (normalAnim) {
            wheels.forEach((wheel) => {
                wheel.elements.forEach((element) => {
                    element.normal();
                });
            });
        }

        // Если нужно очистить элементы от прозрачности
        if (cleanAlpha) {
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
                setTimeout(cleanWin, 1000);
                // view.draw.WinNumber({number: currentLine.Line});
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

    function checkForShipBonus() {
        let game = model.el('game');
        let data = model.data('rollResponse'),
            mode = data.Mode,
            nextMode = data.NextMode;

        if (mode == 'root' && nextMode == 'findBonus') {
            // Лочим все кнопки
            model.state('buttons:locked', true);
            // Остонавливаем автоплей если был
            if (model.state('autoplay:start')) {
                if (!model.state('autoStopWhenFS')) {
                    model.data('remainAutoCount', model.data('autoplay:count'));
                }
                autoplayController.stop();
            }
            // Записываем экран с которого вошли на Фри-Спины
            model.data('startFSScreen', data.Screen);
            model.data('firstScreen', data.Screen);
            // Убираем управление с клавиатуры
            game.input.keyboard.enabled = false;

            // Запускаем переходной экран
            game.time.events.add(1500, () => {
                transitionView.bonusStart();

            });
        }
    }

    function checkForFS() {
        let game = model.el('game');
        let data = model.data('rollResponse'),
            mode = data.Mode,
            nextMode = data.NextMode;

        if (mode == 'root' && nextMode == 'fsBonus') {
            // Лочим все кнопки
            model.state('buttons:locked', true);
            // Остонавливаем автоплей если был
            if (model.state('autoplay:start')) {
                if (!model.state('autoStopWhenFS')) {
                    model.data('remainAutoCount', model.data('autoplay:count'));
                }
                autoplayController.stop();
            }
            // Записываем экран с которого вошли на Фри-Спины
            model.data('startFSScreen', data.Screen);
            model.data('firstScreen', data.Screen);
            // Убираем управление с клавиатуры
            game.input.keyboard.enabled = false;

            let middleEl = view.hide.CroppedMermaid({});
            view.draw.Mermaid({
                el: middleEl
            });

            model.state('fsChecked', true);

            // model.state('fs:end', false);

            // Запускаем переходной экран
            game.time.events.add(1500, () => {
                transitionView.fsStart();
            });
        }
    }

    function checkForChest(winLines) {
        winLines.forEach((winLine) => {
            if (winLine.Line == -1 && winLine.Symbol == '14') {
                fsController.fsMainActions();
            }
        });
    }

    return {
        showWin,
        cleanWin
    };

})();
