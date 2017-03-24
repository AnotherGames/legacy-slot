import { model } from 'modules/Model/Model';

export let view = (() => {

    function drawBG() {
        const game = model.el('game');

        let initBG = game.add.sprite(0, 0, 'initBG');

        return initBG;
        // if (model.desktop) {
        //     initBG = game.add.spine(game.world.centerX, game.world.centerY, 'fon');
        //     initBG.setAnimationByName(0, 'show', false);
        //     initBG.addAnimationByName(0, 'move', true);
        //
        // } else {
        //
        //     let luchi = game.add.sprite(game.world.centerX, game.world.centerY, 'shine');
        //     luchi.anchor.set(0.5);
        //     game.add.tween(luchi).to({rotation: 2 * Math.PI, alpha: 0.1}, 30000, 'Linear', true, 0, -1, true);
        // }

    }

    function drawLogo() {
        const game = model.el('game');

        let initMain = game.add.sprite(game.world.centerX, game.height * 0.45, 'initMain');
        initMain.anchor.set(0.5);

        let initLogo = game.add.sprite(game.world.centerX, game.height * 0.6, 'logoInit');
        initLogo.anchor.set(0.5);

        // let logosSmall = game.add.sprite(game.width * 0.1, game.height * 0.93, 'logosSmall');
        // logosSmall.anchor.set(0.5);
    }

    function drawPlay() {
        const game = model.el('game');
        let initPlay = game.add.sprite(game.world.centerX, game.height * 0.8, 'text', 'continue.png');
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
    };
})();
