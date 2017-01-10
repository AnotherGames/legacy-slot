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
        // Прячем лого
        let gameLogo = model.el('gameLogo');
            gameLogo.visible = false;
        // Отрисовываем фон
        let transitionBG = game.add.graphics(0, 0, transitionContainer).beginFill(0x000000, 0.9).drawRect(0, 0, game.width, game.height);
        model.el('transitionBG', transitionBG);
        let freeSpinsBG = game.add.sprite(game.width / 2, -400, 'freeSpins', null, transitionContainer);
            freeSpinsBG.anchor.set(0.5);
        model.el('freeSpinsBG', freeSpinsBG);
        // Количество фри-спинов
        let freeSpinsCount = model.data('rollResponse').FreeSpinsLeft;
        let freeSpinsLevel = game.add.bitmapText(game.width / 2 - 15, -400, 'numbersFont', freeSpinsCount, 120, transitionContainer);
            freeSpinsLevel.align = 'center';
            freeSpinsLevel.anchor.set(0.5);
        if (model.mobile) {
            freeSpinsLevel.scale.set(0.75);
        }
        model.el('freeSpinsLevel', freeSpinsLevel);
        // Рисуем подложку для множителя
        let multiBG = game.add.sprite(game.width / 2, game.height * 0.44, 'multiplier', null, transitionContainer);
            multiBG.anchor.set(0.5);
            multiBG.alpha = 0;
            multiBG.scale.setTo(0.1, 0.1);
        model.el('multiBG', multiBG);

        let delta = (model.desktop) ? 50 : 25;
        // Отрисовуем множитель
        let multiValue = model.data('rollResponse').NextMode.split('-')[1];
        let multiLevel = game.add.sprite(game.width / 2, multiBG.y + delta, 'multiNumbers', `multi${multiValue}.png`, transitionContainer);
            multiLevel.align = 'center';
            multiLevel.anchor.set(0.5);
            multiLevel.alpha = 0;
            multiLevel.scale.setTo(0.1, 0.1);
        model.el('multiLevel', multiLevel);

        // Кнопка продолжить
        let continueText = game.add.sprite(game.width / 2,
            game.world.height * 0.7,
            'text',
            'continue.png',
            transitionContainer);
            continueText.anchor.set(0.5);
            continueText.scale.setTo(0.1, 0.1);
        model.el('continueText', continueText);

    }

    function _fsStartTween() {
        let game = model.el('game');
        let freeSpinsBG = model.el('freeSpinsBG');
        let freeSpinsLevel = model.el('freeSpinsLevel');
        let multiBG = model.el('multiBG');
        let multiLevel = model.el('multiLevel');
        let continueText = model.el('continueText');

        let delta = (model.mobile) ? 215 : 160;

        function _addFSBG(){
            game.add.tween(freeSpinsBG).to({y: game.height * 0.44}, 1500, Phaser.Easing.Bounce.Out, true);
            game.add.tween(freeSpinsLevel).to({y: freeSpinsBG.height / 2 + delta}, 1500, Phaser.Easing.Bounce.Out, true)
                .onComplete.add(() => {
                    _removeFSBG();
                }, this);
        }

        function _removeFSBG() {
            game.add.tween(freeSpinsBG.scale).to({x: 0.1, y: 0.1}, 500, Phaser.Easing.Elastic.Out, true);
            game.add.tween(freeSpinsLevel.scale).to({x: 0.1, y: 0.1}, 500, Phaser.Easing.Elastic.Out, true);
            game.add.tween(freeSpinsBG).to({alpha: 0}, 250, Phaser.Easing.Elastic.Out, true);
            game.add.tween(freeSpinsLevel).to({alpha: 0}, 250, Phaser.Easing.Elastic.Out, true)
            _addMultiBG();
        }

        function _addMultiBG() {
            game.add.tween(multiBG).to({alpha: 1}, 500, 'Linear', true);
            game.add.tween(multiLevel).to({alpha: 1}, 500, 'Linear', true);
            game.add.tween(multiBG.scale).to({x: 1.0, y: 1.0}, 1500, Phaser.Easing.Elastic.Out, true);
            game.add.tween(multiLevel.scale).to({x: 1.6, y: 1.6}, 1500, Phaser.Easing.Elastic.Out, true)
                .onComplete.add(() => {
                    _removeMultiBG();
                }, this);
        }

        function _removeMultiBG() {
            let fsLevelScale = (model.mobile) ? 0.75 : 1;

            game.add.tween(multiBG.scale).to({x: 0.1, y: 0.1}, 500, Phaser.Easing.Elastic.Out, true);
            game.add.tween(multiLevel.scale).to({x: 0.1, y: 0.1}, 500, Phaser.Easing.Elastic.Out, true);
            game.add.tween(multiBG).to({alpha: 0}, 250, Phaser.Easing.Elastic.Out, true);
            game.add.tween(multiLevel).to({alpha: 0}, 250, Phaser.Easing.Elastic.Out, true);
            game.add.tween(freeSpinsBG).to({alpha: 1}, 500, 'Linear', true);
            game.add.tween(freeSpinsLevel).to({alpha: 1}, 500, 'Linear', true);
            game.add.tween(freeSpinsBG.scale).to({x: 1.0, y: 1.0}, 1500, Phaser.Easing.Elastic.Out, true);
            game.add.tween(freeSpinsLevel.scale).to({x: fsLevelScale, y: fsLevelScale}, 1500, Phaser.Easing.Elastic.Out, true)
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
        let transitionBG = game.add.graphics(0, 0, transitionContainer).beginFill(0x000000, 0.9).drawRect(0, 0, game.width, game.height);
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

        // Отрисовываем Выигрыш
        let winCount = game.add.bitmapText(game.width / 2, -200, 'numbersFont', 0, 120, transitionContainer);
            winCount.align = 'center';
            winCount.anchor.set(0.5);
        if (model.mobile) {
            winCount.scale.setTo(0.8, 0.8);
        }
        model.el('winCount', winCount);
        // И кнопку продолжить
        let continueText = game.add.sprite(game.width / 2,
            game.world.height * 0.7,
            'text',
            'continue.png',
            transitionContainer);
            continueText.anchor.set(0.5);
        if (model.mobile) {
            continueText.y = game.world.height * 0.65;
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
    function _addCoin(container) {
        let game = model.el('game');
        if (container.y >= game.height * 5.7) return;

        let posX = game.rnd.integerInRange(game.width * 0.1, game.width * 0.9);
        let coin = game.add.sprite(posX, container.y * -1 - 100, 'transitionCoin', null, container);
        coin.anchor.set(0.5);
        let scale = game.rnd.integerInRange(50, 100) / 75;
        coin.scale.set(scale, scale);
        let height = coin.height;
        coin.height = game.rnd.integerInRange(height * 0.3, height);
        let tween = game.add.tween(coin)
            .to({rotation: 200}, 1000, 'Linear', true)
            .start();
        tween.onComplete.add(() => {
            coin.destroy();
        });
        game.add.tween(coin)
            .to({height: height}, 200, 'Linear')
            .to({height: height * 0.2}, 100, 'Linear')
            .to({height: height}, 200, 'Linear')
            .to({height: height * 0.2}, 100, 'Linear')
            .to({height: height}, 200, 'Linear')
            .to({height: height * 0.2}, 100, 'Linear')
            .to({height: height}, 200, 'Linear')
            .start();

        game.time.events.add(75, () => {
            _addCoin(container)
        });
    }

    function _coinsTween() {
        let game = model.el('game');
        let coinsContainer = game.add.group();
        _addCoin(coinsContainer);
        game.add.tween(coinsContainer).to({y: game.height * 7}, 5000, 'Linear', true);
    }

    function _fsFinishTween() {
        let game = model.el('game');
        let winText = model.el('winText');
        let winCount = model.el('winCount');
        let continueText = model.el('continueText');

        game.add.tween(winText).to({y: game.height * 0.2}, 1500, Phaser.Easing.Bounce.Out, true)
            .onComplete.add(() => {
                let winCountValue = model.data('rollResponse').FsBonus.TotalFSWinCoins + model.data('rollResponse').Balance.TotalWinCoins;
                _сountMeter(winCountValue, winCount);
            });
        game.add.tween(winCount).to({y: game.height * 0.45}, 1500, Phaser.Easing.Bounce.Out, true);
        game.add.tween(continueText.scale).to({x: 1.0, y: 1.0}, 2500, Phaser.Easing.Elastic.Out, true);
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
        fsFinish
    }

})();
