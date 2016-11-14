import { model } from 'modules/Model/Model';
import { events } from 'modules/Util/Events';

import { keyboard } from 'modules/Keyboard/Keyboard';
keyboard.init();

const game = new Phaser.Game(1280, 720, Phaser.AUTO, 'game');
model.el('game', game);

import { Boot } from 'modules/States/Boot/Boot';
import { Preload } from 'modules/States/Preload/Controller';
import { Init } from 'modules/States/Init/Controller';
import { Main } from 'modules/States/Main/Controller';
import { FS } from 'modules/States/FS/FS';

game.state.add('Boot', Boot, true);
game.state.add('Preload', Preload);
game.state.add('Init', Init);
game.state.add('Main', Main);
game.state.add('FS', FS);

export { model };
export { events };
