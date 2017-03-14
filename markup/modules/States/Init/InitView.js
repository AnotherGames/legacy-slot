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

        let logoBack = game.add.spine(game.world.centerX, game.world.centerY, 'logoBack');
        logoBack.setAnimationByName(0, 'new', false);
        logoBack.addAnimationByName(0, 'idle', true);
        if (model.mobile) {
            logoBack.scale.set(0.66);
        }

        let mermaid = game.add.sprite(game.world.centerX + 20, game.height * 0.35, 'mermaid');
        mermaid.anchor.set(0.5);
        mermaid.scale.set(0.1);
        mermaid.alpha = 0;
        mermaid.animations.add('move', Phaser.Animation.generateFrameNames('rusalka-idle-x_', 0, 30, '.png', 1), 20, true);
        mermaid.animations.play('move');

        let scaleX = (model.desktop) ? 1.25 : 1.0;
        let scaleY = (model.desktop) ? 1.25 : 1.0;
        game.add.tween(mermaid).to({alpha: 1}, 500, 'Linear', true);
        game.add.tween(mermaid.scale).to({x: scaleX, y: scaleY}, 1500, Phaser.Easing.Elastic.Out, true);

        let logoFront = game.add.spine(game.world.centerX, game.world.centerY, 'logoFront');
        logoFront.setAnimationByName(0, 'new', false);
        logoFront.addAnimationByName(0, 'idle', true);
        if (model.mobile) {
            logoFront.scale.set(0.66);
        }

        let logoSmall = game.add.sprite(game.width * 0.1, game.height * 0.92, 'logoSmall');
        logoSmall.anchor.set(0.5);

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
