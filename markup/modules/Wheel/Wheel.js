import { config } from '../../modules/Util/Config';
import { Element } from '../../modules/Element/Element';

export class Wheel {
    get elements() {
        let elems = [];
        for (let i = 2; i < 5; i++) {
            elems.push( this.items[(this.elSwitch - i) % 6]);
        }
        return elems;
    }
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
        },
        currentScreen: Array
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
        if (param.currentScreen === undefined) {
            console.error('constructor: param.elSize is undefined', param);
            return;
        } else {
            this.currentScreen = param.currentScreen;
        }

        this.container = this.state.add.group(this.parent, 'wheelGroup');
        this.container.position.set(this.position.x, this.position.y);

        this.items = [];
        for (let i = 0; i < 6; i++) {
            const elem = new Element({
                state: this.state,
                parent: this.container,
                animation: '1-n',
                x: 0,
                y: i * this.elSize.height * -1
            }).sprite;
            elem.anchor.set(0.5);
            this.items.push(elem);
        }

        this.update();
    }
    /*  param: {
            item: Object,
            posY: Number,
            anim: String
        }   */
    _upElement(param) {
        param.item.y = param.posY;
        param.item.animations.play(param.anim);
    }
    update(currElems = this.currentScreen) {
        this.wheelY = this.container.y = this.position.y + this.elSize.height * 3;

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
        let _this = this;

        function myTween(k) {
            if (k > 1) k = 1;
            let s = 1.0;
            if ( ( k *= 2 ) < 1 ) return 0.5 * ( k * k * ( ( s + 1 ) * k - s ) );
            return 0.5 * ( ( k -= 2 ) * k * ( ( s + 1 ) * k + s ) + 2 );
        }

        let progress = 0;
        let startTime = this.state.time.totalElapsedSeconds() * 1000;
        let timeLength = 5000;
        let startY = _this.wheelY;
        let endY = this.wheelY + _this.elSize.height * 50;
        let pathLenth = endY - startY;
        _this.wheelY += _this.elSize.height;

        let newAnim = function () {
            let currTime = _this.state.time.totalElapsedSeconds() * 1000 - startTime;
            progress = currTime / timeLength;
            _this.container.y = startY + pathLenth * myTween(progress);

            if (_this.container.y > _this.wheelY) {

                const rand = _this.state.rnd.integerInRange(1, 11);
                _this._upElement({
                    item: _this.items[_this.elSwitch % 6],
                    posY: _this.elSize.height * _this.elSwitch * -1,
                    anim: rand + '-b'
                });

                _this.wheelY += _this.elSize.height;
                ++_this.elSwitch;
            }

            if (progress >= 1) {
                _this.state.frameAnims.splice(_this.state.frameAnims.indexOf(newAnim), 1);
            }
        };
        this.state.frameAnims.push(newAnim);

        // const runAnim = this.state.add.tween(this.container)
        //     .to( { y: this.wheelY }, config.wheels.speed, "Linear", true);
        // runAnim.onComplete.add(() => {
            // if (this.isRun) {
            //     const rand = this.state.rnd.integerInRange(1, 11);
            //     this._upElement({
            //         item: this.items[this.elSwitch % 6],
            //         posY: this.elSize.height * this.elSwitch * -1,
            //         anim: rand + '-b'
            //     });
            //     this._run();
            // } else {
            //     this._gotoStop();
            // }
        // }, this);
        //
        // ++this.elSwitch;
    }
    play() {
        this.update();
        this.isRun = true;
        const startAnim = this.state.add.tween(this.container)
            .to({ y: [this.wheelY + 500, this.wheelY] }, 600, "Back.easeIn");
        startAnim.onComplete.add(this._run, this);
        // startAnim.start();
        this._run();
    }
    _gotoStop() {
        let finishAnims = [];
        for (let i = 0; i < 5; i++) {
            this.wheelY += this.elSize.height;
            const runAnim = this.state.add.tween(this.container)
                .to( { y: this.wheelY }, config.wheels.speed, "Linear");

            runAnim.onComplete.add(() => {
                this._upElement({
                    item: this.items[this.elSwitch % 6],
                    posY: this.elSize.height * this.elSwitch * -1,
                    anim: this.finishScreen[4 - i] + '-n'
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
                    const finishAnim = this.state.add.tween(this.container).to({ y: [this.wheelY - 400, this.wheelY] }, 700, "Back.easeOut");
                    finishAnim.onComplete.add(() => {
                        // Fire roll:end event
                        if (this.finishCallback) {
                            this.finishCallback();
                        }
                    });
                    finishAnim.start();
                }, this);
            }

            finishAnims.push(runAnim);
        }
        finishAnims[0].start();
    }
    stop(finishScreen, callback) {
        this.isRun = false;
        this.finishScreen = finishScreen;
        this.currentScreen = finishScreen;
        this.finishCallback = callback;
    }
    _createElement(container, anim, x, y) {
        let element = this.state.add.sprite(x, y, 'elements', null, container);
        this._addAnimation(element, { el: 1, n: false, w: 15 });
        this._addAnimation(element, { el: 2, n: 15, w: 25 });
        this._addAnimation(element, { el: 3, n: false, w: 15 });
        this._addAnimation(element, { el: 4, n: 20, w: 20 });
        this._addAnimation(element, { el: 5, n: false, w: 15 });
        this._addAnimation(element, { el: 6, n: 15, w: 15 });
        this._addAnimation(element, { el: 7, n: false, w: 15 });
        this._addAnimation(element, { el: 8, n: 15, w: 15 });
        this._addAnimation(element, { el: 9, n: 15, w: 15 });
        this._addAnimation(element, { el: 10, n: 15, w: 15 });
        this._addAnimation(element, { el: 11, n: 15, w: 15 });
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
