import { model } from 'modules/Model/Model';

export let view = (() => {

    function drawBG() {
        const game = model.el('game');
        // let mainBGSky = game.add.sprite(0, 0, 'mainBGSky');
        // model.el('mainBGSky', mainBGSky);
        // let luchi = game.add.sprite(game.world.centerX, game.world.centerY + 150, 'luchi');
        // luchi.anchor.set(0.5);
        // game.add.tween(luchi).to({rotation: 2 * Math.PI, alpha: 0.1}, 30000, 'Linear', true, 0, -1, true);

        let initBG = game.add.sprite(0, 0, 'initBG');
        model.el('initBG', initBG);
        return initBG;
    }

    function drawLogo() {
        const game = model.el('game');
        let initLogo = game.add.sprite(game.world.centerX, game.world.centerY * 0.4, 'text', 'logo.png');
            initLogo.anchor.set(0.5);
            initLogo.scale.setTo(0.1, 0.1);
        game.add.tween(initLogo.scale).to({x: 1.0, y: 1.0}, 1000, Phaser.Easing.Elastic.Out, true);
        model.el('initLogo', initLogo);
        return initLogo;
    }

    // function drawBaraban() {
    //     const game = model.el('game');
    //     let deltaYBack = (model.desktop) ? 270 : 220;
    //     if (model.mobile) {
    //         deltaYBack = 220;
    //     }
    //     let initBarabanBack = game.add.sprite(game.world.centerX, game.world.centerY + deltaYBack, 'baraban', 'B-back.png');
    //     initBarabanBack.anchor.set(0.5);
    //
    //     let deltaY = (model.desktop) ? 180 : 160;
    //     let initBaraban = game.add.sprite(game.world.centerX, game.world.centerY + deltaY, 'baraban', 'B-6.png');
    //         initBaraban.anchor.set(0.5);
    //     game.add.tween(initBaraban).to({rotation: 2 * Math.PI}, 6000, 'Linear', true, 0, -1);
    //     model.el('initBaraban', initBaraban);
    //     return initBaraban;
    // }

    function drawPlay() {
        const game = model.el('game');
        let initPlay = game.add.sprite(game.world.centerX, game.height * 0.75, 'text', 'play.png');
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
        // drawBaraban,
        playYoyoTween,
        stopYoyoTween
    }
})();
