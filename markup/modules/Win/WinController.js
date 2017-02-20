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

        let leftLineArr = model.el('leftLineArr');
        let rightLineArr = model.el('rightLineArr');

        leftLineArr.forEach((el) => {
            el.visible = true;
        });

        rightLineArr.forEach((el) => {
            el.visible = true;
        });

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

            let fsLevelNumber = nextMode[7];
            addBigBottleToStage(fsLevelNumber);

            // Лочим все кнопки
            // model.state('buttons:locked', true);
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
            // game.time.events.add(800, () => {
            //     transitionView.fsStart();
            // });
        }
    }

    function addBigBottleToStage(fsLevelNumber) {
        let game = model.el('game');
        let container = model.group('winUp');
        let bottleContainer = game.add.group();
        let bottle1, bottle2, bottle3;
        let bottleBG1, bottleBG2, bottleBG3;

        let wheels = model.el('wheels');
        let upWheels = model.el('upWheels');
        let x = (model.desktop) ? 512 : 384;

        switch (+fsLevelNumber) {
            case 1:
                bottleBG1 = addBottleBG(bottleContainer, wheels[0].elements[1]);
                bottleBG1.x = -x;
                bottle1 = game.add.spine(-x, 70, 'bottle');
                playBottleAnim(bottle1, wheels[0].elements[1]);
                upWheels.containers[0].visible = false;
                game.add.tween(wheels[0].container).to({alpha: 0}, 1000, 'Linear', true);
                break;
            case 2:
                bottleBG1 = addBottleBG(bottleContainer, wheels[2].elements[1]);
                bottleBG1.x = 0;
                bottle1 = game.add.spine(0, 70, 'bottle');
                playBottleAnim(bottle1, wheels[2].elements[1]);
                upWheels.containers[2].visible = false;
                game.add.tween(wheels[2].container).to({alpha: 0}, 1000, 'Linear', true);
                break;
            case 3:
                bottleBG1 = addBottleBG(bottleContainer, wheels[4].elements[1]);
                bottleBG1.x = x;
                bottle1 = game.add.spine(x, 70, 'bottle');
                playBottleAnim(bottle1, wheels[4].elements[1]);
                upWheels.containers[4].visible = false;
                game.add.tween(wheels[4].container).to({alpha: 0}, 1000, 'Linear', true);
                break;
            case 4:
                bottleBG1 = addBottleBG(bottleContainer, wheels[0].elements[1]);
                bottleBG2 = addBottleBG(bottleContainer, wheels[2].elements[1]);
                bottleBG1.x = -x;
                bottleBG2.x = 0;
                bottle1 = game.add.spine(-x, 70, 'bottle');
                bottle2 = game.add.spine(0, 70, 'bottle');
                playBottleAnim(bottle1, wheels[0].elements[1]);
                playBottleAnim(bottle2, wheels[2].elements[1]);
                upWheels.containers[0].visible = false;
                upWheels.containers[2].visible = false;
                game.add.tween(wheels[0].container).to({alpha: 0}, 1000, 'Linear', true);
                game.add.tween(wheels[2].container).to({alpha: 0}, 1000, 'Linear', true);
                break;
            case 5:
                bottleBG1 = addBottleBG(bottleContainer, wheels[2].elements[1]);
                bottleBG2 = addBottleBG(bottleContainer, wheels[4].elements[1]);
                bottleBG1.x = 0;
                bottleBG2.x = x;
                bottle1 = game.add.spine(0, 70, 'bottle');
                bottle2 = game.add.spine(x, 70, 'bottle');
                playBottleAnim(bottle1, wheels[2].elements[1]);
                playBottleAnim(bottle2, wheels[4].elements[1]);
                upWheels.containers[2].visible = false;
                upWheels.containers[4].visible = false;
                game.add.tween(wheels[2].container).to({alpha: 0}, 1000, 'Linear', true);
                game.add.tween(wheels[4].container).to({alpha: 0}, 1000, 'Linear', true);
                break;
            case 6:
                bottleBG1 = addBottleBG(bottleContainer, wheels[0].elements[1]);
                bottleBG2 = addBottleBG(bottleContainer, wheels[4].elements[1]);
                bottleBG1.x = -x;
                bottleBG2.x = x;
                bottle1 = game.add.spine(-x, 70, 'bottle');
                bottle2 = game.add.spine(x, 70, 'bottle');
                playBottleAnim(bottle1, wheels[0].elements[1]);
                playBottleAnim(bottle2, wheels[4].elements[1]);
                upWheels.containers[0].visible = false;
                upWheels.containers[4].visible = false;
                game.add.tween(wheels[0].container).to({alpha: 0}, 1000, 'Linear', true);
                game.add.tween(wheels[4].container).to({alpha: 0}, 1000, 'Linear', true);
                break;
            case 7:
                bottleBG1 = addBottleBG(bottleContainer, wheels[0].elements[1]);
                bottleBG2 = addBottleBG(bottleContainer, wheels[2].elements[1]);
                bottleBG3 = addBottleBG(bottleContainer, wheels[4].elements[1]);
                bottleBG1.x = -x;
                bottleBG2.x = 0;
                bottleBG3.x = x;
                bottle1 = game.add.spine(-x, 70, 'bottle');
                bottle2 = game.add.spine(0, 70, 'bottle');
                bottle3 = game.add.spine(x, 70, 'bottle');
                playBottleAnim(bottle1, wheels[0].elements[1]);
                playBottleAnim(bottle2, wheels[2].elements[1]);
                playBottleAnim(bottle3, wheels[4].elements[1]);
                upWheels.containers[0].visible = false;
                upWheels.containers[2].visible = false;
                upWheels.containers[4].visible = false;
                game.add.tween(wheels[0].container).to({alpha: 0}, 1000, 'Linear', true);
                game.add.tween(wheels[2].container).to({alpha: 0}, 1000, 'Linear', true);
                game.add.tween(wheels[4].container).to({alpha: 0}, 1000, 'Linear', true);
                break;
            default:

        }
        bottleContainer.add(bottle1);
        if (bottle2) {
            bottleContainer.add(bottle2);
        }
        if (bottle3) {
            bottleContainer.add(bottle3);
        }
        bottleContainer.alpha = 0;

        game.add.tween(bottleContainer).to({alpha: 1}, 1000, 'Linear', true);
        container.addAt(bottleContainer, 0);

    }

    function addBottleBG(container, element) {
        let bottleBG;
        let game = model.el('game');
        let y = (model.desktop) ? 12 : 2;
        if (element.active == 10) {
            bottleBG = game.add.sprite(0, y, 'green', null, container);
        }
        if (element.active == 13) {
            bottleBG = game.add.sprite(0, y, 'red', null, container);
        }
        if (element.active == 16) {
            bottleBG = game.add.sprite(0, y, 'orange', null, container);
        }
        bottleBG.anchor.set(0.5);
        model.el('bottleBG', bottleBG);
        return bottleBG;
    }

    function playBottleAnim(bottle, element) {
        if (model.mobile) {
            bottle.scale.set(0.75);
        }
        if (element.active == 10) {
            bottle.setAnimationByName(0, 'idle_n_g', false);
            bottle.addAnimationByName(0, 'open_g', false);
            bottle.addAnimationByName(0, 'idle_n_g', true);
        }
        if (element.active == 13) {
            bottle.setAnimationByName(0, 'idle_n_r', false);
            bottle.addAnimationByName(0, 'open_r', false);
            bottle.addAnimationByName(0, 'idle_n_r', true);
        }
        if (element.active == 16) {
            bottle.setAnimationByName(0, 'idle_n_y', false);
            bottle.addAnimationByName(0, 'open_y', false);
            bottle.addAnimationByName(0, 'idle_n_y', true);
        }

    }

    return {
        showWin,
        cleanWin
    };

})();
