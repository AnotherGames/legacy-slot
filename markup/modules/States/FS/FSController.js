import { model } from 'modules/Model/Model';
import { config } from 'modules/Util/Config';

import { view as fsView } from 'modules/States/FS/FSView';
import { view as transitionView } from 'modules/Transition/TransitionView';
import { view as winView } from 'modules/Win/WinView';

import { controller as soundController } from 'modules/Sound/SoundController';
import { controller as settingsController } from 'modules/Settings/DesktopSettingsController';
import { controller as balanceController } from 'modules/Balance/BalanceController';
import { controller as footerController } from 'modules/Footer/FooterController';
import { controller as panelController } from 'modules/Panel/PanelController';
import { controller as buttonsController } from 'modules/Buttons/ButtonsController';
import { controller as rollController } from 'modules/Roll/RollController';
import { controller as winController } from 'modules/Win/WinController';
import { controller as mobileSetBetController } from 'modules/Menu/SetBet/MenuSetBetController';

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

        game.time.events.add(500, () => {
            soundController.music.stopMusic('fsFon')
            transitionView.fsFinish();
        });

        model.state('fs:end', true);
        model.updateBalance({endFS: true});
        model.state('fs', false);
    }


    function changeMulti() {

        if(model.state('maxFsMultiplier')) return;

        let game = model.el('game');
        let rollData = model.data('rollResponse');
        let multiValue = rollData.FsBonus.Multi;
        let currMulti = model.data('fsMulti');

        if (multiValue > currMulti) {
            changeMultiBackground(multiValue)
        }
    }

    function recoverSession(multi) {
        let wheels = model.el('wheels');
        let upWheels = model.el('upWheels');

        // Меняем подложки элементов

        wheels.forEach((wheel) => {
            wheel.items.forEach((el) => {
                el.changeBG(multi);
            });
        });
        upWheels.forEach((upWheel) => {
            upWheel.forEach((upEl) => {
                upEl.changeBG(multi);
            });
        });
        fsView.draw.newMulti({number: multi});
        model.data('fsMulti', multi);
    }

    function changeMultiBackground(multi) {
        let wheels = model.el('wheels');
        let upWheels = model.el('upWheels');

        // Меняем подложки элементов

        wheels.forEach((wheel) => {
            wheel.items.forEach((el) => {
                el.animBG(multi);
            });
        });
        upWheels.forEach((upWheel) => {
            upWheel.forEach((upEl) => {
                upEl.animBG(multi);
            });
        });
        fsView.draw.newMulti({number: multi});
        model.data('fsMulti', multi);
    }

    return {
        init,
        next,
        count,
        stop,
        changeMulti,
        recoverSession,
        changeMultiBackground
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

        soundController.music.stopMusic('startPerehod');
        soundController.music.stopMusic('fon');
        soundController.music.stopMusic('initFon');

        // Играем фоновую музыку
        soundController.music.playMusic('fsFon');

        fsView.draw.mainBG({});
        // Отрисовуем основной контейнер
        fsView.draw.mainContainer({});
        game.time.events.add(3000, () => {
            fsView.draw.addShadows({});
        });
        fsView.draw.machineContainer({});
        fsView.draw.lineNumbers({});
        winView.draw.UpWinContainer({});

        // Инициализируем крутки
        rollController.init();

        if (model.mobile) {

            // Рисуем футер
            footerController.initMobile();
            // Отрисовуем баланс
            balanceController.initFSMobile();
            mobileSetBetController.init({});
            // Автоматически позиционируем основной контейнер
            this.positionMainContainer();
        } else {    // Desktop

            footerController.initFsDesktop();

            // Автоматически позиционируем основной контейнер
            this.positionMainContainer();

            // Рисуем кнопки управления
            panelController.drawFsPanel();
            // Отрисовуем баланс
            balanceController.initFSDesktop();
        }

        // Добавляем маску
        fsView.draw.machineMask({});

        // Рисуем множитель
        fsView.draw.Multi({
            start: this.fsMulti
        });
        // Рисуем счетчик спинов
        fsView.draw.Count({
            start: this.fsCount
        });

        fsView.draw.Character({});

        // Первая темнота
        game.camera.flash(0x000000, 500);

        if(model.data('fsMulti') > 2){
            controller.recoverSession(model.data('fsMulti'));
        }

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
                fullScreeButton.frameName = (game.scale.isFullScreen || window.innerHeight == screen.height) ? 'fullScreenOff.png' : 'fullScreenOn.png';
        }

        if (model.mobile && !game.device.iOS) {
            (game.scale.isFullScreen) ? $('#fakeButton').addClass('closed') : $('#fakeButton').removeClass('closed');
        }
    }

    positionMainContainer() {
        let game = model.el('game');
        // model.group('main').x = (model.desktop) ? game.world.centerX : game.width - model.group('main').width / 2;
        model.group('main').x = game.world.centerX + 8;
        model.group('main').y = game.world.centerY + config[model.res].mainContainer.y -32;
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
            this.fsCount = model.data('rollResponse').FreeSpinsWin;
            this.fsMulti = 2;
            this.fsLevel = 0;
            model.data('fsMulti', 2);
        }
    }

};
