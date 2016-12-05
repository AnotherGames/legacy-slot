import { model } from 'modules/Model/Model';
import { config } from 'modules/Util/Config';
import { request } from 'modules/Util/Request';
import { Wheel } from 'modules/Class/Wheel';

import { view as mainView } from 'modules/States/Main/View';

import { controller as soundController } from 'modules/Sound/Controller';
import { controller as autoplayController } from 'modules/Autoplay/Controller';
import { controller as panelController } from 'modules/Panel/Controller';
import { view as panelView } from 'modules/Panel/View';
import { controller as buttonsController } from 'modules/Buttons/Controller';
import { controller as winController } from 'modules/Win/Controller';
import { controller as fsController } from 'modules/States/FS/Controller';

export let controller = (() => {

    function init() {
        let game = model.el('game');
        let elementsContainer = model.group('elements');

        let wheels = [];
        let elSize = config[model.res].elements;

        // Восстановление экрана с которого мы ошли на Фри Спины
        let firstWheels = checkFirstScreen();

        // Заполняемм колеса элементами
        for (let i = 0; i < 5; i++) {
            wheels.push(new Wheel({
                game,
                parent: elementsContainer,
                position: {
                    x: (i - 2) * elSize.width,
                    y: -elSize.height
                },
                elSize,
                currentScreen: firstWheels[i]
            }));
        }

        model.el('wheels', wheels);
    }

    function startRoll(options) {
        // Если не было Ready - не крутим
        if (!model.state('ready')) return;

        // Если маленький баланс - не крутим, выкидываем попап
        if (!model.checkBalance()) {
            mainView.draw.showPopup({message: 'You have low balance on your account'});
            return;
        }

        // Если долго идет запрос (больше 4 сек) - выкидываем попап
        let game = model.el('game');
        let rollPopupTimer = game.time.events.add(4000, () => {
            mainView.draw.showPopup({message: 'You have weak Internet connection'});
        });

        // Выключаем управление с клавиатуры
        game.input.keyboard.enabled = false;


        // Лочим кнопки на время крутки
        if(!model.state('fs')){
          if(model.mobile) {
            buttonsController.lockButtons();
          } else {
            panelView.lockButtons(); 
          }
        }

        // Отправляем запрос Roll
        request.send('Roll')
            .then((data) => {
                model.state('ready', false);

                // Выключаем срабатывание попапа на длинный Roll
                game.time.events.remove(rollPopupTimer);

                // Если есть ошибка закрытой сессии - выкидываем попап
                if (data.ErrorMessage === 'SessionClosedOrNotOpened') {
                    mainView.draw.showPopup({message: 'Your session is closed. Please click to restart'});
                }

                // Очищаем выигрышный экран
                winController.cleanWin(true);

                // Записываем полученные данные
                model.data('rollResponse', data);

                // Обновляем баланс (забираем ставку)
                if (model.state('fs')) {
                    model.updateBalance({startFSRoll: true});
                } else {
                    model.updateBalance({startRoll: true});
                }

                // Выставляем состояния крутки на прогресс
                model.state('roll:progress', true);
                model.state('roll:fast', false);

                // Играем звук кручения барабанов
                soundController.sounds.playSound('baraban');

                // Расчитываем конечный экран
                let wheels = model.el('wheels');
                let finishScreen = _convertArray(data.Screen);

                // Крутим колеса
                wheels.forEach((wheel, columnIndex) => {
                    // Fast
                    if (model.state('fastRoll')) {
                        wheel.fast();
                    }
                    // Normal
                    game.time.events.add(columnIndex * config.wheel.roll.deltaTime, () => {
                        wheel.roll(finishScreen[columnIndex] || config.wheel.roll.finishScreen, {
                            time: config.wheel.roll.time,
                            length: config.wheel.roll.length,
                            easingSeparation: config.wheel.roll.easingSeparation,
                            callback
                        });
                    }, wheel);

                });

                // Когда все пять колес завершают движение - заканчиваем крутку и показываем выигрыш
                let countFinish = 0;
                function callback() {
                    ++countFinish;
                    if (countFinish === 5) {
                        endRoll();
                        winController.showWin();
                    }
                }

            })
            .catch((err) => {console.error(err)});
    }

    function checkFirstScreen() {
        let firstScreen;
        if (model.data('startFSScreen') !== undefined
        && !model.state('fs') ) {
            firstScreen = model.data('startFSScreen');
            model.data('startFSScreen', undefined);
        } else {
            firstScreen = model.data('firstScreen');
        }
        return _convertArray(firstScreen);
    }

    function fastRoll() {
        if (!model.state('roll:fast') && model.state('roll:progress')) {
            model.el('wheels').forEach((wheel) => {
                wheel.fast();
            });
            model.state('roll:fast', true);
        }
    }

    function endRoll() {
        if (model.state('ready')) return;

        // Отправляем запрос Ready
        request.send('Ready').then((data) => {
            soundController.sounds.stopSound('baraban');
            // Обновляем баланс в конце крутки
            if (model.state('fs')) {
                model.updateBalance({endFSRoll: true});
                fsController.count({end: true});
            } else {
                model.updateBalance({endRoll: true});
            }

            // Убираем состояния прогресса
            model.state('ready', true);
            model.state('roll:progress', false);

            // Запускаем следующую автокрутку (или ФС-крутку)
            if (!model.state('fs')) {
                _runNextAutoIfExist();
            } else {
                _runNextFSIfExist();
            }

        });

        // Убираем лок кнопок
        if(!model.state('fs')){
          if(model.mobile) {
            buttonsController.unlockButtons();
          } else {
            panelView.unlockButtons();
          }
        }

        // Если у нас не автоплей, то убираем и лок клавиатуры
        if (model.state('autoplay:end')){
            let game = model.el('game');
            game.input.keyboard.enabled = true;
        }
    }

    function _convertArray(arr) {
        let result = Array(5);
        arr.forEach((row, rowIndex) => {
            row.forEach((el, colIndex) => {
                result[colIndex] = result[colIndex] || [];
                result[colIndex].push(el);
            });
        });
        return result;
    }

    function _runNextAutoIfExist() {
        const game = model.el('game');
        let rollResponse = model.data('rollResponse');
        // Здесь определяется время через которое начнется следующая крутка: если не было выигрыша, то сразу, если был, то через секунду
        let time = (rollResponse.Balance.TotalWinCoins) ? 1000 : 0;

        game.time.events.add(time, () => {
            if (model.state('autoplay:end')) return;
            autoplayController.next()
        });
    }

    function _runNextFSIfExist() {
        const game = model.el('game');
        let rollResponse = model.data('rollResponse');
        // Здесь определяется время через которое начнется следующая крутка: если не было выигрыша, то сразу, если был, то через секунду
        let time = (rollResponse.WinLines.length) ? 1000 : 0;

        game.time.events.add(time, () => {
            if (model.state('fs:end')) return;
            fsController.next();
        });

    }

    return {
        init,
        startRoll,
        endRoll,
        fastRoll
    };

})();
