import { model } from 'modules/Model/Model';
import { events } from 'modules/Util/Events';
import { config } from 'modules/Util/Config';
import { popup } from 'modules/Util/Popup';
import { request } from 'modules/Util/Request';
import { sound } from 'modules/Sound/Sound';
import { Wheel } from 'modules/Class/Wheel';

export let controller = (() => {

    function init() {
        const game = model.el('game');
        const elementsContainer = model.el('elementsContainer');

        let wheels = [];
        let elSize = config[model.state('res')].elements;

        let firstScreen;
        if (model.data('startFSScreen') !== undefined && !model.state('FSMode') ) {
            firstScreen = model.data('startFSScreen');
            model.data('startFSScreen', undefined);
        } else {
            firstScreen = model.data('firstScreen');
        }
        let firstWheels = _convertArray(firstScreen);

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
        if (!model.state('ready')) return;
        // model.state('lockedButtons', true);
        let game = model.el('game');
        if (!model.checkBalance()) {
            console.warn('Not enought money!');
            popup.showPopup({message: 'You have low balance on your account'});
            return;
        }
        model.state('ready', false);
        let rollPopupTimer = game.time.events.add(4000, () => {
            popup.showPopup({message: 'You have weak Internet connection'});
        });

        request.send('Roll')
            .then((data) => {

                game.time.events.remove(rollPopupTimer);

                if (data.ErrorMessage === 'SessionClosedOrNotOpened') {
                    popup.showPopup({message: 'Your session is closed. Please click to restart'});
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
        // model.state('lockedButtons', false);
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
        const game = model.el('game');
        let rollResponse = model.data('rollResponse');
        let time = (rollResponse.Balance.TotalWinCoins) ? 1000 : 0;

        game.time.events.add(time, () => {
            if (model.state('autoEnd')) return;
            events.trigger('autoplay:next');
        });
    }

    function _runNextFSIfExist() {
        const game = model.el('game');
        let rollResponse = model.data('rollResponse');
        let time = (rollResponse.WinLines.length) ? 2000 : 0;

        game.time.events.add(time, () => {
            if (model.state('fsEnd')) return;
            events.trigger('fs:next');
        });

    }

    events.on('roll:request', startRoll);
    events.on('roll:end', endRoll);
    events.on('roll:fast', fastRoll);

    return {
        init
    };

})();
