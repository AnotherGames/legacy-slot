import { model } from 'modules/Model/Model';
import { config } from 'modules/Util/Config';

export let view = (() => {

    let create = {
        groups: function ({
            game = model.el('game')
        }) {
            model.group('bg', game.add.group());
            model.group('upperBG', game.add.group());
            model.group('main', game.add.group());
            model.group('buttons', game.add.group());
            model.group('balanceContainer', game.add.group());
            model.group('menuContainer', game.add.group());
            model.group('footer', game.add.group());
            model.group('balanceCash', game.add.group());
            model.group('balanceCoin', game.add.group());
            model.group('popup', game.add.group());
            model.group('transition', game.add.group());
            model.group('infoTable', game.add.group());
            model.group('footerMenu', game.add.group());
        }
    };

    let draw = {
        mainBG: function ({
            game = model.el('game'),
            container = model.group('bg')
        }) {
            let mainBG = game.add.sprite(0, 0, 'bonusBG', null, container);
            model.el('mainBG', mainBG);
        },

        doorsElements: function ({
            game = model.el('game'),
            container = model.group('bg')
        }) {
            let doorsElements = [];
            for (let i = 1; i < 6; i++) {
                let element = game.add.spine(game.world.centerX, game.world.centerY, `element${i}`);
                element.setAnimationByName(0, 'idle', true);
                container.add(element);
                if (model.mobile) {
                    element.scale.set(0.66);
                }
                doorsElements.push(element);
            }
            model.el('doorsElements', doorsElements);

        },

        changeAnim: function ({
            game = model.el('game'),
            container = model.group('bg'),
            number = 1,
            anim = 'open'
        }) {
            let doorsElements = model.el('doorsElements');
            doorsElements.forEach((item, index) => {
                if (index + 1 == number) {
                    if (anim == 'open') {
                        item.setAnimationByName(0, anim, false);
                        item.addAnimationByName(0, 'idle_opened', true);
                    } else {
                        item.setAnimationByName(0, anim, false);
                        item.addAnimationByName(0, 'idle', true);
                    }
                }
            });
        },

        upperBG: function ({
            game = model.el('game'),
            container = model.group('upperBG')
        }) {
            let bgTop = game.add.spine(game.world.centerX, game.world.centerY, 'BG_top');
            bgTop.setAnimationByName(0, 'idle', true);
            container.add(bgTop);
            if (model.mobile) {
                bgTop.scale.set(0.66);
            }
        },

        addLight: function ({
            game = model.el('game'),
            container = model.group('bg')
        }) {
            for (let i = 0; i < 3; i++) {
                let topLight = game.add.sprite(0 - i * game.rnd.integerInRange(25, 35), 0 - i * game.rnd.integerInRange(15, 25), 'topLight', null, container);
                topLight.alpha = game.rnd.integerInRange(0, 70) / 100;
                game.add.tween(topLight)
                    .to({alpha: game.rnd.integerInRange(40, 90) / 100}, game.rnd.integerInRange(3000, 5000), 'Linear', true, null, -1, true);
            }
        },

        showFailBubbles: function ({
            game = model.el('game'),
            container = model.group('bg'),
            x = 0,
            y = 0
        }) {
            console.log('i am here', x, y);
            let emitter = game.add.emitter(x, y - 50, 100);
            container.add(emitter);
            emitter.makeParticles('bubble');
            emitter.width = 100;

            emitter.setRotation(0, 0);
            emitter.setAlpha(0.1, 1, 3000);
            emitter.minParticleScale = 0.1;
            emitter.maxParticleScale = 0.4;
            emitter.setYSpeed(-100, -500);
            emitter.gravity = -400;

            let emitterFrequency = (model.desktop) ? 200 : 100;

            emitter.start(true, 0, null, emitterFrequency, true);
        },

        showWin: function ({
            game = model.el('game'),
            container = model.group('bg'),
            winTextFrame = 'totalW.png'
        }) {

            let winText = game.add.sprite(game.width / 2,
                game.height * 0.2,
                'text',
                winTextFrame,
                container);
            winText.anchor.set(0.5);
            winText.scale.set(0.1);
            model.el('winText', winText);

            // Отрисовываем Выигрыш
            let winCount = game.add.bitmapText(game.width / 2, game.height * 0.6, 'numbersFont', '0', 100, container);
            winCount.align = 'center';
            winCount.anchor.set(0.5);
            winCount.scale.set(0.1);
            model.el('winCount', winCount);

            draw._showWinTween({});
        },

        _showWinTween: function ({
            game = model.el('game'),
            winText = model.el('winText'),
            winCount = model.el('winCount')
        }) {
            let scaleX = (model.desktop) ? 0.6 : 0.3;
            let scaleY = (model.desktop) ? 0.6 : 0.3;
            game.add.tween(winText.scale).to({x: 1.0, y: 1.0}, 1500, Phaser.Easing.Bounce.Out, true);
            let winCountValue = model.data('bonusWinCoins');
            draw._сountMeter(winCountValue, winCount);

            game.add.tween(winCount.scale).to({x: scaleX, y: scaleY}, 1500, Phaser.Easing.Bounce.Out, true);
        },

        _сountMeter: function (count, elem) {
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
                    game.winAnims.splice(game.winAnims.indexOf(anim), 1);
                }

            };
            game.winAnims.push(anim);
        }

    };

    return {
        create,
        draw
    };
})();
