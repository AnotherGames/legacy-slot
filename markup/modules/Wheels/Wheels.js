import { config } from '../../modules/Util/Config';

export class Wheels {
    /*  param: {
    state: State,
    parent: Group,
    position: {
        x: Number,
        y: Number
    },
    elSize: {
        width: Number,
        height: Number
    }
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
        if (param.parent === undefined) {
            console.error('constructor: param.parent is undefined', param);
            return;
        } else {
            this.parent = param.parent;
        }
        if (param.position === undefined) {
            console.error('constructor: param.position is undefined', param);
            return;
        } else {
            this.position = param.position;
        }
        if (param.position.x === undefined) {
            console.error('constructor: param.position.x is undefined', param);
            return;
        }
        if (param.position.y === undefined) {
            console.error('constructor: param.position.y is undefined', param);
            return;
        }
        if (param.elSize === undefined) {
            console.error('constructor: param.elSize is undefined', param);
            return;
        } else {
            this.elSize = param.elSize;
        }
        if (param.elSize.width === undefined) {
            console.error('constructor: param.elSize.width is undefined', param);
            return;
        }
        if (param.elSize.height === undefined) {
            console.error('constructor: param.elSize.height is undefined', param);
            return;
        }

        this.container = this.state.add.group(this.parent, 'wheelGroup');
        this.container.position.set(this.position.x, this.position.y);

        this.items = [];
        for (let i = 0; i < 6; i++) {
            // const elem = this.state.add.sprite(0, i * this.elSize.height * -1, rand, rand + '-b.png');
            const rand = this.state.rnd.integerInRange(1, 11);
            const elem = this._createElement(this.container, rand + '-n', 0, i * this.elSize.height * -1);
            // const elem = this.state.add.sprite(0, i * this.elSize.height * -1, 'elements', rand + '-b.png');
            elem.anchor.set(0.5);
            this.container.add(elem);
            this.items.push(elem);
        }
    }
    /*  currElems: {
            item: Object,
            posY: Number,
            anim: String
        }   */
    _upElement(param) {
        param.item.y = param.posY;
        param.item.animations.play(param.anim);
    }
    update(currElems) {
        this.currPosY = this.container.y = this.position.y + this.elSize.height * 2;

        for (let i = 0; i < 5; i++) {
            this._upElement({
                item: this.items[i],
                posY: i * this.elSize.height * -1,
                anim: currElems[4 - i] + '-n'
            });
        }

        this.elSwitch = 5;
    }
    _run() {
        const runAnim = this.state.add.tween(this.container);
        this.currPosY += this.elSize.height;
        runAnim.to( { y: this.currPosY }, config.wheels.speed, "Linear", true);
        runAnim.onComplete.add(() => {
            if (this.isRun) {
                const rand = this.state.rnd.integerInRange(1, 11);
                this._upElement({
                    item: this.items[this.elSwitch % 6],
                    posY: this.elSize.height * this.elSwitch * -1,
                    anim: rand + '-b'
                });


                this._run();
            } else {
                this._gotoStop();
            }
        }, this);

        ++this.elSwitch;
    }
    play() {
        this.isRun = true;
        const runAnim1 = this.state.add.tween(this.container).to({ y: this.currPosY - 100 }, 1000, "Quart.easeOut");
        const runAnim2 = this.state.add.tween(this.container).to({ y: this.currPosY + 100}, 500, "Quart.easeIn");
        runAnim1.onComplete.add(() => {
            runAnim2.start();
        });
        runAnim1.start();

        runAnim2.onComplete.add(() => {
            this._run();
        }, this);

    }
    _gotoStop() {
        let finishAnims = [];
        for (let i = 0; i < 5; i++) {
            const runAnim = this.state.add.tween(this.container);
            this.currPosY += this.elSize.height;
            runAnim.to( { y: this.currPosY }, config.wheels.speed, "Linear");
            runAnim.onComplete.add(() => {
                this._upElement({
                    item: this.items[this.elSwitch % 6],
                    posY: this.elSize.height * this.elSwitch * -1,
                    anim: this.finishElems[4 - i] + '-n'
                });

                ++this.elSwitch;
            }, this);


            if (i !== 0) {
                finishAnims[finishAnims.length - 1].onComplete.add(() => {
                    runAnim.start();
                }, this);
            }
            if (i === 4) {
                runAnim.onComplete.add(() => {
                    const runAnim1 = this.state.add.tween(this.container).to({ y: this.currPosY + 100 }, 500, "Quart.easeOut");
                    const runAnim2 = this.state.add.tween(this.container).to({ y: this.currPosY }, 500, "Quart.easeIn");
                    runAnim1.onComplete.add(() => {
                        runAnim2.start();
                    });
                    runAnim1.start();
                }, this);
            }
            finishAnims.push(runAnim);
        }
        finishAnims[0].start();
    }
    stop(finishElems) {
        this.isRun = false;
        this.finishElems = finishElems;
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
