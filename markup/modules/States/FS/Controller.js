import { events } from 'modules/Util/Events';
import { model } from 'modules/Model/Model';
import { config } from 'modules/Util/Config';

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

        game.stage.disableVisibilityChange = false;

        model.state('FSMode', true);

        fsView.create.groups({});

        keyboard.removeDefaultKey();

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

        this.playFonMusic();

        fsView.draw.mainBG({});
        fsView.draw.mainContainer({});
        fsView.draw.machineContainer({});

        rollController.init();

        if (model.state('mobile')) {
            footerController.initMobile();
            balanceController.initFSMobile();

            game.mainContainer.x = model.data('mainXRight');
            game.mainContainer.y = game.world.centerY + config[model.state('res')].mainContainer.y;
        } else {    // Desktop
            footerController.initDesktop();

            game.mainContainer.x = game.width - game.mainContainer.width / 2;
            game.mainContainer.y = game.world.centerY + config[model.state('res')].mainContainer.y;

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
            game.time.events.add(time, () => {
                let candle2 = fsView.draw.fsCandle({x: 62, y: 500});
                candle2.scale.set(0.7);
                let candle3 = fsView.draw.fsCandle({x: 372, y: 440});
            });
        } else {
            let candle1 = fsView.draw.fsCandle({x: -12, y: 315});
            candle1.scale.set(0.8);
            game.time.events.add(time, () => {
                let candle2 = fsView.draw.fsCandle({x: 5, y: 330});
                candle2.scale.set(0.7);
                let candle3 = fsView.draw.fsCandle({x: 164, y: 292});
            });
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
        model.el('brainPanel').destroy();
    }

    onBrain() {
        let rollData = model.data('rollResponse');
        let fsMulti = model.el('fsMulti');
        let multiValue = rollData.FsBonus.Multi;

        fsMulti.frameName = `multi${multiValue}.png`;
        let brain = model.el('flyingBrain');
        let currMulti = model.data('fsMulti');

        if (multiValue > currMulti) {
            if (currMulti === 6) {
                let zombie = model.el('zombie');
                zombie.Up(() => {
                    brain.Up(() => {
                        zombie.Up();
                        sound.sounds.zombie1.play();
                    });
                });
                model.data('fsMulti', multiValue);
            } else {
                model.el('zombie').Up();
                model.data('fsMulti', multiValue);
            }
        }

        if (currMulti < 7) {
            brain.Win();
            this.searchBrains({});
        }
    }

    searchBrains({
        startLevel
    }) {
        let brainSound = Math.round(Math.random()) ? sound.sounds.brain1 : sound.sounds.brain2;

        let levelValue = startLevel || model.data('rollResponse').FsBonus.Level;
        let levelABS = levelValue % 3;
        let brainPanel = model.el('brainPanel');
        if (model.state('brainPanel') === false) {
            fsView.draw.BrainLevel({});
            brainPanel = model.el('brainPanel');
            model.state('brainPanel', true);
        }
        if (levelABS === 0) {
            // console.warn('levelABS', levelABS);
            brainSound.play();
            brainPanel.visible = true;
            brainPanel.setAnimationByName(0,'w3', false);
            brainPanel.addAnimationByName(0,'w4', false);
            const game = model.el('game');
            game.time.events.add(1000, () => {
                brainPanel.destroy();
                model.state('brainPanel', false);
            });
        }
        if (levelABS === 1){
            // console.warn('levelABS', levelABS);
            brainSound.play();
            brainPanel.visible = true;
            brainPanel.setAnimationByName(0,'w1', false);
            brainPanel.addAnimationByName(0,'w1.5', true);
        }
        if (levelABS === 2){
            // console.warn('levelABS', levelABS);
            brainSound.play();
            brainPanel.visible = true;
            brainPanel.setAnimationByName(0,'w2', false);
            brainPanel.addAnimationByName(0,'w2.5', true);
        }

    }
}
