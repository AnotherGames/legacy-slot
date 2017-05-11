import { model } from 'modules/Model/Model';
import { config } from 'modules/Util/Config';

export let view = (() => {

    let create = {
        groups: function ({
            game = model.el('game')
        }) {
            model.group('bg', game.add.group());
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

        showWin: function ({
            game = model.el('game'),
            container = model.group('main'),
            winTextFrame = 'youWin.png'
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
            let winCount = game.add.bitmapText(game.width / 2, game.height / 2 - 30, 'numbersFont', '0', 50, container);
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
