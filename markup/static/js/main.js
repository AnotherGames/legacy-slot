import { Boot } from '../../modules/States/Boot';
import { Preload } from '../../modules/States/Preload';
import { Init } from '../../modules/States/Init';
import { Main } from '../../modules/States/Main';
import { FS } from '../../modules/States/FS';

let game = new Phaser.Game(800, 600, Phaser.AUTO);

game.state.add('Boot', Boot, true);
game.state.add('Preload', Preload);
game.state.add('Init', Init);
game.state.add('Main', Main);
game.state.add('FS', FS);
