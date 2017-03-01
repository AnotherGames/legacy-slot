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

        upperBG: function ({
            game = model.el('game'),
            container = model.group('upperBG')
        }) {
            let middleBG = game.add.sprite(0, 0, 'bonusBG2', null, container);
            model.el('middleBG', middleBG);

            let upperBG = game.add.sprite(0, 0, 'bonusBG3', null, container);
            model.el('upperBG', upperBG);
        },

        bigFish: function ({
            game = model.el('game'),
            container = model.group('bg')
        }) {
            let x = (model.desktop) ? 200 : 150;
            let y = (model.desktop) ? 520 : 350;
            let bigFish = game.add.sprite(x, y, 'bigFish', null, container);
            bigFish.anchor.set(0.5);
            if (model.mobile) {
                bigFish.scale.set(0.6);
            }
            bigFish.animations.add('move', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2]);
            bigFish.animations.play('move', 20, true);
            model.el('bigFish', bigFish);

            game.add.tween(bigFish).to({y: bigFish.y + 40}, 3000, 'Linear', true, 0, -1, true);
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

        showOctopus: function ({
            game = model.el('game'),
            container = model.group('bg')
        }) {
            let octopus = game.add.sprite(game.width * 0.68, game.height * 0.75, 'octopus', null, container);
            octopus.anchor.set(0.5);
            octopus.alpha = 0;

            let inkSmall = game.add.sprite(game.width * 0.68, game.height * 0.75, 'chernila', null, container);
            inkSmall.anchor.set(0.5);
            inkSmall.scale.set(4.0);
            if (model.mobile) {
                inkSmall.scale.set(2.0);
            }
            inkSmall.animations.add('move');
            inkSmall.animations.play('move', 20, false);

            game.add.tween(inkSmall).to({alpha: 0}, 1500, 'Linear', true, 500);
            game.add.tween(octopus).to({alpha: 1}, 1500, 'Linear', true, 500);
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
            let winCount = game.add.bitmapText(game.width / 2, game.height / 2, 'numbersFont', '0', 120, container);
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
            let scaleX = (model.desktop) ? 1.0 : 0.7;
            let scaleY = (model.desktop) ? 1.0 : 0.7;
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
