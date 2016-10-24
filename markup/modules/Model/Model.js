import { events } from '../../modules/Events/Events';

export let model = (function () {

    let _data = {},
        _el = {},
        _state = {},
        _flag = {};

    function returnData(obj, key, value) {
        if (typeof value !== 'undefined') {
            obj[key] = value;
        } else {
            return obj[key];
        }
    }

    function data(key, value) {
        return returnData(_data, key, value);
    }

    function el(key, value) {
        return returnData(_el, key, value);
    }

    function state(key, value) {
        return returnData(_state, key, value);
        events.trigger(`change:${key}`, _state[key]);
    }

    function flag(key, value) {
        if (value && typeof value !== 'boolean') {
            console.error('Flag is not boolean');
            return;
        }
        return returnData(_flag, key, value);
    }

    function log() {
        console.info({
            _data,
            _el,
            _state,
            _flag
        });
    }

    return {
        data,
        el,
        state,
        flag,
        log
    };
})();
