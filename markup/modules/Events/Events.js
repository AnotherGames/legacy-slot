import { model } from '../../modules/Model/Model';

export let events = {
    events: {},
    on: function (eventName, fn) {
        this.events[eventName] = this.events[eventName] || [];
        this.events[eventName].push(fn);
    },
    off: function (eventName, fn) {
        if (this.events[eventName]) {
            for (let i = 0, len = this.events[eventName].length; i < len; i++) {
                if (this.events[eventName][i] === fn) {
                    this.events[eventName].splice(i, 1);
                    break;
                }
            }
        }
    },
    trigger: function (eventName, data) {
        if (model.flag('events:debug')) {
            console.info(`Event ${eventName} triggered!`);
        }
        try {
            if (this.events[eventName]) {
                this.events[eventName].forEach(function (fn) {
                    fn(data);
                });
            }
        } catch (e) {
            console.error(e.message, eventName, data);
        }
    }
};
