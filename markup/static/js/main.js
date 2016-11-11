import { model } from 'modules/Model/Model';
import { events } from 'modules/Util/Events';

const game = new Phaser.Game(1280, 720, Phaser.AUTO, 'game');
model.el('game', game);

import { Boot } from 'modules/States/Boot/Boot';
import { Preload } from 'modules/States/Preload/Preload';
import { Init } from 'modules/States/Init/Init';
import { Main } from 'modules/States/Main/Main';
import { FS } from 'modules/States/FS/FS';

game.state.add('Boot', Boot, true);
game.state.add('Preload', Preload);
game.state.add('Init', Init);
game.state.add('Main', Main);
game.state.add('FS', FS);

export { model };
export { events };
