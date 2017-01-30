import { model } from 'modules/Model/Model';
import { config } from 'modules/Util/Config';
import { request } from 'modules/Util/Request';
import { Wheel } from 'modules/Class/Wheel';

import { view as mainView } from 'modules/States/Main/MainView';
import { view as panelView } from 'modules/Panel/PanelView';

import { controller as soundController } from 'modules/Sound/SoundController';
import { controller as autoplayController } from 'modules/Autoplay/AutoplayController';
import { controller as buttonsController } from 'modules/Buttons/ButtonsController';
import { controller as winController } from 'modules/Win/WinController';
import { controller as fsController } from 'modules/States/FS/FSController';

export let controller = (() => {

    function init() {
        let game = model.el('game');
        let elementsContainer = model.group('elements');

        let wheels = [];
        let elSize = config[model.res].elements;

        // Восстановление экрана с которого мы ошли на Фри Спины
        let firstWheels = checkFirstScreen();
        let deltaY = (model.desktop) ? 0 : 50;

        // Заполняемм колеса элементами
        for (let i = 0; i < 5; i++) {
            wheels.push(new Wheel({
                game,
                parent: elementsContainer,
                position: {
                    x: (i - 2) * elSize.width,
                    y: -elSize.height - deltaY
                },
                elSize,
                currentScreen: firstWheels[i]
            }));
        }

        model.el('wheels', wheels);
    }

    function startRoll() {
        // Если не было Ready - не крутим
        if (!model.state('ready')) {
            return false;
        }

        // Если долго идет запрос (больше 4 сек) - выкидываем попап
        let game = model.el('game');
        let rollPopupTimer = game.time.events.add(4000, () => {
            mainView.draw.showPopup({message: 'You have weak Internet connection'});
        });

        model.state('ready', false);
        // Отправляем запрос Roll
        request.send('Roll')
            .then((data) => {

                // Выключаем срабатывание попапа на длинный Roll
                game.time.events.remove(rollPopupTimer);

                // Если есть ошибка закрытой сессии - выкидываем попап
                if (data.ErrorMessage === 'SessionClosedOrNotOpened') {
                    mainView.draw.showPopup({message: 'Your session is closed. Please click to restart'});
                }

                // Очищаем выигрышный экран
                winController.cleanWin();

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
                soundController.sound.playSound({sound: 'baraban', fade: 500, volume: 0.6});
                // soundController.sound.changeSoundVolume('baraban', 60);

                // Расчитываем конечный экран
                let wheels = model.el('wheels');
                let finishScreen = _convertArray(data.Screen);
                model.data('finishScreen', finishScreen);

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
                    }
                }

            })
            .catch((err) => {
                mainView.draw.showPopup({message: 'You have weak Internet connection. Click to restart.'});
                console.error(err);
            });
    }

    function checkFirstScreen() {
        let firstScreen;
        if (model.data('startFSScreen')
        && !model.state('fs') ) {
            firstScreen = model.data('startFSScreen');
            model.data('startFSScreen', null);
        } else {
            model.log();
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
        if (model.state('ready')) {
            return false;
        }
        soundController.sound.stopSound('baraban');

        // Отправляем запрос Ready
        request.send('Ready').then(() => {
            winController.showWin();
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

            // Убираем лок кнопок
            if (!model.state('fs') && model.state('autoplay:end') && !model.state('buttons:locked')) {
                let game = model.el('game');
                if (model.mobile) {
                    buttonsController.unlockButtons();
                } else {
                    game.input.keyboard.enabled = true;
                    panelView.unlockButtons();
                }
            }

        })
        .catch((err) => {
            mainView.draw.showPopup({message: 'You have weak Internet connection. Click to restart.'});
            console.error(err);
        });

    }

    function _convertArray(arr) {
        let result = Array(5);
        arr.forEach((row) => {
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
            if (model.state('autoplay:end')) {
                return false;
            }
            autoplayController.next();
        });
    }

    function _runNextFSIfExist() {
        const game = model.el('game');
        let rollResponse = model.data('rollResponse');
        // Здесь определяется время через которое начнется следующая крутка: если не было выигрыша, то сразу, если был, то через секунду
        let time = (rollResponse.WinLines.length) ? 1000 : 0;

        let fsTimer = game.time.events.add(time, () => {
            if (model.state('fs:end')) {
                return false;
            }
            fsController.next();
        });

        model.el('fsTimer', fsTimer);

    }

    return {
        init,
        startRoll,
        endRoll,
        fastRoll
    };

})();
