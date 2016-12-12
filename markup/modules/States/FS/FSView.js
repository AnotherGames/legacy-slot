import { model } from 'modules/Model/Model';
import { config } from 'modules/Util/Config';
import { Dragon } from 'modules/Class/Dragon';
import { Brain } from 'modules/Class/Brain';
import { view as transitionView } from 'modules/Transition/TransitionView';

export let view = (() => {

    let create = {
        groups: function ({
            game = model.el('game')
        }) {
            model.group('bg', game.add.group());
            model.group('main', game.add.group());
            model.group('buttons', game.add.group());
            model.group('panel', game.add.group());
            model.group('balanceContainer', game.add.group());
            model.group('menuContainer', game.add.group());
            model.group('dragon', game.add.group());
            model.group('footer', game.add.group());
            model.group('balanceCash', game.add.group());
            model.group('balanceCoin', game.add.group());
            model.group('fs', game.add.group());
            model.group('popup', game.add.group());
            model.group('transition', game.add.group());
        }
    };

    let draw = {
        mainBG: function ({
            game = model.el('game'),
            container = model.group('bg')
        }) {
            let animBG = game.add.spine(
                game.world.centerX,
                game.world.centerY,
                'animBG'
            );
            animBG.setAnimationByName(0, 'animation', true);
            container.add(animBG);
            model.el('animMainBG', animBG);

            let mainBG = game.add.sprite(0, 0, 'fsBG', null, container);
            model.el('mainBG', mainBG);

            if (model.state('isAnimBG')) {
                mainBG.visible = false;
            } else {
                animBG.visible = false;
            }
        },

        mainContainer: function ({
            game = model.el('game'),
            container = model.group('main')
        }) {
            let gameMachine = game.add.sprite(0, config[model.res].gameMachine.y, 'gameMachine', null, container);
                gameMachine.anchor.set(0.5);
            model.el('gameMachine', gameMachine);

            let deltaY = (model.mobile) ? 10 : 50;

            let gameLogo = game.add.sprite(0, -game.height / 2 + deltaY, 'gameLogo', null, container);
                gameLogo.anchor.set(0.5, 0);
            model.el('gameLogo', gameLogo);
        },

        machineContainer: function ({
            game = model.el('game'),
            container = model.group('main')
        }) {
            let machineGroup = game.add.group();
            container.addAt(machineGroup, 1);
            model.group('machine', machineGroup);

            let winTop = game.add.group();
            container.addAt(winTop, 2);
            model.group('winTop', winTop);

            machineGroup.glistaLightContainer = game.add.group();
            model.group('glistaLight', machineGroup.glistaLightContainer);
            machineGroup.add(machineGroup.glistaLightContainer);

            machineGroup.elementsContainer = game.add.group();
            model.group('elements', machineGroup.elementsContainer);
            machineGroup.add(machineGroup.elementsContainer);

            machineGroup.glistaContainer = game.add.group();
            model.group('glista', machineGroup.glistaContainer);
            machineGroup.add(machineGroup.glistaContainer);
        },

        addDragon: function ({
            game = model.el('game')
        }) {
            let container = model.group('dragon');
            let x, y;
            if (model.mobile) {
                x = 610;
                y = 280;
            } else {
                x = 850;
                y = 450;
            }
            let dragonFS = new Dragon({position: {x, y}, container});
                dragonFS.IdleFS();
            if (model.mobile) {
                dragonFS.char.scale.set(0.7);
            }
            model.el('dragonFS', dragonFS);
        },

        lineNumbers: function ({
            game = model.el('game')
        }) {
            let mainGroup = model.group('main');
            let gameMachine = model.el('gameMachine');

            let leftArr = [];

            for (let i = 1; i < 11; i++) {
                let name = i;
                let lineNumber = game.add.sprite(config[model.res].win[i][0].x - gameMachine.width / 2, config[model.res].win[i][0].y - gameMachine.height / 2 - 60, 'lineNumbers', 'line_splash-' + i +'_0.png', mainGroup);
                lineNumber.normal = function() {lineNumber.frameName = 'line_splash-' + name + '_0.png'};
                lineNumber.name = name;
                lineNumber.anchor.set(0.5);
                leftArr.push(lineNumber);
            }

            model.el('leftArr', leftArr);

            let rightArr = [];

            for (let i = 1; i < 11; i++) {
                let name = i;
                let lineNumber = game.add.sprite(config[model.res].win[i][1].x - gameMachine.width / 2, config[model.res].win[i][0].y - gameMachine.height / 2 - 60, 'lineNumbers', 'line_splash-' + i +'_0.png', mainGroup);
                lineNumber.normal = function() {lineNumber.frameName = 'line_splash-' + name + '_0.png'};
                lineNumber.name = name;
                lineNumber.anchor.set(0.5);
                rightArr.push(lineNumber);
            }
            model.el('rightArr', rightArr);
        },

        machineMask: function ({
            game = model.el('game'),
            machineGroup = model.group('machine')
        }) {
            const elSize = config[model.res].elements;

            let maskX = game.world.centerX;

            let mask = game.add.graphics();
                mask.beginFill(0x000000);
                mask.drawRect(maskX, game.world.centerY + config[model.res].mainContainer.y, elSize.width * 5, elSize.height * 3);
            mask.pivot.set(elSize.width * 2.5, elSize.height * 1.5);

            machineGroup.mask = mask;
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
            game = model.el('game'),
            container = model.group('panel'),
            start = 2
        }) {
            let x, y;
            if (model.mobile) {
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
            game = model.el('game'),
            container = model.group('panel'),
            start = 15,
            fontDesktop = '70',
            fontMobile = '45'
        }) {
            let x, y, font, deltaY;
            if (model.mobile) {
                x = 270;
                y = 60;
                font = fontMobile;
                deltaY = 10;
            } else {
                x = 510;
                y = 90;
                font = fontDesktop;
                deltaY = 10;
            }
            let countBG = game.add.sprite(x, y, 'freeSpinsPanelFS', null, container);
                countBG.anchor.set(0.5);

            let fsCount = game.add.bitmapText(x, y + deltaY, 'numbersFont', start, font, container);
                fsCount.anchor.set(0.5)
            model.el('fs:count', fsCount);
        }

    };

    return {
        create,
        draw
    };
})();
