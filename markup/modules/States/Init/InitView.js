import { model } from 'modules/Model/Model';

export let view = (() => {

    function drawBG() {
        const game = model.el('game');

        let initBG = game.add.tileSprite(0, 0, game.width, game.height, 'gradientLine');
        model.el('initBG', initBG);

        let shine = game.add.sprite(game.world.centerX, game.world.centerY + 150, 'shine');
            shine.anchor.set(0.5);
        game.add.tween(shine).to({rotation: 2 * Math.PI, alpha: 0.1}, 30000, 'Linear', true, 0, -1, true);

        return initBG;
    }

    function drawLogo() {
        const game = model.el('game');

        let initLogo = game.add.sprite(game.world.centerX, game.height * 0.5, 'initLogo');
            initLogo.anchor.set(0.5);

        let logosSmall = game.add.sprite(game.width * 0.1, game.height * 0.85, 'logosSmall');
            logosSmall.anchor.set(0.5);
        //
        // let ninja = game.add.spine(game.width * 0.33, game.height * 0.75, 'ninja');
        //     ninja.setAnimationByName(1, 'idle', true);
        //     (model.desktop) ? ninja.scale.set(0.6) : ninja.scale.set(0.4);

    }

    function drawPlay() {
        const game = model.el('game');
        let deltaY = (model.desktop) ? 100: 60;
        let initPlay = game.add.sprite(game.world.centerX, game.height * 0.8, 'text', 'play.png');
            initPlay.anchor.set(0.5);
            initPlay.scale.setTo(0.1, 0.1);
        let initPlayTween = game.add.tween(initPlay.scale).to({x: 1.0, y: 1.0}, 1000, Phaser.Easing.Elastic.Out, true);
        model.el('initPlay', initPlay);
        model.el('initPlayTween', initPlayTween);
        return initPlay;
    }

    function playYoyoTween({
        intervalTime = 2500,
        yoyoTime = 100
     }) {
        const game = model.el('game');
        let initPlay = model.el('initPlay');
        let initPlayInterval = setInterval(() => {
            initPlay.rotation = 0.1;
            game.add.tween(initPlay).to({rotation: -0.1}, yoyoTime, 'Linear', true, 0, 3, true)
                .onComplete.add(() => {
                    initPlay.rotation = 0;
                });
        }, intervalTime);
        model.el('initPlayInterval', initPlayInterval);
        return initPlayInterval;
    }

    function stopYoyoTween() {
        clearInterval(model.el('initPlayInterval'));
    }

    return {
        drawBG,
        drawLogo,
        drawPlay,
        playYoyoTween,
        stopYoyoTween
    }
})();
