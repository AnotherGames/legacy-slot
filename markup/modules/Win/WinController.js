import { model } from 'modules/Model/Model';

import { view } from 'modules/Win/WinView';
import { view as transitionView } from 'modules/Transition/TransitionView';
import { view as mainView } from 'modules/States/Main/MainView';

import { controller as autoplayController } from 'modules/Autoplay/AutoplayController';
import { controller as panelController } from 'modules/Panel/PanelController';
import { controller as buttonsController } from 'modules/Buttons/ButtonsController';
import { controller as fsController } from 'modules/States/FS/FSController';

export let controller = (() => {

    model.data('glistaFiredCounter', 0);
    model.data('glistaDoneCounter', 0);

    function drawFsState(numberOfSpins) {
        let game = model.el('game');
        model.state('fs', true);
        // Изменяем панель на FS
        model.group('blurBG').removeAll();
        model.group('light').removeAll();
        mainView.draw.drawBlurBg({});
        mainView.draw.addLight({side: 'left'});
        mainView.draw.addLight({side: 'right'});
        mainView.draw.lightToggle({});
        panelController.drawFsPanel();
        mainView.draw.addBigLight({});
        game.time.events.add(2000, () => {
            mainView.draw.changeBigLight({});
        });
        fsController.init(numberOfSpins);
        mainView.draw.changeBG({});
        if (model.mobile) {
            model.group('buttons').visible = false;
            model.group('main').x = game.world.centerX;
        }

    }

    function checkForFS() {
        let game = model.el('game');
        let data = model.data('rollResponse');
        let mode = data.Mode;
        let nextMode = data.NextMode;

        if (mode === 'root' && nextMode.indexOf('fsBonus') !== -1 ) {
            model.state('buttons:locked', true);
            console.warn('fs start!');

            // Остонавливаем автоплей если был
            if (model.state('autoplay:start')) {
                model.data('remainAutoCount', model.data('autoplay:count'));
                autoplayController.stop();
            }

            game.time.events.add(2000, () => {
                mainView.draw.addBigLight({});
                transitionView.fsStart();
            });
        }
    }

    function oneAfterAnother() {
        // Если идет крутка - пропускаем
        if (model.state('roll:progress')) {
            return;
        }
        // Обнуляем счетчики для глист
        model.data('glistaFiredCounter', 0);
        model.data('glistaDoneCounter', 0);

        cleanWin();

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
        if (nextIndex === winLines.length) {
            nextIndex = 0;
        }
        model.data('currentLineIndex', nextIndex);

        // Выставляем таймер для проигрыша следующей линии
        let game = model.el('game');
        game.time.events.add(1400, () => {
            oneAfterAnother();
        });

    }

    function showWin() {
        let game = model.el('game');
        let data = model.data('rollResponse'),
            winTotalData = data.Balance.TotalWinCoins,
            winLines = data.WinLines;
        // Если нет выигрыша - выходим
        if (winLines.length === 0) {
            return;
        }
        // Записываем финишный экран на верхний слой
        view.draw.copyFinishScreenToUpWheels({});

        // Проверяем переход на Фри-Спины
        checkForFS();

        // Играем звук выигрыша
        view.play.WinSound();
        // Рисуем табличку
        view.draw.TotalWin({winTotalData});

        let logoGM = model.el('logoGM');
        logoGM.setAnimationByName(0, 'win', true);

        // Для каждой линии проигрываем символы, глисты и номерки
        let winElements = { number: [], amount: [] };
        winLines.forEach((winLine) => {
            view.draw.WinNumber({number: winLine.Line});
            winElements.number.push(winLine.Line);
            winElements.amount.push(winLine.Count);
            view.draw.WinGlista({number: winLine.Line});
        });

        view.draw.WinElements({number: winElements.number, amount: winElements.amount});
        // Запускаем таймер для показа линий одна за другой
        let oneAfterAnotherTimer = game.time.events.add(1400, () => {
            if (model.state('autoplay:end')
            && model.state('fs:end')
            && !model.state('bonus')
            && !model.state('roll:progress')) {
                oneAfterAnother();
            }
        });
        model.data('oneAfterAnotherTimer', oneAfterAnotherTimer);
    }

    function cleanWin(cleanAlpha = false, normalAnim = true) {
        let game = model.el('game');
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

        let leftInnerLightArr = model.el('leftInnerLightArr');
        let rightInnerLightArr = model.el('rightInnerLightArr');

        leftInnerLightArr.forEach((el) => {
            el.alpha = 0;
        });

        rightInnerLightArr.forEach((el) => {
            el.alpha = 0;
        });

        mainView.draw.lightPlay({win: false});
        mainView.draw.hideFlag({});

        model.group('glistaLight').removeAll();

        // Прячем маленькую таблицу Win

        if (model.el('winTotalSmall')) {
            let winTotalSmall = model.el('winTotalSmall');
            let winTotalTextSmall = model.el('winTotalTextSmall');
            game.add.tween(winTotalSmall).to({ alpha: 0, y: 150 }, 300, 'Linear', true);
            game.add.tween(winTotalTextSmall).to({ alpha: 0, y: 170 }, 300, 'Linear', true);
        }

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
        container.removeAll();
        // view.hide.WinTop({})
        //     .onComplete.add(() => {
        //         container.alpha = 1;
        //     });
    }

    return {
        showWin,
        cleanWin,
        drawFsState
    };

})();
