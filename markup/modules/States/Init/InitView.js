import { model } from 'modules/Model/Model';

export let view = (() => {

    function drawBG() {
        const game = model.el('game');
        let initBG = game.add.sprite(0, 0, 'initBG');
        model.el('initBG', initBG);
        return initBG;
    }

    function drawBGLogo() {
        const game = model.el('game');
        let BGLogo = game.add.sprite(50, game.height * 0.85, 'logos');
        model.el('BGLogo', BGLogo);
        return BGLogo;
    }

    function drawLogo() {
        const game = model.el('game');
        let deltaY;
        if (model.mobile) {
            deltaY = 90;
        } else {
            deltaY = 150;
        }
        let initLogo = game.add.spine(game.world.centerX, game.world.centerY - deltaY, 'logo');
        initLogo.setAnimationByName(0, '1', true);
        if (model.mobile) {
            initLogo.scale.set(0.9);
        }

        model.el('initLogo', initLogo);
        return initLogo;
    }

    function drawPlay() {
        const game = model.el('game');
        let y;
        if (model.state('mobile')) {
            y = game.height * 0.6;
        } else {
            y = game.height * 0.8;
        }
        let initPlay = game.add.sprite(game.world.centerX, y, 'text', 'play.png');
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
        drawBGLogo,
        drawPlay,
        playYoyoTween,
        stopYoyoTween
    }
})();
