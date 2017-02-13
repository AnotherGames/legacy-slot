import { model } from 'modules/Model/Model';

export let view = (() => {

    function drawBG() {
        const game = model.el('game');

        let initBG;

        if (model.desktop) {
            initBG = game.add.spine(0, 0, 'fon');
                initBG.setAnimationByName(1, 'show', false);
                initBG.addAnimationByName(1, 'move', true);

                // let bottle = game.add.spine(game.world.centerX, game.world.centerY, 'bottle');
                //     bottle.setAnimationByName(1, 'idle_n_g', true);
                // model.el('bottle', bottle);
        } else {
            initBG = game.add.tileSprite(0, 0, game.width, game.height, 'gradientLine');

            let luchi = game.add.sprite(game.world.centerX, game.world.centerY, 'shine');
            luchi.anchor.set(0.5);
            game.add.tween(luchi).to({rotation: 2 * Math.PI, alpha: 0.1}, 30000, 'Linear', true, 0, -1, true);
        }

        let logosSmall = game.add.sprite(game.width * 0.1, game.height * 0.93, 'logosSmall');
            logosSmall.anchor.set(0.5);

        return initBG;
    }

    function drawLogo() {
        const game = model.el('game');

        let initLogo = game.add.sprite(game.world.centerX, game.height * 0.4, 'initLogo');
            initLogo.anchor.set(0.5);
            initLogo.scale.set(0.66);
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
