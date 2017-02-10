import { model } from 'modules/Model/Model';
import { config } from 'modules/Util/Config';

import { view as fsView } from 'modules/States/FS/FSView';
import { view as transitionView } from 'modules/Transition/TransitionView';

import { controller as soundController } from 'modules/Sound/SoundController';
import { controller as settingsController } from 'modules/Settings/DesktopSettingsController';
import { controller as balanceController } from 'modules/Balance/BalanceController';
import { controller as footerController } from 'modules/Footer/FooterController';
import { controller as panelController } from 'modules/Panel/PanelController';
import { controller as buttonsController } from 'modules/Buttons/ButtonsController';
import { controller as rollController } from 'modules/Roll/RollController';
import { controller as winController } from 'modules/Win/WinController';

export let controller = (() => {

    function init(amount) {
        if (model.state('fs:end') === false) return;

        model.state('fs:end', false);
        model.data('fs:count', amount);
        model.updateBalance({startFS: true});

        next();
    }

    function next() {
        let rollData = model.data('rollResponse');

        if(!model.state('fs:end')
        && rollData.NextMode !== 'root') {
            controller.count({start: true});
            rollController.startRoll();
        }

        if (rollData.NextMode === 'root') {
            stop();
        }
    }

    function count({
        start,
        end
    }) {
        if (start) {
            let newFsCount = model.data('fs:count');
            newFsCount--;
            model.data('fs:count', newFsCount);
            model.el('fs:count').text = newFsCount;
        }
        if (end) {
            model.data('fs:count', model.data('rollResponse').FreeSpinsLeft);
            model.el('fs:count').text = model.data('rollResponse').FreeSpinsLeft;
        }
    }

    function stop() {
        let game = model.el('game');

        game.time.events.add(1500, () => {
            soundController.music.stopMusic('fsFon')
            transitionView.fsFinish();
        });

        model.state('fs:end', true);
        model.state('fs', false);
        model.updateBalance({endFS: true});
        model.el('brainPanel').destroy();
    }

    function brain() {
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
                        soundController.sound.playSound({sound: 'zombie1'});
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
            searchBrains({});
        }

        fsView.draw.CountPlus3({});
    }

    function searchBrains({
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
            playBrainSound();
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
            playBrainSound();
            brainPanel.visible = true;
            brainPanel.setAnimationByName(0,'w1', false);
            brainPanel.addAnimationByName(0,'w1.5', true);
        }
        if (levelABS === 2){
            playBrainSound();
            brainPanel.visible = true;
            brainPanel.setAnimationByName(0,'w2', false);
            brainPanel.addAnimationByName(0,'w2.5', true);
        }

    }

    function playBrainSound(){
      if (Math.round(Math.random())){
          soundController.sound.playSound({sound: 'mozgi2'})
      } else {
          soundController.sound.playSound({sound: 'mozgi1'})
      }
    }

    return {
        init,
        next,
        count,
        stop,
        brain,
        searchBrains
    };
})();

export class FS {
    constructor(game) {

    }

    init() {
        console.info('FS State!');
        let game = model.el('game');

        // Проверим сохраненную сессию
        this.checkSavedFS();

        // массив в который записываются анимации для проигрывания
        game.frameAnims = [];
        game.spriteAnims = [];


        model.state('fs', true);

        // Создаем контейнеры
        fsView.create.groups({});

        // При выходе из вкладки анимации будут останавливаться
        game.stage.disableVisibilityChange = true;

    }

    create() {
        let game = model.el('game');

        // Играем фоновую музыку
        soundController.music.stopMusic('startPerehod');
        soundController.music.stopMusic('fon');
        soundController.music.stopMusic('initFon');
        soundController.music.playMusic('fsFon');

        // Отрисовуем основной контейнер
        fsView.draw.mainBG({});
        fsView.draw.mainContainer({});
        fsView.draw.machineContainer({});

        // Инициализируем крутки
        rollController.init();

        if (model.mobile) {
            // Рисуем футер
            footerController.initMobile();
            // Отрисовуем баланс
            balanceController.initFSMobile();

            // Автоматически позиционируем основной контейнер
            this.positionMainContainer();
        } else {    // Desktop
            footerController.initDesktop();

            // Автоматически позиционируем основной контейнер
            this.positionMainContainer();

            // Рисуем кнопки управления
            panelController.drawFsPanel();
            // Отрисовуем баланс
            balanceController.initFSDesktop();
        }

        // Добавляем маску
        fsView.draw.machineMask({});

        // Добавляем Мозги на экран
        fsView.draw.Brain();
        // Добавляем Зомби на экран
        fsView.draw.Zombie(this.fsMulti);
        // Добавляем свечки
        this.positionCandles();

        // Рисуем множитель
        fsView.draw.Multi({
            start: this.fsMulti
        });
        // Рисуем счетчик спинов
        fsView.draw.Count({
            start: this.fsCount
        });
        // Рисуем счетчик мозгов
        fsView.draw.BrainLevel({});
        // Если сохранненая сессия, то переключаем счетчик мозгов
        if (this.fsLevel > 0) {
            controller.searchBrains({
                startLevel: this.fsLevel
            })
        }

        // Первая темнота
        game.camera.flash(0x000000, 500);

        // Запускаем Фри Спины
        game.time.events.add(1000, () => {
            controller.init(this.fsCount);
        });

    }

    update() {
        const game = model.el('game');
        // Обновляем время
        footerController.updateTime({});
        // Проигрываем анимацию
        model.el('game').frameAnims.forEach((anim) => {
            anim();
        });

        if (model.desktop) {
            let fullScreeButton = model.el('fullScreeButton');
                fullScreeButton.frameName = (game.scale.isFullScreen || window.innerHeight == screen.height) ? 'fullscreenOff.png' : 'fullscreen.png';
        }
    }

    positionMainContainer() {
        let game = model.el('game');
        model.group('main').x = game.width - model.group('main').width / 2;
        model.group('main').y = game.world.centerY + config[model.res].mainContainer.y;
    }

    checkSavedFS() {
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
    }

    positionCandles() {
        let game = model.el('game');
        let time = game.rnd.integerInRange(10, 70);
        if (model.desktop) {
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
    }

};
