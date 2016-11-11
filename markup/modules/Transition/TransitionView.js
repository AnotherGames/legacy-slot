import { model } from 'modules/Model/Model';
import { sound } from 'modules/Sound/Sound';

export let view = (() => {

    function fsStart() {
        _fsStartDraw();
        _fsStartTween();
        _fsStartInput();
        setTimeout(function () {
            _fsStartHide();
        }, 10000);
    }

    function _fsStartDraw() {
        const game = model.el('game');
        const transitionContainer = model.group('transition');

        const transitionBG = game.add.sprite(0, 0, 'initBG', null, transitionContainer);
        model.el('transitionBG', transitionBG);
        const freeSpinsText = game.add.sprite(game.world.width / 2,
            -400,
            'text',
            'freeSpins.png',
            transitionContainer);
        freeSpinsText.anchor.set(0.5);
        model.el('freeSpinsText', freeSpinsText);

        const freeSpinsLevel = game.add.text(game.world.width / 2,
            -200,
            '15',
            {font: 'bold 140px Helvetica, Arial', fill: '#fff', align: 'center'},
            transitionContainer);
        freeSpinsLevel.anchor.set(0.5);
        model.el('freeSpinsLevel', freeSpinsLevel);

        const axeBig = game.add.sprite(game.world.width / 2 + 250,
            game.world.height / 2,
            'axe',
            null,
            transitionContainer);
        axeBig.anchor.set(0.5);
        axeBig.scale.setTo(0.1, 0.1);
        model.el('axeBig', axeBig);

        const axeSmall = game.add.sprite(game.world.width / 2 - 250,
            game.world.height / 2 + 50,
            'axeSmall',
            null,
            transitionContainer);
        axeSmall.anchor.set(0.5);
        axeSmall.scale.setTo(0.1, 0.1);
        model.el('axeSmall', axeSmall);

        const continueText = game.add.sprite(game.world.width / 2,
            game.world.height * 0.8,
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

        game.add.tween(freeSpinsText).to({y: game.world.height * 0.2}, 1500, Phaser.Easing.Bounce.Out, true);
        game.add.tween(freeSpinsLevel).to({y: game.world.height / 2}, 1500, Phaser.Easing.Bounce.Out, true);
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
        const continueText = model.el('continueText');
        continueText.inputEnabled = true;
        continueText.input.priorityID = 2;
        continueText.events.onInputDown.add(function () {
            console.log('i am i am starting fs');
            sound.sounds.button.play();
            // game.state.start('FS');
        });
    }

    function _fsStartHide() {
        console.log('i am starting fs after timeout');
        const game = model.el('game');
        // game.state.start('FS');
    }

    return {
        fsStart
    }

})();
