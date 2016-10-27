import { Boot } from '../../modules/States/Boot';
import { Preload } from '../../modules/States/Preload';
import { Init } from '../../modules/States/Init';
import { Main } from '../../modules/States/Main';
import { FS } from '../../modules/States/FS';
import { model } from 'modules/Model/Model';

let game = new Phaser.Game(1280, 720, Phaser.AUTO, 'game');
model.el('game', game);

game.state.add('Boot', Boot, true);
game.state.add('Preload', Preload);
game.state.add('Init', Init);
game.state.add('Main', Main);
game.state.add('FS', FS);

export { model };
