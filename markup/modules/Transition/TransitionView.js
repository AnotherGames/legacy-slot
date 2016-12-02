import { model } from 'modules/Model/Model';
import { sound } from 'modules/Sound/Sound';
import { config } from 'modules/Util/Config';

export let view = (() => {

    function fsStart() {
        const game = model.el('game');
        let darkness = game.add.graphics();
        darkness.beginFill(0x000000);
        darkness.drawRect(0, 0, game.width, game.height);
        game.add.tween(darkness).to( { alpha: 0 }, 1500, 'Linear', true)
            .onComplete.add(() => {
                darkness.destroy();
            }, this);
        _fsStartDraw();
        _fsStartTween();
        _fsStartInput();
        if (model.state('autoTransititon')) {
            game.time.events.add(config.autoTransitionTime, () => {
                sound.sounds.button.play();
                sound.music.startPerehod.stop();
                model.el('game').state.start('FS');
            });
        }
    }

    function _fsStartDraw() {
        const game = model.el('game');
        const transitionContainer = model.group('transition');

        sound.music.fon.stop();
        sound.music.startPerehod.play();

        let gameLogo = model.el('gameLogo');
        gameLogo.visible = false;

        const transitionBG = game.add.graphics(0, 0, transitionContainer).beginFill(0x000000, 0.9).drawRect(0, 0, game.width, game.height);
        model.el('transitionBG', transitionBG);

        const freeSpinsBG = game.add.sprite(game.width / 2, -400, 'freeSpins', null, transitionContainer);
        freeSpinsBG.anchor.set(0.5);
        model.el('freeSpinsBG', freeSpinsBG);

        let freeSpinsCount = model.data('rollResponse').FreeSpinsLeft;
        const freeSpinsLevel = game.add.bitmapText(game.width / 2 - 15, -400, 'numbersFont', freeSpinsCount, 120, transitionContainer);
        freeSpinsLevel.align = 'center';
        freeSpinsLevel.anchor.set(0.5);
        model.el('freeSpinsLevel', freeSpinsLevel);

        if (model.state('mobile')) {
            freeSpinsLevel.scale.set(0.75);
        }

        const multiBG = game.add.sprite(game.width / 2, game.height * 0.44, 'multiplier', null, transitionContainer);
        multiBG.anchor.set(0.5);
        multiBG.alpha = 0;
        multiBG.scale.setTo(0.1, 0.1);
        model.el('multiBG', multiBG);

        let delta = 25;
        if (model.state('desktop')) {
            delta = 50;
        }

        let multiValue = model.data('rollResponse').NextMode.split('-')[1];
        const multiLevel = game.add.sprite(game.width / 2, multiBG.y + delta, 'multiNumbers', `multi${multiValue}.png`, transitionContainer);
        multiLevel.align = 'center';
        multiLevel.anchor.set(0.5);
        multiLevel.alpha = 0;
        multiLevel.scale.setTo(0.1, 0.1);
        model.el('multiLevel', multiLevel);

        const continueText = game.add.sprite(game.width / 2,
            game.world.height * 0.7,
            'text',
            'continue.png',
            transitionContainer);
        continueText.anchor.set(0.5);
        continueText.scale.setTo(0.1, 0.1);
        model.el('continueText', continueText);

    }

    function _fsStartTween() {
        const game = model.el('game');
        const freeSpinsBG = model.el('freeSpinsBG');
        const freeSpinsLevel = model.el('freeSpinsLevel');
        const multiBG = model.el('multiBG');
        const multiLevel = model.el('multiLevel');

        const continueText = model.el('continueText');
        let delta = 160;
        if (model.state('mobile')) {
            delta = 215;
        }


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
            let fsLevelScale = 1;
            if (model.state('mobile')) {
                fsLevelScale = 0.75;
            };

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
        const game = model.el('game');
        const transitionBG = model.el('transitionBG');
        transitionBG.inputEnabled = true;
        transitionBG.input.priorityID = 2;
        transitionBG.events.onInputDown.add(function () {
            sound.sounds.button.play();
            sound.music.startPerehod.stop();
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
        const game = model.el('game');
        let darkness = game.add.graphics();
        darkness.beginFill(0x000000);
        darkness.drawRect(0, 0, game.width, game.height);
        game.add.tween(darkness).to( { alpha: 0 }, 1500, 'Linear', true)
            .onComplete.add(() => {
                darkness.destroy();
            }, this);
        _fsFinishDraw();
        _fsFinishTween();
        _fsFinishInput();

        if (model.state('autoTransititon')) {
            game.time.events.add(config.autoTransitionTime, () => {
                sound.sounds.button.play();
                sound.music.finishPerehod.stop();
                model.el('game').state.start('Main');
            });
        }
    }

    function _fsFinishDraw() {
        const game = model.el('game');
        const transitionContainer = model.group('transition');
        sound.music.fsFon.stop();

        sound.music.finishPerehod.play();
        if (model.data('fsMulti') === 7) {
            sound.sounds.zombie2.play();
        }
        const transitionBG = game.add.graphics(0, 0, transitionContainer).beginFill(0x000000, 0.9).drawRect(0, 0, game.width, game.height);
        model.el('transitionBG', transitionBG);

        let winTextFrame;
        if (model.data('fsMulti') === 7) {
            winTextFrame = 'bigW.png';
        } else {
            winTextFrame = 'totalW.png';
        }

        const winText = game.add.sprite(game.width / 2, -400, 'text', winTextFrame, transitionContainer);
        winText.anchor.set(0.5);
        model.el('winText', winText);

        const winCount = game.add.bitmapText(game.width / 2, -200, 'numbersFont', 0, 120, transitionContainer);
        winCount.align = 'center';
        winCount.anchor.set(0.5);
        if (model.state('mobile')) {
            winCount.scale.set(0.8);
        }
        console.log(winCount);
        model.el('winCount', winCount);

        const continueText = game.add.sprite(game.width / 2,
            game.height * 0.65,
            'text',
            'continue.png',
            transitionContainer);
        continueText.anchor.set(0.5);
        continueText.scale.setTo(0.1, 0.1);
        model.el('continueText', continueText);

    }

    function _fsFinishTween() {
        const game = model.el('game');
        const winText = model.el('winText');
        const winCount = model.el('winCount');

        const continueText = model.el('continueText');

        game.add.tween(winText).to({y: game.height * 0.25}, 1500, Phaser.Easing.Bounce.Out, true)
            .onComplete.add(() => {
                let winCountValue = model.data('rollResponse').FsBonus.TotalFSWinCoins + model.data('rollResponse').Balance.TotalWinCoins;
                _сountMeter(winCountValue, winCount);
            });

        game.add.tween(winCount).to({y: game.height * 0.45}, 1500, Phaser.Easing.Bounce.Out, true);
        game.add.tween(continueText.scale).to({x: 1.0, y: 1.0}, 2500, Phaser.Easing.Elastic.Out, true)
            .onComplete.add(() => {
                continueText.rotation = 0.1;
                game.add.tween(continueText).to({rotation: -0.1}, 100, 'Linear', true, 0, 4, true)
                    .onComplete.add(() => {
                        continueText.rotation = 0;
                    }, this);
            }, this);
    }

    function _сountMeter(count, elem) {
        const game = model.el('game');

        sound.music.fsFon.volume = 0;
        sound.music.fsFon.play();

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
        console.log('i am finishing fs');
        const transitionBG = model.el('transitionBG');
        transitionBG.inputEnabled = true;
        transitionBG.input.priorityID = 2;
        transitionBG.events.onInputDown.add(function () {
            sound.sounds.button.play();
            sound.music.finishPerehod.stop();
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
