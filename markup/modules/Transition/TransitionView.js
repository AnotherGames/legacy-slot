import { model } from 'modules/Model/Model';
import { config } from 'modules/Util/Config';

import { controller as keyboardController } from 'modules/Keyboard/KeyboardController'
import { controller as soundController } from 'modules/Sound/SoundController';

import { view as mainView } from 'modules/States/Main/MainView';

export let view = (() => {

    function fsStart() {
        let game = model.el('game');
        model.state('transitionScreen', true);
        // Запускаем затемнение
        game.camera.flash(0x000000, 500)
        // Отрисовываем переходной экран
        _fsStartDraw();
        _fsStartTween();

        game.input.keyboard.enabled = true;
        // Автопереход если включен
        // if (model.state('autoTransititon')) {
            game.time.events.add(config.autoTransitionTime, transitionInFs);
        // }
    }

    function _fsStartDraw() {
        let game = model.el('game');
        let transitionContainer = model.group('transition');
        // Изменяем музыку
        soundController.music.stopMusic('fon');
        soundController.sound.playSound({sound: 'startPerehod'});

        let boy = game.add.spine(game.width * 0.15, game.height * 0.7, 'boy');
            boy.setAnimationByName(0, 'S2-newone', false);
            boy.addAnimationByName(0, 'S2-idle', true);
            (model.desktop) ? boy.scale.set(0.5) : boy.scale.set(0.3);
            transitionContainer.add(boy);
        model.el('boy', boy);

        let freeSpinsCount = model.data('rollResponse').FreeSpinsLeft;
        let freeSpinsText = game.add.bitmapText(game.width * 0.17, game.height * 0.20, 'textGreen', 'you win' + ' ', 90, transitionContainer);
            freeSpinsText.anchor.set(0.5);
            freeSpinsText.scale.set(0.1);
            freeSpinsText.alpha = 0;
        model.el('freeSpinsText', freeSpinsText);

        let freeSpinsText2 = game.add.bitmapText(game.width * 0.17, game.height * 0.33, 'textOrange', '+' + freeSpinsCount, 120, transitionContainer);
            freeSpinsText2.anchor.set(0.5);
            freeSpinsText2.scale.set(0.1);
            freeSpinsText2.alpha = 0;
        model.el('freeSpinsText2', freeSpinsText2);

        let freeSpinsText3 = game.add.bitmapText(game.width * 0.17, game.height * 0.45, 'textGreen', 'free spins', 90, transitionContainer);
            freeSpinsText3.anchor.set(0.5);
            freeSpinsText3.scale.set(0.1);
            freeSpinsText3.alpha = 0;
        model.el('freeSpinsText3', freeSpinsText3);

    }

    function _fsStartTween() {
        let game = model.el('game');
        let freeSpinsText = model.el('freeSpinsText');
        let freeSpinsText2 = model.el('freeSpinsText2');
        let freeSpinsText3 = model.el('freeSpinsText3');
        let scaleX = (model.desktop) ? 1.0 : 0.7;
        let scaleY = (model.desktop) ? 1.0 : 0.7;

        // Анимации появления
        game.add.tween(freeSpinsText).to({alpha: 1}, 500, 'Linear', true, 700);
        game.add.tween(freeSpinsText2).to({alpha: 1}, 500, 'Linear', true, 700);
        game.add.tween(freeSpinsText3).to({alpha: 1}, 500, 'Linear', true, 700);
        game.add.tween(freeSpinsText.scale).to({x: scaleX, y: scaleY}, 1000, Phaser.Easing.Elastic.Out, true, 700);
        game.add.tween(freeSpinsText2.scale).to({x: scaleX, y: scaleY}, 1000, Phaser.Easing.Elastic.Out, true, 700);
        game.add.tween(freeSpinsText3.scale).to({x: scaleX, y: scaleY}, 1000, Phaser.Easing.Elastic.Out, true, 700);

    }

    // function _fsStartInput() {
    //     let game = model.el('game');
    //     // При клике на фон будет переход на Фри-Спины
    //     let transitionBG = model.el('transitionBG');
    //         transitionBG.inputEnabled = true;
    //         transitionBG.input.priorityID = 2;
    //     transitionBG.events.onInputDown.add(transitionInFs);
    // }

    function transitionInFs() {
        soundController.sound.stopSound({sound: 'startPerehod'});
        soundController.music.playMusic('fsFon');
        model.state('transitionScreen', false);
        let transitionContainer = model.group('transition');
        transitionContainer.removeAll();
    }


    function fsFinish() {
        let game = model.el('game');
        // game.input.keyboard.enabled = true;
        keyboardController.initFsKeys();
        model.state('buttons:locked', false);
        // Темнота
        game.camera.flash(0x000000, 500)
        // Отрисовка финишного экрана
        _fsFinishDraw();
        _fsFinishTween();

        model.state('maxFsMultiplier', false);
        // Автопереход
        // if (model.state('autoTransititon')) {
            game.time.events.add(config.autoTransitionTime + 4000, transitionOutFs);
        // }
    }

    function _fsFinishDraw() {
        let game = model.el('game');
        let transitionContainer = model.group('transition');
        // Изменяем музыку
        soundController.music.stopMusic('fsFon');
        soundController.sound.playSound({sound: 'finishPerehod'});

        // Рисуем фон
        let transitionBG = game.add.graphics(0, 0).beginFill(0x000000, 0.8).drawRect(0, 0, game.world.width, game.world.height);
        transitionContainer.add(transitionBG);
        model.el('transitionBG', transitionBG);


        // выбираем надпись для конечного экрна (Big Win --- Total Win)
        let winTextFrame;
        if (model.data('fsMulti') === 8) {
            winTextFrame = 'bigW.png';
        } else {
            winTextFrame = 'totalW.png';
        }

        let gun = game.add.spine(game.width / 2, game.height, 'gun');
        transitionContainer.add(gun);
        if (model.mobile) {
            gun.scale.set(0.6);
        }
        gun.setAnimationByName(0, '1', false);
        game.time.events.add(1500, () => {
            soundController.sound.playSound({sound: 'gun'});
            soundController.sound.playSound({sound: 'burstConfetti'});
            mainView.draw.addBurst({container: transitionContainer});
        });
        game.time.events.add(2500, () => {
            soundController.sound.playSound({sound: 'gun'});
            soundController.sound.playSound({sound: 'burstConfetti'});
            mainView.draw.addBurst({container: transitionContainer});
        });
        game.time.events.add(3500, () => {
            soundController.sound.playSound({sound: 'gun'});
            soundController.sound.playSound({sound: 'burstConfetti'});
            mainView.draw.addBurst({container: transitionContainer});
        });

        let winText = game.add.sprite(game.width / 2, -400, 'text', winTextFrame);
            winText.anchor.set(0.5);
        model.el('winText', winText);

        // Отрисовываем Выигрыш
        let winCount = game.add.bitmapText(game.width / 2, -200, 'textOrange', '0', 180);
            winCount.align = 'center';
            winCount.anchor.set(0.5);
        model.el('winCount', winCount);

        // И кнопку продолжить
        // let continueText = game.add.sprite(game.width / 2, -200, 'text', 'continue.png', transitionContainer);
        //     continueText.anchor.set(0.5);
        // model.el('continueText', continueText);

    }

    function _fsFinishTween() {
        let game = model.el('game');
        let transitionContainer = model.group('transition');
        let winText = model.el('winText');
        let winCount = model.el('winCount');
        let scaleX = (model.desktop) ? 1.0 : 0.7;
        let scaleY = (model.desktop) ? 1.0 : 0.7;

        game.add.tween(winText).to({y: game.height * 0.2}, 1500, Phaser.Easing.Bounce.Out, true)
            .onComplete.add(() => {
                let winCountValue = model.data('rollResponse').FsBonus.TotalFSWinCoins + model.data('rollResponse').Balance.TotalWinCoins;
                _сountMeter(winCountValue, winCount);
            });
        game.add.tween(winCount).to({y: game.height * 0.4}, 1500, Phaser.Easing.Bounce.Out, true);

        // game.add.tween(continueText).to({y: game.height * 0.85}, 1500, Phaser.Easing.Bounce.Out, true)
        //     .onComplete.add(() => {
        //         continueText.rotation = 0.1;
        //         game.add.tween(continueText).to({rotation: -0.1}, 100, 'Linear', true, 0, 4, true)
        //             .onComplete.add(() => {
        //                 continueText.rotation = 0;
        //             }, this);
        //     }, this);
    }

    function transitionOutFs() {
        let winText = model.el('winText');
        let winCount = model.el('winCount');
        winText.destroy();
        winCount.destroy();
        soundController.sound.stopSound({sound: 'finishPerehod'});
        let transitionContainer = model.group('transition');
        transitionContainer.removeAll();
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

    // function _fsFinishInput() {
    //     let transitionBG = model.el('transitionBG');
    //     transitionBG.inputEnabled = true;
    //     transitionBG.input.priorityID = 2;
    //     transitionBG.events.onInputDown.add(function () {
    //         soundController.sound.playSound({sound : 'buttonClick'});
    //         soundController.music.stopMusic('finishPerehod');
    //         // model.el('game').state.start('Main');
    //     });
    // }

    return {
        fsStart,
        fsFinish,
        transitionInFs,
        transitionOutFs
    }

})();
