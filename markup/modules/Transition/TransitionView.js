import { model } from 'modules/Model/Model';
import { config } from 'modules/Util/Config';

import { controller as keyboardController } from '../../../Info/KeyboardController';
import { controller as soundController } from '../../../Info/SoundController';

import { view as mainView } from 'modules/States/Main/MainView';

export let view = (() => {



    function _fsStartDraw() {
        let game = model.el('game');
        let transitionContainer = model.group('transition');
        // Изменяем музыку
        soundController.music.stopMusic('fon');
        soundController.sound.playSound({sound: 'startPerehod'});

        // let boyContainer = game.add.group();
        // transitionContainer.add(boyContainer);
        //
        // let boy = game.add.spine(game.width * 0.11, game.height * 0.7, 'boy');
        // boy.setAnimationByName(0, 'S2-newone', false);
        // boy.addAnimationByName(0, 'S2-idle', true);
        // (model.desktop) ? boy.scale.set(0.4) : boy.scale.set(0.25);
        // boyContainer.add(boy);
        // model.el('boy', boy);

        let darknessBG = model.el('darknessBG');
        darknessBG.visible = true;

        let freeSpinsText = game.add.sprite(game.world.centerX, game.height * 0.2, 'text', 'freespin.png', transitionContainer);
        freeSpinsText.anchor.set(0.5);
        freeSpinsText.scale.set(0.1);
        freeSpinsText.alpha = 0;
        model.el('freeSpinsText', freeSpinsText);

        // let freeSpinsCount = model.data('rollResponse').FreeSpinsLeft;
        let freeSpinsNumber = game.add.bitmapText(game.world.centerX, game.height * 0.5, 'numbersFont', '+' + '15', 70, transitionContainer);
        freeSpinsNumber.anchor.set(0.5);
        freeSpinsNumber.scale.set(0.1);
        freeSpinsNumber.alpha = 0;
        model.el('freeSpinsNumber', freeSpinsNumber);

        let continueText = game.add.sprite(game.world.centerX, game.height * 0.65, 'text', 'continue.png', transitionContainer);
        continueText.anchor.set(0.5);
        continueText.scale.set(0.1);
        continueText.alpha = 0;
        model.el('continueText', continueText);

        // model.group('boy', boyContainer);
    }

    function _fsStartTween() {
        let game = model.el('game');
        let freeSpinsText = model.el('freeSpinsText');
        let freeSpinsNumber = model.el('freeSpinsNumber');
        let continueText = model.el('continueText');
        let scaleX = (model.desktop) ? 1.0 : 0.7;
        let scaleY = (model.desktop) ? 1.0 : 0.7;

        // Анимации появления
        game.add.tween(freeSpinsNumber).to({alpha: 1}, 500, 'Linear', true, 700);
        game.add.tween(freeSpinsText).to({alpha: 1}, 500, 'Linear', true, 700);
        game.add.tween(continueText).to({alpha: 1}, 500, 'Linear', true, 700);
        game.add.tween(freeSpinsNumber.scale).to({x: scaleX, y: scaleY}, 1000, Phaser.Easing.Elastic.Out, true, 700);
        game.add.tween(freeSpinsText.scale).to({x: scaleX, y: scaleY}, 1000, Phaser.Easing.Elastic.Out, true, 700);
        game.add.tween(continueText.scale).to({x: scaleX, y: scaleY}, 1000, Phaser.Easing.Elastic.Out, true, 700)
            .onComplete.add(() => {
                game.add.tween(continueText.scale).to({x: 1.3, y: 1.3}, 1500, Phaser.Easing.Elastic.Out, true, 400, -1, true);
            });
    }

    function transitionInFs() {
        soundController.sound.stopSound({sound: 'startPerehod'});
        soundController.music.playMusic('fsFon');
        model.state('transitionScreen', false);

        let game = model.el('game');
        let transitionContainer = model.group('transition');
        transitionContainer.removeAll();

        let darknessBG = model.el('darknessBG');
        darknessBG.visible = false;

        // let boyContainer = model.group('boy');
        // game.add.tween(boyContainer.scale).to({x: 0.1, y: 0.1}, 500, 'Linear', true)
        //     .onComplete.add(() => {
        //     }, this);
    }

    function transitionOutFs() {
        let game = model.el('game');
        let winText = model.el('winText');
        let winCount = model.el('winCount');
        soundController.sound.stopSound({sound: 'finishPerehod'});
        let transitionContainer = model.group('transition');
        game.add.tween(transitionContainer).to({alpha: 0}, 500, 'Linear', true)
            .onComplete.add(() => {
                let darknessBG = model.el('darknessBG');
                darknessBG.visible = false;

                transitionContainer.removeAll();
                winText.destroy();
                winCount.destroy();
            }, this);
    }

    function _fsFinishDraw() {
        let game = model.el('game');
        let transitionContainer = model.group('transition');
        // Изменяем музыку
        soundController.music.stopMusic('fsFon');
        soundController.sound.playSound({sound: 'finishPerehod'});

        // Рисуем фон
        // let transitionBG = game.add.graphics(0, 0).beginFill(0x000000, 0.8).drawRect(0, 0, game.world.width, game.world.height);
        // transitionContainer.add(transitionBG);
        // model.el('transitionBG', transitionBG);


        // выбираем надпись для конечного экрна (Big Win --- Total Win)

        // let gun = game.add.spine(game.width / 2, game.height, 'gun');
        // transitionContainer.add(gun);
        // if (model.mobile) {
        //     gun.scale.set(0.6);
        // }
        // gun.setAnimationByName(0, '1', false);
        // game.time.events.add(1500, () => {
        //     soundController.sound.playSound({sound: 'gun'});
        //     soundController.sound.playSound({sound: 'burstConfetti'});
        //     mainView.draw.addBurst({container: transitionContainer});
        // });
        // game.time.events.add(2500, () => {
        //     soundController.sound.playSound({sound: 'gun'});
        //     soundController.sound.playSound({sound: 'burstConfetti'});
        //     mainView.draw.addBurst({container: transitionContainer});
        // });
        // game.time.events.add(3500, () => {
        //     soundController.sound.playSound({sound: 'gun'});
        //     soundController.sound.playSound({sound: 'burstConfetti'});
        //     mainView.draw.addBurst({container: transitionContainer});
        // });

        let darknessBG = model.el('darknessBG');
        darknessBG.visible = true;

        let winTextFrame;
        if (model.data('fsMulti') === 8) {
            winTextFrame = 'bigW.png';
        } else {
            winTextFrame = 'totalW.png';
        }

        let winText = game.add.sprite(game.width / 2, -400, 'text', winTextFrame);
        winText.anchor.set(0.5);
        model.el('winText', winText);

        // Отрисовываем Выигрыш
        let winCount = game.add.bitmapText(game.width / 2, -200, 'numbersFont', '0', 180);
        winCount.align = 'center';
        winCount.anchor.set(0.5);
        model.el('winCount', winCount);
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
    function _fsFinishTween() {
        let game = model.el('game');
        let transitionContainer = model.group('transition');
        let winText = model.el('winText');
        let winCount = model.el('winCount');

        game.add.tween(transitionContainer).to({alpha: 1}, 500, 'Linear', true);
        game.add.tween(winCount).to({y: game.height * 0.4}, 1500, Phaser.Easing.Bounce.Out, true, 500);
        game.add.tween(winText).to({y: game.height * 0.2}, 1500, Phaser.Easing.Bounce.Out, true, 500)
            .onComplete.add(() => {
                let winCountValue = model.data('rollResponse').FsBonus.TotalFSWinCoins + model.data('rollResponse').Balance.TotalWinCoins;
                _сountMeter(winCountValue, winCount);
            });

    }

    function fsStart() {
        let game = model.el('game');
        model.state('transitionScreen', true);
        // Запускаем затемнение
        game.camera.flash(0x000000, 500);
        // Отрисовываем переходной экран
        _fsStartDraw();
        _fsStartTween();

        // Автопереход если включен
        game.time.events.add(config.autoTransitionTime, transitionInFs);
    }

    function fsFinish() {
        let game = model.el('game');
        // game.input.keyboard.enabled = true;
        // keyboardController.initFsKeys(transitionInFs);
        model.state('buttons:locked', false);
        // Темнота
        game.camera.flash(0x000000, 500);
        // Отрисовка финишного экрана
        _fsFinishDraw();
        _fsFinishTween();

        model.state('maxFsMultiplier', false);
        // Автопереход
        game.time.events.add(config.autoTransitionTime + 4000, transitionOutFs);
    }

    return {
        fsStart,
        fsFinish,
        transitionInFs,
        transitionOutFs
    };

})();
