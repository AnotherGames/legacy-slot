import { events } from 'modules/Util/Events';
import { model } from 'modules/Model/Model';
import { config } from 'modules/Util/Config';

import { settings } from 'modules/Menu/Settings';
import { sound } from 'modules/Sound/Sound';

import { view as fsView } from 'modules/States/FS/View';

import { controller as balanceController } from 'modules/Balance/BalanceController';
import { controller as footerController } from 'modules/Footer/FooterController';
import { controller as panelController } from 'modules/Panel/PanelController';
import { controller as buttonsController } from 'modules/Buttons/ButtonsController';
import { controller as rollController } from 'modules/Roll/RollController';
import { controller as winController } from 'modules/Win/WinController';
import { view as transitionView } from 'modules/Transition/TransitionView';

export class FS {
    constructor(game) {

    }

    init() {
        console.info('FS State!');
        const game = model.el('game');
        sound.init({sound: model.state('sound'), volume: model.state('volume'), music: model.state('music')});

        if (model.data('savedFS')) {
            let saved = model.data('savedFS');
            this.fsCount = saved.fsCount;
            this.fsMulti = saved.fsMulti;
            this.fsLevel = saved.fsLevel;
            model.data('savedFS', null);
            model.data('fsMulti', this.fsMulti);
        } else {
            this.fsCount = model.data('rollResponse').FreeSpinsWin;
            this.fsMulti = model.data('rollResponse').NextMode.split('-')[1];
            this.fsLevel = 0;
            model.data('fsMulti', this.fsMulti);
        }

        // массив в который записываются анимации для проигрывания
        game.frameAnims = [];
        game.spriteAnims = [];

        game.stage.disableVisibilityChange = false;

        model.state('FSMode', true);

        fsView.create.groups({});

        if (model.state('firstFS') === false) {
            events.on('fs:init', this.initFS.bind(this));
            events.on('fs:next', this.nextFS.bind(this));
            events.on('fs:count', this.countFS.bind(this));
            events.on('fs:stop', this.stopFS.bind(this));
            // events.on('fs:brain', this.onBrain.bind(this));
            // events.on('fs:brain', fsView.draw.CountPlus3.bind(this, {}));
            model.state('firstFS', true);
        }
    }

    preload() {

    }

    create() {
        const game = model.el('game');

        this.playFonMusic();

        fsView.draw.mainBG({});
        fsView.draw.mainContainer({});
        fsView.draw.machineContainer({});
        fsView.draw.lineNumbers({});
        game.mainContainer.x = game.world.centerX;
        game.mainContainer.y = game.world.centerY + config[model.state('res')].mainContainer.y;

        rollController.init();

        if (model.state('mobile')) {
            footerController.initMobile();
            balanceController.initFSMobile();

        } else {    // Desktop
            footerController.initDesktop();
            settings.initDesktopSettings(game);
            panelController.initFS();
            balanceController.initFSDesktop();
        }

        fsView.draw.machineMask({});

        fsView.draw.Multi({
            start: this.fsMulti
        });
        fsView.draw.Count({
            start: this.fsCount
        });

        // PreAnimation
        fsView.draw.darkness({});

        game.time.events.add(1000, () => {
            footerController.updateTime({});
            events.trigger('fs:init', this.fsCount);
        });
    }

    playFonMusic() {
        const game = model.el('game');

        sound.music.fsFon.volume = 0;
        sound.music.fsFon.play();

        let timeLength = config.fadeinMusicTime;
        let _clock = game.time.create(true);
        _clock.add(timeLength, () => {}, this);
        _clock.start();
        let timer = 0;

        let anim = function () {
            timer = timeLength - _clock.duration;
            let progress = timer / timeLength;
            if (progress > 1) {
                progress = 1;
            }
            sound.music.fsFon.volume = progress;

            if (progress === 1) {
                game.frameAnims.splice(game.frameAnims.indexOf(anim), 1);
            }

        };
        this.game.frameAnims.push(anim);
    }

    update() {
        const game = model.el('game');
        game.frameAnims.forEach((anim) => {
            anim();
        });
    }

    initFS(amount) {
        if (model.state('fsEnd') === false) return;
        console.log('I am initing FS: ', amount);

        model.state('fsEnd', false);
        model.data('fsCount', amount);
        model.updateBalance({startFS: true});

        this.nextFS();
    }

    nextFS() {
        let rollData = model.data('rollResponse');

        if (!model.state('fsEnd') && rollData.NextMode !== 'root') {

            events.trigger('fs:count', {start: true});
            events.trigger('roll:request');

        }

        if (rollData.NextMode === 'root') {

            events.trigger('fs:stop');

        }
    }

    countFS({
        start,
        end
    }) {
        if (start) {
            let newFsCount = model.data('fsCount');
                newFsCount--;
            model.data('fsCount', newFsCount);
            model.el('fsCount').text = newFsCount;
        }
        if (end) {
            model.data('fsCount', model.data('rollResponse').FreeSpinsLeft);
            model.el('fsCount').text = model.data('rollResponse').FreeSpinsLeft;
        }
    }

    stopFS() {
        console.log('I am stoping FS!');

        const game = model.el('game');
        game.time.events.add(1500, () => {
            sound.music.fsFon.stop();
                transitionView.fsFinish();
        });

        model.state('lockedButtons', false);
        model.state('fsEnd', true);
        model.state('FSMode', false);
        model.updateBalance({endFS: true});

    }

    // onBrain() {
    //     console.log(' i am in brain function');
    //     let rollData = model.data('rollResponse');
    //     let fsMulti = model.el('fsMulti');
    //     let multiValue = rollData.FsBonus.Multi;
    //
    //     fsMulti.frameName = `multi${multiValue}.png`;
    //     let brain = model.el('flyingBrain');
    //     let currMulti = model.data('fsMulti');
    //
    //     if (multiValue > currMulti) {
    //         if (currMulti === 6) {
    //             let zombie = model.el('zombie');
    //             zombie.Up(() => {
    //                 brain.Up(() => {
    //                     zombie.Up();
    //                     sound.sounds.zombie1.play();
    //                 });
    //             });
    //             model.data('fsMulti', multiValue);
    //         } else {
    //             model.el('zombie').Up();
    //             model.data('fsMulti', multiValue);
    //         }
    //     }
    //
    //     if (currMulti < 7) {
    //         brain.Win();
    //         this.searchBrains({});
    //     }
    // }

}
