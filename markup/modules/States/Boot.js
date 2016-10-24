import { model } from '../../modules/Model/Model';

export class Boot {
    constructor(game) {

    }
    init() {
        console.info('Boot State!');
        model.data();
    }
    preload() {

    }
    create() {

    }
}
