export class Init {
    constructor(game) {
        this.playInterval = null;

    }
    init() {
        console.info('Init State!');
        this.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    }

    create() {
        let initSound = this.add.audio('initFon', 1, true);
        initSound.play();
        let initBackground = this.add.sprite(0, 0, 'initBG');
        let initLogo = this.add.sprite(this.world.centerX, this.world.centerY * 0.4, 'text', 'logo.png');
        initLogo.anchor.set(0.5);
        initLogo.scale.setTo(0.1, 0.1);

        let initPlayBtn = this.add.sprite(this.world.centerX, this.world.centerY, 'text', 'play.png');
        initPlayBtn.anchor.set(0.5);
        initPlayBtn.scale.setTo(0.1, 0.1);
        initPlayBtn.inputEnabled = true;
        initPlayBtn.events.onInputDown.add(handlePlayBtn, this);

        let darkness = this.add.graphics();
        darkness.beginFill(0x000000);
        darkness.drawRect(0, 0, this.game.width, this.game.height);

        this.add.tween(darkness).to( { alpha: 0 }, 1000, 'Linear', true);
        this.add.tween(initLogo.scale).to({x: 1.0, y: 1.0}, 1000, Phaser.Easing.Elastic.Out, true);
        this.add.tween(initPlayBtn.scale).to({x: 1.0, y: 1.0}, 1000, Phaser.Easing.Elastic.Out, true)
            .onComplete.add(() => {
                this.playInterval = setInterval(() => {
                    initPlayBtn.rotation = 0.1;
                    this.add.tween(initPlayBtn).to({rotation: -0.1}, 130, Phaser.Easing.Elastic.Out, true, 0, 3, true)
                        .onComplete.add(() => {
                            initPlayBtn.rotation = 0;
                        }, this);
                }, 2500);
            }, this);

        function handlePlayBtn() {

            fullScreen();
            // this.scale.startFullScreen(false);
            initSound.stop();
            let closeAnim = this.add.tween(darkness);
            closeAnim.to( { alpha: 1 }, 500, 'Linear', true);
            closeAnim.onComplete.add(() => {
                this.state.start('Main');
                clearInterval(this.playInterval);
            }, this);
        }
        function fullScreen(e) {
            $('#game').addClass('full');
            e = e || document.querySelector('#game');
            e.requestFullScreen ? e.requestFullScreen() : e.mozRequestFullScreen ? e.mozRequestFullScreen() : e.webkitRequestFullScreen && e.webkitRequestFullScreen();
        }
    }
}
