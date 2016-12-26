import { model } from 'modules/Model/Model';

export let view = (() => {

    function drawBG() {
        const game = model.el('game');
        let initBG = game.add.sprite(0, 0, 'initBG');
        model.el('initBG', initBG);

        let secondBG = game.add.sprite(0, 0, 'BG', null, model.group('bg'));
        model.el('secondBG', secondBG);

        let upperBG = game.add.sprite(0, 0, 'upperBG', null, model.group('bg'));
        model.el('upperBG', upperBG);

        return initBG;
    }

    function drawBGLogo() {
        const game = model.el('game');
        let BGLogo = game.add.sprite(game.world.width / 2, game.height * 0.85, 'logos');
        BGLogo.anchor.set(0.5);
        model.el('BGLogo', BGLogo);
        return BGLogo;
    }

    function drawLogo() {
        const game = model.el('game');
        let deltaY = (model.desktop) ? 200 : 120;

        let initLogo = game.add.spine(game.world.centerX, game.world.centerY - deltaY, 'logo');
        initLogo.setAnimationByName(0, 'animation', true);
        if (model.mobile) {
            initLogo.scale.set(0.7);
        }

        model.el('initLogo', initLogo);
        return initLogo;
    }

    function drawPlay() {
        const game = model.el('game');

        let y = game.height * 0.6;
        let deltaX1 = (model.desktop) ? 350 : 220;
        let deltaX2 = (model.desktop) ? 230 : 150;

        let initPlay = game.add.sprite(game.world.centerX, y, 'text', 'play.png');
            initPlay.anchor.set(0.5);
            initPlay.scale.setTo(0.1, 0.1);

        let wind1 = game.add.sprite(game.world.centerX - deltaX1, y + 30, 'wind1');
            wind1.anchor.set(0.5);

        let wind2 = game.add.sprite(game.world.centerX + deltaX2, y - 70, 'wind2');
            wind1.anchor.set(0.5);

        if (model.mobile) {
            wind1.scale.set(0.7);
            wind2.scale.set(0.7);
        }

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
        drawBGLogo,
        drawPlay,
        playYoyoTween,
        stopYoyoTween,
        firstDarkness,
        lastDarkness
    }
})();
