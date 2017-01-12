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
        game.input.keyboard.enabled = true;
        // Автопереход если включен
        if (model.state('autoTransititon')) {
            game.time.events.add(config.autoTransitionTime, transitionInFs);
        }
    }

    function _fsStartDraw() {
        let game = model.el('game');
        let transitionContainer = model.group('transition');
        game.camera.flash(0x000000, 777)
        // Изменяем музыку
        soundController.music.stopMusic('fon');
        soundController.music.playMusic('startPerehod');
        // Отрисовываем фон

        let transitionBG = game.add.graphics(0, 0).beginFill(0x000000, 0.9).drawRect(0, 0, game.world.width, game.world.height);
        transitionContainer.add(transitionBG);
        model.el('transitionBG', transitionBG);

        let freeSpinsBG = game.add.sprite(game.world.centerX, game.height * 0.37, 'transitionFS', null, transitionContainer);
        freeSpinsBG.anchor.set(0.5);
        freeSpinsBG.scale.set(0.1);
        model.el('freeSpinsBG', freeSpinsBG);

        // Надпись Free Spins
        let freeSpinsText = game.add.sprite(game.width / 2,
            -400,
            'text',
            'freeSpins.png',
            transitionContainer);
            freeSpinsText.anchor.set(0.5);
        model.el('freeSpinsText', freeSpinsText);

        // Счетчик Фри-Спинов
        let freeSpinsCount = model.data('rollResponse').FreeSpinsLeft;
        let freeSpinsLevel = game.add.bitmapText(game.width / 2, game.height / 2, 'numbersFont', freeSpinsCount, 140, transitionContainer);
            freeSpinsLevel.align = 'center';
            freeSpinsLevel.anchor.set(0.5);
            freeSpinsLevel.scale.set(0.1);
        model.el('freeSpinsLevel', freeSpinsLevel);

        // Кнопка продолжить
        let continueText = game.add.sprite(game.width / 2,
            -200,
            'text',
            'continue.png',
            transitionContainer);
            continueText.anchor.set(0.5);
        model.el('continueText', continueText);

    }

    function _fsStartTween() {
        let game = model.el('game');
        let freeSpinsText = model.el('freeSpinsText');
        let freeSpinsLevel = model.el('freeSpinsLevel');
        let freeSpinsBG = model.el('freeSpinsBG');
        let continueText = model.el('continueText');
        let scaleX = (model.desktop) ? 1.0 : 0.7;
        let scaleY = (model.desktop) ? 1.0 : 0.7;

        // Анимации появления
        game.add.tween(freeSpinsLevel.scale).to({x: scaleX, y: scaleY}, 1500, Phaser.Easing.Elastic.Out, true);
        game.add.tween(freeSpinsBG.scale).to({x: scaleX, y: scaleY}, 1500, Phaser.Easing.Elastic.Out, true);
        game.add.tween(freeSpinsText).to({y: game.height * 0.2}, 1500, Phaser.Easing.Bounce.Out, true, 1500);
        game.add.tween(continueText).to({y: game.height * 0.8}, 1500, Phaser.Easing.Bounce.Out, true, 1500)
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
        transitionBG.events.onInputDown.add(transitionInFs);
    }

    function transitionInFs() {
        soundController.sound.playSound({sound : 'buttonClick'});
        soundController.music.stopMusic('startPerehod');
        model.el('game').state.start('FS');
        model.state('transitionScreen', false);
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
        game.camera.flash(0x000000, 777)
        // Изменяем музыку
        soundController.music.stopMusic('fsFon');
        soundController.music.playMusic('finishPerehod');

        // Рисуем фон
        let transitionBG = game.add.graphics(0, 0).beginFill(0x000000, 0.9).drawRect(0, 0, game.world.width, game.world.height);
        transitionContainer.add(transitionBG);
        model.el('transitionBG', transitionBG);

        let winBG = game.add.sprite(game.world.centerX, game.height * 0.37, 'transitionFS', null, transitionContainer);
        winBG.anchor.set(0.5);
        winBG.scale.set(0.1);
        model.el('winBG', winBG);

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

        // Отрисовываем Выигрыш
        let winCount = game.add.bitmapText(game.width / 2, game.height * 0.5, 'numbersFont', 0, 140, transitionContainer);
            winCount.align = 'center';
            winCount.anchor.set(0.5);
            winCount.scale.set(0.1);
        model.el('winCount', winCount);

        // И кнопку продолжить
        let continueText = game.add.sprite(game.width / 2,
            -200,
            'text',
            'continue.png',
            transitionContainer);
            continueText.anchor.set(0.5);
        model.el('continueText', continueText);

    }

    function _fsFinishTween() {
        let game = model.el('game');
        let winText = model.el('winText');
        let winCount = model.el('winCount');
        let winBG = model.el('winBG');
        let continueText = model.el('continueText');
        let scaleX = (model.desktop) ? 1.0 : 0.7;
        let scaleY = (model.desktop) ? 1.0 : 0.7;

        game.add.tween(winText).to({y: game.height * 0.2}, 1500, Phaser.Easing.Bounce.Out, true)
            .onComplete.add(() => {
                let winCountValue = model.data('rollResponse').FsBonus.TotalFSWinCoins + model.data('rollResponse').Balance.TotalWinCoins;
                _сountMeter(winCountValue, winCount);
            });
        game.add.tween(winCount.scale).to({x: scaleX, y: scaleY}, 1500, Phaser.Easing.Elastic.Out, true);
        game.add.tween(winBG.scale).to({x: scaleX, y: scaleY}, 1500, Phaser.Easing.Elastic.Out, true);
        game.add.tween(continueText).to({y: game.height * 0.85}, 1500, Phaser.Easing.Bounce.Out, true)
            .onComplete.add(() => {
                continueText.rotation = 0.1;
                game.add.tween(continueText).to({rotation: -0.1}, 100, 'Linear', true, 0, 4, true)
                    .onComplete.add(() => {
                        continueText.rotation = 0;
                    }, this);
            }, this);
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



    return {
        fsStart,
        fsFinish,
        transitionInFs

    }

})();
