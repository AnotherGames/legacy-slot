export class Element {
    constructor() {
        
    }
    _createElement(container, anim, x, y) {
        let element = this.state.add.sprite(x, y, 'elements', null, container);
        this.state.addAnimation(element, { el: 1, n: false, w: 15 });
        this.state.addAnimation(element, { el: 2, n: 15, w: 25 });
        this.state.addAnimation(element, { el: 3, n: false, w: 15 });
        this.state.addAnimation(element, { el: 4, n: 20, w: 20 });
        this.state.addAnimation(element, { el: 5, n: false, w: 15 });
        this.state.addAnimation(element, { el: 6, n: 15, w: 15 });
        this.state.addAnimation(element, { el: 7, n: false, w: 15 });
        this.state.addAnimation(element, { el: 8, n: 15, w: 15 });
        this.state.addAnimation(element, { el: 9, n: 15, w: 15 });
        this.state.addAnimation(element, { el: 10, n: 15, w: 15 });
        this.state.addAnimation(element, { el: 11, n: 15, w: 15 });
        element.animations.play(anim);
        return element;
    }
    _addAnimation(element, options) {
        element.animations.add(`${options.el}-n`,
            options.n
            ? Phaser.Animation.generateFrameNames(`${options.el}-n-`, 1, options.n, '.png', 2)
            : [`${options.el}-n.png`], 15, true);
        element.animations.add(`${options.el}-b`, [`${options.el}-b.png`], 15, true);
        element.animations.add(`${options.el}-w`, Phaser.Animation.generateFrameNames(`${options.el}-w-`, 1, options.w, '.png', 2), 15, true);
    }
}
