import { events } from 'modules/Util/Events';
import { preloadController } from 'modules/States/Preload/PreloadController';

export class Preload {
    constructor(game) {

    }
    init() {
        events.trigger('preload:init');
        console.info('Preload State!');
    }
    preload() {
        events.trigger('preload:preload');
    }
}
