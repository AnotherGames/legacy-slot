import { model } from 'modules/Model/Model';
import { config } from 'modules/Util/Config';

import { view as fsView } from 'modules/States/FS/View';
import { view as transitionView } from 'modules/Transition/View';

import { controller as soundController } from 'modules/Sound/Controller';
import { controller as settingsController } from 'modules/Settings/Controller';
import { controller as balanceController } from 'modules/Balance/Controller';
import { controller as footerController } from 'modules/Footer/Controller';
import { controller as panelController } from 'modules/Panel/Controller';
import { controller as buttonsController } from 'modules/Buttons/Controller';
import { controller as rollController } from 'modules/Roll/Controller';
import { controller as winController } from 'modules/Win/Controller';

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
            // soundController.music.fsFon.stop();
            soundController.music.stopMusic('fsFon')
            transitionView.fsFinish();
        });

        model.state('buttons:locked', false);
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
                        // soundController.sounds.zombie1.play();
                        soundController.sounds.playSound('zombie1');
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
        // let brainSound = Math.round(Math.random()) ? soundController.sounds.brain1 : soundController.sounds.brain2;

        let levelValue = startLevel || model.data('rollResponse').FsBonus.Level;
        let levelABS = levelValue % 3;
        let brainPanel = model.el('brainPanel');
        if (model.state('brainPanel') === false) {
            fsView.draw.BrainLevel({});
            brainPanel = model.el('brainPanel');
            model.state('brainPanel', true);
        }
        if (levelABS === 0) {
            playBrainSound()
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
            playBrainSound()
            brainPanel.visible = true;
            brainPanel.setAnimationByName(0,'w1', false);
            brainPanel.addAnimationByName(0,'w1.5', true);
        }
        if (levelABS === 2){
            playBrainSound()
            brainPanel.visible = true;
            brainPanel.setAnimationByName(0,'w2', false);
            brainPanel.addAnimationByName(0,'w2.5', true);
        }

    }

    function playBrainSound(){
      Math.round(Math.random())
      ? soundController.sounds.playSound('brain1')
      : soundController.sounds.playSound('brain2')
    }

    return {
        init,
        next,
        count,
        stop,
        brain
    };
})();

export class FS {
    constructor(game) {

    }

    init() {
        console.info('FS State!');
        let game = model.el('game');

        // Инициализируем звуки
        // soundController.init({
        //     sound: model.state('sound'),
        //     volume: model.state('volume'),
        //     music: model.state('music')
        // });

        // Проверим сохраненную сессию
        this.checkSavedFS();

        // массив в который записываются анимации для проигрывания
        game.frameAnims = [];
        game.spriteAnims = [];

        // При выходе из вкладки анимации будут останавливаться
        game.stage.disableVisibilityChange = false;

        model.state('fs', true);

        // Создаем контейнеры
        fsView.create.groups({});
    }

    create() {
        let game = model.el('game');

        // Играем фоновую музыку
        this.playFonMusic();

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
        fsView.draw.darkness({});

        // Запускаем Фри Спины
        game.time.events.add(1000, () => {
            controller.init(this.fsCount);
        });
    }

    update() {
        // Обновляем время
        footerController.updateTime({});
        // Проигрываем анимацию
        model.el('game').frameAnims.forEach((anim) => {
            anim();
        });
    }

    playFonMusic() {
        const game = model.el('game');

        // soundController.music.fsFon.volume = 0;
        // soundController.music.fsFon.play();
        soundController.music.playMusic('fsFon');
        soundController.music.changeMusicVolume('fsFon', 0)

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
            // soundController.music.fsFon.volume = progress;
            soundController.music.changeMusicVolume('fsFon', progress)

            if (progress === 1) {
                game.frameAnims.splice(game.frameAnims.indexOf(anim), 1);
            }

        };
        this.game.frameAnims.push(anim);
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
