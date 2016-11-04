export class Init {
    constructor(game) {

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

        let initPlayBtn = this.add.sprite(this.world.centerX, this.world.centerY, 'text', 'play.png');
        initPlayBtn.anchor.set(0.5);
        initPlayBtn.inputEnabled = true;
        initPlayBtn.events.onInputDown.add(handlePlayBtn, this);

        let darkness = this.add.graphics();
        darkness.beginFill(0x000000);
        darkness.drawRect(0, 0, this.game.width, this.game.height);

        this.add.tween(darkness).to( { alpha: 0 }, 1000, 'Linear', true);

        function handlePlayBtn() {
            this.scale.startFullScreen(false);
            initSound.stop();
            let closeAnim = this.add.tween(darkness);
            closeAnim.to( { alpha: 1 }, 500, 'Linear', true);
            closeAnim.onComplete.add(() => {
                this.state.start('Main');
            }, this);
        }
    }
}
