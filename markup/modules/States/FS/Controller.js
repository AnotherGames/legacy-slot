import { events } from 'modules/Util/Events';
import { model } from 'modules/Model/Model';

import { keyboard } from 'modules/Keyboard/Keyboard';
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

        // массив в который записываются анимации для проигрывания
        game.frameAnims = [];
        game.spriteAnims = [];

        game.stage.disableVisibilityChange = true;

        model.state('FSMode', true);
        model.data('fsMulti', 2);

        fsView.create.groups({});

        this.keyboardEventsRemove();

        if (model.state('firstFS') === false) {
            events.on('fs:init', this.initFS.bind(this));
            events.on('fs:next', this.nextFS.bind(this));
            events.on('fs:count', this.countFS.bind(this, {start: true}));
            events.on('fs:stop', this.stopFS.bind(this));
            events.on('fs:brain', this.onBrain.bind(this));
            model.state('firstFS', true);
        }
    }

    preload() {

    }

    create() {
        const game = model.el('game');

        sound.music.fsFon.play();

        fsView.draw.mainBG({});
        fsView.draw.mainContainer({});
        fsView.draw.machineContainer({});

        rollController.init();

        if (model.state('mobile')) {
            footerController.initMobile();
            balanceController.initFSMobile();

            game.mainContainer.x = model.data('mainXRight');
        } else {    // Desktop
            footerController.initDesktop();

            game.mainContainer.x = game.width - game.mainContainer.width;

            settings.initDesktopSettings(game);
            panelController.initFS();
            balanceController.initFSDesktop();
        }

        fsView.draw.machineMask({});

        fsView.draw.Zombie();
        fsView.draw.Brain();

        fsView.draw.Multi({});
        fsView.draw.Count({});
        fsView.draw.BrainLevel({});

        // PreAnimation
        fsView.draw.darkness({});

        setInterval(() => {
            footerController.updateTime({});
        }, 1000);
        setTimeout(() => {
            events.trigger('fs:init', 15);
        }, 1000)
    }

    update() {
        const game = model.el('game');
        game.frameAnims.forEach((anim) => {
            anim();
        });
    }

    keyboardEventsRemove() {
        // Space
        keyboard.Remove(32);
        // Up
        keyboard.Remove(38);
        // Down
        keyboard.Remove(40);
        // Right
        keyboard.Remove(39);
        // Left
        keyboard.Remove(37);
    }

    initFS(amount) {
        if (model.state('fsEnd') === false) return;
        console.log('I am initing FS: ', amount);

        model.state('fsEnd', false);
        model.data('fsCount', amount);

        this.nextFS();
    }

    nextFS() {
        let fsCount = model.data('fsCount');
        let rollData = model.data('rollResponse');
        fsCount--;

        if (!model.state('fsEnd')) {

            events.trigger('roll:request');

        }

        if (fsCount >= 0) {

            model.data('fsCount', fsCount);
            events.trigger('fs:count', fsCount);

        }
        //  && rollData.NextMode === 'root'
        if (fsCount === 0) {

            events.trigger('fs:stop');

        }
    }

    countFS({
        start,
        end
    }) {
        if (start) {
            model.el('fsCount').text = model.data('fsCount');
        }
        if (end) {
            model.el('fsCount').text = 'end';
        }
    }

    stopFS() {
        console.log('I am stoping FS!');

        setTimeout(() => {
            sound.music.fsFon.stop();
            transitionView.fsFinish();
            // model.el('game').state.start('Main');
        }, 2000);

        model.state('lockedButtons', false);
        model.state('fsEnd', true);
        model.state('FSMode', false);
    }

    onBrain() {
        let rollData = model.data('rollResponse');
        let fsCount = model.el('fsCount');
        let fsMulti = model.el('fsMulti');
        let multiValue = rollData.FsBonus.Multi;

        fsCount.text = '+3';
        model.data('fsCount', rollData.FreeSpinsLeft);
        fsMulti.frameName = `multi${multiValue}.png`;

        let currMulti = model.data('fsMulti');

        if (multiValue > currMulti) {
            if (currMulti === 6) {
                let brain = model.el('flyingBrain');
                let zombie = model.el('zombie');
                zombie.Up(() => {
                    brain.Up(() => {
                        zombie.Up();
                    });
                });
            } else {
                model.el('zombie').Up();
                model.data('fsMulti', multiValue);
            }
        }
        this.searchBrains();
    }

    searchBrains() {
        let levelValue = model.data('rollResponse').FsBonus.Level;
        let levelABS = levelValue % 3;
        let brainPanel = model.el('brainPanel');
        if (levelABS === 0) {
            brainPanel.frameName = `03.png`;
            setTimeout(() => {
                brainPanel.visible = false;
            }, 500);
        } else {
            brainPanel.visible = true;
            brainPanel.frameName = `0${levelABS}.png`;
        }
    }
}
