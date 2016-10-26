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
            const elem = this.state.add.sprite(0, i * this.elSize.height * -1, 'elements', rand + '-b.png');
            elem.anchor.set(0.5);
            this.container.add(elem);
            this.items.push(elem);
        }
    }
    /*  currElems: []   */
    update(currElems) {
        this.container.y = this.position.y + this.elSize.height * 2;

        for (let i = 0; i < 5; i++) {
            let item = this.items[i];
            item.y = i * this.elSize.height * -1;
            // item.animations.play(currElems[4 - i] + '-n', 15, true);
            item.frameName = currElems[4 - i] + '-b.png';
        }

        this.elSwitch = 5;
    }
    _run() {
        const runAnim = this.state.add.tween(this.container);
        runAnim.to( { y: this.container.y + this.elSize.height }, 30, "Linear", true);
        runAnim.onComplete.add(() => {
            if (this.isRun) {
                this._run();
            } else {
                this.lull();
            }
        }, this);

        const item = this.items[this.elSwitch % 6];
        const rand = this.state.rnd.integerInRange(1, 11);
        item.frameName = rand + '-b.png';
        item.y = this.elSize.height * this.elSwitch * -1;

        ++this.elSwitch;
    }
    play() {
        this.isRun = true;
        const runAnim1 = this.state.add.tween(this.container).to({ y: this.container.y - 100 }, 500);
        const runAnim2 = this.state.add.tween(this.container).to({ y: this.container.y + 100 }, 500, "Quart.easeIn");
        runAnim1.chain(runAnim2);
        runAnim1.start();

        runAnim2.onComplete.add(() => {
            this._run();
        }, this);

    }
    _lull() {

    }
    stop(finisElems) {
        this.isRun = false;
        this.finisElems = finisElems;
    }
}
