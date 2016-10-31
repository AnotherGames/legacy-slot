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
        this._gotoPlay = false;
        this._gotoPaused = false;
        this._gotoLoop = false;
        this._pausedStartTime = 0;
        this._pausedTimeLenth = 0;
        this._loopLengthY = 0;
        this._wheelSpeed = 0;
        this._wheelStartPos = 0;
        this._wheelLastY = this.position.y;
        Object.defineProperty(this, "wheelLastY", {
            set: function (val) {
                this._wheelSpeed = val - this._wheelLastY;
                this._wheelLastY = val;
            }
        });

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
        this.wheelY = this._wheelLastY = this.container.y = this.position.y + this.elSize.height * 3;

        for (let i = 0; i < 5; i++) {
            this._upElement({
                item: this.items[i],
                posY: i * this.elSize.height * -1,
                anim: currElems[4 - i] + '-n'
            });
        }

        this.elSwitch = 5;
        this._gotoPlay = false;
        this._gotoPaused = false;
        this._gotoLoop = false;
        this._pausedTimeLenth = 0;
        this._loopLengthY = 0;
        this._wheelStartPos = 0;
    }
    play() {
        if (this.mode === 'roll') return;

        if (this.mode === 'paused') {
            this._pausedTimeLenth += this.state.time.totalElapsedSeconds() * 1000 - this._pausedStartTime;
            this.mode = 'roll';
            return;
        }

        this._gotoPlay = true;
    }
    paused() {
        if (this.mode === 'paused') return;

        this._gotoPaused = true;
    }
    _endLoop() {
        this._pausedTimeLenth += this.state.time.totalElapsedSeconds() * 1000 - this._pausedStartTime;
        this._loopLengthY += this.wheelY - this._wheelStartPos;
        this._wheelStartPos = 0;
    }
    loop() {
        if (this.mode === 'loop') return;
        if (this.mode === 'paused') {
            console.error('loop: do not goto "Loop" mode if the pause!');
            return;
        }

        this._gotoLoop = true;
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

        this.mode = 'roll';
        this.update();

        let _this = this;
        let startTime = this.state.time.totalElapsedSeconds() * 1000;
        let timeLength = config.wheel.roll.time;
        this.easingSeparation = config.wheel.roll.easingSeparation;
        this.rollLength = config.wheel.roll.length;
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
                this.rollLength = param.length;
            }
            if (typeof (param.easingSeparation) === 'number') {
                if (param.easingSeparation <= 0) {
                    console.error('roll: param.easingSeparation is incorrectly.', param.easingSeparation);
                    return;
                }
                this.easingSeparation = param.easingSeparation;
            }
            if (typeof (param.callback) === 'function') {
                this.finishCallback = param.callback;
            } else {
                this.finishCallback = undefined;
            }
        }

        let startY = _this.wheelY;
        let endY = this.wheelY + _this.elSize.height * this.rollLength;
        let pathLenth = endY - startY;
        _this.wheelY += _this.elSize.height;

        let anim = function () {
            switch (_this.mode) {
                case 'paused':
                    break;
                case 'loop':
                    _this.container.y += _this._wheelSpeed;

                    _this._elemGotoSwitchTop();
                    _this._elemGotoSwitchBottom();
                    break;
                case 'roll':
                    let currTime = _this.state.time.totalElapsedSeconds() * 1000 - (startTime + _this._pausedTimeLenth);
                    let progress = currTime / timeLength;
                    if (progress > 1) {
                        progress = 1;
                    }
                    _this.wheelLastY = _this.container.y = startY + _this._loopLengthY + pathLenth * _this._easingBackInOut(progress);

                    _this._elemGotoSwitchTop();
                    _this._elemGotoSwitchBottom();

                    if (progress === 1) {
                        _this.state.frameAnims.splice(_this.state.frameAnims.indexOf(anim), 1);

                        _this.mode = 'idle';

                        if (_this.finishCallback) {
                            _this.finishCallback();
                        }
                    }
                    break;
                default:
                    return;
            }

        };
        this.state.frameAnims.push(anim);
    }
    _easingBackInOut(k) {
        if (k > 1) k = 1;
        let s = this.easingSeparation;
        if ( ( k *= 2 ) < 1 ) return 0.5 * ( k * k * ( ( s + 1 ) * k - s ) );
        return 0.5 * ( ( k -= 2 ) * k * ( ( s + 1 ) * k + s ) + 2 );
    }
    _gotoMode() {
        if (this._gotoPlay) {
            this._gotoPlay = false;

            this._endLoop();

            this.mode = 'roll';
        }

        if (this._gotoLoop) {
            this._gotoLoop = false;

            if (this.mode === 'roll') {
                this._pausedStartTime = this.state.time.totalElapsedSeconds() * 1000;
            }
            this._wheelStartPos = this.wheelY;
            this.mode = 'loop';
        }

        if (this._gotoPaused) {
            this._gotoPaused = false;

            this._endLoop();

            this._pausedStartTime = this.state.time.totalElapsedSeconds() * 1000;

            this.mode = 'paused';
        }
    }
    _elemGotoSwitchTop() {
        if (this.container.y < this.wheelY) return;
        if (this.mode === 'roll') --this.rollLength;

        this._gotoMode();

        const rand = this.state.rnd.integerInRange(1, 11);
        let anim = rand + '-b';

        if (this.mode === 'roll'
            && this.rollLength < 5
            && this.rollLength > -1
        ) {
            anim = this.finishScreen[this.rollLength] + '-n';
        }

        let itemInd = (this.elSwitch < 0) ? 6 - (Math.abs(this.elSwitch) % 6) : Math.abs(this.elSwitch) % 6;
        // anim = (itemInd + 1) + '-n';
        this._upElement({
            item: this.items[itemInd],
            posY: this.elSize.height * this.elSwitch * -1,
            anim
        });

        this.wheelY += this.elSize.height;
        ++this.elSwitch;

        this._elemGotoSwitchTop();
    }

    _elemGotoSwitchBottom() {
        if (this.container.y > this.wheelY - this.elSize.height * 2) return;
        // if (this.isPaused) return;
        this._gotoMode();

        if (this.mode === 'roll') ++this.rollLength;

        const rand = this.state.rnd.integerInRange(1, 11);
        let anim = rand + '-b';
        if (this.rollLength < 1
            && this.rollLength > -4
        ) {
            anim = this.finishScreen[4 + this.rollLength] + '-n';
        }

        let itemInd = (this.elSwitch < 0) ?  6 - (Math.abs(this.elSwitch) % 6) : Math.abs(this.elSwitch) % 6;
        // anim = (itemInd + 1) + '-n';
        this._upElement({
            item: this.items[itemInd],
            posY: this.elSize.height * (this.elSwitch - 6) * -1,
            anim
        });

        --this.elSwitch;
        this.wheelY -= this.elSize.height;

        this._elemGotoSwitchBottom();
    }
}
