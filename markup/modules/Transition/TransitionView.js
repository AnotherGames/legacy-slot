import { model } from 'modules/Model/Model';
import { sound } from 'modules/Sound/Sound';

export let view = (() => {

    function fsStart() {
        _fsStartDraw();
        _fsStartTween();
        _fsStartInput();
        // setTimeout(function () {
        //     _fsStartHide();
        // }, 10000);
    }

    function _fsStartDraw() {
        const game = model.el('game');
        const transitionContainer = model.group('transition');

        sound.music.fon.stop();
        sound.music.startPerehod.play();

        const transitionBG = game.add.sprite(0, 0, 'initBG', null, transitionContainer);
        model.el('transitionBG', transitionBG);
        const freeSpinsText = game.add.sprite(game.width / 2,
            -400,
            'text',
            'freeSpins.png',
            transitionContainer);
        freeSpinsText.anchor.set(0.5);
        model.el('freeSpinsText', freeSpinsText);

        const freeSpinsLevel = game.add.bitmapText(game.width / 2, -200, 'numbersFont', '15', 120, transitionContainer);
        freeSpinsLevel.align = 'center';
        freeSpinsLevel.anchor.set(0.5);
        model.el('freeSpinsLevel', freeSpinsLevel);

        const axeBig = game.add.sprite(game.width / 2 + 350,
            game.world.height / 2,
            'axe',
            null,
            transitionContainer);
        axeBig.anchor.set(0.5);
        axeBig.scale.setTo(0.1, 0.1);
        model.el('axeBig', axeBig);

        const axeSmall = game.add.sprite(game.width / 2 - 350,
            game.world.height / 2 + 50,
            'axeSmall',
            null,
            transitionContainer);
        axeSmall.anchor.set(0.5);
        axeSmall.scale.setTo(0.1, 0.1);
        model.el('axeSmall', axeSmall);

        const continueText = game.add.sprite(game.width / 2,
            game.world.height * 0.75,
            'text',
            'continue.png',
            transitionContainer);
        continueText.anchor.set(0.5);
        continueText.scale.setTo(0.1, 0.1);
        model.el('continueText', continueText);
    }

    function _fsStartTween() {
        const game = model.el('game');
        const freeSpinsText = model.el('freeSpinsText');
        const freeSpinsLevel = model.el('freeSpinsLevel');
        const axeBig = model.el('axeBig');
        const axeSmall = model.el('axeSmall');
        const continueText = model.el('continueText');

        game.add.tween(freeSpinsText).to({y: game.height * 0.2}, 1500, Phaser.Easing.Bounce.Out, true);
        game.add.tween(freeSpinsLevel).to({y: game.height / 2}, 1500, Phaser.Easing.Bounce.Out, true);
        game.add.tween(axeBig.scale).to({x: 1.0, y: 1.0}, 2500, Phaser.Easing.Elastic.Out, true);
        game.add.tween(axeSmall.scale).to({x: 1.0, y: 1.0}, 2500, Phaser.Easing.Elastic.Out, true);
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
        const game = model.el('game');
        const transitionBG = model.el('transitionBG');
        transitionBG.inputEnabled = true;
        transitionBG.input.priorityID = 2;
        transitionBG.events.onInputDown.add(function () {
            sound.sounds.button.play();
            sound.music.startPerehod.stop();
            sound.music.fsFon.play();
            model.el('game').state.start('FS');
        });
    }

    function _fsStartHide() {
        console.log('i am starting fs after timeout');
        sound.music.startPerehod.stop();
        sound.music.fsFon.play();
        const game = model.el('game');
        model.el('game').state.start('FS');
    }

    function fsFinish() {
        _fsFinishDraw();
        _fsFinishTween();
        _fsFinishInput();
        // setTimeout(function () {
        //     _fsFinishHide();
        // }, 10000);
    }

    function _fsFinishDraw() {
        const game = model.el('game');
        const transitionContainer = model.group('transition');
        sound.music.fsFon.stop();
        sound.music.finishPerehod.play();

        const transitionBG = game.add.sprite(0, 0, 'initBG', null, transitionContainer);
        model.el('transitionBG', transitionBG);

        const winText = game.add.sprite(game.width / 2,
            -400,
            'text',
            'totalW.png',
            transitionContainer);
        winText.anchor.set(0.5);
        model.el('winText', winText);

        let winCountValue = model.data('rollResponse').FsBonus.TotalFSWinCoins;

        const winCount = game.add.bitmapText(game.width / 2, -200, 'numbersFont', winCountValue, 120, transitionContainer);
        winCount.align = 'center';
        winCount.anchor.set(0.5);
        if (model.state('mobile')) {
            winCount.scale.setTo(0.8, 0.8);
        }
        console.log(winCount);
        model.el('winCount', winCount);

        const skull = game.add.sprite(game.width / 2,
            game.world.height * 0.65,
            'skull',
            null,
            transitionContainer);
        skull.anchor.set(0.5);
        skull.scale.setTo(0.1, 0.1);
        model.el('skull', skull);

        const continueText = game.add.sprite(game.width / 2,
            game.world.height * 0.85,
            'text',
            'continue.png',
            transitionContainer);
        continueText.anchor.set(0.5);
        if (model.state('mobile')) {
            continueText.y = game.world.height * 0.8;
        }
        continueText.scale.setTo(0.1, 0.1);
        model.el('continueText', continueText);

    }

    function _fsFinishTween() {
        const game = model.el('game');
        const winText = model.el('winText');
        const winCount = model.el('winCount');
        const skull = model.el('skull');
        const continueText = model.el('continueText');

        game.add.tween(winText).to({y: game.height * 0.2}, 1500, Phaser.Easing.Bounce.Out, true);
        game.add.tween(winCount).to({y: game.height * 0.45}, 1500, Phaser.Easing.Bounce.Out, true);
        console.log('winText', winText.x);
        game.add.tween(continueText.scale).to({x: 1.0, y: 1.0}, 2500, Phaser.Easing.Elastic.Out, true);
        game.add.tween(skull.scale).to({x: 1.0, y: 1.0}, 2500, Phaser.Easing.Elastic.Out, true)
            .onComplete.add(() => {
                skull.rotation = 0.1;
                game.add.tween(skull).to({rotation: -0.1}, 100, 'Linear', true, 0, 4, true)
                    .onComplete.add(() => {
                        skull.rotation = 0;
                    }, this);
            }, this);
    }

    function _fsFinishInput() {
        console.log('i am finishing fs');
        const game = model.el('game');
        const transitionBG = model.el('transitionBG');
        transitionBG.inputEnabled = true;
        transitionBG.input.priorityID = 2;
        transitionBG.events.onInputDown.add(function () {
            sound.sounds.button.play();
            sound.music.finishPerehod.stop();
            sound.music.fon.play();
            model.el('game').state.start('Main');
        });
    }

    function _fsFinishHide() {
        console.log('i am finishing fs after timeout');
        sound.music.finishPerehod.stop();
        sound.music.fon.play();
        const game = model.el('game');
        model.el('game').state.start('Main');
    }

    return {
        fsStart,
        fsFinish
    }

})();
