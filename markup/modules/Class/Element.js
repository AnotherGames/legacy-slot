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

        const game = model.el('game');

        this.sprite = game.add.sprite(param.x, param.y, 'elements', null, param.parent);

        this._addAnimation({ el: 1, n: false, w: 15 });
        this._addAnimation({ el: 2, n: 20, w: 20 });
        this._addAnimation({ el: 3, n: false, w: 15 });
        this._addAnimation({ el: 4, n: 15, w: 25 });
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
        this.sprite.animations.play(animation);
        if (!model.state('isAnimations')) {
            this.sprite.animations.paused = true;
        }
    }

    win() {
        let name = parseInt(this.sprite.animations.currentAnim.name);
        this.play(`${name}-w`);
        this.sprite.animations.currentAnim.onComplete.add(() => {
            this.play(`${name}-n`);
        });
    }

    normal() {
        let name = parseInt(this.sprite.animations.currentAnim.name);
        if (this.sprite.animations.currentAnim === `${name}-n`) return;
        this.play(`${name}-n`);
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
