import { model } from 'modules/Model/Model';
import { Dragon } from 'modules/Class/Dragon';

import { view } from 'modules/Win/WinView';
import { view as transitionView } from 'modules/Transition/TransitionView';

import { controller as autoplayController } from 'modules/Autoplay/AutoplayController';
import { controller as soundController } from '../../../Info/SoundController';

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

        if (winLines.length == 1
        && model.state('fs')
        && winLines[0].Count == 0
        && winLines[0].Line == -1) {
            let dragonFS = model.el('dragonFS');
            soundController.sound.playSound({sound: 'dragonEat', duration: 1500});
            dragonFS.Eat();
        }

        // Проверяем переход на Фри-Спины
        checkForFS();
        // Играем звук выигрыша
        view.play.WinSound();
        // Рисуем табличку
        if (model.state('fs')) {
            view.draw.TotalWin({winTotalData, fs: true});
        } else {
            view.draw.TotalWin({winTotalData});
        }
        // Для каждой линии проигрываем символы, глисты и номерки
        winLines.forEach((winLine) => {
            view.draw.WinNumber({number: winLine.Line});
            view.draw.WinElements({number: winLine.Line, amount: winLine.Count});
            view.draw.WinGlista({number: winLine.Line});
        });
        // Запускаем таймер для показа линий одна за другой
        game.time.events.add(1400, () => {
            if(model.state('autoplay:end')
            && model.state('fs:end')
            && !model.state('roll:progress')) {
                oneAfterAnother();
            }
        });
    }

    function cleanWin(cleanAlpha = false) {
        let container = model.group('winTop');
        // Обнуляем счетчики глист
        model.data('glistaFiredCounter', 0);
        model.data('glistaDoneCounter', 0);
        // Если нужно очистить элементы от прозрачности
        if (cleanAlpha) {
            let wheels = model.el('wheels');
            wheels.forEach((wheel) => {
                wheel.elements.forEach((element) => {
                    element.show();
                });
            });
        }

        let leftArr = model.el('leftArr');
        let rightArr = model.el('rightArr');

        leftArr.forEach((el) => {
            el.normal();
        });

        rightArr.forEach((el) => {
            el.normal();
        });

        // Убираем элементы в контенере WinTop (это таблички с выигрышами)
        view.hide.WinTop({})
            .onComplete.add(() => {
                container.removeAll();
                container.alpha = 1;
            });;
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
                view.draw.WinNumber({number: currentLine.Line});
                view.draw.WinElements({number: currentLine.Line, amount: currentLine.Count});
                view.draw.WinGlista({number: currentLine.Line});
                view.draw.WinLineTable({line: currentLine});
            // Если скаттеры
            } else {
                view.draw.WinElements({number: currentLine.Line, amount: currentLine.Count});
                // view.draw.WinLineTable({line: currentLine, scatter: true});
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

        if(mode == 'root'
        && nextMode.split('-')[0] == 'fsBonus') {
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

            let dragon = model.el('dragon');
            dragon.FlyToFS();

            // Убираем управление с клавиатуры
            game.input.keyboard.enabled = false;
            // Запускаем переходной экран
            game.time.events.add(1500, () => {
                transitionView.fsStart();
            });
        }
    }

    return {
        showWin,
        cleanWin
    };

})();
