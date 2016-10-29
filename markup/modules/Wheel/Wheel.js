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
        if (typeof (param) !== 'object') {
            console.error('constructor: param is not object');
            return;
        }
        if (param.state === undefined) {
            console.error('constructor: param.state is undefined', param);
            return;
        }
        if (param.parent === undefined) {
            console.error('constructor: param.parent is undefined', param);
            return;
        }
        if (typeof (param.position) !== 'object') {
            console.error('constructor: param.position is undefined', param);
            return;
        }
        if (typeof (param.position.x) !== 'number') {
            console.error('constructor: param.position.x is undefined', param);
            return;
        }
        if (typeof (param.position.y) !== 'number') {
            console.error('constructor: param.position.y is undefined', param);
            return;
        }
        if (typeof (param.elSize) !== 'object') {
            console.error('constructor: param.elSize is undefined', param);
            return;
        }
        if (typeof (param.elSize.width) !== 'number') {
            console.error('constructor: param.elSize.width is undefined', param);
            return;
        }
        if (typeof (param.elSize.height) !== 'number') {
            console.error('constructor: param.elSize.height is undefined', param);
            return;
        }
        if (param.currentScreen === undefined) {
            console.error('constructor: param.elSize is undefined', param);
            return;
        }
        // инитим входящие параметры
        this.state = param.state;
        this.parent = param.parent;
        this.position = param.position;
        this.elSize = param.elSize;
        this.currentScreen = param.currentScreen;
        // инитим внутрение параметры
        this.isPaused = false;
        this._gotoPaused = false;
        this._pausedStart = 0;
        this._pausedTimeLenth = 0;

        this.container = this.state.add.group(this.parent, 'wheelGroup');
        this.container.position.set(this.position.x, this.position.y);

        this.items = [];
        for (let i = 0; i < 6; i++) {
            const elem = new Element({
                state: this.state,
                parent: this.container,
                el: 1,
                animation: 'n',
                x: 0,
                y: i * this.elSize.height * -1
            });
            elem.sprite.anchor.set(0.5);
            // elem.sprite.scale.set(0.5);
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
        param.item.sprite.y = param.posY;
        param.item.play(param.anim);
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
        //     .to( { y: this.wheelY }, config.wheel.speed, "Linear", true);
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
        if (!this._gotoPaused) return;

        this._pausedTimeLenth += this.state.time.totalElapsedSeconds() * 1000 - this._pausedStart;
        this._gotoPaused = false;
        this.isPaused = false;
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
    paused() {
        this._gotoPaused = true;
        this._pausedStart = this.state.time.totalElapsedSeconds() * 1000;
    }
    /*  *param: {
            time: Number (milisecond),
            length: Number (amount of elements, >6),
            callback: Function
        }   */
    roll(finishScreen, param) {
        if (finishScreen === undefined) {
            console.error('roll: finishScreen is undefined');
            return;
        }

        this.update();

        this.mode = 'roll';
        this.isRun = true;
        this._gotoPaused = false;
        this.isPaused = false;
        this._pausedTimeLenth = 0;

        let _this = this;
        let startTime = this.state.time.totalElapsedSeconds() * 1000;
        let timeLength = config.wheel.roll.time;
        let rollLength = config.wheel.roll.length;
        let easingSeparation = config.wheel.roll.easingSeparation;
        this.finishScreen = finishScreen;

        if (typeof (param) === 'object') {
            if (typeof (param.time) === 'number') {
                if (param.time <= 0) {
                    console.error('roll: param.time is incorrectly.', param.time);
                    return;
                }
                timeLength = param.time;
            }
            if (typeof (param.length) === 'number') {
                if (param.length <= 0) {
                    console.error('roll: param.length is incorrectly.', param.length);
                    return;
                }
                rollLength = param.length;
            }
            if (typeof (param.easingSeparation) === 'number') {
                if (param.easingSeparation <= 0) {
                    console.error('roll: param.easingSeparation is incorrectly.', param.easingSeparation);
                    return;
                }
                easingSeparation = param.easingSeparation;
            }
            if (typeof (param.callback) === 'function') {
                this.finishCallback = param.callback;
            } else {
                this.finishCallback = undefined;
            }
        }

        const _easingBackInOut = function(k) {
            if (k > 1) k = 1;
            let s = easingSeparation;
            if ( ( k *= 2 ) < 1 ) return 0.5 * ( k * k * ( ( s + 1 ) * k - s ) );
            return 0.5 * ( ( k -= 2 ) * k * ( ( s + 1 ) * k + s ) + 2 );
        };

        let startY = _this.wheelY;
        let endY = this.wheelY + _this.elSize.height * rollLength;
        let pathLenth = endY - startY;
        _this.wheelY += _this.elSize.height;

        let elemGotoSwitchTop = function () {
            if (_this.container.y < _this.wheelY) return;
            // if (_this.isPaused) return;
            if (_this._gotoPaused) {
                _this.isPaused = true;
            }

            --rollLength;

            const rand = _this.state.rnd.integerInRange(1, 11);
            let anim = rand + '-b';
            if (rollLength < 5
                && rollLength > -1
            ) {
                anim = finishScreen[rollLength] + '-n';
            }

            let itemInd = (_this.elSwitch < 0) ? 6 - (Math.abs(_this.elSwitch) % 6) : Math.abs(_this.elSwitch) % 6;
            // anim = (itemInd + 1) + '-n';
            _this._upElement({
                item: _this.items[itemInd],
                posY: _this.elSize.height * _this.elSwitch * -1,
                anim
            });

            _this.wheelY += _this.elSize.height;
            ++_this.elSwitch;

            elemGotoSwitchTop();
        };

        let elemGotoSwitchBottom = function () {
            if (_this.container.y > _this.wheelY - _this.elSize.height * 2) return;
            // if (_this.isPaused) return;
            if (_this._gotoPaused) {
                _this.isPaused = true;
            }

            ++rollLength;

            const rand = _this.state.rnd.integerInRange(1, 11);
            let anim = rand + '-b';
            if (rollLength < 1
                && rollLength > -4
            ) {
                anim = finishScreen[4 + rollLength] + '-n';
            }

            let itemInd = (_this.elSwitch < 0) ?  6 - (Math.abs(_this.elSwitch) % 6) : Math.abs(_this.elSwitch) % 6;
            // anim = (itemInd + 1) + '-n';
            _this._upElement({
                item: _this.items[itemInd],
                posY: _this.elSize.height * (_this.elSwitch - 6) * -1,
                anim
            });

            --_this.elSwitch;
            _this.wheelY -= _this.elSize.height;

            elemGotoSwitchTop();
        };

        let newAnim = function () {
            if (_this.isPaused) return;

            let currTime = _this.state.time.totalElapsedSeconds() * 1000 - (startTime + _this._pausedTimeLenth);
            let progress = currTime / timeLength;
            if (progress > 1) {
                progress = 1;
            }

            _this.container.y = startY + pathLenth * _easingBackInOut(progress);

            elemGotoSwitchTop();
            elemGotoSwitchBottom();

            if (progress === 1) {
                _this.state.frameAnims.splice(_this.state.frameAnims.indexOf(newAnim), 1);
                if (_this.finishCallback) {
                    _this.finishCallback();
                }
            }
        };
        this.state.frameAnims.push(newAnim);
    }
}
