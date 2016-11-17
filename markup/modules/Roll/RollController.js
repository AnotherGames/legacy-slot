import { model } from 'modules/Model/Model';
import { events } from 'modules/Util/Events';
import { config } from 'modules/Util/Config';
import { request } from 'modules/Util/Request';
import { sound } from 'modules/Sound/Sound';
import { Wheel } from 'modules/Class/Wheel';
import { view as mainView } from 'modules/States/Main/View';

export let controller = (() => {

    function init() {
        const game = model.el('game');
        const elementsContainer = model.el('elementsContainer');

        let wheels = [];
        let elSize = config[model.state('res')].elements;

        let firstScreen = model.data('firstScreen');
        let firstWheels = _convertArray(firstScreen);

        for (let i = -2; i < 3; i++) {
            wheels.push(new Wheel({
                game,
                parent: elementsContainer,
                position: {
                    x: i * elSize.width - config[model.state('res')].machine.x,
                    y: 0 - config[model.state('res')].machine.y * 2
                },
                elSize,
                currentScreen: firstWheels[i + 2]
            }));
        }

        model.el('wheels', wheels);
    }

    function startRoll(options) {
        if (!model.state('ready')) return;
        if (!model.checkBalance()) {
            console.warn('Not enought money!');
            return;
        }
        model.state('ready', false);
        request.send('Roll')
            .then((data) => {

                if (data.ErrorMessage === 'SessionClosedOrNotOpened') {
                    mainView.draw.showPopup({message: 'Your session is closed. Please click to restart'});
                }

                events.trigger('roll:start');
                model.data('rollResponse', data);

                if (model.state('FSMode')) {
                    model.updateBalance({startFSRoll: true});
                } else {
                    model.updateBalance({startRoll: true});
                }

                model.state('roll:progress', true);
                model.state('roll:fast', false);

                _playRollSound();

                const game = model.el('game');
                let wheels = model.el('wheels');
                let finishScreen = _convertArray(data.Screen);

                wheels.forEach((wheel, columnIndex) => {
                    // Fast
                    if (model.state('fastRoll')) {
                        wheel.fast();
                    }
                    // Normal
                    game.time.events.add(columnIndex * config.wheel.roll.deltaTime, () => {
                        wheel.roll(finishScreen[columnIndex] || config.wheel.roll.finishScreen, {
                            // TODO: для обычних круток используй параметры конфига.
                            time: 1500,
                            length: 25,
                            easingSeparation: 0.9,
                            callback
                        });
                    }, wheel);

                });

                let countFinish = 0;
                function callback() {
                    ++countFinish;
                    if (countFinish === 5) {
                        events.trigger('roll:end');
                    }
                }

            })
            .catch((err) => {console.error(err)});
    }

    function fastRoll() {
        if (!model.state('roll:fast') && model.state('roll:progress')) {
            model.el('wheels').forEach((wheel) => {
                wheel.fast();
            });
            model.state('roll:fast', true);
            console.log('i am doing fast roll');
        }
    }

    function endRoll() {
        if (model.state('ready')) return;
        request.send('Ready').then((data) => {

            if (model.state('FSMode')) {
                model.updateBalance({endFSRoll: true});
                events.trigger('fs:count', {end: true});
            } else {
                model.updateBalance({endRoll: true});
            }
            model.state('ready', true);
            model.state('roll:progress', false);

            if (!model.state('FSMode')) {
                _runNextAutoIfExist();
            } else {
                _runNextFSIfExist();
            }

        });
    }

    function _playRollSound() {
        let duration;
        if (model.state('fastRoll')) {
            duration = config.wheel.roll.fastTime / 1000;
        } else {
            duration = config.wheel.roll.time / 1000;
        }
        sound.sounds.baraban.addMarker('roll', 0, duration, 1, false);
        sound.sounds.baraban.play('roll');
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
        let rollResponse = model.data('rollResponse');
        let time = (rollResponse.Balance.TotalWinCoins) ? 1000 : 0;

        setTimeout(() => {
            if (model.state('autoEnd')) return;
            events.trigger('autoplay:next');
        }, time);

    }

    function _runNextFSIfExist() {
        let rollResponse = model.data('rollResponse');
        let time = (rollResponse.WinLines.length) ? 1000 : 0;

        setTimeout(() => {
            if (model.state('fsEnd')) return;
            events.trigger('fs:next');
        }, time);

    }

    events.on('roll:request', startRoll);
    events.on('roll:end', endRoll);
    events.on('roll:fast', fastRoll);

    return {
        init
    };

})();
