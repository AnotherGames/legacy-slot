export class Init {
    constructor(game) {

    }
    init() {
        console.info('Init State!');
    }
    preload() {
        console.info('Preload init State!');
    }
    create() {
        var initBackground = this.add.sprite(0, 0, 'initBG');
        var initLogo = this.add.sprite(this.world.centerX, this.world.centerY * 0.4, 'text', 'logo.png');
        initLogo.anchor.set(0.5);

        var initPlayBtn = this.add.sprite(this.world.centerX, this.world.centerY, 'text', 'play.png');
        initPlayBtn.anchor.set(0.5);
        initPlayBtn.inputEnabled = true;
        initPlayBtn.events.onInputDown.add(gotoPlat, this);


        let bounds = new Phaser.Rectangle(0, 0, this.game.width, this.game.height);
        let graphics = this.add.graphics(bounds.x, bounds.y);
        graphics.beginFill(0x000000);
        graphics.drawRect(0, 0, bounds.width, bounds.height);

        this.add.tween(graphics).to( { alpha: 0 }, 2000, "Linear", true);

        function gotoPlat() {
            // this.scale.startFullScreen(false);
            // this.scale.maxWidth = document.innerWidth;
            // this.scale.maxHeight = document.innerHeight;

            let closeAnim = this.add.tween(graphics)
            closeAnim.to( { alpha: 1 }, 2000, "Linear");
            closeAnim.onComplete.add(() => {
                this.state.start('Main');
            }, this);
        }
    }
}
