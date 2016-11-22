import { model } from 'modules/Model/Model';

export let view = (() => {

    // Эти методы должны быть в sound view
    function playMusic() {
        const game = model.el('game');
        let initSound = game.add.audio('initFon', 1, true);
        model.sound('initSound', initSound);
        return initSound.play();
    }

    // Эти методы должны быть в sound view
    function stopMusic() {
        let initSound = model.sound('initSound');
        return initSound.stop();
    }

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

    function drawLuchi() {
        const game = model.el('game');
        let deltaY = 50;
        if (model.state('desktop')) {
            deltaY = 150;
        }
        let luchi = game.add.sprite(game.world.centerX, game.world.centerY - deltaY, 'luchi');
        luchi.anchor.set(0.5);
        model.el('luchi', luchi);
        return luchi;
    }

    function drawLogo() {
        const game = model.el('game');
        let deltaY = 50;
        if (model.state('desktop')) {
            deltaY = 150;
        }
        let initLogo = game.add.sprite(game.world.centerX, game.world.centerY - deltaY, 'initLogo', null);
            initLogo.anchor.set(0.5);
            initLogo.scale.setTo(0.1, 0.1);
        game.add.tween(initLogo.scale).to({x: 1.0, y: 1.0}, 1000, Phaser.Easing.Elastic.Out, true);
        model.el('initLogo', initLogo);
        return initLogo;
    }

    function drawPlay() {
        const game = model.el('game');
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
        playMusic,
        stopMusic,
        drawBG,
        drawBGLogo,
        drawLuchi,
        drawLogo,
        drawPlay,
        playYoyoTween,
        stopYoyoTween,
        firstDarkness,
        lastDarkness
    }
})();
