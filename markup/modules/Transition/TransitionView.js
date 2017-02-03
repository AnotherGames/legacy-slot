import { model } from 'modules/Model/Model';
import { config } from 'modules/Util/Config';

import { controller as keyboardController } from 'modules/Keyboard/KeyboardController';
import { controller as soundController } from 'modules/Sound/SoundController';

export let view = (() => {

    function fsStart() {
        let game = model.el('game');
        model.state('transitionScreen', true);
        // Запускаем затемнение
        game.camera.flash(0x000000, 500);
        // Отрисовываем переходной экран
        _fsStartDraw();
        _fsStartTween();
        _fsStartInput();
        game.input.keyboard.enabled = true;
        // Автопереход если включен
        if (model.state('autoTransititon')) {
            game.time.events.add(config.autoTransitionTime, () => {
                soundController.sound.playSound({sound: 'buttonClick'});
                soundController.music.stopMusic('startPerehod');
                model.el('game').state.start('FS');
                model.state('transitionScreen', false);
            });
        }
    }

    function _fsStartDraw() {
        let game = model.el('game');
        let transitionContainer = model.group('transition');
        game.camera.flash(0x000000, 777);
        // Изменяем музыку
        soundController.music.stopMusic('fon');
        soundController.music.playMusic('startPerehod');
        // Отрисовываем фон

        let transitionBG = game.add.sprite(0, 0, 'transitionBG1', null, transitionContainer);
        model.el('transitionBG', transitionBG);

        // Надпись Free Spins
        let freeSpinsText = game.add.sprite(game.width / 2, game.height * 0.2, 'text', 'freespins.png', transitionContainer);
        freeSpinsText.anchor.set(0.5);
        freeSpinsText.scale.set(0.1);
        model.el('freeSpinsText', freeSpinsText);

        // Счетчик Фри-Спинов
        let freeSpinsCount = model.data('rollResponse').FreeSpinsLeft;
        let freeSpinsLevel = game.add.bitmapText(game.width / 2, game.height / 2, 'numbersFont', freeSpinsCount, 120, transitionContainer);
        freeSpinsLevel.align = 'center';
        freeSpinsLevel.anchor.set(0.5);
        freeSpinsLevel.scale.set(0.1);
        model.el('freeSpinsLevel', freeSpinsLevel);

        let diverChar = game.add.sprite(-800, game.height * 0.85, 'diverChar', null, transitionContainer);
        diverChar.anchor.set(0.5);
        diverChar.angle = -60;
        model.el('diverChar', diverChar);

        let octopusChar = game.add.sprite(game.width + 800, game.height * 0.85, 'octopusChar', null, transitionContainer);
        octopusChar.anchor.set(0.5);
        octopusChar.angle = 60;
        model.el('octopusChar', octopusChar);

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
        let continueText = model.el('continueText');
        let diverChar = model.el('diverChar');
        let octopusChar = model.el('octopusChar');
        let scaleX = (model.desktop) ? 1.0 : 0.7;
        let scaleY = (model.desktop) ? 1.0 : 0.7;

        // Анимации появления
        game.add.tween(freeSpinsText.scale).to({x: 1.0, y: 1.0}, 1500, Phaser.Easing.Bounce.Out, true);
        game.add.tween(freeSpinsLevel.scale).to({x: scaleX, y: scaleY}, 1500, Phaser.Easing.Bounce.Out, true);
        game.add.tween(continueText.scale).to({x: 1.0, y: 1.0}, 1500, Phaser.Easing.Bounce.Out, true);
        game.add.tween(diverChar).to({x: game.width * 0.1, y: game.height * 0.55, angle: 0}, 500, Phaser.Easing.Cubic.Out, true, 1500);
        game.add.tween(octopusChar).to({x: game.width * 0.82, y: game.height * 0.65, angle: 0}, 500, Phaser.Easing.Cubic.Out, true, 2000)
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
        // При клике на фон будет переход на Фри-Спины
        let transitionBG = model.el('transitionBG');
        transitionBG.inputEnabled = true;
        transitionBG.input.priorityID = 2;
        transitionBG.events.onInputDown.add(function () {
            soundController.sound.playSound({sound: 'buttonClick'});
            soundController.music.stopMusic('startPerehod');
            model.el('game').state.start('FS');
            model.state('transitionScreen', false);
        });
    }

    function _fsStartHide() {
        // Автоматический переход на Фри-Спины
        soundController.music.stopMusic('startPerehod');
        soundController.music.playMusic('fsFon');
        model.el('game').state.start('FS');
    }

    function fsFinish() {
        let game = model.el('game');
        // game.input.keyboard.enabled = true;
        keyboardController.initFsKeys();
        // Темнота
        game.camera.flash(0x000000, 500);
        // Отрисовка финишного экрана
        _fsFinishDraw();
        _fsFinishTween();
        _fsFinishInput();
        // _coinsTween();
        model.state('maxFsMultiplier', false);
        // Автопереход
        if (model.state('autoTransititon')) {
            game.time.events.add(config.autoTransitionTime, () => {
                soundController.sound.playSound({sound: 'buttonClick'});
                soundController.music.stopMusic('finishPerehod');
                model.el('game').state.start('Main');
            });
        }
    }

    function _fsFinishDraw() {
        let game = model.el('game');
        let transitionContainer = model.group('transition');
        game.camera.flash(0x000000, 777);
        // Изменяем музыку
        soundController.music.stopMusic('fsFon');
        soundController.music.playMusic('finishPerehod');
        soundController.sound.playSound({sound: 'win'});

        // Рисуем фон
        let transitionBG = game.add.sprite(0, 0, 'transitionBG2', null, transitionContainer);
        model.el('transitionBG', transitionBG);

        // выбираем надпись для конечного экрна (Big Win --- Total Win)
        let winTextFrame;
        if (model.data('fsMulti') === 7) {
            winTextFrame = 'bigW.png';
        } else {
            winTextFrame = 'totalW.png';
        }

        let winText = game.add.sprite(game.width / 2,
            game.height * 0.2,
            'text',
            winTextFrame,
            transitionContainer);
        winText.anchor.set(0.5);
        winText.scale.set(0.1);
        model.el('winText', winText);

        // Отрисовываем Выигрыш
        let winCount = game.add.bitmapText(game.width / 2, game.height / 2 - 50, 'numbersFont', '0', 120, transitionContainer);
        winCount.align = 'center';
        winCount.anchor.set(0.5);
        winCount.scale.set(0.1);
        model.el('winCount', winCount);

        let diverChar = game.add.sprite(-800, game.height * 0.85, 'diverChar', null, transitionContainer);
        diverChar.anchor.set(0.5);
        diverChar.angle = -60;
        model.el('diverChar', diverChar);

        let octopusChar = game.add.sprite(game.width + 800, game.height * 0.85, 'octopusChar', null, transitionContainer);
        octopusChar.anchor.set(0.5);
        octopusChar.angle = 60;
        model.el('octopusChar', octopusChar);

        let treasureChest = game.add.sprite(game.width / 2, -400, '14', '14-n-00.png', transitionContainer);
        treasureChest.anchor.set(0.5);
        treasureChest.scale.set(1.8);
        treasureChest.animations.add('open', Phaser.Animation.generateFrameNames('14-w-', 0, 29, '.png', 2), 20, false);
        model.el('treasureChest', treasureChest);

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

    function _fsFinishTween() {
        let game = model.el('game');
        let winText = model.el('winText');
        let winCount = model.el('winCount');
        let continueText = model.el('continueText');
        let diverChar = model.el('diverChar');
        let octopusChar = model.el('octopusChar');
        let treasureChest = model.el('treasureChest');
        let scaleX = (model.desktop) ? 1.0 : 0.7;
        let scaleY = (model.desktop) ? 1.0 : 0.7;

        game.add.tween(winText.scale).to({x: 1.0, y: 1.0}, 1500, Phaser.Easing.Bounce.Out, true)
            .onComplete.add(() => {
                let winCountValue = model.data('rollResponse').FsBonus.TotalFSWinCoins + model.data('rollResponse').Balance.TotalWinCoins;
                _сountMeter(winCountValue, winCount);
            });
        game.add.tween(winCount.scale).to({x: scaleX, y: scaleY}, 1500, Phaser.Easing.Bounce.Out, true);
        game.add.tween(continueText.scale).to({x: 1.0, y: 1.0}, 1500, Phaser.Easing.Bounce.Out, true);
        game.add.tween(diverChar).to({x: game.width * 0.1, y: game.height * 0.55, angle: 0}, 500, Phaser.Easing.Cubic.Out, true, 1500);
        game.add.tween(octopusChar).to({x: game.width * 0.82, y: game.height * 0.65, angle: 0}, 500, Phaser.Easing.Cubic.Out, true, 2000);
        game.add.tween(treasureChest).to({y: game.height * 0.65}, 1000, Phaser.Easing.Elastic.Out, true, 2500)
            .onComplete.add(() => {
                treasureChest.animations.play('open');
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
            soundController.sound.playSound({sound: 'buttonClick'});
            soundController.sound.stopSound({sound: 'win'});
            soundController.music.stopMusic('finishPerehod');
            model.el('game').state.start('Main');
        });
    }

    function _fsFinishHide() {
        console.log('i am finishing fs after timeout');
        soundController.sound.stopSound({sound: 'win'});
        soundController.music.stopMusic('finishPerehod');
        // soundController.music.playMusic('fon');
        model.el('game').state.start('Main');
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
            elem.setText( parseInt(count * progress, 10) );

            if (progress === 1) {
                game.frameAnims.splice(game.frameAnims.indexOf(anim), 1);
            }

        };
        game.frameAnims.push(anim);
    }

    return {
        fsStart,
        fsFinish
    };

})();
