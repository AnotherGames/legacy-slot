import { model } from 'modules/Model/Model';
import { config } from 'modules/Util/Config';
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
            model.group('numbers', game.add.group());
            model.group('footer', game.add.group());
            model.group('footerMenu', game.add.group());
            model.group('balanceCash', game.add.group());
            model.group('balanceCoin', game.add.group());
            model.group('infoTable', game.add.group());
            model.group('transition', game.add.group());
        }
    };

    let draw = {
        mainBG: function ({
            game = model.el('game')
        }) {
            let mainBG = game.add.sprite(0, 0, 'initBG', null, model.group('bg'));
	        model.el('mainBG', mainBG);

	        if (model.desktop) {
		        let animBG = game.add.spine(
			        game.world.centerX,
			        game.world.centerY,
			        'animBG'
		        );
		        model.group('bg').add(animBG);
		        model.el('animMainBG', animBG);
		        // убирает пиксельные полосы по бокам
		        animBG.scale.set(1.01);
		        animBG.setAnimationByName(0, '1', true);

		        if (model.state('isAnimBG')) {
			        mainBG.visible = false;
		        } else {
			        animBG.visible = false;
			        for (let i = 0; i < 5; i++) {
				        transitionView.addCloud({container: model.group('bg')});
			        }
		        }
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

        lineNumbers: function ({
            game = model.el('game'),
            container = model.group('numbers'),
            gameMachine = model.el('gameMachine'),
            side = 'left'
        }) {
            let x = (side === 'right') ? gameMachine.right - 40 : gameMachine.left + 40;
            let lineNumbersArr = [];

            container.x = game.world.centerX;
            container.y = game.world.centerY - 65;
            console.log('Game machine: ', gameMachine.right);
            console.log('Container: ', container);

            for (let i = 1; i < 11; i++) {
                // let lineNumber = game.add.sprite(x, config[model.res].win[i][0].y - gameMachine.height / 2 - 40,
                //     'lineNumbers',
                //     'line_splash-' + i + '_0.png',
                //     container);
                let lineNumber = game.add.sprite(x, config[model.res].win[i][0].y - gameMachine.height / 2 - 40,
                    'closeButton',
                    null,
                    container);
                // lineNumber.normal = function () {
                //     lineNumber.frameName = 'line_splash-' + i + '_0.png';
                // };
                lineNumber.name = i;
                lineNumber.anchor.set(0.5);
                lineNumber.alpha = 0.01;

                if (model.state('fs')) {
                    lineNumbersArr.push(lineNumber);
                    continue;
                }

                lineNumber.inputEnabled = true;
                lineNumber.input.priorityID = 2;
                lineNumber.input.pixelPerfectOver = 1;

                lineNumber.events.onInputOver.add(() => {
                    setTimeout(() => {
                        if (lineNumber.lineShape) {
                            lineNumber.lineShape.destroy();
                        }
                    }, 4000);
                    lineNumber.lineShape = this.lineShape(lineNumber.name);
                });

                lineNumber.events.onInputOut.add(() => {
                    if (lineNumber.lineShape) {
                        lineNumber.lineShape.destroy();
                    }
                });

                lineNumbersArr.push(lineNumber);
            }

            model.el(side + 'Arr', lineNumbersArr);
        },

        lineShape: function (number) {
            let game = model.el('game');
            let container = model.group('glistaLight');
            let line = model.data('lines')[number - 1];
            let elSize = config[model.res].elements;
            let lineShape = game.add.graphics(0, 0, container);
            let gameMachine = model.el('gameMachine');
            lineShape
                .lineStyle(4, 0xdddddd, 0.8)
                .moveTo((line[0].X + 0.5) * elSize.width - gameMachine.width / 2 + 80, (line[0].Y + 0.5) * elSize.height - gameMachine.height / 2 + 90)
                .lineTo((line[1].X + 0.5) * elSize.width - gameMachine.width / 2 + 80, (line[1].Y + 0.5) * elSize.height - gameMachine.height / 2 + 90)
                .lineTo((line[2].X + 0.5) * elSize.width - gameMachine.width / 2 + 80, (line[2].Y + 0.5) * elSize.height - gameMachine.height / 2 + 90)
                .lineTo((line[3].X + 0.5) * elSize.width - gameMachine.width / 2 + 80, (line[3].Y + 0.5) * elSize.height - gameMachine.height / 2 + 90)
                .lineTo((line[4].X + 0.5) * elSize.width - gameMachine.width / 2 + 80, (line[4].Y + 0.5) * elSize.height - gameMachine.height / 2 + 90);
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
        }
    };

    return {
        create,
        draw
    };
})();
