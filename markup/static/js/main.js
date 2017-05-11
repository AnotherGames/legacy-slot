import { model } from 'modules/Model/Model';
import { Gold } from 'modules/Class/DoorLevel';

const game = new Phaser.Game(1280, 720, Phaser.AUTO, 'game');
model.el('game', game);

import { Boot } from 'modules/States/Boot/BootController';
import { Preload } from 'modules/States/Preload/PreloadController';
import { Init } from 'modules/States/Init/InitController';
import { Main } from 'modules/States/Main/MainController';
import { FS } from 'modules/States/FS/FSController';
import { Bonus } from 'modules/States/Bonus/BonusController';

game.state.add('Boot', Boot, true);
game.state.add('Preload', Preload);
game.state.add('Init', Init);
game.state.add('Main', Main);
game.state.add('FS', FS);
game.state.add('Bonus', Bonus);

export { model, Gold };
