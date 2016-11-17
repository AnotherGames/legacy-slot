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

        if (model.data('savedFS')) {
            let saved = model.data('savedFS');
            this.fsCount = saved.fsCount;
            this.fsMulti = saved.fsMulti;
            this.fsLevel = saved.fsLevel;
            model.data('savedFS', null);
            model.data('fsMulti', this.fsMulti);
        } else {
            this.fsCount = 15;
            this.fsMulti = 2;
            this.fsLevel = 0;
            model.data('fsMulti', 2);
        }

        // массив в который записываются анимации для проигрывания
        game.frameAnims = [];
        game.spriteAnims = [];

        game.stage.disableVisibilityChange = true;

        model.state('FSMode', true);

        fsView.create.groups({});

        this.keyboardEventsRemove();

        if (model.state('firstFS') === false) {
            events.on('fs:init', this.initFS.bind(this));
            events.on('fs:next', this.nextFS.bind(this));
            events.on('fs:count', this.countFS.bind(this));
            events.on('fs:stop', this.stopFS.bind(this));
            events.on('fs:brain', this.onBrain.bind(this));
            events.on('fs:brain', fsView.draw.CountPlus3.bind(this, {}));
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

        fsView.draw.Brain();
        fsView.draw.Zombie(this.fsMulti);


        let time = game.rnd.integerInRange(10, 70);
        if (model.state('desktop')) {
            let candle1 = fsView.draw.fsCandle({});
            candle1.scale.set(0.8);
            setTimeout(() => {
                let candle2 = fsView.draw.fsCandle({x: 62, y: 500});
                candle2.scale.set(0.7);
            }, time);
            setTimeout(() => {
                let candle3 = fsView.draw.fsCandle({x: 372, y: 440});
            }, time);
        } else {
            let candle1 = fsView.draw.fsCandle({x: -12, y: 315});
            candle1.scale.set(0.8);
            setTimeout(() => {
                let candle2 = fsView.draw.fsCandle({x: 5, y: 330});
                candle2.scale.set(0.7);
            }, time);
            setTimeout(() => {
                let candle3 = fsView.draw.fsCandle({x: 164, y: 292});
            }, time);
        }

        fsView.draw.Multi({
            start: this.fsMulti
        });
        fsView.draw.Count({
            start: this.fsCount
        });
        fsView.draw.BrainLevel({});
        if (this.fsLevel > 0) {
            this.searchBrains({
                startLevel: this.fsLevel
            })
        }

        // PreAnimation
        fsView.draw.darkness({});

        setInterval(() => {
            footerController.updateTime({});
        }, 1000);
        setTimeout(() => {
            events.trigger('fs:init', this.fsCount);
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

        setTimeout(() => {
            sound.music.fsFon.stop();
            transitionView.fsFinish();
        }, 1000);

        model.state('lockedButtons', false);
        model.state('fsEnd', true);
        model.state('FSMode', false);
        model.updateBalance({endFS: true});
        model.el('brainPanel').destroy();
    }

    onBrain() {
        let rollData = model.data('rollResponse');
        let fsMulti = model.el('fsMulti');
        let multiValue = rollData.FsBonus.Multi;

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
        if (currMulti < 6){
            this.searchBrains({});
        }
    }

    searchBrains({
        startLevel
    }) {
        let levelValue = startLevel || model.data('rollResponse').FsBonus.Level;
        let levelABS = levelValue % 3;
        let brainPanel = model.el('brainPanel');
        if (model.state('brainPanel') === false) {
            fsView.draw.BrainLevel({});
            brainPanel = model.el('brainPanel');
            model.state('brainPanel', true);
        }
        if (levelABS === 0) {
            console.warn('levelABS', levelABS);
            brainPanel.visible = true;
            brainPanel.setAnimationByName(0,'w3', false);
            brainPanel.addAnimationByName(0,'w4', false);
            setTimeout(() => {
                brainPanel.destroy();
                model.state('brainPanel', false);
            }, 1000);
        }
        if (levelABS === 1){
            console.warn('levelABS', levelABS);
            brainPanel.visible = true;
            brainPanel.setAnimationByName(0,'w1', false);
            brainPanel.addAnimationByName(0,'w1.5', true);
        }
        if (levelABS === 2){
            console.warn('levelABS', levelABS);
            brainPanel.visible = true;
            brainPanel.setAnimationByName(0,'w2', false);
            brainPanel.addAnimationByName(0,'w2.5', true);
        }

    }
}
