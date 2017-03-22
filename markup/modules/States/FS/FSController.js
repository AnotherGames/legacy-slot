import { model } from 'modules/Model/Model';
import { config } from 'modules/Util/Config';
import { request } from 'modules/Util/Request';

import { view as fsView } from 'modules/States/FS/FSView';
import { view as transitionView } from 'modules/Transition/TransitionView';
import { view as winView } from 'modules/Win/WinView';
import { view as mainView } from 'modules/States/Main/MainView';
import Footer from '../../../../Info/Footer';

import { controller as soundController } from 'modules/Sound/SoundController';
import { controller as balanceController } from 'modules/Balance/BalanceController';
import { controller as panelController } from 'modules/Panel/PanelController';
import { controller as rollController } from 'modules/Roll/RollController';
import { controller as mobileSetBetController } from 'modules/Menu/SetBet/MenuSetBetController';

export let controller = (() => {

    function init(amount) {
        if (model.state('fs:end') === false) return;

        model.state('fs:end', false);
        model.data('fs:count', amount);
        model.updateBalance({startFS: true});
        let multiCounter = 0;
        model.el('multiCounter', multiCounter);

        next();
    }

    function next() {
        let rollData = model.data('rollResponse');

        if (!model.state('fs:end')
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
            soundController.music.stopMusic('fsFon');
            transitionView.fsFinish();
        });

        model.state('fs:end', true);
        model.updateBalance({endFS: true});
        model.state('fs', false);

    }

    function fsMainActions() {
        // Проигрываем анимации барабана и +3
        fsView.draw.CountPlus3({});

        // если максимальный множитель достигнут то возвращаемся
        if (model.state('maxFsMultiplier')) return;

        let rollData = model.data('rollResponse');
        // let levelValue = rollData.FsBonus.Level;
        // let currLevel = model.data('fsLevel');
        let multiValue = rollData.FsBonus.Multi;
        let currMulti = model.data('fsMulti');
        let multiCounter = model.el('multiCounter');

        // Увеличиваем мульти(разбивание бутылки)
        if (multiValue > currMulti) {
            multiCounter++;
            // console.warn(multiCounter);
            fsView.draw.changeMulti({number: multiValue, counter: multiCounter});
            model.data('fsMulti', multiValue);
            model.el('multiCounter', multiCounter);
        }

        model.state('changeLevel', true);

    }

    return {
        init,
        next,
        count,
        stop,
        fsMainActions
    };
})();

export class FS {

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
        let footer = new Footer({model, soundController, request});
        model.el('footer', footer);

        // Играем фоновую музыку
        soundController.music.stopMusic('startPerehod');
        soundController.music.stopMusic('fon');
        soundController.music.stopMusic('initFon');
        soundController.music.playMusic('fsFon');

        fsView.draw.mainBG({});
        // Отрисовуем основной контейнер
        fsView.draw.mainContainer({});
        fsView.draw.machineContainer({});
        mainView.draw.lineNumbers({});
        winView.draw.UpWinContainer({});

        mainView.draw.addShark({});
        game.time.events.add(game.rnd.integerInRange(7000, 12000), () => {
            mainView.draw.addFish1({});
            mainView.draw.addFish2({});
        });

        // Инициализируем крутки
        rollController.init();

        if (model.mobile) {
            // Рисуем футер
            footer.initMobile();
            // Отрисовуем баланс
            balanceController.initFSMobile();
            mobileSetBetController.init({});
            // Автоматически позиционируем основной контейнер
            this.positionMainContainer();
        } else {    // Desktop

            footer.initFsDesktop();

            // Автоматически позиционируем основной контейнер
            this.positionMainContainer();

            // Рисуем кнопки управления
            panelController.drawFsPanel();
            // Отрисовуем баланс
            balanceController.initFSDesktop();
            // BG animations
            mainView.draw.addBubbles({});

        }

        mainView.draw.addLight({});

        // Добавляем маску
        // fsView.draw.machineMask({});
        // Рисуем множитель
        fsView.draw.Multi({
            start: this.fsMulti
        });

        fsView.draw.Level({
            start: this.fsLevel
        });

        if(model.data('fsLevel') > 0) {
            this.drawRecoveredPanel();
        }
        // Рисуем счетчик спинов
        fsView.draw.Count({
            start: this.fsCount
        });

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
        model.el('footer').update();
        // Проигрываем анимацию
        model.el('game').frameAnims.forEach((anim) => {
            anim();
        });

        if (model.mobile && !game.device.iOS) {
            (game.scale.isFullScreen) ? $('#fakeButton').addClass('closed') : $('#fakeButton').removeClass('closed');
        }

        let wheels = model.el('wheels');

        let scale1 = (model.desktop) ? 1.25 : 0.95;
        let scale2 = (model.desktop) ? 1.05 : 0.85;
        let scale3 = (model.desktop) ? 0.85 : 0.7;

        wheels.forEach((wheel) => {

            let act = wheel.elements;
            wheel.elements[0].activeSprite.scale.set(1);
            wheel.elements[0].bg.scale.set(scale1);

            if (act[1].active == 11 || act[1].active == 12 || act[1].active == 13) {
                wheel.elements[1].activeSprite.scale.set(1);
            } else {
                wheel.elements[1].activeSprite.scale.set(0.85);
                wheel.elements[1].bg.scale.set(scale2);
            }

            if (act[2].active == 11 || act[2].active == 12 || act[2].active == 13) {
                wheel.elements[2].activeSprite.scale.set(1);
            } else {
                wheel.elements[2].activeSprite.scale.set(0.7);
                wheel.elements[2].bg.scale.set(scale3);
            }

        });

    }

    positionMainContainer() {
        let game = model.el('game');
        model.group('main').x = game.world.centerX + 8;
        model.group('main').y = game.world.centerY + config[model.res].mainContainer.y - 10;
    }

    checkSavedFS() {
        if (model.data('savedFS')) {
            let saved = model.data('savedFS');
            this.fsCount = saved.fsCount;
            this.fsMulti = saved.fsMulti;
            this.fsLevel = saved.fsLevel;
            model.data('fsMulti', this.fsMulti);
            model.data('fsLevel', this.fsLevel);
            model.data('savedFS', null);
        } else {
            this.fsCount = 15;
            this.fsMulti = 2;
            this.fsLevel = 0;
            model.data('fsMulti', 2);
            model.data('fsLevel', 0);
        }
    }

    drawRecoveredPanel() {
        let multi = model.data('fsMulti');
        let level = model.data('fsLevel');

        for(let i = 2; i < multi; i++){
            fsView.draw.changeMulti({ number: i + 1, animation: i + 1 + '' });
        }
        fsView.draw.changeLevel({number: level, animation: level - 1 + ''});
    }

}
