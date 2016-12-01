import { model } from 'modules/Model/Model';
import { config } from 'modules/Util/Config';
// import { Zombie } from 'modules/Class/Zombie';
// import { Brain } from 'modules/Class/Brain';
import { view as transitionView } from 'modules/Transition/TransitionView';

export let view = (() => {

    let create = {
        groups: function ({
            game = model.el('game')
        }) {
            game.bgContainer = game.add.group();
            model.el('bgContainer', game.bgContainer);
            model.group('bg', game.bgContainer);

            game.mainContainer = game.add.group();
            model.el('mainContainer', game.mainContainer);
            model.group('main', game.mainContainer);

            game.buttonsContainer = game.add.group();
            model.group('buttons', game.buttonsContainer);

            game.panelContainer = game.add.group();
            model.group('panel', game.panelContainer);

            game.balanceContainer = game.add.group();
            model.el('balanceContainer', game.balanceContainer);

            game.menuContainer = game.add.group();
            model.el('menuContainer', game.menuContainer);

            game.footerContainer = game.add.group();
            model.group('footer', game.footerContainer);

            game.balanceCashContainer = game.add.group();
            model.group('balanceCash', game.balanceCashContainer);

            game.balanceCoinContainer = game.add.group();
            model.group('balanceCoin', game.balanceCoinContainer);

            game.fsContainer = game.add.group();
            model.group('fs', game.fsContainer);

            game.popupContainer = game.add.group();
            model.group('popup', game.popupContainer);

            game.transitionContainer = game.add.group();
            model.group('transition', game.transitionContainer);
        }
    };

    let draw = {
        mainBG: function ({
            game = model.el('game')
        }) {
            let animBG = game.add.spine(
                game.world.centerX,
                game.world.centerY,
                'animBG'
            );
            animBG.setAnimationByName(
                0,
                'animation',
                true
            );
            game.bgContainer.add(animBG);
            model.el('animMainBG', animBG);

            let mainBG = game.add.sprite(0, 0, 'fsBG', null, game.bgContainer);
            model.el('mainBG', mainBG);

            if (model.state('isAnimBG')) {
                mainBG.visible = false;
            } else {
                animBG.visible = false;
            }
        },

        mainContainer: function ({
            game = model.el('game')
        }) {
            let mainGroup = game.mainContainer;

            let gameMachine = game.add.sprite(0, config[model.state('res')].gameMachine.y, 'gameMachine', null, mainGroup);
            gameMachine.anchor.set(0.5);
            model.el('gameMachine', gameMachine);

            let deltaY = 50;
            if (model.state('mobile')) {
                deltaY = 10;
            }

            let gameLogo = game.add.sprite(0, -game.height / 2 + deltaY, 'gameLogo', null, mainGroup);
            gameLogo.anchor.set(0.5, 0);
            model.el('gameLogo', gameLogo);
        },

        lineNumbers: function ({
            game = model.el('game')
        }) {
            let mainGroup = game.mainContainer;
            let gameMachine = model.el('gameMachine');

            let leftArr = [];

            for (let i = 1; i < 11; i++) {
                let name = i;
                let lineNumber = game.add.sprite(config[model.state('res')].win[i][0].x - gameMachine.width / 2, config[model.state('res')].win[i][0].y - gameMachine.height / 2 - 60, 'lineNumbers', 'line_splash-' + i +'_0.png', mainGroup);
                lineNumber.normal = function() {lineNumber.frameName = 'line_splash-' + name + '_0.png'};
                lineNumber.name = name;
                lineNumber.anchor.set(0.5);
                leftArr.push(lineNumber);
            }

            model.el('leftArr', leftArr);

            let rightArr = [];

            for (let i = 1; i < 11; i++) {
                let name = i;
                let lineNumber = game.add.sprite(config[model.state('res')].win[i][1].x - gameMachine.width / 2, config[model.state('res')].win[i][0].y - gameMachine.height / 2 - 60, 'lineNumbers', 'line_splash-' + i +'_0.png', mainGroup);
                lineNumber.normal = function() {lineNumber.frameName = 'line_splash-' + name + '_0.png'};
                lineNumber.name = name;
                lineNumber.anchor.set(0.5);
                rightArr.push(lineNumber);
            }
            model.el('rightArr', rightArr);
        },

        machineContainer: function ({
            game = model.el('game'),
            mainGroup = game.mainContainer
        }) {
            let machineGroup = mainGroup.machineContainer = game.add.group();
            model.el('machineContainer', machineGroup);
            mainGroup.addAt(machineGroup, 1);

            game.winTopContainer = game.add.group();
            model.group('winTop', game.winTopContainer);
            mainGroup.addAt(game.winTopContainer, 3);

            machineGroup.glistaLightContainer = game.add.group();
            model.el('glistaLightContainer', machineGroup.glistaLightContainer);
            machineGroup.add(machineGroup.glistaLightContainer);

            machineGroup.elementsContainer = game.add.group();
            model.el('elementsContainer', machineGroup.elementsContainer);
            machineGroup.add(machineGroup.elementsContainer);

            machineGroup.glistaContainer = game.add.group();
            model.el('glistaContainer', machineGroup.glistaContainer);
            machineGroup.add(machineGroup.glistaContainer);
        },

        machineMask: function ({
            game = model.el('game'),
            machineGroup = model.el('machineContainer')
        }) {
            const elSize = config[model.state('res')].elements;
            let mask = game.add.graphics();
            mask.beginFill(0x000000);

            let maskX = game.world.centerX;

            mask.drawRect(
                maskX,
                game.world.centerY + config[model.state('res')].mainContainer.y,
                elSize.width * 5,
                elSize.height * 3);
            mask.pivot.set(elSize.width * 2.5, elSize.height * 1.5);
            machineGroup.mask = mask;

            if (model.state('side') === 'right')
                mask.x = model.data('mainXRight') - model.data('mainXLeft');

            model.el('mask', mask);
        },

        darkness: function ({
            game = model.el('game')
        }) {
            let darkness = game.add.graphics();
            darkness.beginFill(0x000000);
            darkness.drawRect(0, 0, game.width, game.height);
            return game.add.tween(darkness).to( { alpha: 0 }, 1500, 'Linear', true);
        },

        Multi: function({
            start = 2,
            container = model.group('panel')
        }) {
            const game = model.el('game');
            let x, y;
            if (model.state('mobile')) {
                x = 980;
                y = 60;
            } else {
                x = 830;
                y = 90;
            }
            let multiBG = game.add.sprite(x, y, 'multiPanelFS', null, container);
            multiBG.anchor.set(0.5);

            const fsMulti = game.add.sprite(
                x,
                y + 5,
                'multiNumbers',
                `multi${start}.png`,
                container);
            fsMulti.anchor.set(0.5);
            model.el('fsMulti', fsMulti);
            return fsMulti;
        },

        Count: function({
            start = 15,
            fontDesktop = '70',
            fontMobile = '45',
            container = model.group('panel')
        }) {
            const game = model.el('game');
            let x, y, font, deltaY;
            if (model.state('mobile')) {
                x = 270;
                y = 60;
                font = fontMobile;
                deltaY = 10;
            } else {
                x = 510;
                y = 90;
                font = fontDesktop;
                deltaY = 15;
            }
            const countBG = game.add.sprite(x, y, 'freeSpinsPanelFS', null, container);
            countBG.anchor.set(0.5);

            const fsCount = game.add.bitmapText(x, y + deltaY, 'numbersFont', start, font, container);
            fsCount.anchor.set(0.5)
            model.el('fsCount', fsCount);
        }

    };

    return {
        create,
        draw
    };
})();
