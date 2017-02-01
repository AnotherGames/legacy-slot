import { model } from 'modules/Model/Model';
import { config } from 'modules/Util/Config';
import { controller as soundController } from 'modules/Sound/SoundController';

export let view = (() => {

    let create = {
        groups: function ({
            game = model.el('game')
        }) {
            model.group('bg', game.add.group());
            model.group('main', game.add.group());
            model.group('panel', game.add.group());
            model.group('buttons', game.add.group());
            model.group('balanceContainer', game.add.group());
            model.group('menuContainer', game.add.group());
            model.group('footer', game.add.group());
            model.group('balanceCash', game.add.group());
            model.group('balanceCoin', game.add.group());
            model.group('popup', game.add.group());
            model.group('transition', game.add.group());
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
            container = model.group('bg')
        }) {
            let upperBG = game.add.sprite(0, 0, 'bonusBG2', null, container);
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
            if (model.mobile){
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
        }
    };

return {
    create,
    draw
};
})();
