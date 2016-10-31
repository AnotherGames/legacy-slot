import { model } from 'modules/Model/Model';
import { events } from 'modules/Events/Events';
import { Wheel } from 'modules/Wheel/Wheel';
import { config } from 'modules/Util/Config';
import { util } from 'modules/Util/Util';


export let roll = (function() {

    function initWheels(currentScreen, options) {
        let game = model.el('game');
        let machineContainer = model.el('machineContainer');
        let wheels = [];
        let elSize = config[model.state('res')].elements;

        let firstScreen = model.data('firstScreen');
        let firstWheels = Array(5);

        firstScreen.forEach((row, rowIndex) => {
            row.forEach((el, colIndex) => {
                firstWheels[colIndex] = firstWheels[colIndex] || [];
                firstWheels[colIndex].push(el);
            });
        });

        console.log(firstWheels);

        for (let i = -2; i < 3; i++) {
            wheels.push(new Wheel({
                game, // в опциях можно передавать состояние и контейнер в котором создавать колеса
                parent: machineContainer,
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

    function requestRoll(options) {
        util.request('_Roll').then((data) => {

            let nextScreen = data.Screen;
            let nextWheels = Array(5);

            nextScreen.forEach((row, rowIndex) => {
                row.forEach((el, colIndex) => {
                    nextWheels[colIndex] = nextWheels[colIndex] || [];
                    nextWheels[colIndex].push(el);
                });
            });

            startRoll(nextWheels, options);

        });
    }

    function startRoll(finishScreen, options) {
        let wheels = model.el('wheels');
        let game = model.el('game');

        let countFinish = 0;
        let callback = function () {
            ++countFinish;
            if (countFinish === 5) {
                events.trigger('roll:rollFinished');
                console.log('Roll finished!');
            }
        };

        wheels.forEach((wheel, columnIndex) => {
            // Roll
            game.time.events.add(columnIndex * config.wheel.roll.deltaTime, () => {
                wheel.roll(finishScreen[columnIndex] || config.wheel.roll.finishScreen, {
                    time: options.time,
                    length: options.length,
                    easingSeparation: options.ease,
                    callback
                });
            }, wheel);

        });
    }

    events.on('roll:initWheels', initWheels);
    events.on('roll:requestRoll', requestRoll);

    return {
        initWheels,
        startRoll
    }

})();
