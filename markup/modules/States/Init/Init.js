import { events } from 'modules/Util/Events';
import { initController } from 'modules/States/Init/InitController';

export class Init {
    constructor(game) {

    }
    init() {
        events.trigger('init:init');
        console.info('Init State!');
    }

    create() {
        events.trigger('init:create');
    }
}
