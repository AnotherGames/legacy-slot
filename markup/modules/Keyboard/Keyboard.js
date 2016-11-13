export let keyboard = {
    _stack: {},
    _press: {},

    _isActive: true,
    get active() {
        return this._isActive;
    },
    set active(val) {
        if (!val) {
            this._press = {};
        }
        this._isActive = val;
    },

    init: function () {
        let _this = this;
        document.body.addEventListener('keydown', function (event) {
            _this._keyDown(event);
        });
        document.body.addEventListener('keyup', function (event) {
            _this._keyUp(event);
        });
    },

    _keyDown: function (event) {
        if (!this.active) return;

        let _key = event.which || event.keyCode;
        if (!_key) return;

        let _stack = this._stack[_key];
        if (_stack
            && (_stack.down || _stack._press)
        ) {
            if ( !this._press[_key]) {
                this._press[_key] = true;
                if (_stack.down) {
                    if (_stack.down(event)) return;
                }
            } else {
                if (_stack.press) {
                    if (!_stack.press(event)) return;
                }
            }

            event.preventDefault();
            return false;
        }
    },
    _keyUp: function(event) {
        if (!this.active) return;

        let _key = event.which || event.keyCode;
        if (!_key) return;

        let _stack = this._stack[_key];
        if (!_stack) return;

        delete this._press[_key];
        if (!_stack.up) return;
        if (!_stack.up(event)) return;

        return false;
    },

    /*  param: {
            key: Number,
            down: Function,
            press: Function,
            up: Function
        }   */
    Add: function (param) {
        if (typeof (param) !== 'object') {
            console.error('Add: param is not object.', param);
            return;
        }
        if (typeof (param.key) !== 'number') {
            console.error('Add: key is not number.', param);
            return;
        }

        this._stack[param.key] = {};

        if (typeof (param.down) === 'function') {
            this._stack[param.key].down = param.down;
        }
        if (typeof (param.press) === 'function') {
            this._stack[param.key].press = param.press;
        }
        if (typeof (param.up) === 'function') {
            this._stack[param.key].up = param.up;
        }
    },

    Remove: function (key) {
        if (!this._stack[key]) {
            console.warn('Key "' + key + '" is not create.');
            return;
        }

        delete this._stack[key];
        if ( this._press[key]) {
            delete this._press[key];
        }
    }
};
