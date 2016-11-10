import { model } from 'modules/Model/Model';
import { events } from 'modules/Util/Events';
import { config } from 'modules/Util/Config';
import { request } from 'modules/Util/Request';
import { sound } from 'modules/Sound/Sound';
import { Wheel } from 'modules/Class/Wheel';

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
        request.send('Roll')
            .then((data) => {
                events.trigger('roll:start');
                model.state('roll:progress', true);
                model.state('roll:fast', false);
                model.data('rollResponse', data);

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
                            length: 30,
                            easingSeparation: 1.2,
                            callback
                        });
                    }, wheel);

                });

                let countFinish = 0;
                function callback() {
                    ++countFinish;
                    if (countFinish === 5) {
                        // events.trigger('roll:end');
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
        }
    }

    function endRoll() {
        request.send('Ready').then((data) => {
            // console.log('Ready done', data);
            if (!model.state('FSMode')) {
                let rollResponse = model.data('rollResponse');
                if (rollResponse.Balance.TotalWinCoins > 0) {
                    setTimeout(() => {
                        if (model.state('autoEnd')) return;
                        events.trigger('autoplay:next');
                    }, 1000)
                } else {
                    if (model.state('autoEnd')) return;
                    events.trigger('autoplay:next');
                }
            }

            // FS
            if (model.state('FSMode')) {

                let rollResponse = model.data('rollResponse');
                if (rollResponse.WinLines.length > 0) {
                    if (model.state('evilBrain')) {
                        setTimeout(() => {
                            // if (model.state('fsEnd')) return;
                            events.trigger('fs:next');
                            model.state('evilBrain', false);
                        }, 1500);
                    } else {
                        setTimeout(() => {
                            // if (model.state('fsEnd')) return;
                            events.trigger('fs:next');
                        }, 1000);
                    }
                } else {
                    // if (model.state('fsEnd')) return;
                    events.trigger('fs:next');
                }

                let winSum = model.el('winSum');
                let totalWinSum = model.el('totalWinSum');

                // totalWinSum.text = rollResponse.FsBonus.TotalFSWinCoins;
                // winSum.text = rollResponse.Balance.TotalWinCoins;

            }
            model.state('roll:progress', false);
            model.state('ready', true);
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


    events.on('roll:request', startRoll);
    events.on('roll:end', endRoll);
    // events.on('autoplay:startRoll', rollRequest);

    return {
        init
    };

})();
