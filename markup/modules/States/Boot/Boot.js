import { events } from 'modules/Util/Events';
import { bootController } from 'modules/States/Boot/BootController';

export class Boot {
    constructor(game) {

    }
    init() {
        console.log('Boot State!');
        events.trigger('boot:init');
    }
    preload() {
        events.trigger('boot:preload');
    }
}
