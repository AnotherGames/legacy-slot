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

        let mermaid = game.add.sprite(game.world.centerX + 20, game.height * 0.35, 'mermaid');
        mermaid.anchor.set(0.5);
        if (model.desktop) {
            mermaid.scale.set(1.25);
        }
        mermaid.animations.add('move', Phaser.Animation.generateFrameNames('rusalka-idle-x_', 0, 30, '.png', 1), 20, true);
        mermaid.animations.play('move');
        // let anim = mermaid.animations.getAnimation('move');
        // anim.enableUpdate = true;
        // anim.onUpdate.add(() => {
        //     console.log(anim.currentFrame, anim.frameTotal);
        // });

        let initLogo = game.add.sprite(game.world.centerX, game.height * 0.6, 'logo');
        initLogo.anchor.set(0.5);
        initLogo.scale.setTo(0.1, 0.1);
        game.add.tween(initLogo.scale).to({x: 1.0, y: 1.0}, 1000, Phaser.Easing.Elastic.Out, true);
        model.el('initLogo', initLogo);
        return initLogo;
    }

    function drawPlay() {
        const game = model.el('game');
        let initPlay = game.add.sprite(game.world.centerX, game.height * 0.75, 'play');
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
