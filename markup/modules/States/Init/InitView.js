import { model } from 'modules/Model/Model';

export let view = (() => {

    function drawBG() {
        const game = model.el('game');

        let initBG = game.add.spine(0, 0, 'fon');
            initBG.setAnimationByName(1, 'show', false);
            initBG.addAnimationByName(1, 'move', true);
            (model.desktop) ? initBG.scale.set(1.0) : initBG.scale.set(0.6);

        return initBG;
    }

    // function drawLogo() {
    //     const game = model.el('game');
    //
    //     let initLogo = game.add.sprite(game.world.centerX, game.height * 0.3, 'initLogo');
    //         initLogo.anchor.set(0.5);
    //
    //     let logosSmall = game.add.sprite(game.width * 0.1, game.height * 0.93, 'logosSmall');
    //         logosSmall.anchor.set(0.5);
    //
    // }
    //
    // function drawPlay() {
    //     const game = model.el('game');
    //     let deltaY = (model.desktop) ? 100: 60;
    //     let initPlay = game.add.sprite(game.world.centerX, game.height * 0.8, 'text', 'play.png');
    //         initPlay.anchor.set(0.5);
    //         initPlay.scale.setTo(0.1, 0.1);
    //     let initPlayTween = game.add.tween(initPlay.scale).to({x: 1.0, y: 1.0}, 1000, Phaser.Easing.Elastic.Out, true);
    //     model.el('initPlay', initPlay);
    //     model.el('initPlayTween', initPlayTween);
    //     return initPlay;
    // }
    //
    // function playYoyoTween({
    //     intervalTime = 2500,
    //     yoyoTime = 100
    //  }) {
    //     const game = model.el('game');
    //     let initPlay = model.el('initPlay');
    //     let initPlayInterval = setInterval(() => {
    //         initPlay.rotation = 0.1;
    //         game.add.tween(initPlay).to({rotation: -0.1}, yoyoTime, 'Linear', true, 0, 3, true)
    //             .onComplete.add(() => {
    //                 initPlay.rotation = 0;
    //             });
    //     }, intervalTime);
    //     model.el('initPlayInterval', initPlayInterval);
    //     return initPlayInterval;
    // }
    //
    // function stopYoyoTween() {
    //     clearInterval(model.el('initPlayInterval'));
    // }

    return {
        drawBG
    }
})();
