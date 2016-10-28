export class Element {
    /*  param: {
            state: Object,
            parent: Object,
            animation: String,
            x: Number,
            y: Number
        }   */
    constructor(param) {
        if (param === undefined) {
            console.error('constructor: param is undefined');
            return;
        }
        if (param.state === undefined) {
            console.error('constructor: param.state is undefined', param);
            return;
        } else {
            this.state = param.state;
        }

        this.sprite = this.state.add.sprite(param.x, param.y, 'elements', null, param.parent);
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
        this.sprite.animations.play(param.animation);
    }
    _addAnimation(options) {
        this.sprite.animations.add(`${options.el}-n`,
            options.n
            ? Phaser.Animation.generateFrameNames(`${options.el}-n-`, 1, options.n, '.png', 2)
            : [`${options.el}-n.png`], 15, true);
        this.sprite.animations.add(`${options.el}-b`, [`${options.el}-b.png`], 15, true);
        this.sprite.animations.add(`${options.el}-w`, Phaser.Animation.generateFrameNames(`${options.el}-w-`, 1, options.w, '.png', 2), 15, true);
    }
}
