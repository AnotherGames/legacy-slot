import { model } from 'modules/Model/Model';

export let view = (() => {

    function drawBG() {
        const game = model.el('game');

        let initBG = game.add.sprite(0, 0, 'initBG');
        model.el('initBG', initBG);
        return initBG;
    }

    function drawLogo() {
        const game = model.el('game');
        let initLogo = game.add.sprite(game.world.centerX, game.world.centerY * 0.4, 'initLogo');
        initLogo.anchor.set(0.5);
        initLogo.scale.setTo(0.1, 0.1);
        game.add.tween(initLogo.scale).to({x: 1.0, y: 1.0}, 1000, Phaser.Easing.Elastic.Out, true);
        model.el('initLogo', initLogo);
        return initLogo;
    }

    function drawPlay() {
        const game = model.el('game');
        let clock = game.add.sprite(game.world.centerX - 100, game.height * 0.6, 'clock');
        clock.anchor.set(0.5);
        // let clockClose = clock.animations.add('close', 15, false);
        // clock.animations.play('close');
        // let clockSpin = clock.animations.add('spin', [23, 24, 25, 26], 15, true);
        // clockClose.onComplete.add(() => {
        //     clockSpin.play('spin');
        // }, this);

        let initPlay = game.add.sprite(game.world.centerX, game.height * 0.6, 'initPlay');
        initPlay.anchor.set(0.5);
        initPlay.scale.set(0.8);
        model.el('initPlay', initPlay);
        // initPlay.scale.setTo(0.1, 0.1);
        // let initPlayTween = game.add.tween(initPlay.scale).to({x: 1.0, y: 1.0}, 1000, Phaser.Easing.Elastic.Out, true);
        // model.el('initPlayTween', initPlayTween);
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
    };
})();
