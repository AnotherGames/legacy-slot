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

        let ninja = game.add.spine(game.width * 0.33, game.height * 0.75, 'ninja');
            ninja.setAnimationByName(1, 'idle', true);
            ninja.scale.set(0.6);

        let ronin = game.add.spine(game.width * 0.7, game.height * 0.76, 'ronin');
            ronin.setAnimationByName(1, 'idle', true);
            ronin.scale.set(0.6);

        let samurai = game.add.spine(game.width * 0.6, game.height * 0.75, 'samurai');
            samurai.setAnimationByName(1, 'idle', true);
            samurai.scale.set(0.6);

        let geisha = game.add.spine(game.width * 0.45, game.height * 0.87, 'geisha');
            geisha.setAnimationByName(1, 'idle', true);
            geisha.scale.set(0.6);
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

    function firstDarkness() {
        const game = model.el('game');
        let darkness = game.add.graphics(0, 0);
            darkness.beginFill(0x000000, 1).drawRect(0, 0, game.world.width, game.world.height);
        model.el('initDarkness', darkness);
        return game.add.tween(darkness)
            .to({alpha: 0}, 500, Phaser.Easing.In, true);
    }

    function lastDarkness() {
        const game = model.el('game');
        return game.add.tween(model.el('initDarkness'))
            .to( { alpha: 1 }, 500, 'Linear', true);
    }

    return {
        drawBG,
        drawLogo,
        drawPlay,
        playYoyoTween,
        stopYoyoTween,
        firstDarkness,
        lastDarkness
    }
})();
