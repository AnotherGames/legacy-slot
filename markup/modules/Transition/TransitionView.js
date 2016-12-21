import { model } from 'modules/Model/Model';
import { config } from 'modules/Util/Config';

import { controller as keyboardController } from 'modules/Keyboard/KeyboardController'
import { controller as soundController } from 'modules/Sound/SoundController';

export let view = (() => {

    function fsStart() {
        let game = model.el('game');
        model.state('transitionScreen', true);
        // Запускаем затемнение
        let darkness = game.add.graphics();
            darkness.beginFill(0x000000);
            darkness.drawRect(0, 0, game.width, game.height);
        game.add.tween(darkness).to( { alpha: 0 }, 1500, 'Linear', true)
            .onComplete.add(() => {
                darkness.destroy();
            }, this);
        // Отрисовываем переходной экран
        _fsStartDraw();
        _fsStartTween();
        _fsStartInput();
        // Автопереход если включен
        if (model.state('autoTransititon')) {
            game.time.events.add(config.autoTransitionTime, () => {
                soundController.sound.playSound({sound : 'buttonClick'});
                soundController.music.stopMusic('startPerehod');
                model.el('game').state.start('FS');
                model.state('transitionScreen', false);
            });
        }
    }

    function _fsStartDraw() {
        let game = model.el('game');
        let transitionContainer = model.group('transition');
        // Изменяем музыку
        soundController.music.stopMusic('fon');
        soundController.music.playMusic('startPerehod');
        // Отрисовываем фон
        let transitionBGSky = game.add.sprite(0, 0, 'mainBGSky', null, transitionContainer);
        model.el('transitionBGSky', transitionBGSky);

        let luchi = game.add.sprite(game.world.centerX, game.world.centerY + 150, 'luchi', null, transitionContainer);
        luchi.anchor.set(0.5);
        model.el('luchi', luchi);

        let transitionBG = game.add.sprite(0, 0, 'initBG', null, transitionContainer);
        model.el('transitionBG', transitionBG);

        // Надпись Free Spins
        let freeSpinsText = game.add.sprite(game.width / 2,
            -400,
            'text',
            'freeSpins.png',
            transitionContainer);
            freeSpinsText.anchor.set(0.5);
        model.el('freeSpinsText', freeSpinsText);

        addLines({});
        // Счетчик Фри-Спинов
        let freeSpinsCount = model.data('rollResponse').FreeSpinsLeft;
        let freeSpinsLevel = game.add.bitmapText(game.width / 2, -200, 'numbersFont', freeSpinsCount, 120, transitionContainer);
            freeSpinsLevel.align = 'center';
            freeSpinsLevel.anchor.set(0.5);
            if (model.mobile) {
                freeSpinsLevel.scale.set(0.7);
            }
        model.el('freeSpinsLevel', freeSpinsLevel);

        // Кнопка продолжить
        let continueText = game.add.sprite(game.width / 2,
            game.world.height * 0.8,
            'text',
            'continue.png',
            transitionContainer);
            continueText.anchor.set(0.5);
            continueText.scale.setTo(0.1, 0.1);
        model.el('continueText', continueText);

    }

    function _fsStartTween() {
        let game = model.el('game');
        let freeSpinsText = model.el('freeSpinsText');
        let freeSpinsLevel = model.el('freeSpinsLevel');
        let luchi = model.el('luchi');
        let continueText = model.el('continueText');

        // Анимации появления
        game.add.tween(luchi).to({rotation: 2 * Math.PI, alpha: 0.1}, 30000, 'Linear', true, 0, -1, true);
        game.add.tween(freeSpinsText).to({y: game.height * 0.2}, 1500, Phaser.Easing.Bounce.Out, true);
        game.add.tween(freeSpinsLevel).to({y: game.height / 2}, 1500, Phaser.Easing.Bounce.Out, true);
        game.add.tween(continueText.scale).to({x: 1.0, y: 1.0}, 2500, Phaser.Easing.Elastic.Out, true)
            // Болтание кнопки продолжить
            .onComplete.add(() => {
                continueText.rotation = 0.1;
                game.add.tween(continueText).to({rotation: -0.1}, 100, 'Linear', true, 0, 4, true)
                    .onComplete.add(() => {
                        continueText.rotation = 0;
                    }, this);
            }, this);
    }

    function _fsStartInput() {
        let game = model.el('game');
        // При клике на фон будет переход на Фри-Спины
        let transitionBG = model.el('transitionBG');
            transitionBG.inputEnabled = true;
            transitionBG.input.priorityID = 2;
        transitionBG.events.onInputDown.add(function () {
            soundController.sound.playSound({sound : 'buttonClick'});
            soundController.music.stopMusic('startPerehod');
            model.el('game').state.start('FS');
            model.state('transitionScreen', false);
        });
    }

    function _fsStartHide() {
        // Автоматический переход на Фри-Спины
        soundController.music.stopMusic('startPerehod');
        soundController.music.playMusic('fsFon');
        let game = model.el('game');
        model.el('game').state.start('FS');
    }

    function fsFinish() {
        let game = model.el('game');
        // game.input.keyboard.enabled = true;
        keyboardController.initFsKeys();
        // Темнота
        let darkness = game.add.graphics();
            darkness.beginFill(0x000000);
            darkness.drawRect(0, 0, game.width, game.height);
        game.add.tween(darkness).to( { alpha: 0 }, 1500, 'Linear', true)
            .onComplete.add(() => {
                darkness.destroy();
            }, this);
        // Отрисовка финишного экрана
        _fsFinishDraw();
        _fsFinishTween();
        _fsFinishInput();
        // _coinsTween();
        model.state('maxFsMultiplier', false);
        // Автопереход
        if (model.state('autoTransititon')) {
            game.time.events.add(config.autoTransitionTime, () => {
                soundController.sound.playSound({sound : 'buttonClick'});
                soundController.music.stopMusic('finishPerehod');
                model.el('game').state.start('Main');
            });
        }
    }

    function _fsFinishDraw() {
        let game = model.el('game');
        let transitionContainer = model.group('transition');
        // Изменяем музыку
        soundController.music.stopMusic('fsFon');
        soundController.music.playMusic('finishPerehod');

        // Рисуем фон
        let transitionBGSky = game.add.sprite(0, 0, 'transitionSky', null, transitionContainer);
        model.el('transitionBGSky', transitionBGSky);

        let sun = game.add.sprite(game.world.centerX * 1.05, game.world.centerY, 'sun', null, transitionContainer);
        sun.anchor.set(0.5);
        model.el('sun', sun);

        let transitionBG = game.add.sprite(0, 0, 'transitionBG', null, transitionContainer);
        model.el('transitionBG', transitionBG);

        // выбираем надпись для конечного экрна (Big Win --- Total Win)
        let winTextFrame;
        if (model.data('fsMulti') === 8) {
            winTextFrame = 'bigW.png';
        } else {
            winTextFrame = 'totalW.png';
        }

        let winText = game.add.sprite(game.width / 2,
            -400,
            'text',
            winTextFrame,
            transitionContainer);
        winText.anchor.set(0.5);
        model.el('winText', winText);

        addLines({});

        // Отрисовываем Выигрыш
        let winCount = game.add.bitmapText(game.width / 2, -200, 'numbersFont', 0, 120, transitionContainer);
            winCount.align = 'center';
            winCount.anchor.set(0.5);
        if (model.mobile) {
            winCount.scale.set(0.7);
        }
        model.el('winCount', winCount);

        // И кнопку продолжить
        let continueText = game.add.sprite(game.width / 2,
            game.world.height * 0.85,
            'text',
            'continue.png',
            transitionContainer);
            continueText.anchor.set(0.5);
        if (model.mobile) {
            continueText.y = game.world.height * 0.85;
        }
        continueText.scale.setTo(0.1, 0.1);
        model.el('continueText', continueText);

    }
    // Накрутка выигрыша
    function _сountMeter(count, elem) {
        let game = model.el('game');

        let timeLength = config.countMeterTime;
        let _clock = game.time.create(true);
        _clock.add(timeLength, () => {}, this);
        _clock.start();

        let anim = function () {
            let timer = timeLength - _clock.duration;
            let progress = timer / timeLength;
            if (progress > 1) {
                progress = 1;
            }
            elem.setText( parseInt(count * progress) );

            if (progress === 1) {
                game.frameAnims.splice(game.frameAnims.indexOf(anim), 1);
            }

        };
        game.frameAnims.push(anim);
    }

    // Монетки на победном экране
    // function _addCoin(container) {
    //     let game = model.el('game');
    //     if (container.y >= game.height * 5.7) return;
    //
    //     let posX = game.rnd.integerInRange(game.width * 0.1, game.width * 0.9);
    //     let coin = game.add.sprite(posX, container.y * -1 - 100, 'transitionCoin', null, container);
    //     coin.anchor.set(0.5);
    //     let scale = game.rnd.integerInRange(50, 100) / 75;
    //     coin.scale.set(scale, scale);
    //     let height = coin.height;
    //     coin.height = game.rnd.integerInRange(height * 0.3, height);
    //     let tween = game.add.tween(coin)
    //         .to({rotation: 200}, 1000, 'Linear', true)
    //         .start();
    //     tween.onComplete.add(() => {
    //         coin.destroy();
    //     });
    //     game.add.tween(coin)
    //         .to({height: height}, 200, 'Linear')
    //         .to({height: height * 0.2}, 100, 'Linear')
    //         .to({height: height}, 200, 'Linear')
    //         .to({height: height * 0.2}, 100, 'Linear')
    //         .to({height: height}, 200, 'Linear')
    //         .to({height: height * 0.2}, 100, 'Linear')
    //         .to({height: height}, 200, 'Linear')
    //         .start();
    //
    //     game.time.events.add(75, () => {
    //         _addCoin(container)
    //     });
    // }
    //
    // function _coinsTween() {
    //     let game = model.el('game');
    //     let coinsContainer = game.add.group();
    //     _addCoin(coinsContainer);
    //     game.add.tween(coinsContainer).to({y: game.height * 7}, 5000, 'Linear', true);
    // }

    function _fsFinishTween() {
        let game = model.el('game');
        let winText = model.el('winText');
        let winCount = model.el('winCount');
        let sun = model.el('sun');
        let continueText = model.el('continueText');

        game.add.tween(sun).to({y: sun.y + 500}, 20000, 'Linear', true);
        game.add.tween(winText).to({y: game.height * 0.2}, 1500, Phaser.Easing.Bounce.Out, true)
            .onComplete.add(() => {
                let winCountValue = model.data('rollResponse').FsBonus.TotalFSWinCoins + model.data('rollResponse').Balance.TotalWinCoins;
                _сountMeter(winCountValue, winCount);
            });
        game.add.tween(winCount).to({y: game.height * 0.5}, 1500, Phaser.Easing.Bounce.Out, true);
        game.add.tween(continueText.scale).to({x: 1.0, y: 1.0}, 2500, Phaser.Easing.Elastic.Out, true)
            .onComplete.add(() => {
                continueText.rotation = 0.1;
                game.add.tween(continueText).to({rotation: -0.1}, 100, 'Linear', true, 0, 4, true)
                    .onComplete.add(() => {
                        continueText.rotation = 0;
                    }, this);
            }, this);
    }

    function _fsFinishInput() {
        let transitionBG = model.el('transitionBG');
        transitionBG.inputEnabled = true;
        transitionBG.input.priorityID = 2;
        transitionBG.events.onInputDown.add(function () {
            soundController.sound.playSound({sound : 'buttonClick'});
            soundController.music.stopMusic('finishPerehod');
            model.el('game').state.start('Main');
        });
    }

    function _fsFinishHide() {
        console.log('i am finishing fs after timeout');
        soundController.music.stopMusic('finishPerehod');
        soundController.music.playMusic('fon');
        let game = model.el('game');
        model.el('game').state.start('Main');
    }

    function addCloud({
        x = model.el('game').rnd.integerInRange(0, model.el('game').width),
        container = model.group('bg')
    }) {
        let game = model.el('game');
        let random = game.rnd.integerInRange(3, 10);

        // let number = game.rnd.integerInRange(1, 4);
        // let cloud = game.add.sprite(0, 150, 'clouds', `cloud${number}.png`, container);
        let cloud = game.add.sprite(0, 150, 'cloud', null, container);
        cloud.anchor.set(0.5);
        cloud.scale.set(random / 10);

        let time = game.rnd.integerInRange(40, 60);
        let side = game.rnd.integerInRange(0, 1) ? 'left' : 'right';
        // let delta;
        if (model.desktop) {
            cloud.y = cloud.y = cloud.y + game.rnd.integerInRange(0, 250);
        } else {
            cloud.y = cloud.y = cloud.y + game.rnd.integerInRange(0, 100);
        }
        cloud.x = x;

        if (container === model.group('bg')){
            cloud.x = (side === 'left') ? -cloud.width : game.width + cloud.width;
        }
        let delta = (side === 'left') ? game.width + cloud.width : -cloud.width;

        game.add.tween(cloud).to({x: delta}, time * 1000, 'Linear', true)
            .onComplete.add(() => {
                cloud.destroy();
                // if (container === model.group('bg') && model.state('isAnimations' == false)){
                //     addCloud({container: model.group('bg')});
                // }
            }, this);

    }

    function addLines({
        game = model.el('game'),
        container = model.group('transition')
    }) {
        let linesArr = [];
        let amount = Math.random() * 5 + 2;
        for (let i = 0; i < amount; i++) {
            let fonLine = game.add.sprite(game.rnd.integerInRange(0, game.width), 0, 'fonLine', null, container);
                fonLine.alpha = game.rnd.integerInRange(3, 10) / 10;
            linesArr.push(fonLine);
        }

        let fonLine2 = game.add.sprite(0, 0, 'fonLine', null, container);
        fonLine2.alpha = 0.6;
        game.add.tween(fonLine2).to({x: game.width}, 30000, 'Linear', true, 0, -1)

        // передвигаем линии
        moveLines(linesArr);

    }

    function moveLines(linesArr) {
        let game = model.el('game');

        linesArr.forEach((lineSprite) => {
            game.time.events.add(game.rnd.integerInRange(20, 150), () => {
                lineSprite.x = game.rnd.integerInRange(0, game.width);
                lineSprite.alpha = game.rnd.integerInRange(3, 10) / 10;
                let curX = lineSprite.x;
                game.add.tween(lineSprite).to({x: game.rnd.integerInRange(curX - 3, curX + 3), alpha: lineSprite.alpha - 0.2}, 30, 'Linear', true, 0, 5, true);
            });
        });

        game.time.events.add(game.rnd.integerInRange(500, 1000), () => {
            moveLines(linesArr);
        });
    }

    return {
        fsStart,
        fsFinish,
        addCloud,
        addLines
    }

})();
