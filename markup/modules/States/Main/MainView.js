import { model } from 'modules/Model/Model';
import { config } from 'modules/Util/Config';
import { Dragon } from 'modules/Class/Dragon';
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
            model.group('footer', game.add.group());
            model.group('footerMenu', game.add.group());
            model.group('balanceCash', game.add.group());
            model.group('balanceCoin', game.add.group());
            model.group('popup', game.add.group());
            model.group('infoTable', game.add.group());
            model.group('transition', game.add.group());
            model.group('dragon', game.add.group());
        }
    };

    let draw = {
        mainBG: function ({
            game = model.el('game')
        }) {
	        let mainBG = game.add.sprite(0, 0, 'mainBG', null, model.group('bg'));
	        model.el('mainBG', mainBG);

	        if (model.desktop) {
		        let animBG = game.add.spine(game.world.centerX, game.world.centerY, 'animBG');
		        animBG.setAnimationByName(0, 'animation', true);
		        model.group('bg').add(animBG);
		        model.el('animMainBG', animBG);

		        if (model.state('isAnimBG') && model.desktop) {
			        mainBG.visible = false;
		        } else {
			        animBG.visible = false;
		        }
		        let sticks = game.add.sprite(300, game.height * 0.6, 'sticks', null, model.group('bg'));
                    sticks.anchor.set(0.5);
                model.el('sticks', sticks);
            }
        },

        mainContainer: function ({
            game = model.el('game'),
            container = model.group('main')
        }) {
            let gameBG = game.add.sprite(0, 0, 'gameBG', null, container);
                gameBG.anchor.set(0.5);
            model.el('gameBG', gameBG);

            let gameMachine = game.add.sprite(0, config[model.res].gameMachine.y, 'gameMachine', null, container);
                gameMachine.anchor.set(0.5);
            model.el('gameMachine', gameMachine);
        },

        logo: function({
            game = model.el('game'),
            container = model.group('dragon'),
            deltaY = -460
        }) {
            let logoX;
            if (model.mobile) {
                logoX = 25;
            } else {
                logoX = 40;
            }
            container.x = game.world.centerX;
            container.y = game.world.centerY;

            if (model.mobile) {
                if (model.state('gameSideLeft')) {
                    container.x = model.data('mainXLeft');
                } else {
                    container.x = model.data('mainXRight');
                }
            }
            this.addDragon({});
            let gameLogo = game.add.sprite(logoX, deltaY, 'gameLogo', null, container);
                gameLogo.anchor.set(0.5);
                gameLogo.scale.set(0.9);

            model.el('gameLogo', gameLogo);
        },

        addDragon: function ({
            game = model.el('game'),
            container = model.group('dragon')
        }) {
            let x, y;
            if (model.mobile) {
                x = 15;
                y = 95;
            } else {
                x = 15;
                y = 25;
            }
            let dragon = new Dragon({position: {x, y}, container});
            if (model.mobile) {
                dragon.char.scale.set(0.8);
            }
            model.el('dragon', dragon);
        },

        lineNumbers: function ({
            game = model.el('game'),
            container = model.group('main')
        }) {
            let gameMachine = model.el('gameMachine');

            let leftArr = [];
            let rightArr = [];

            for (let i = 1; i < 11; i++) {
                let name = i;
                let lineNumber = game.add.sprite(config[model.res].win[i][0].x - gameMachine.width / 2, config[model.res].win[i][0].y - gameMachine.height / 2 - 60, 'lineNumbers', 'line_splash-' + i +'_0.png', container);
                lineNumber.normal = function() {lineNumber.frameName = 'line_splash-' + name + '_0.png'};
                lineNumber.name = name;
                lineNumber.anchor.set(0.5);
                lineNumber.inputEnabled = true;
                lineNumber.input.priorityID = 2;
                lineNumber.input.pixelPerfectOver = 1;
                lineNumber.events.onInputOver.add(() => {
                    if (lineNumber.lineShape) {
                        lineNumber.lineShape.destroy();
                    }
                    lineNumber.lineShape = this.lineShape(lineNumber.name);
                    setTimeout(() => {
                        if (lineNumber.lineShape) {
                            lineNumber.lineShape.destroy();
                        }
                    }, 4000);
                });

                lineNumber.events.onInputOut.add(() => {
                    if (lineNumber.lineShape) {
                        lineNumber.lineShape.destroy();
                    }
                });
                leftArr.push(lineNumber);
            }

            model.el('leftArr', leftArr);


            for (let i = 1; i < 11; i++) {
                let name = i;
                let lineNumber = game.add.sprite(
                    config[model.res].win[i][1].x - gameMachine.width / 2,
                    config[model.res].win[i][0].y - gameMachine.height / 2 - 60,
                    'lineNumbers', 'line_splash-' + i +'_0.png', container);
                lineNumber.normal = function() {lineNumber.frameName = 'line_splash-' + name + '_0.png'};
                lineNumber.name = name;
                lineNumber.anchor.set(0.5);
                lineNumber.inputEnabled = true;
                lineNumber.input.priorityID = 2;
                lineNumber.input.pixelPerfectOver = 1;
                lineNumber.events.onInputOver.add(() => {
                    if (lineNumber.lineShape) {
                        lineNumber.lineShape.destroy();
                    }
                    lineNumber.lineShape = this.lineShape(lineNumber.name);
                    setTimeout(() => {
                        if (lineNumber.lineShape) {
                            lineNumber.lineShape.destroy();
                        }
                    }, 4000);
                });

                lineNumber.events.onInputOut.add(() => {
                    if (lineNumber.lineShape) {
                        lineNumber.lineShape.destroy();
                    }
                });

                rightArr.push(lineNumber);
            }
            model.el('rightArr', rightArr);
        },

        lineShape: function(number) {
            let game = model.el('game');
            let container = model.group('glistaLight');
            let line = model.data('lines')[number - 1];
            let elSize = config[model.res].elements;
            let lineShape = game.add.graphics(0, 0, container);
            lineShape
                // .beginFill(0x000000)
                .lineStyle(4, 0xfee73f, 0.8)
                .moveTo((line[0].X + 0.5) * elSize.width - model.el('gameMachine').width / 2 + 50, (line[0].Y + 0.5) * elSize.height - model.el('gameMachine').height / 2 + 50)
                .lineTo((line[1].X + 0.5) * elSize.width - model.el('gameMachine').width / 2 + 50, (line[1].Y + 0.5) * elSize.height - model.el('gameMachine').height / 2 + 50)
                .lineTo((line[2].X + 0.5) * elSize.width - model.el('gameMachine').width / 2 + 50, (line[2].Y + 0.5) * elSize.height - model.el('gameMachine').height / 2 + 50)
                .lineTo((line[3].X + 0.5) * elSize.width - model.el('gameMachine').width / 2 + 50, (line[3].Y + 0.5) * elSize.height - model.el('gameMachine').height / 2 + 50)
                .lineTo((line[4].X + 0.5) * elSize.width - model.el('gameMachine').width / 2 + 50, (line[4].Y + 0.5) * elSize.height - model.el('gameMachine').height / 2 + 50)
            return lineShape;
        },

        machineContainer: function ({
            game = model.el('game'),
            container = model.group('main')
        }) {
            let machineGroup = game.add.group();
            container.addAt(machineGroup, 1);
            model.group('machine', machineGroup);

            let winTop = game.add.group();
            container.addAt(winTop, 3);
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

        machineMask: function ({
            game = model.el('game'),
            machineGroup = model.group('machine')
        }) {
            const elSize = config[model.res].elements;

            let someGraphic = game.add.graphics(-elSize.width * 2.5, -elSize.height * 1.5, machineGroup);
                someGraphic.beginFill(0xffffff).drawRect(0, 0, elSize.width * 5, elSize.height * 3);
            machineGroup.mask = someGraphic;
        },


        initPopup: function () {
            let popup = document.querySelector('#popup');
            popup.addEventListener('click', draw.closePopup);
        },

        showPopup: function ({
            message = 'popup',
            balance = false
        }) {
            model.state('notReload', balance);

            let popup = document.querySelector('#popup');
            let overlay = document.querySelector('#darkness');
            let popupText = document.querySelector('#popup h2');
            let popupBottomText = document.querySelector('#popup p');
            let bottomText;

            popup.classList.remove('closed');
            overlay.classList.remove('closed');

            popupText.innerHTML = message;

            if (model.desktop) {
                bottomText = `Click to ${(balance) ? 'close' : 'restart'}`;
            } else {
                bottomText = `Tap to ${(balance) ? 'close' : 'restart'}`;
            }

            popupBottomText.innerHTML = bottomText;
        },

        closePopup: function () {
            if (model.state('notReload')) {
                let popup = document.querySelector('#popup');
                let overlay = document.querySelector('#darkness');

                popup.classList.add('closed');
                overlay.classList.add('closed');
            } else {
                window.location.reload();
            }
        }
    };

    return {
        create,
        draw
    };
})();
