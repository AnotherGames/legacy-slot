import { model } from 'modules/Model/Model';
import { config } from 'modules/Util/Config';

import { view as mainView } from 'modules/States/Main/MainView';
import { view as winView } from 'modules/Win/WinView';

import { controller as soundController } from 'modules/Sound/SoundController';
import { controller as settingsController } from 'modules/Settings/DesktopSettingsController';
import { controller as balanceController } from 'modules/Balance/BalanceController';
import { controller as footerController } from 'modules/Footer/FooterController';
import { controller as panelController } from 'modules/Panel/PanelController';
import { controller as buttonsController } from 'modules/Buttons/ButtonsController';
import { controller as rollController } from 'modules/Roll/RollController';
import { controller as autoplayController } from 'modules/Autoplay/AutoplayController';
import { controller as mobileSettingsController } from 'modules/Menu/Settings/MenuSettingsController';
import { controller as mobileAutoplayController } from 'modules/Menu/Autoplay/MenuAutoplayController';
import { controller as mobileSetBetController } from 'modules/Menu/SetBet/MenuSetBetController';
import { controller as keyboardController } from 'modules/Keyboard/KeyboardController';

export class Main {
    constructor(game) {

    }

    init() {
        console.info('Main State!');
        let game = model.el('game');

        // массив в который записываются анимации для проигрывания
        game.frameAnims = [];
        game.spriteAnims = [];

        // Создаем контейнеры
        mainView.create.groups({});

        // При выходе из вкладки анимации будут останавливаться
        game.stage.disableVisibilityChange = true;
    }

    create() {
        let game = model.el('game');

        // Выход из темноты
        game.camera.flash(0x000000, 500);

        soundController.music.stopMusic('finishPerehod');
        soundController.music.stopMusic('fsFon');
        soundController.music.stopMusic('initFon');
        // Играем фоновую музыку

        soundController.music.playMusic('fon');

        // Отрисовуем основной контейнер
        mainView.draw.mainBG({});
        if (model.mobile) {
            mainView.draw.addCloud({});
        }
        mainView.draw.addBalloons({});
        mainView.draw.addCat({});
        game.time.events.add(5000, () => {
            mainView.draw.addConfetti({});
            // panelController.drawFsPanel();
        });
        // mainView.draw.addBurst({});
        mainView.draw.mainContainer({});
        mainView.draw.machineContainer({});
        mainView.draw.lineNumbers({side: 'left'});
        mainView.draw.lineNumbers({side: 'right'});
        winView.draw.UpWinContainer({});

        // Инициализируем крутки
        rollController.init();

        if (model.mobile) {
            // Рисуем футер
            footerController.initMobile();
            // Рисуем кнопки управления
            buttonsController.drawButtons();
            // Автоматически позиционируем основной контейнер
            this.positionMainContainer();
            // Отрисовуем баланс
            balanceController.initMobile();
            // И меню
            mobileSettingsController.init({});
            mobileAutoplayController.init({});
            mobileSetBetController.init({});
        } else {    // Desktop
            // Рисуем футер
            footerController.initDesktop();
            footerController.initSettingInfoButtons();
            // Автоматически позиционируем основной контейнер
            this.positionMainContainer();
            // Инициализируем десктопные сеттинги
            settingsController.initDesktopSettings(game);
            // Рисуем кнопки управления
            panelController.drawButtons();
            // Отрисовуем баланс
            balanceController.initDesktop();
        }
        // Добавляем маску
        mainView.draw.machineMask({});
        // Инициализируем управление клавиатурой
        if (model.desktop) {
            keyboardController.initMainKeys();
        }

        // Проверяем остались ли автокрутки
        this.checkForRemainAutoplay();

    }

    update() {
        const game = model.el('game');
        footerController.updateTime({});
        game.frameAnims.forEach((anim) => {
            anim();
        });

        if (model.desktop) {
            let fullScreeButton = model.el('fullScreeButton');
            fullScreeButton.frameName = (game.scale.isFullScreen || window.innerHeight === screen.height) ? 'fullScreenOn.png' : 'fullScreenOff.png';
        }
        if (model.el('emitter')) {
            game.physics.arcade.collide(model.el('emitter'));
        }
    }

    positionMainContainer() {
        let game = model.el('game');
        if (model.mobile) {
            let mainXLeft = model.data('buttonsDelta') * 2 + model.el('gameMachine').width / 2;
            let mainXRight = game.width - model.el('gameMachine').width
                - model.data('buttonsDelta') * 2 + model.el('gameMachine').width / 2;

            model.data('mainXLeft', mainXLeft);
            model.data('mainXRight', mainXRight);

            if (model.state('gameSideLeft')) {
                model.group('main').x = mainXLeft;
            } else {
                model.group('main').x = mainXRight;
            }

            model.group('main').y = game.world.centerY + config[model.res].mainContainer.y;
        } else {
            model.group('main').x = game.world.centerX;
            // model.group('main').y = game.world.centerY + config[model.res].mainContainer.y;
            model.group('main').y = 450;
        }
    }

    checkForRemainAutoplay() {
        if (model.data('remainAutoCount') && !model.state('autoStopWhenFS')) {
            autoplayController.start(model.data('remainAutoCount'));
            model.data('remainAutoCount', null);
        }
    }

}
