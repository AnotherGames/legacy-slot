import { model } from 'modules/Model/Model';
import { config } from 'modules/Util/Config';

import { view as mainView } from 'modules/States/Main/View';

import { controller as soundController } from 'modules/Sound/Controller';
import { controller as settingsController } from 'modules/Settings/Controller';
import { controller as balanceController } from 'modules/Balance/Controller';
import { controller as footerController } from 'modules/Footer/Controller';
import { controller as panelController } from 'modules/Panel/Controller';
import { controller as buttonsController } from 'modules/Buttons/Controller';
import { controller as rollController } from 'modules/Roll/Controller';
import { controller as winController } from 'modules/Win/Controller';
import { controller as autoplayController } from 'modules/Autoplay/Controller';
import { controller as mobileSettingsController } from 'modules/Menu/Settings/Controller';
import { controller as mobileAutoplayController } from 'modules/Menu/Autoplay/Controller';
import { controller as mobileSetBetController } from 'modules/Menu/SetBet/Controller';
import { controller as fsController } from 'modules/States/FS/Controller';

export class Main {
    constructor(game) {

    }

    init() {
        console.info('Main State!');
        let game = model.el('game');

        // Инициализируем звуки
        soundController.init({
            sound: model.state('sound'),
            volume: model.state('volume'),
            music: model.state('music')
        });

        // массив в который записываются анимации для проигрывания
        game.frameAnims = [];
        game.spriteAnims = [];

        // При выходе из вкладки анимации будут останавливаться
        game.stage.disableVisibilityChange = false;

        // Создаем контейнеры
        mainView.create.groups({});
    }

    create() {
        let game = model.el('game');

        // Играем фоновую музыку
        soundController.music.fon.play();

        // Отрисовуем основной контейнер
        mainView.draw.mainBG({});
        mainView.draw.mainContainer({});
        mainView.draw.machineContainer({});

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
        this.initKeys();

        // Первая темнота
        let darkness = mainView.draw.darkness({});
            this.add.tween(darkness).to( { alpha: 0 }, 1500, 'Linear', true);

        // Проверяем сохранненые сессии
        this.checkForSavedFS();

        // Проверяем остались ли автокрутки
        this.checkForRemainAutoplay();

        let lastTime = new Date().getTime();
        let fps = 1;
        let lowCount = 0;

        // Проверка на ФПС (убрать и переделать!!!)
        let checkFPS = function () {
            if ( !model.state('isFirstAutoChangeAnimBG') ) return;
            if ( !model.state('isAnimBG') ) return;
            if (lastTime + 1000 > new Date().getTime() ) {
                fps++;
            } else {
                if (fps < 10) {
                    console.log('FPS:', fps);
                    lowCount++;
                    if (lowCount > 3) {
                        model.state('isAnimBG', false);
                        let animMainBG = model.el('animMainBG');
                        let mainBG = model.el('mainBG');

                        mainBG.visible = true;
                        animMainBG.visible = false;

                        model.state('isFirstAutoChangeAnimBG', false);
                        console.log('Auto Change AnimBG.');
                    }
                } else {
                    if (lowCount > 0) {
                        lowCount--;
                    }
                }
                lastTime = new Date().getTime();
                fps = 1;
            }
        };
        game.frameAnims.push(checkFPS);
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
        if (model.mobile) {
            let mainXLeft = model.data('buttonsDelta') * 2 + model.group('main').width / 2;
            let mainXRight = game.width - model.group('main').width -
            model.data('buttonsDelta') * 2 + model.group('main').width / 2;

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
            model.group('main').y = game.world.centerY + config[model.res].mainContainer.y;
        }
    }

    checkForSavedFS() {
        if (model.data('savedFS')) {
            game.state.start('FS');
        }
    }

    checkForRemainAutoplay() {
        if (model.data('remainAutoCount') && !model.state('autoStopWhenFS')) {
            autoplayController.start(model.data('remainAutoCount'));
            model.data('remainAutoCount', null);
        }
    }

    initKeys() {
        let game = model.el('game');

        let space = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        space.onDown.add(() => {
            panelController.handle.spin();
        });

        let up = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        up.onDown.add(() => {
            model.changeCoin({up: true});
        });

        let down = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        down.onDown.add(() => {
            model.changeCoin({down: true});
        });

        let right = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
        right.onDown.add(() => {
            model.changeBet({up: true});
        });

        let left = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
        left.onDown.add(() => {
            model.changeBet({down: true});
        });

    }

}
