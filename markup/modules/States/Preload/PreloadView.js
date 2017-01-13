import { model } from 'modules/Model/Model';

export let view = (() => {

    function drawPreloadBar() {
        const game = model.el('game');
        let preloadBar = game.add.sprite(game.world.centerX, game.world.centerY * 1.3, 'preloadBar');
            preloadBar.anchor.set(0, 0.5);
            preloadBar.position.x -= preloadBar.width / 2;
        model.el('preloadBar', preloadBar);
        return preloadBar;
    }

    function drawPreloadCoin() {
        const game = model.el('game');
        let preloadCoin = game.add.sprite(game.world.centerX, game.world.centerY * 0.9, 'preloadCoin');
            preloadCoin.anchor.set(0.5);
            preloadCoin.scale.set(0);
            preloadCoin.animations.add('coin', null, 15, true);
            preloadCoin.animations.play('coin');
        game.add.tween(preloadCoin.scale).to({x: 1, y: 1}, 1000, Phaser.Easing.Out, true);
        model.el('preloadCoin', preloadCoin);
        return preloadCoin;
    }

    function hideBar() {
        const game = model.el('game');
        return game.add.tween(model.el('preloadBar'))
            .to({alpha: 0}, 500, Phaser.Easing.In, true);
    }

    function hideCoin() {
        const game = model.el('game');
        return game.add.tween(model.el('preloadCoin').scale)
            .to({x: 0, y: 0}, 500, Phaser.Easing.In, true);
    }


    return {
        drawPreloadBar,
        drawPreloadCoin,
        hideBar,
        hideCoin
    }
})();
