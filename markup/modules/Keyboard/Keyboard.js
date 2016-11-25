import { model } from 'modules/Model/Model';
import { events } from 'modules/Util/Events';

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
    },

    initDefaultKey: function() {
            // Space
            this.Add({
                key: 32,
                down: function () {
                    if (model.state('lockedButtons') || model.state('roll:progress') || !model.state('autoEnd')) return;
                    events.trigger('roll:request');
                    events.trigger('roll:fast');
                    return true;
                }
            });
            // Up
            this.Add({
                key: 38,
                down: function () {
                    if (model.state('roll:progress') || !model.state('autoEnd')) return;
                    model.changeCoin({up: true});
                    return true;
                }
            });
            // Down
            this.Add({
                key: 40,
                down: function () {
                    if (model.state('roll:progress') || !model.state('autoEnd')) return;
                    model.changeCoin({down: true});
                    return true;
                }
            });
            // Right
            this.Add({
                key: 39,
                down: function () {
                    if (model.state('roll:progress') || !model.state('autoEnd')) return;
                    model.changeBet({up: true});
                    return true;
                }
            });
            // Left
            this.Add({
                key: 37,
                down: function () {
                    if (model.state('roll:progress') || !model.state('autoEnd')) return;
                    model.changeBet({down: true});
                    return true;
                }
            });
        },

        removeDefaultKey: function(){
            // Space
            this.Remove(32);
            // Up
            this.Remove(38);
            // Down
            this.Remove(40);
            // Right
            this.Remove(39);
            // Left
            this.Remove(37);
        }
};
