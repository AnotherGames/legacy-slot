import { model } from 'modules/Model/Model';
import { config } from 'modules/Util/Config';

import { controller as keyboardController } from 'modules/Keyboard/KeyboardController';
import { controller as soundController } from 'modules/Sound/SoundController';

import { view as mainView } from 'modules/States/Main/MainView';

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
                soundController.sound.playSound({currentSound: 'buttonClick'});
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

        let transitionBG = game.add.graphics(0, 0, transitionContainer).beginFill(0x000000, 0.8).drawRect(0, 0, game.width, game.height);
        model.el('transitionBG', transitionBG);

        mainView.draw.addShark({container: transitionContainer});
        // Надпись Free Spins
        let freeSpinsText = game.add.sprite(game.width / 2, -400, 'text', 'freespin.png', transitionContainer);
        freeSpinsText.anchor.set(0.5);
        // freeSpinsText.scale.set(0.1);
        model.el('freeSpinsText', freeSpinsText);

        // Счетчик Фри-Спинов
        let freeSpinsCount = model.data('rollResponse').FreeSpinsLeft;
        let freeSpinsLevel = game.add.bitmapText(game.width / 2, -400, 'numbersFont', freeSpinsCount, 120, transitionContainer);
        freeSpinsLevel.align = 'center';
        freeSpinsLevel.anchor.set(0.5);
        (model.desktop) ? freeSpinsLevel.scale.set(0.6) : freeSpinsLevel.scale.set(0.3) ;
        model.el('freeSpinsLevel', freeSpinsLevel);

        // Надпись Multi
        let multiText = game.add.sprite(game.width / 2, game.height * 0.2, 'text', 'multiplay.png', transitionContainer);
        multiText.anchor.set(0.5);
        multiText.scale.set(0.1);
        multiText.alpha = 0;
        model.el('multiText', multiText);

        // Счетчик Multi
        let multiLevel = game.add.bitmapText(game.width / 2, game.height * 0.6, 'numbersFont', 'x2', 120, transitionContainer);
        multiLevel.align = 'center';
        multiLevel.anchor.set(0.5);
        multiLevel.scale.set(0.1);
        multiLevel.alpha = 0;
        model.el('multiLevel', multiLevel);

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
        let multiText = model.el('multiText');
        let multiLevel = model.el('multiLevel');
        let continueText = model.el('continueText');
        let scaleX = (model.desktop) ?  0.6 : 0.3;
        let scaleY = (model.desktop) ?  0.6 : 0.3;

        let delta = (model.mobile) ? 215 : 160;

        function _addFSBG(){
            game.add.tween(freeSpinsText).to({y: game.height * 0.2}, 1500, Phaser.Easing.Bounce.Out, true);
            game.add.tween(freeSpinsLevel).to({y: game.height * 0.6}, 1500, Phaser.Easing.Bounce.Out, true)
                .onComplete.add(() => {
                    _removeFSBG();
                }, this);
        }

        function _removeFSBG() {
            game.add.tween(freeSpinsText.scale).to({x: 0.1, y: 0.1}, 500, Phaser.Easing.Elastic.Out, true);
            game.add.tween(freeSpinsLevel.scale).to({x: 0.1, y: 0.1}, 500, Phaser.Easing.Elastic.Out, true);
            game.add.tween(freeSpinsText).to({alpha: 0}, 250, Phaser.Easing.Elastic.Out, true);
            game.add.tween(freeSpinsLevel).to({alpha: 0}, 250, Phaser.Easing.Elastic.Out, true)
            _addMultiBG();
        }

        function _addMultiBG() {
            game.add.tween(multiText).to({alpha: 1}, 500, 'Linear', true);
            game.add.tween(multiLevel).to({alpha: 1}, 500, 'Linear', true);
            game.add.tween(multiText.scale).to({x: 1.0, y: 1.0}, 1500, Phaser.Easing.Elastic.Out, true);
            game.add.tween(multiLevel.scale).to({x: scaleX, y: scaleY}, 1500, Phaser.Easing.Elastic.Out, true)
                .onComplete.add(() => {
                    _removeMultiBG();
                }, this);
        }

        function _removeMultiBG() {
            let fsLevelScale = (model.mobile) ? 0.75 : 1;

            game.add.tween(multiText.scale).to({x: 0.1, y: 0.1}, 500, Phaser.Easing.Elastic.Out, true);
            game.add.tween(multiLevel.scale).to({x: 0.1, y: 0.1}, 500, Phaser.Easing.Elastic.Out, true);
            game.add.tween(multiText).to({alpha: 0}, 250, Phaser.Easing.Elastic.Out, true);
            game.add.tween(multiLevel).to({alpha: 0}, 250, Phaser.Easing.Elastic.Out, true);
            game.add.tween(freeSpinsText).to({alpha: 1}, 500, 'Linear', true);
            game.add.tween(freeSpinsLevel).to({alpha: 1}, 500, 'Linear', true);
            game.add.tween(freeSpinsText.scale).to({x: 1.0, y: 1.0}, 1500, Phaser.Easing.Elastic.Out, true);
            game.add.tween(freeSpinsLevel.scale).to({x: scaleX, y: scaleY}, 1500, Phaser.Easing.Elastic.Out, true)
                .onComplete.add(() => {
                    _removeFSBG();
                })

        }

        // Анимации появления
        _addFSBG();

        game.add.tween(continueText.scale).to({x: 1.0, y: 1.0}, 2500, Phaser.Easing.Elastic.Out, true)
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
            soundController.sound.playSound({currentSound: 'buttonClick'});
            soundController.music.stopMusic('startPerehod');
            model.el('game').state.start('FS');
            model.state('transitionScreen', false);
        });
    }

    function fsFinish() {
        let game = model.el('game');
        // game.input.keyboard.enabled = true;
        keyboardController.initFsKeys();
        model.state('buttons:locked', false);
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
                soundController.sound.playSound({currentSound: 'buttonClick'});
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
        soundController.sound.playSound({currentSound: 'win'});

        // Рисуем фон

        let transitionBG = game.add.graphics(0, 0, transitionContainer).beginFill(0x000000, 0.8).drawRect(0, 0, game.width, game.height);
        model.el('transitionBG', transitionBG);

        mainView.draw.addShark({container: transitionContainer});
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
        let winCount = game.add.bitmapText(game.width / 2, game.height * 0.6, 'numbersFont', '0', 120, transitionContainer);
        winCount.align = 'center';
        winCount.anchor.set(0.5);
        winCount.scale.set(0.1);
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

    function _fsFinishTween() {
        let game = model.el('game');
        let winText = model.el('winText');
        let winCount = model.el('winCount');
        let continueText = model.el('continueText');
        let scaleX = (model.desktop) ? 0.6 : 0.3;
        let scaleY = (model.desktop) ? 0.6 : 0.3;

        game.add.tween(winText.scale).to({x: 1.0, y: 1.0}, 1500, Phaser.Easing.Bounce.Out, true);
        let winCountValue = model.data('rollResponse').FsBonus.TotalFSWinCoins + model.data('rollResponse').Balance.TotalWinCoins;
        _сountMeter(winCountValue, winCount);

        game.add.tween(winCount.scale).to({x: scaleX, y: scaleY}, 1500, Phaser.Easing.Bounce.Out, true);
        game.add.tween(continueText.scale).to({x: 1.0, y: 1.0}, 1500, Phaser.Easing.Bounce.Out, true)
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
            soundController.sound.playSound({currentSound: 'buttonClick'});
            soundController.sound.stopSound({currentSound: 'win'});
            soundController.music.stopMusic('finishPerehod');
            model.el('game').state.start('Main');
        });
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

    // Бонусный экран
    function bonusStart() {
        let game = model.el('game');
        model.state('transitionScreen', true);
        // Запускаем затемнение
        game.camera.flash(0x000000, 500);
        // Отрисовываем переходной экран
        _bonusStartDraw();
        _bonusStartTween();
        _bonusStartInput();
        game.input.keyboard.enabled = true;
        // Автопереход если включен
        if (model.state('autoTransititon')) {
            game.time.events.add(config.autoTransitionTime, () => {
                soundController.sound.playSound({currentSound: 'buttonClick'});
                soundController.music.stopMusic('startPerehod');
                model.el('game').state.start('Bonus');
                model.state('transitionScreen', false);
            });
        }
    }

    function _bonusStartDraw() {
        let game = model.el('game');
        let transitionContainer = model.group('transition');
        // Изменяем музыку
        soundController.music.stopMusic('fon');
        soundController.music.playMusic('startPerehod');

        // Отрисовываем фон
        let transitionBG = game.add.graphics(0, 0, transitionContainer).beginFill(0x000000, 0.8).drawRect(0, 0, game.width, game.height);
        model.el('transitionBG', transitionBG);

        // Надпись Bonus
        let bonusText = game.add.sprite(game.width / 2, game.height * 0.2, 'text', 'bonusLevel.png', transitionContainer);
        bonusText.anchor.set(0.5);
        bonusText.scale.set(0.1);
        model.el('bonusText', bonusText);

        // Fish
        let fishBonus = game.add.sprite(game.width / 2, game.height * 0.5, 'bonusFish', null, transitionContainer);
        fishBonus.anchor.set(0.5);
        fishBonus.scale.set(0.1);
        model.el('fishBonus', fishBonus);

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

    function _bonusStartTween() {
        let game = model.el('game');
        let bonusText = model.el('bonusText');
        let fishBonus = model.el('fishBonus');
        let continueText = model.el('continueText');

        // Анимации появления
        game.add.tween(bonusText.scale).to({x: 1.0, y: 1.0}, 1500, Phaser.Easing.Bounce.Out, true);
        game.add.tween(fishBonus.scale).to({x: 1.0, y: 1.0}, 1500, Phaser.Easing.Bounce.Out, true);
        game.add.tween(continueText.scale).to({x: 1.0, y: 1.0}, 1500, Phaser.Easing.Bounce.Out, true)
            // Болтание кнопки продолжить
            .onComplete.add(() => {
                continueText.rotation = 0.1;
                game.add.tween(continueText).to({rotation: -0.1}, 100, 'Linear', true, 0, 4, true)
                    .onComplete.add(() => {
                        continueText.rotation = 0;
                    }, this);
            }, this);
    }

    function _bonusStartInput() {
        // При клике на фон будет переход на Фри-Спины
        let transitionBG = model.el('transitionBG');
        transitionBG.inputEnabled = true;
        transitionBG.input.priorityID = 2;
        transitionBG.events.onInputDown.add(function () {
            soundController.sound.playSound({currentSound: 'buttonClick'});
            soundController.music.stopMusic('startPerehod');
            model.el('game').state.start('Bonus');
            model.state('transitionScreen', false);
        });
    }

    return {
        fsStart,
        fsFinish,
        bonusStart
    };

})();
