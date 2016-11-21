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

        const transitionBG = game.add.sprite(0, 0, 'initBG', null, transitionContainer);
        model.el('transitionBG', transitionBG);

        const cloudContainer = game.add.group();
        transitionContainer.add(cloudContainer);
        model.group('cloudContainer', cloudContainer);
        for (let i = 0; i < 5; i++) {
            addCloud({});
        }

        const freeSpinsText = game.add.sprite(game.width / 2,
            -400,
            'text',
            'freeSpins.png',
            transitionContainer);
        freeSpinsText.anchor.set(0.5);
        model.el('freeSpinsText', freeSpinsText);

        let freeSpinsCount = model.data('rollResponse').FreeSpinsLeft;
        const freeSpinsLevel = game.add.bitmapText(game.width / 2, -200, 'numbersFont', freeSpinsCount, 120, transitionContainer);
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
        _coinsTween();
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
        const transitionBG = game.add.sprite(0, 0, 'initBG', null, transitionContainer);
        model.el('transitionBG', transitionBG);

        const cloudContainer = game.add.group();
        transitionContainer.add(cloudContainer);
        model.group('cloudContainer', cloudContainer);
        for (let i = 0; i < 5; i++) {
            addCloud({});
        }

        let winTextFrame;
        if (model.data('fsMulti') === 7) {
            winTextFrame = 'bigW.png';
        } else {
            winTextFrame = 'totalW.png';
        }

        const winText = game.add.sprite(game.width / 2,
            -400,
            'text',
            winTextFrame,
            transitionContainer);
        winText.anchor.set(0.5);
        model.el('winText', winText);

        const winCount = game.add.bitmapText(game.width / 2, -200, 'numbersFont', 0, 120, transitionContainer);
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

    function _addCoin(container) {
        const game = model.el('game');
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
        const game = model.el('game');
        let coinsContainer = game.add.group();
        _addCoin(coinsContainer);
        game.add.tween(coinsContainer).to({y: game.height * 7}, 5000, 'Linear', true);
    }

    function _fsFinishTween() {
        const game = model.el('game');
        const winText = model.el('winText');
        const winCount = model.el('winCount');
        const skull = model.el('skull');
        const continueText = model.el('continueText');

        game.add.tween(winText).to({y: game.height * 0.2}, 1500, Phaser.Easing.Bounce.Out, true)
            .onComplete.add(() => {
                let winCountValue = model.data('rollResponse').FsBonus.TotalFSWinCoins + model.data('rollResponse').Balance.TotalWinCoins;
                _сountMeter(winCountValue, winCount);
            });
        game.add.tween(winCount).to({y: game.height * 0.45}, 1500, Phaser.Easing.Bounce.Out, true);
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

    function addCloud({
        x = model.el('game').rnd.integerInRange(0, model.el('game').width),
        container = model.group('cloudContainer')
    }) {
        const game = model.el('game');

        let number = game.rnd.integerInRange(1, 4);
        const cloud = game.add.sprite(0, 150, 'clouds', `cloud${number}.png`, container);
        cloud.anchor.set(0.5);

        let time = game.rnd.integerInRange(40, 60);
        let side = game.rnd.integerInRange(0, 1) ? 'left' : 'right';
        let delta;
        if (model.state('desktop')) {
            cloud.y = cloud.y = cloud.y + game.rnd.integerInRange(0, 250);
        } else {
            cloud.y = cloud.y = cloud.y + game.rnd.integerInRange(0, 100);
        }
        cloud.x = x;

        if (container === model.group('bg')){
            if (side === 'left') {
                cloud.x = -cloud.width;
            } else {
                cloud.x = game.width + cloud.width;
            }
        }
        if (side === 'left') {
            delta = game.width + cloud.width;
        } else {
            delta = -cloud.width;
        }

        game.add.tween(cloud).to({x: delta}, time * 1000, 'Linear', true)
            .onComplete.add(() => {
                cloud.destroy();
                if (container === model.group('bg') && model.state('isAnimations' == false)){
                    addCloud({container: model.group('bg')});
                }
            }, this);

    }

    return {
        fsStart,
        fsFinish,
        addCloud
    }

})();
