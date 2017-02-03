import { model } from 'modules/Model/Model';
import { config } from 'modules/Util/Config';

import { view as fsView } from 'modules/States/FS/FSView';
import { view as transitionView } from 'modules/Transition/TransitionView';
import { view as winView } from 'modules/Win/WinView';
import { view as mainView } from 'modules/States/Main/MainView';

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

        model.state('buttons:locked', false);
        model.state('fs:end', true);
        model.state('fs', false);
        model.updateBalance({endFS: true});
        // bulletCounter = 0;
    }

    function chestActions() {
        let game = model.el('game');
        // Проигрываем анимации барабана и +3
        fsView.draw.CountPlus3({});

        //если максимальный множитель достигнут то возвращаемся
        if(model.state('maxFsMultiplier')) return;

        let rollData = model.data('rollResponse');
        let levelValue = rollData.FsBonus.Level;
        let currLevel = model.data('fsLevel');
        let multiValue = rollData.FsBonus.Multi;
        let currMulti = model.data('fsMulti');

        // Увеличиваем мульти(разбивание бутылки)
        if (multiValue > currMulti) {
            fsView.draw.changeMulti({number: multiValue, animation: multiValue + ''});
            model.data('fsMulti', multiValue);
        }

        if (levelValue > currLevel) {
            fsView.draw.changeLevel({number: levelValue, animation: levelValue - 1 + ''});
            model.data('fsLevel', levelValue);
        }

    }

    return {
        init,
        next,
        count,
        stop,
        chestActions
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
        game.camera.flash(0x000000, 777)

        // Играем фоновую музыку
        soundController.music.stopMusic('startPerehod');
        soundController.music.stopMusic('fon');
        soundController.music.stopMusic('initFon');
        soundController.music.playMusic('fsFon');

        fsView.draw.mainBG({});
        // Отрисовуем основной контейнер
        fsView.draw.mainContainer({});
        fsView.draw.machineContainer({});
        mainView.draw.lineNumbers({side: 'left'});
        mainView.draw.lineNumbers({side: 'right'});
        winView.draw.UpWinContainer({});

        // BG anim
        mainView.draw.addBubbles({});
        mainView.draw.addShark({});
        game.time.events.add(6000, () => {
            mainView.draw.addFishes({});
        });

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
        // Рисуем множитель
        fsView.draw.Multi({
            start: this.fsMulti
        });

        fsView.draw.Level({
            start: this.fsLevel
        });
        // Рисуем счетчик спинов
        fsView.draw.Count({
            start: this.fsCount
        });

        // Если сохранненая сессия, то переключаем счетчик мозгов
        // if (this.fsLevel > 0) {
        //     controller.searchBrains({
        //         startLevel: this.fsLevel
        //     })
        // }

        // Первая темнота
        game.camera.flash(0x000000, 500);

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

    positionMainContainer() {
        let game = model.el('game');
        // model.group('main').x = (model.desktop) ? game.world.centerX : game.width - model.group('main').width / 2;
        model.group('main').x = game.world.centerX + 8;
        model.group('main').y = game.world.centerY + config[model.res].mainContainer.y - 10;
    }

    checkSavedFS() {
        if (model.data('savedFS')) {
            let saved = model.data('savedFS');
            this.fsCount = saved.fsCount;
            this.fsMulti = saved.fsMulti;
            this.fsLevel = saved.fsLevel;
            model.data('savedFS', null);
            model.data('fsMulti', this.fsMulti);
            model.data('fsLevel', this.fsLevel);
        } else {
            this.fsCount = 15;
            this.fsMulti = 2;
            this.fsLevel = 0;
            model.data('fsMulti', 2);
            model.data('fsLevel', 0);
        }
    }

};
