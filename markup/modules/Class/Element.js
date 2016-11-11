import { model } from 'modules/Model/Model';

export class Element {
    /*  param: {
            game: Object,
            parent: Object,
            el: Number,
            animation: String,
            x: Number,
            y: Number
        }   */
    constructor(param) {
        if (param === undefined) {
            console.error('constructor: param is undefined');
            return;
        }
        if (param.game === undefined) {
            console.error('constructor: param.game is undefined', param);
            return;
        } else {
            this.game = param.game;
        }

        this.state = this.game.state.states.Main;

        this.sprite = this.state.add.sprite(param.x, param.y, 'elements', null, param.parent);

        // this._addElementAnimations(param.el);

        this._addAnimation({ el: 1, n: false, w: 15 });
        this._addAnimation({ el: 2, n: 15, w: 25 });
        this._addAnimation({ el: 3, n: false, w: 15 });
        this._addAnimation({ el: 4, n: 20, w: 20 });
        this._addAnimation({ el: 5, n: false, w: 15 });
        this._addAnimation({ el: 6, n: 15, w: 15 });
        this._addAnimation({ el: 7, n: false, w: 15 });
        this._addAnimation({ el: 8, n: 15, w: 15 });
        this._addAnimation({ el: 9, n: 15, w: 15 });
        this._addAnimation({ el: 10, n: 15, w: 15 });
        this._addAnimation({ el: 11, n: 15, w: 15 });

        this.sprite.animations.play(`${param.el}-${param.animation}`);
        if (model.state('mobile')) {
            this.sprite.scale.x = this.sprite.scale.y = 1.5;
        }
    }

    play(animation) {
        // let thisAnim = Object.keys(this.sprite.animations._anims).some((key) => {
        //     if (parseInt(key) === parseInt(animation)) return true;
        // });
        // if (thisAnim) {
        this.sprite.animations.play(animation);
        if (!model.state('isAnimations')) {
            this.sprite.animations.paused = true;
        }
        // } else {
        //     this.sprite.animations._anims = [];
        //     this.sprite.loadTexture(parseInt(animation));
        //     this._addElementAnimations(parseInt(animation));
        //     this.sprite.animations.play(animation);
        // }
    }

    _addElementAnimations(el) {
        switch (el) {
            case 1:
                this._addAnimation({ el: 1, n: false, w: 15 });
                break;
            case 2:
                this._addAnimation({ el: 2, n: 15, w: 25 });
                break;
            case 3:
                this._addAnimation({ el: 3, n: false, w: 15 });
                break;
            case 4:
                this._addAnimation({ el: 4, n: 20, w: 20 });
                break;
            case 5:
                this._addAnimation({ el: 5, n: false, w: 15 });
                break;
            case 6:
                this._addAnimation({ el: 6, n: 15, w: 15 });
                break;
            case 7:
                this._addAnimation({ el: 7, n: false, w: 15 });
                break;
            case 8:
                this._addAnimation({ el: 8, n: 15, w: 15 });
                break;
            case 9:
                this._addAnimation({ el: 9, n: 15, w: 15 });
                break;
            case 10:
                this._addAnimation({ el: 10, n: 15, w: 15 });
                break;
            case 11:
                this._addAnimation({ el: 11, n: 15, w: 15 });
                break;
        }
    }

    _addAnimation(options) {
        this.sprite.animations.add(`${options.el}-n`,
            options.n
            ? Phaser.Animation.generateFrameNames(`${options.el}-n-`, 1, options.n, '.png', 2)
            : [`${options.el}-n.png`], 15, true);
        this.sprite.animations.add(`${options.el}-b`, [`${options.el}-b.png`], 15, true);
        this.sprite.animations.add(`${options.el}-w`, Phaser.Animation.generateFrameNames(`${options.el}-w-`, 1, options.w, '.png', 2), 15, false);
    }
}
