import { model } from 'modules/Model/Model';
import { request } from 'modules/Util/Request';
import { config } from 'modules/Util/Config';

import { view } from 'modules/Win/WinView';
import { view as transitionView } from 'modules/Transition/TransitionView';
import { view as mainView } from 'modules/States/Main/MainView';
import { view as buttonsView } from 'modules/Buttons/ButtonsView';
import { view as panelView } from 'modules/Panel/PanelView';

import { controller as autoplayController } from 'modules/Autoplay/AutoplayController';
import { controller as panelController } from 'modules/Panel/PanelController';
import { controller as buttonsController } from 'modules/Buttons/ButtonsController';
import { controller as fsController } from 'modules/States/FS/FSController';

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
        let game = model.el('game');
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

        // Показываем обычные номера линий

        let leftLineArr = model.el('leftLineArr');
        let rightLineArr = model.el('rightLineArr');

        leftLineArr.forEach((el) => {
            el.visible = true;
        });

        rightLineArr.forEach((el) => {
            el.visible = true;
        });

        // Прячем маленькую таблицу Win

        if (model.el('winTotalSmall')) {
            let winTotalSmall = model.el('winTotalSmall');
            let winTotalTextSmall = model.el('winTotalTextSmall');
            game.add.tween(winTotalSmall).to({ alpha: 0, y: 150 }, 300, 'Linear', true);
            game.add.tween(winTotalTextSmall).to({ alpha: 0, y: 170 }, 300, 'Linear', true);
        }

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
        let data = model.data('rollResponse');
        let mode = data.Mode;
        let nextMode = data.NextMode;

        if (mode == 'root' && nextMode.indexOf('fsBonus') != -1 ) {
            let fsBonusLevel = nextMode[7];
            drawFsState(fsBonusLevel, fsBonusLevel);
        }
    }

    function drawFsState(fsLevelNumber, numberOfSpins) {
        let game = model.el('game');

        view.draw.addBigBottleToStage(fsLevelNumber);

        // Остонавливаем автоплей если был
        if (model.state('autoplay:start')) {
            model.data('remainAutoCount', model.data('autoplay:count'));
            autoplayController.stop();
        }

        model.state('fs', true);
        // Лочим все кнопки
        model.state('buttons:locked', true);
        if (model.mobile) {
            buttonsController.lockButtons();
        }
        // Убираем управление с клавиатуры
        game.input.keyboard.enabled = false;

        // Изменяем панель на FS
        panelController.drawFsPanel(numberOfSpins);

        fsController.init(10);

        // Персонаж объявляет количество фриспинов
        game.time.events.add(500, () => {
            transitionView.fsStart();
            mainView.draw.addCat2({});
            if (model.desktop) {
                mainView.draw.changeBG({});
            } else {
                mainView.draw.addTrash({});
            }
        });
    }


    return {
        showWin,
        cleanWin,
        drawFsState
    };

})();
