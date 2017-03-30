import { model } from 'modules/Model/Model';
import { config } from 'modules/Util/Config';
import { request } from '../../../../Info/Request';

import { view as mainView } from 'modules/States/Main/MainView';
import { view as winView } from 'modules/Win/WinView';
import { view as transitionView } from 'modules/Transition/TransitionView';
import Footer from '../../../../Info/Footer';

import { controller as soundController } from '../../../../Info/SoundController';
import { controller as settingsController } from 'modules/Settings/DesktopSettingsController';
import { controller as balanceController } from 'modules/Balance/BalanceController';
import { controller as panelController } from 'modules/Panel/PanelController';
import { controller as buttonsController } from 'modules/Buttons/ButtonsController';
import { controller as rollController } from 'modules/Roll/RollController';
import { controller as autoplayController } from 'modules/Autoplay/AutoplayController';
import { controller as mobileSettingsController } from 'modules/Menu/Settings/MenuSettingsController';
import { controller as mobileAutoplayController } from 'modules/Menu/Autoplay/MenuAutoplayController';
import { controller as mobileSetBetController } from 'modules/Menu/SetBet/MenuSetBetController';
import { controller as keyboardController } from '../../../../Info/KeyboardController';

export class Main {

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
        let footer = new Footer({model, soundController, request});
        model.el('footer', footer);
        model.state('firstRoll', true);
        // Первая темнота
        game.camera.flash(0x000000, 500);

        soundController.music.stopMusic('finishPerehod');
        soundController.music.stopMusic('fsFon');
        soundController.music.stopMusic('initFon');
        // Играем фоновую музыку

        soundController.music.playMusic('fon');

        // Отрисовуем основной контейнер
        mainView.draw.mainBG({});
        mainView.draw.mainContainer({});
        mainView.draw.machineContainer({});
        // mainView.draw.machineMask({});
        mainView.draw.lineNumbers({});
        winView.draw.UpWinContainer({});

        mainView.draw.addShark({});
        game.time.events.add(game.rnd.integerInRange(7000, 12000), () => {
            mainView.draw.addFish1({});
            mainView.draw.addFish2({});
            mainView.draw.addFish3({});
        });

        // Инициализируем крутки
        rollController.init();

        if (model.mobile) {
            // Рисуем футер
            footer.initMobile();
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
            footer.initMainDesktop();

            // Автоматически позиционируем основной контейнер
            this.positionMainContainer();

            // Инициализируем десктопные сеттинги
            settingsController.initDesktopSettings(game);
            // Рисуем кнопки управления
            panelController.drawButtons();
            panelController.drawInfoButton();
            // Отрисовуем баланс
            balanceController.initDesktop();
            // Инициализируем управление клавиатурой
            keyboardController.initMainKeys(transitionView.transitionInFs);
            // BG animations
            mainView.draw.addBubbles({});

        }

        mainView.draw.addLight({});

        // Проверяем остались ли автокрутки
        this.checkForRemainAutoplay();
    }

    update() {
        let game = model.el('game');

        model.el('footer').update();
        game.frameAnims.forEach((animation) => {
            animation();
        });

        if (model.mobile && !game.device.iOS) {
            (game.scale.isFullScreen) ? $('#fakeButton').addClass('closed') : $('#fakeButton').removeClass('closed');
        }

        this.scaleElements();

    }

    scaleElements() {
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
        if (model.mobile) {
            let mainXLeft = model.data('buttonsDelta') * 2 + (model.el('gameMachine').width - 165) / 2;
            let mainXRight = game.width - (model.el('gameMachine').width - 165) -
            model.data('buttonsDelta') * 2 + (model.el('gameMachine').width - 165) / 2;

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
